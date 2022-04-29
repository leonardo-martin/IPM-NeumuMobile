import HeaderAdmin from '@components/header/admin'
import ModalizeFixed from '@components/modalize'
import { SafeAreaLayout } from '@components/safeAreaLayout'
import toast from '@helpers/toast'
import { useModal } from '@hooks/useModal'
import { PatientDto } from '@models/Patient'
import { useFocusEffect } from '@react-navigation/native'
import { optIn, optOut } from '@services/abrafreu.service'
import { getPatient, updatePatient } from '@services/patient.service'
import { Button, Input, Radio, RadioGroup, Spinner, Text, useStyleSheet } from '@ui-kitten/components'
import { getRelationPastExams } from '@utils/common'
import { onlyNumbers } from '@utils/mask'
import React, { FC, ReactElement, useCallback, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { Keyboard, ScrollView, TouchableOpacity, View } from 'react-native'
import { Modalize } from 'react-native-modalize'
import { Host, Portal } from 'react-native-portalize'
import { examResult } from './data'
import { mappingStyle } from './style'

const PatientGeneticMappingProgramScreen: FC = (): ReactElement => {

    const [isLoading, setIsLoading] = useState<boolean>(false)
    const form = useForm<PatientDto>()
    const { ref } = useModal<Modalize>()
    const [selectedIndex, setSelectedIndex] = useState<number | undefined>(undefined)
    const [selectTmp, setSelectTmp] = useState<number | undefined>(selectedIndex)
    const styles = useStyleSheet(mappingStyle)
    const [selectedIndexExamDNA, setSelectedIndexExamDNA] = useState(-1)
    const [unidentifiedError, setUnidentifiedError] = useState<boolean>(false)

    const getData = async () => {
        try {
            const response = await getPatient()
            const optIn = response.data.abrafeuRegistrationOptIn === 'true' ? 0 : 1
            form.setValue('abrafeuRegistrationOptIn', response.data.abrafeuRegistrationOptIn)

            if (optIn === 0 && response.data.pastExams) {
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
            toast.danger({ message: 'Erro ao buscar os dados do usuário', duration: 3000 })
        }
    }

    useFocusEffect(
        useCallback(() => {
            getData()
        }, [])
    )

    const handleParticipateProgram = (index: number) => {
        setSelectedIndex(index)
        form.setValue('abrafeuRegistrationOptIn', index === 0 ? 'true' : 'false')
        if (index !== selectedIndex) ref.current?.open()
    }

    const confirm = async (data: PatientDto) => {
        Keyboard.dismiss()
        setIsLoading(!isLoading)

        if (data.abrafeuRegistrationOptIn === 'false') {
            form.resetField('pastExams')
            delete data.pastExams
            setSelectedIndexExamDNA(-1)
        } else {
            if (selectTmp === 1) {
                delete data.pastExams
            }
        }

        try {
            await updatePatient(data)

            // send email
            if (selectedIndex === 0 && !data.pastExams) {
                await optIn()
            } else if (selectedIndex === 1) {
                await optOut()
            }
            setSelectTmp(data.abrafeuRegistrationOptIn === 'true' ? 0 : 1)
            setIsLoading(false)
            
        } catch (error) {
            setIsLoading(false)
            setSelectedIndex(selectTmp)
            toast.danger({ message: 'Ocorreu um erro. Tente novamente mais tarde', duration: 3000 })
        } finally {
            ref.current?.close()
        }
    }

    const close = () => {
        setSelectedIndex(selectTmp)
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

    const LoadingIndicator = () => (
        <Spinner size='tiny' status='basic' />
    )

    return (
        <Host>
            <HeaderAdmin />
            <SafeAreaLayout level='1' style={styles.safeArea}>
                <ScrollView
                    keyboardShouldPersistTaps='handled'
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ flexGrow: 1 }}>
                    <View style={styles.container}>

                        <View style={styles.subContainer}>
                            <Text style={styles.title}>Como funciona ?</Text>
                            <Text style={styles.text}>
                                Aceitando participar, e após este cadastro feito, será enviado um e-mail direto do aplicativo para que você forneça informações sobre você e/ou seu filho.
                            </Text>
                            <Text style={styles.text}>
                                Você será solicitado a ceder informações importantes com relação a exames realizados para o diagnóstico clínico da distrofia muscular, confirmado pelo seu médico neurologista. Após o envio, os pais, responsáveis e/ou médicos dos pacientes deverão preencher o questionário que será disponibilizado pelo aplicativo.
                            </Text>
                        </View>
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
                        {selectTmp === 0 && (
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
                                                label="CRM do Médico Responsável *"
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
                                                editable={!isLoading}
                                            />
                                        )}
                                        name='pastExams.doctor.crm'
                                        defaultValue=''
                                    />
                                    {form.formState.errors.pastExams?.doctor?.crm && <Text category='s2' style={[styles.text, { paddingHorizontal: 5 }]}>{form.formState.errors.pastExams?.doctor?.crm?.message}</Text>}

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
                                                            disabled={isLoading}
                                                            onBlur={onBlur}>{evaProps => <Text {...evaProps} >{_}</Text>}</Radio>
                                                    )
                                                })}
                                            </RadioGroup>
                                        )}
                                        name='pastExams.exam.id'
                                    />
                                    {form.formState.errors.pastExams?.exam?.id && <Text category='s2' style={[styles.text, { paddingHorizontal: 5 }]}>{form.formState.errors.pastExams?.exam?.id?.message}</Text>}
                                </View>
                                <View style={styles.containerBtn}>
                                    <Button
                                        accessoryLeft={isLoading ? LoadingIndicator : undefined}
                                        size='small'
                                        onPress={form.handleSubmit(confirm)}
                                        status='primary'>{isLoading ? '' : 'Salvar'.toUpperCase()}</Button>
                                </View>
                            </>
                        )}
                    </View>
                </ScrollView>
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