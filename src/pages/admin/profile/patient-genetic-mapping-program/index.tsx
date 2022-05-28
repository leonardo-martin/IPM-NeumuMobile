import RequestUnderageDialog from '@components/dialog/requestUnderageDialog'
import CustomErrorMessage from '@components/error'
import HeaderAdmin from '@components/header/admin'
import ModalizeFixed from '@components/modalize'
import { SafeAreaLayout } from '@components/safeAreaLayout'
import { useAppSelector } from '@hooks/redux'
import { useModal } from '@hooks/useModal'
import { PatientDto } from '@models/Patient'
import { UnderageStatus } from '@models/Underage'
import { useFocusEffect } from '@react-navigation/native'
import { getStatusAbrafeuForm, optIn, optOut } from '@services/abrafreu.service'
import { AppStorage } from '@services/app-storage.service'
import { getPatient, updatePatient } from '@services/patient.service'
import { createUnderagePermission, getStatus } from '@services/underage.service'
import { Button, Input, Modal, Radio, RadioGroup, Spinner, Text, useStyleSheet } from '@ui-kitten/components'
import { EvaSize, EvaStatus } from '@ui-kitten/components/devsupport'
import { getRelationPastExams } from '@utils/common'
import { onlyNumbers } from '@utils/mask'
import { compareAsc, subYears } from 'date-fns'
import { AbrafeuOptInStatus } from 'models/Abrafeu'
import React, { FC, ReactElement, useCallback, useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { Alert, Keyboard, TouchableOpacity, View } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { Modalize } from 'react-native-modalize'
import { Host, Portal } from 'react-native-portalize'
import Toast from 'react-native-toast-message'
import { RootState } from 'store'
import { examResult } from './data'
import PendingApprovalMappingProgram from './extra/pending-approval.component'
import { mappingStyle } from './style'

const PatientGeneticMappingProgramScreen: FC = (): ReactElement => {

    const [isFetchingData, setIsFetchingData] = useState<boolean>(false)
    const [isOpenedModal, setIsOpenedModal] = useState<boolean>(false)
    const [patient, setPatient] = useState<PatientDto>()
    const form = useForm<PatientDto>()
    const { ref } = useModal<Modalize>()
    const { ref: requestUnderageRef } = useModal<Modal>()
    const [visibleModal, setVisibleModal] = useState<boolean>(false)
    const [selectedIndex, setSelectedIndex] = useState<number | undefined>(undefined)
    const [selectTmp, setSelectTmp] = useState<number | undefined>(selectedIndex)
    const styles = useStyleSheet(mappingStyle)
    const [selectedIndexExamDNA, setSelectedIndexExamDNA] = useState(-1)
    const [unidentifiedError, setUnidentifiedError] = useState<boolean>(false)
    const [statusPermission, setStatusPermission] = useState<UnderageStatus | undefined>(undefined)
    const [isCompleteAddress, setIsCompleteAddress] = useState(false)
    const [accept, setAccept] = useState<boolean>(false)
    const [responsibleEmail, setResponsibleEmail] = useState<string>('')
    const [formAvailable, setFormAvailable] = useState<AbrafeuOptInStatus>(AbrafeuOptInStatus.NOT_REQUESTED)

    const { profile } = useAppSelector((state: RootState) => state.profile)
    const [underage, setUnderage] = useState<boolean>(true)

    useEffect(() => {
        if (profile) {
            checkIfPermission()
            let result = compareAsc(subYears(new Date(), 18), profile.dateOfBirth as string)
            if (result !== 1) {
                setAccept(false)
                setUnderage(true)
            } else {
                setAccept(true)
                setUnderage(false)
            }
        }
    }, [profile])

    const getData = async () => {
        try {
            const response = await getPatient()
            setPatient(response.data)
            const optIn = response.data?.abrafeuRegistrationOptIn === 'true' ? 0 : 1
            form.setValue('abrafeuRegistrationOptIn', response.data?.abrafeuRegistrationOptIn === 'true' ? 'true' : 'false')

            if (optIn === 0 && response.data.pastExams?.exam) {
                setSelectedIndexExamDNA(response.data.pastExams.exam.id as number)
                form.setValue('pastExams.exam.id', response.data.pastExams.exam.id)
                form.setValue('pastExams.exam.description', response.data.pastExams.exam.description)
                form.setValue('pastExams.doctor.crm', response.data.pastExams.doctor?.crm)
            }
            setSelectedIndex(optIn)
            setSelectTmp(optIn)
            setUnidentifiedError(false)
        } catch (error) {
            setSelectedIndex(undefined)
            setSelectTmp(undefined)
            setUnidentifiedError(true)
            Toast.show({
                type: 'danger',
                text2: 'Erro ao buscar os dados do usuário',
            })
        } finally {
            setIsFetchingData(false)
        }
    }

    useFocusEffect(
        useCallback(() => {
            setIsOpenedModal(false)
            setIsFetchingData(true)
            setStatusPermission(undefined)
            getUnderageStatus()
        }, [])
    )

    const verifyStatusForm = async () => {
        try {
            const response = await getStatusAbrafeuForm()
            if (response.status === 200) {
                setFormAvailable(response.data)
            } else {
                setFormAvailable(AbrafeuOptInStatus.NOT_AVAILABLE)
            }
        } catch (error) {
            setFormAvailable(AbrafeuOptInStatus.NOT_AVAILABLE)
        }
    }

    const handleParticipateProgram = (index: number) => {
        setSelectedIndex(index)
        if (index === 0 && underage && !accept) {
            if (statusPermission === UnderageStatus.GRANTED) {
                form.clearErrors()
                if (!isCompleteAddress)
                    modalRequiredAddress()
                else
                    alertCommon()
            } else {
                Alert.alert(
                    'Atenção!',
                    'Por questões legais, caso o paciente possua menos de 18 anos, será solicitado via e-mail, uma permissão ao seu responsável (com 18 anos ou mais) para participar do Programa de Mapeamento Genético',
                    [
                        {
                            text: 'OK',
                            style: 'default',
                            onPress: () => {
                                form.clearErrors()
                                if (isCompleteAddress)
                                    setVisibleModal(true)
                                else
                                    modalRequiredAddress()
                            }
                        }
                    ]
                )
            }
        } else if (index === 0 && accept) {
            if (underage) {
                if (isCompleteAddress)
                    setVisibleModal(true)
                else
                    modalRequiredAddress()
            }
        } else {
            if (isCompleteAddress) {
                if (underage && statusPermission === UnderageStatus.NOT_REQUESTED) {
                    setVisibleModal(true)
                }
            } else {
                modalRequiredAddress()
            }
        }

        form.clearErrors()
        form.setValue('pastExams.doctor.crm', '')
        form.setValue('pastExams.exam.id', '')
        form.setValue('pastExams.exam.description', '')
        form.setValue('abrafeuRegistrationOptIn', index === 0 ? 'true' : 'false')
        setSelectedIndexExamDNA(-1)
        if (selectTmp === 0 && index === 1) {
            setIsOpenedModal(true)
            ref.current?.open()
        }
    }

    const modalRequiredAddress = () => {
        Alert.alert(
            'Atenção!',
            'Necessário preencher o endereço no perfil para participar do programa',
            [
                {
                    text: 'OK',
                    style: 'default',
                    onPress: () => setSelectedIndex(1)
                }
            ]
        )
    }

    const checkIfPermission = () => {
        if (profile?.address1 !== '' && profile?.city !== '' && profile?.state !== '' && profile?.postalCode !== '') {
            setIsCompleteAddress(true)
        } else {
            setIsCompleteAddress(false)
        }
    }

    const getUnderageStatus = async () => {
        const response = await getStatus()
        if (response.status === 200) {
            setStatusPermission(response.data)
            verifyStatusForm()
        } else {
            setStatusPermission(UnderageStatus.NOT_REQUESTED)
        }
        if (response.data === UnderageStatus.PENDING) {
            setIsFetchingData(false)
        } else
            getData()
    }

    const confirm = async (data: PatientDto) => {
        Keyboard.dismiss()

        if (isOpenedModal) {
            if (data.abrafeuRegistrationOptIn === 'false') {
                form.resetField('pastExams')
                delete data.pastExams
                setSelectedIndexExamDNA(-1)
            }

            try {
                if ((underage && statusPermission === UnderageStatus.GRANTED) || (!underage)) {
                    const response = await updatePatient(data)
                    setPatient(response.data)
                    // send email
                    if (selectedIndex === 0) {
                        await optIn()
                        Toast.show({
                            type: 'success',
                            text2: 'Obrigado por inscrever-se!',
                        })
                    } else if (selectedIndex === 1) {
                        if (underage) {
                            setAccept(false)
                        }
                        await optOut()
                        Toast.show({
                            type: 'info',
                            text2: 'Que pena... Agradeçemos pelo apoio',
                        })
                    }

                    setSelectTmp(data.abrafeuRegistrationOptIn === 'true' ? 0 : 1)
                } else if (underage && statusPermission === UnderageStatus.NOT_REQUESTED && responsibleEmail !== '') {
                    const response = await createUnderagePermission({
                        responsibleEmail: responsibleEmail
                    })
                    if (response.status === 201) {
                        const response = await updatePatient(data)
                        setPatient(response.data)
                        await AppStorage.setItem('UNDERAGE_EMAIL', responsibleEmail)
                        setStatusPermission(UnderageStatus.PENDING)

                        Toast.show({
                            type: 'success',
                            text2: 'E-mail enviado ao responsável',
                        })
                    } else {
                        Toast.show({
                            type: 'danger',
                            text2: 'Ocorreu um erro. Tente novamente mais tarde',
                        })
                    }
                }


            } catch (error) {
                setSelectedIndex(selectTmp)
                Toast.show({
                    type: 'danger',
                    text2: 'Ocorreu um erro. Tente novamente mais tarde!',
                })
            } finally {
                setIsOpenedModal(false)
                ref.current?.close()
            }
        } else {
            setIsOpenedModal(true)
            ref.current?.open()
        }
    }

    const close = () => {
        setIsOpenedModal(false)
        ref.current?.close()
    }

    const handleRadioSelectedExamDNA = (index: number) => {
        setSelectedIndexExamDNA(index)
        form.clearErrors('pastExams.exam.id')
        const exam = getRelationPastExams(index)
        if (exam) {
            form.setValue('pastExams.exam.id', index)
            form.setValue('pastExams.exam.description', exam)
        }
    }

    const LoadingIndicator = (size: EvaSize | undefined = 'tiny', status: EvaStatus | undefined = 'basic') => (
        <Spinner size={size} status={status} />
    )

    const callbackRequestPermission = (success: boolean, data?: { responsibleEmail: string }) => {
        if (success && data?.responsibleEmail) {
            setResponsibleEmail(data.responsibleEmail)
            alertCommon()
        } else if (!success) {
            setSelectedIndex(1)
        }
    }

    const alertCommon = () => {
        Alert.alert(
            'Importante',
            'Para finalizar o cadastro, preencha os demais campos e clique em "Salvar". Caso não preenchido, não será efetuado o cadastro.',
            [
                {
                    text: 'Ok',
                    style: 'default',
                    onPress: () => setAccept(true)
                }
            ]
        )
    }

    return (
        <Host>
            <HeaderAdmin />
            <SafeAreaLayout level='1' style={styles.safeArea}>
                {isFetchingData ?
                    <>
                        <View style={{
                            flex: 1,
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}>
                            {LoadingIndicator('giant', 'primary')}
                        </View>
                    </>
                    : (
                        <>
                            {statusPermission === UnderageStatus.PENDING ?
                                <PendingApprovalMappingProgram />
                                : (
                                    <KeyboardAwareScrollView
                                        keyboardShouldPersistTaps='handled'
                                        showsVerticalScrollIndicator={false}
                                        enableOnAndroid>
                                        <View
                                            style={styles.container}>
                                            <Text style={styles.title}>Como funciona ?</Text>
                                            <Text style={styles.text}>
                                                Aceitando participar, e após este cadastro feito, será enviado um e-mail direto do aplicativo para que você forneça informações sobre você e/ou seu filho.
                                            </Text>
                                            <Text style={styles.text}>
                                                Você será solicitado a ceder informações importantes com relação a exames realizados para o diagnóstico clínico da distrofia muscular, confirmado pelo seu médico neurologista. Após o envio, os pais, responsáveis e/ou médicos dos pacientes deverão preencher o questionário que será disponibilizado pelo aplicativo.
                                            </Text>
                                            <View style={styles.subContainer}>
                                                <Text style={styles.title}>Importante</Text>
                                                <Text style={styles.text}>
                                                    Todas as informações que você fornecer serão mantidas em um banco de dados seguro e, quaisquer informações que possam identificar você e seus familiares, não serão compartilhadas para fins comerciais. Nossa equipe está profundamente comprometida em proteger sua privacidade e identidade e usará todas as medidas disponíveis para garantir a segurança de suas informações pessoais. O TeleNeuMu respeita e cumpre a nova Lei Geral de Proteção de Dados (LGPD) implementada no Brasil desde 14/08/2018.
                                                </Text>
                                            </View>

                                            <View style={styles.subContainer}>
                                                <Text style={styles.question}>Participar do Programa de Mapeamento Genético</Text>
                                                <Controller
                                                    control={form.control}
                                                    render={({ field: { name, ref } }) => (
                                                        <RadioGroup
                                                            testID={name}
                                                            ref={ref}
                                                            style={styles.radioGroup}
                                                            selectedIndex={selectedIndex}
                                                            onChange={handleParticipateProgram}>
                                                            <Radio disabled={unidentifiedError} style={styles.radio}>Sim</Radio>
                                                            <Radio disabled={unidentifiedError} style={styles.radio}>Não</Radio>
                                                        </RadioGroup>
                                                    )}
                                                    name='abrafeuRegistrationOptIn'
                                                />
                                            </View>
                                            {((selectedIndex === 0 && accept && underage) ||
                                                (selectedIndex === 0 && accept && !underage)) && !patient?.pastExams?.exam && (
                                                    <>
                                                        <View style={[styles.subContainer, { alignItems: 'flex-start' }]}>
                                                            <Controller
                                                                control={form.control}
                                                                rules={{
                                                                    required: {
                                                                        value: selectedIndex === 0,
                                                                        message: 'Campo obrigatório'
                                                                    },
                                                                    minLength: {
                                                                        value: selectedIndex === 0 ? 5 : 0,
                                                                        message: `Mín. 5 caracteres`
                                                                    },
                                                                }}
                                                                render={({ field: { onChange, onBlur, value, name, ref } }) => (
                                                                    <Input
                                                                        size='small'
                                                                        label="Número de Registro do Médico Responsável *"
                                                                        style={styles.input}
                                                                        keyboardType='number-pad'
                                                                        placeholder=''
                                                                        testID={name}
                                                                        onBlur={onBlur}
                                                                        onChangeText={onChange}
                                                                        value={value ? onlyNumbers(value) : value}
                                                                        ref={ref}
                                                                        maxLength={6}
                                                                        underlineColorAndroid="transparent"
                                                                    />
                                                                )}
                                                                name='pastExams.doctor.crm'
                                                                defaultValue=''
                                                            />
                                                            <CustomErrorMessage name='pastExams.doctor.crm' errors={form.formState.errors} />

                                                            <View style={styles.viewLabel}>
                                                                <Text category='label' status='primary' style={styles.labelTitle}>Assinale uma das alternativas abaixo em relação ao teste genético: *</Text>
                                                            </View>
                                                            <Controller
                                                                control={form.control}
                                                                rules={{
                                                                    required: {
                                                                        value: selectedIndex === 0,
                                                                        message: 'Campo obrigatório'
                                                                    },
                                                                }}
                                                                render={({ field: { onBlur, name, ref } }) => (
                                                                    <RadioGroup
                                                                        ref={ref}
                                                                        testID={name}
                                                                        style={{ paddingHorizontal: 5 }}
                                                                        selectedIndex={selectedIndexExamDNA}
                                                                        onChange={handleRadioSelectedExamDNA}>
                                                                        {examResult.map((_, i) => {
                                                                            return (
                                                                                <Radio
                                                                                    key={_ + i}
                                                                                    onBlur={onBlur}>{evaProps => <Text {...evaProps} >{_}</Text>}</Radio>
                                                                            )
                                                                        })}
                                                                    </RadioGroup>
                                                                )}
                                                                name='pastExams.exam.id'
                                                            />
                                                            <View style={{
                                                                paddingVertical: 10
                                                            }}>
                                                                <CustomErrorMessage name='pastExams.exam.id' errors={form.formState.errors} />
                                                            </View>
                                                        </View>
                                                        <View style={styles.containerBtn}>
                                                            <Button
                                                                size='small'
                                                                onPress={form.handleSubmit(confirm)}
                                                                status='primary'>{'Salvar'.toUpperCase()}</Button>
                                                        </View>
                                                    </>
                                                )}

                                            {((statusPermission === UnderageStatus.GRANTED && underage && selectTmp === 0) ||
                                                (statusPermission === UnderageStatus.NOT_REQUESTED && !underage && selectTmp === 0))
                                                && formAvailable === AbrafeuOptInStatus.AVAILABLE && (
                                                    <>
                                                        <View style={{ flexDirection: 'column', paddingBottom: 15, alignItems: 'center' }}>

                                                            <View style={styles.containerBtn}>
                                                                <Button
                                                                    disabled
                                                                    onPress={form.handleSubmit(confirm)}
                                                                    status='success'>{'abrir questionário'.toUpperCase()}</Button>
                                                            </View>
                                                        </View>
                                                    </>
                                                )}
                                        </View>
                                    </KeyboardAwareScrollView>
                                )}
                        </>
                    )
                }

                <RequestUnderageDialog
                    ref={requestUnderageRef}
                    onVisible={setVisibleModal}
                    visible={visibleModal}
                    callback={callbackRequestPermission}
                />
            </SafeAreaLayout>
            <Portal>
                <ModalizeFixed
                    ref={ref}
                    alwaysOpen={0}
                    snapPoint={300}
                    adjustToContentHeight={true}
                    closeOnOverlayTap={false}
                    withHandle={false}>
                    <Text style={styles.textConfirmModalize}>
                        {selectedIndex === 0 ? 'Deseja participar do programa?' : 'Deseja não participar do programa?'}
                    </Text>
                    <TouchableOpacity style={styles.contentButton} activeOpacity={0.75} onPress={form.handleSubmit(confirm)}>
                        <Text style={styles.contentButtonText}>{'Confirmar'.toUpperCase()}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.contentButton, styles.buttonOutline]} activeOpacity={0.75} onPress={close}>
                        <Text style={[styles.contentButtonText, styles.buttonTextOutline]}>{'Cancelar'.toUpperCase()}</Text>
                    </TouchableOpacity>
                </ModalizeFixed>
            </Portal>
        </Host >
    )
}

export default PatientGeneticMappingProgramScreen