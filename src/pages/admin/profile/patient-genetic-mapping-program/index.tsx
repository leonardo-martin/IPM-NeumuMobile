import CustomErrorMessage from '@components/error'
import HeaderAdmin from '@components/header/admin'
import ModalizeFixed from '@components/modalize'
import { SafeAreaLayout } from '@components/safeAreaLayout'
import { useAppSelector } from '@hooks/redux'
import { useModal } from '@hooks/useModal'
import { AbrafeuOptInStatus } from '@models/Abrafeu'
import { PatientDto } from '@models/Patient'
import { UnderageStatus } from '@models/Underage'
import { useFocusEffect, useNavigation } from '@react-navigation/native'
import { getStatusAbrafeuForm, optIn, optOut } from '@services/abrafreu.service'
import { getPatient, updatePatient } from '@services/patient.service'
import { getStatus } from '@services/underage.service'
import { Button, Input, Radio, RadioGroup, Spinner, Text, useStyleSheet } from '@ui-kitten/components'
import { EvaSize, EvaStatus } from '@ui-kitten/components/devsupport'
import { getRelationPastExams } from '@utils/common'
import { formatCpf, onlyNumbers } from '@utils/mask'
import LoadingIndicatorComponent from 'components/loadingIndicator'
import { compareAsc, subYears } from 'date-fns'
import React, { FC, ReactElement, useCallback, useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { Alert, Keyboard, RefreshControl, TouchableOpacity, View } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { Modalize } from 'react-native-modalize'
import { Host, Portal } from 'react-native-portalize'
import Toast from 'react-native-toast-message'
import { RootState } from 'store'
import { examResult } from './data'
import PendingApprovalMappingProgram from './extra/pending-approval.component'
import { mappingStyle } from './style'

const PatientGeneticMappingProgramScreen: FC = (): ReactElement => {

    const [isSending, setIsSending] = useState<boolean>(false)
    const navigation = useNavigation<any>()
    const [refreshing, setRefreshing] = useState<boolean>(false)
    const [isFetchingData, setIsFetchingData] = useState<boolean>(false)
    const [isOpenedModal, setIsOpenedModal] = useState<boolean>(false)
    const [patient, setPatient] = useState<PatientDto>()
    const form = useForm<PatientDto>()
    const { ref } = useModal<Modalize>()
    const [selectedIndex, setSelectedIndex] = useState<number | undefined>(undefined)
    const [selectTmp, setSelectTmp] = useState<number | undefined>(selectedIndex)
    const styles = useStyleSheet(mappingStyle)
    const [selectedIndexExamDNA, setSelectedIndexExamDNA] = useState(-1)
    const [unidentifiedError, setUnidentifiedError] = useState<boolean>(false)
    const [statusPermission, setStatusPermission] = useState<UnderageStatus | undefined>(undefined)
    const [isCompleteAddress, setIsCompleteAddress] = useState(false)
    const [accept, setAccept] = useState<boolean>(false)
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
                    'Por questões legais, caso o paciente possua menos de 18 anos, será solicitado via e-mail, uma permissão ao seu responsável cadastrado no aplicativo (com 18 anos ou mais) para participar do Programa de Mapeamento Genético',
                    [
                        {
                            text: 'OK',
                            style: 'default',
                            onPress: () => {
                                setAccept(true)
                                form.clearErrors()
                                if (!isCompleteAddress)
                                    modalRequiredAddress()
                                else
                                    alertCommon()
                            }
                        }
                    ]
                )
            }
        } else if (index === 0 && accept) {
            if (!isCompleteAddress)
                modalRequiredAddress()
            else
                alertCommon()
        }

        form.clearErrors()
        form.setValue('pastExams.doctor.crm', '')
        form.setValue('pastExams.exam.id', '')
        form.setValue('pastExams.exam.description', '')
        form.setValue('abrafeuRegistrationOptIn', index === 0 ? 'true' : 'false')
        form.setValue('pastExams.questions', undefined)
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
                    style: 'cancel',
                    onPress: () => setSelectedIndex(1)
                },
                {
                    text: 'Meu Perfil',
                    style: 'default',
                    onPress: () => navigation.navigate('EditProfile')
                }
            ]
        )
    }

    const checkIfPermission = () => {
        if ((profile?.address1 !== '' && profile?.address1 !== null) &&
            (profile?.city !== '' && profile?.city !== null) &&
            (profile?.state !== '' && profile?.state !== null) &&
            (profile?.postalCode !== '' && profile?.postalCode !== null)) {
            setIsCompleteAddress(true)
        } else {
            setIsCompleteAddress(false)
        }
    }

    const checkIfFormIsAvailable = () => {
        if (formAvailable !== AbrafeuOptInStatus.AVAILABLE) {
            Alert.alert(
                'Questionário DFEU',
                'Questionário não disponível ainda. Informarems quando estiver preparado para realizar o documento',
                [
                    {
                        text: 'Ok',
                        style: 'default'
                    }
                ]
            )
        } else {
            navigation.navigate('AbrafeuForm')
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
                setIsSending(true)
                const response = await updatePatient(data)
                setPatient(response.data)
                // send email
                if (selectedIndex === 0) {
                    try {
                        await optIn()
                        Toast.show({
                            type: 'success',
                            text2: 'Obrigado por inscrever-se!',
                        })
                    } catch (error) {
                        if (error && ((error as any).response?.data?.message?.message as string).toString().toLowerCase().includes('underage and does not have permission')) {
                            Toast.show({
                                type: 'success',
                                text2: 'Solicitação efetuada com sucesso. Aguarde aprovação do responsável',
                            })
                            setStatusPermission(UnderageStatus.PENDING)
                        }
                    }
                } else if (selectedIndex === 1) {
                    if (underage) {
                        setAccept(false)
                    }
                    await optOut()
                    Toast.show({
                        type: 'info',
                        text2: 'Que pena... Agradecemos pelo apoio',
                    })
                }

                setIsOpenedModal(false)
                ref.current?.close()
                setIsSending(false)
                setSelectTmp(data.abrafeuRegistrationOptIn === 'true' ? 0 : 1)
            } catch (error) {
                setIsOpenedModal(false)
                ref.current?.close()
                setIsSending(false)
                setSelectedIndex(selectTmp)
                Toast.show({
                    type: 'danger',
                    text2: 'Ocorreu um erro. Tente novamente mais tarde!',
                })
            }
        } else {
            setIsOpenedModal(true)
            ref.current?.open()
        }
        setIsSending(false)
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

    const onRefresh = useCallback(() => {
        setRefreshing(true)
        getUnderageStatus()
        setRefreshing(false)
    }, [])

    return (
        <Host>
            <HeaderAdmin />
            <SafeAreaLayout level='1' style={styles.safeArea}>
                {isFetchingData ?
                    <>
                        <LoadingIndicatorComponent size='giant' />
                    </>
                    : (
                        <>
                            {statusPermission === UnderageStatus.PENDING ?
                                <ScrollView
                                    showsVerticalScrollIndicator={false}
                                    contentContainerStyle={{ flex: 1 }}
                                    refreshControl={
                                        <RefreshControl
                                            refreshing={refreshing}
                                            onRefresh={onRefresh}
                                        />
                                    }>
                                    <PendingApprovalMappingProgram />
                                </ScrollView>
                                : (
                                    <KeyboardAwareScrollView
                                        keyboardShouldPersistTaps='handled'
                                        keyboardDismissMode='interactive'
                                        showsVerticalScrollIndicator={false}
                                        enableOnAndroid>
                                        <View
                                            style={styles.container}>
                                            <Text style={styles.title}>Como funciona ?</Text>
                                            <Text style={styles.text}>
                                                {`\t`}Aceitando participar, e após este cadastro feito, será enviado um e-mail de boas vindas direto do aplicativo explicando as fases do projeto.
                                                Ao participar deste projeto, você concorda em ceder informações ao parceiro Abrafeu sobre dados pessoais necessários, laudos, e a exames realizados para o diagnóstico clínico da distrofia muscular confirmado pelo seu médico neurologista.
                                            </Text>
                                            <Text style={styles.text}>
                                                {`\t`}Após o envio, os pais, responsáveis e/ou médicos dos pacientes deverão preencher o questionário que será disponibilizado pelo aplicativo.
                                            </Text>
                                            <View style={styles.subContainer}>
                                                <Text style={styles.title}>Importante</Text>
                                                <Text style={styles.text}>
                                                    {`\t`}Todas as informações que você fornecer serão mantidas em um banco de dados seguro e, quaisquer informações que possam identificar você e seus familiares, não serão compartilhadas para fins comerciais.
                                                    Nossa equipe está profundamente comprometida em proteger sua privacidade e identidade e usará todas as medidas disponíveis para garantir segurança de suas informações pessoais.
                                                </Text>
                                                <Text style={styles.text}>
                                                    {`\t`}O TeleNeuMu e a Abrafeu respeita e cumpre a nova Lei Geral de Proteção de Dados (LGPD) implementada no Brasil desde 14/08/2018.
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
                                                (selectedIndex === 0 && accept && !underage)) && !patient?.pastExams?.exam &&
                                                isCompleteAddress && (
                                                    <>
                                                        <View style={[styles.subContainer, { alignItems: 'flex-start' }]}>
                                                            <View>
                                                                <Text style={styles.text}>
                                                                    Eu, <Text style={[styles.text, { fontWeight: 'bold', textTransform: 'uppercase', textDecorationLine: 'underline' }]}>{profile?.name}</Text>, portador do {!!profile?.cpf ? 'CPF' : 'RNM'} <Text style={[styles.text, { fontWeight: 'bold', textDecorationLine: 'underline' }]}>{" " + (!!profile?.cpf ? (formatCpf(profile?.cpf) || profile?.cpf) : profile?.rne) + " "}</Text> concordo que o meu DNA (ou o DNA do meu filho) seja tornado anônimo e utilizado com o objetivo de pesquisa.
                                                                </Text>
                                                                <Controller
                                                                    control={form.control}
                                                                    rules={{
                                                                        required: {
                                                                            value: true,
                                                                            message: 'Campo obrigatório'
                                                                        }
                                                                    }}
                                                                    render={({ field: { name, ref, onChange, value } }) => (
                                                                        <RadioGroup
                                                                            testID={name}
                                                                            ref={ref}
                                                                            style={{ paddingHorizontal: 5 }}
                                                                            selectedIndex={value}
                                                                            onChange={onChange}>
                                                                            <Radio>Sim</Radio>
                                                                            <Radio>Não (descarte imediato após a conclusão do teste autorizado neste documento)</Radio>
                                                                        </RadioGroup>
                                                                    )}
                                                                    name='pastExams.questions.one'
                                                                />
                                                                <CustomErrorMessage name='pastExams.questions.one' errors={form.formState.errors} />
                                                                <Text style={styles.text}>
                                                                    Concordo que os dados genômicos sejam tornados anônimos e utilizados com o objetivo de pesquisa ou publicações científicas.
                                                                </Text>
                                                                <Controller
                                                                    control={form.control}
                                                                    rules={{
                                                                        required: {
                                                                            value: true,
                                                                            message: 'Campo obrigatório'
                                                                        }
                                                                    }}
                                                                    render={({ field: { name, ref, onChange, value } }) => (
                                                                        <RadioGroup
                                                                            testID={name}
                                                                            ref={ref}
                                                                            style={{ paddingHorizontal: 5 }}
                                                                            selectedIndex={value}
                                                                            onChange={onChange}>
                                                                            <Radio>Sim</Radio>
                                                                            <Radio>Não (informações serão descartadas em 60 meses)</Radio>
                                                                        </RadioGroup>
                                                                    )}
                                                                    name='pastExams.questions.two'
                                                                />
                                                                <CustomErrorMessage name='pastExams.questions.two' errors={form.formState.errors} />
                                                            </View>
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
                                                (statusPermission === UnderageStatus.NOT_REQUESTED && !underage && selectTmp === 0)) &&
                                                formAvailable === AbrafeuOptInStatus.AVAILABLE && (
                                                    <>
                                                        <View style={{ flexDirection: 'column', paddingBottom: 15, alignItems: 'center' }}>

                                                            <View style={styles.containerBtn}>
                                                                <Button
                                                                    onPress={checkIfFormIsAvailable}
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
                        {selectedIndex === 0 ? 'Deseja participar do programa?' : 'Deseja sair do programa?'}
                    </Text>
                    <TouchableOpacity style={styles.contentButton} activeOpacity={0.75} onPress={form.handleSubmit(confirm)}>
                        {isSending ? (
                            <LoadingIndicatorComponent size='small' status='control' />
                        ) : (
                            <Text style={styles.contentButtonText}>{'Confirmar'.toUpperCase()}</Text>
                        )}
                    </TouchableOpacity>
                    <TouchableOpacity disabled={isSending} style={[styles.contentButton, styles.buttonOutline]} activeOpacity={0.75} onPress={close}>
                        <Text style={[styles.contentButtonText, styles.buttonTextOutline]}>{'Cancelar'.toUpperCase()}</Text>
                    </TouchableOpacity>
                </ModalizeFixed>
            </Portal>
        </Host >
    )
}

export default PatientGeneticMappingProgramScreen