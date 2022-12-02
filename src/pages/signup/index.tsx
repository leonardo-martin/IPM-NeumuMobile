import TermsConditions from '@components/acceptTerms'
import RegisterHeader from '@components/header/register'
import LoadingIndicatorComponent from '@components/loadingIndicator'
import { SafeAreaLayout } from '@components/safeAreaLayout'
import Stepper from '@components/stepper'
import { PatientProfileCreatorTypeEnum, RelationshipPatient } from '@models/PatientProfileCreator'
import { RegisterParams } from '@models/SignUpProps'
import { UserDoctorData, UserPatientData } from '@models/User'
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native'
import { createUser } from '@services/user.service'
import { Button, CheckBox, useStyleSheet } from '@ui-kitten/components'
import { extractFieldString } from '@utils/common'
import { cleanNumberMask } from '@utils/mask'
import React, { FC, ReactElement, useCallback, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Alert, BackHandler, Keyboard, View } from 'react-native'
import { Modalize } from 'react-native-modalize'
import { Host, Portal } from 'react-native-portalize'
import Toast from 'react-native-toast-message'
import { creatorRelationship } from './data'
import PatientSignUpEndScreen from './patient/last'
import PatientSignUpPart1Screen from './patient/part1'
import DoctorSignUpPart1Screen from './specialist/part1'
import DoctorSignUpPart2Screen from './specialist/part2'
import { signupStyle } from './style'

const SignUpScreen: FC = (): ReactElement => {

    const patientForm = useForm<UserPatientData>()
    const specialistForm = useForm<UserDoctorData>()

    const forms = [
        patientForm,
        specialistForm
    ]

    const route = useRoute()
    const params = route.params as RegisterParams

    const modalizeRef = useRef<Modalize>()
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const navigation = useNavigation<any>()
    const [active, setActive] = useState(0)
    const styles = useStyleSheet(signupStyle)

    const [sending, setSending] = useState<boolean>(false)
    const [indeterminate, setIndeterminate] = useState<boolean | undefined>(true)
    const [checked, setChecked] = useState<boolean | undefined>(false)

    const onIndeterminateChange = (isChecked: boolean, isIndeterminate: boolean | undefined) => {
        setIndeterminate(isIndeterminate)
        if (isChecked) {
            setChecked(true)
        } else setChecked(false)
    }

    const hasUnsavedChanges = () => {
        Alert.alert(
            'Descartar alterações?',
            'Você tem alterações não salvas. Tem certeza que deseja sair dessa tela?',
            [
                { text: "Não", style: 'cancel', onPress: () => { } },
                {
                    text: 'Sim',
                    style: 'destructive',
                    onPress: () => navigation.goBack(),
                },
            ]
        )
    }

    const onBack = () => {
        if (active > 0)
            setActive((p) => p - 1)
        else
            hasUnsavedChanges()
    }

    const onNext = () => setActive((p) => p + 1)
    const onDone = () => {
        Keyboard.dismiss()
        setIsLoading(false)
        setSending(false)
        modalizeRef.current?.open()
    }

    useFocusEffect(
        useCallback(() => {
            const onBackPress = () => {
                if (active > 0) {
                    onBack()
                    return true
                } else {
                    hasUnsavedChanges()
                    return true
                }
            }
            const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress)
            return () => subscription.remove()
        }, [active])
    )

    const submit = async (data: UserPatientData | UserDoctorData) => {
        setIsLoading(true)
        setSending(true)

        var messageError = ''
        let allowedToCreate: boolean = true

        try {
            if (data.cpf)
                data.cpf = cleanNumberMask(data.cpf)
            data.phone = cleanNumberMask(data.phone)
            data.phone2 = cleanNumberMask(data.phone2)

            // defined that the username is your document
            data.username = data.cpf ?? data.rne

            if (data.emailConfirmation)
                delete data.emailConfirmation

            if (params?.type === 0) {
                let newData = data as UserPatientData
                newData = {
                    ...newData,
                    data: {
                        ...newData?.data,
                        'examType': 'clinical'
                    },
                    patientProfileCreatorTypeId: Number(newData.patientProfileCreatorTypeId)

                }

                if (newData?.data['typeOfDocument']) delete newData.data['typeOfDocument']

                if (newData?.data['emailConfirmation']) delete newData.data['emailConfirmation']

                if (newData && newData.data && newData.data['cpf'])
                    newData.data['cpf'] = cleanNumberMask(newData.data['cpf'])

                if (newData && newData.data && newData.data['phone'])
                    newData.data['phone'] = cleanNumberMask(newData.data['phone'])

                if (newData && newData.data && newData.data['phone2'])
                    newData.data['phone2'] = cleanNumberMask(newData.data['phone2'])

                if (newData.abrafeuRegistrationOptIn === 'false') delete newData.pastExams

                if (newData.susNumber === '' || !newData.susNumber) delete newData.susNumber

                try {
                    if (newData?.patientProfileCreatorTypeId === PatientProfileCreatorTypeEnum.Other) {

                        const id = newData.data['creatorRelationship']
                        newData.data['creatorRelationship'] = creatorRelationship.find((_, index) => index === id)

                        if (newData.data['creatorRelationship'] as RelationshipPatient === 'Familiar') {
                            const kinship: {
                                id: number,
                                title: string
                            } = JSON.parse(JSON.stringify(newData.data['kinship']))
                            newData.data['kinship'] = kinship.title
                        } else {
                            delete newData.data['kinship']
                        }

                        if (newData.data['creatorRelationship'] as RelationshipPatient !== 'Profissional de Saúde') delete newData.data['specialty']

                        if (newData.data['creatorRelationship'] as RelationshipPatient !== 'Tutor Legal') {
                            delete newData.data['guardian']
                        } else {
                            // allowedToCreate = false
                            // try {
                            //     const file = newData.data['guardian'].attachment as DocumentPickerResponse
                            //     const formData = new FormData()
                            //     formData.append('fileFormat', file.name)
                            //     formData.append('file', {
                            //         uri: Platform.OS === 'android'
                            //             ? file.uri
                            //             : file.uri.replace('file://', ''),
                            //         name: file.name,
                            //         type: file.type
                            //     })

                            //     const response = await uploadTutorFile(formData, newData.cpf as string, newData.data['cpf'])

                            //     if (response.status === 201) {
                            //         allowedToCreate = true
                            //         newData.data['guardian'].attachment.uri = '[hidden]'
                            //     } else {
                            //         const message: string = response.data.message.message ?? ""
                            //         if (message.includes('Patient profile already exists')) {
                            //             messageError = `Tutor já cadastrado para o CPF ${formatCpf(data.cpf)}`
                            //         } else messageError = 'Erro ao enviar anexo'
                            //     }

                            // } catch (error) {
                            //     allowedToCreate = false
                            //     messageError = 'Erro ao enviar a documentação'
                            // }
                        }
                    } else {
                        delete newData?.responsibleEmail
                    }
                } catch (error) {
                    allowedToCreate = false
                    messageError = 'Erro desconhecido. Entre em contato com o suporte'
                }

                if (allowedToCreate) {
                    const response = await createUser(newData)

                    if (response.status !== 201) {
                        const message = response.data?.message
                        if (message.toUpperCase().includes('Unique constraint'.toUpperCase())) {
                            var field = extractFieldString(message)
                            field = (field === 'SUSNUMBER') ? 'Cartão Nacional de Saúde' : field
                            messageError = field + ' já cadastrado'
                        } else {
                            messageError = 'Ocorreu um erro. Tente novamente mais tarde.'
                        }
                    }

                    setIsLoading(false)
                    setSending(false)
                } else {
                    setIsLoading(false)
                    setSending(false)
                }
            } else if (params?.type === 1) {
                const newData = data as UserDoctorData

                newData.professionalTypeId = "1"
                if (newData.specialty) newData.specialty.professionalTypeId = "1"

                if (newData.specialty?.others && newData.specialty.others !== '') newData.specialty.description = newData.specialty?.others
                else delete newData.specialty?.others

                const response = await createUser(newData, 'doctor')
                if (response.status !== 201) {
                    const message = response.data?.message
                    if (message.toUpperCase().includes('Unique constraint'.toUpperCase())) {
                        var field = extractFieldString(message)
                        messageError = field + ' já cadastrado'
                    } else {
                        messageError = 'Ocorreu um erro. Tente novamente mais tarde.'
                    }
                }
                setIsLoading(false)
                setSending(false)
            }

        } catch (error) {
            setIsLoading(false)
            setSending(false)
            messageError = 'Ocorreu um erro inesperado. Entre em contato com o administrador'
        } finally {
            modalizeRef.current?.close()
        }

        if (messageError !== '')
            Toast.show({
                type: 'danger',
                text2: messageError,
                autoHide: false,
            })
        else navigation.navigate('RegistrationConfirmation', {
            type: params.type
        })
    }

    const patientSteps = [
        <PatientSignUpPart1Screen register={params} form={patientForm} onSubmit={onNext} />,
        <PatientSignUpEndScreen register={params} form={patientForm} onSubmit={onNext} />
    ]

    const specialistSteps = [
        <DoctorSignUpPart1Screen register={params} form={specialistForm} onSubmit={onNext} />,
        <DoctorSignUpPart2Screen register={params} form={specialistForm} onSubmit={onNext} />
    ]

    const steps = [
        patientSteps,
        specialistSteps
    ]

    return (
        <Host>
            <RegisterHeader
                form={forms[params?.type || 0]}
                active={active}
                onBack={onBack}
                onNext={onNext}
                onFinish={onDone}
                numberScreens={steps[params?.type || 0].length}
            />
            <SafeAreaLayout level='1' style={styles.safeArea}>
                <View style={styles.content}>
                    <Stepper
                        active={active}
                        content={steps[params?.type || 0] ? steps[params?.type || 0] : []}
                    />
                </View>
                <Portal>
                    <Modalize
                        ref={modalizeRef}
                        closeOnOverlayTap={!sending}
                    >
                        <View style={styles.termsModal}>
                            <TermsConditions />
                            <View style={styles.viewCheckbox}>
                                <CheckBox
                                    testID={'acceptTerms'}
                                    style={styles.checkbox}
                                    checked={checked}
                                    indeterminate={indeterminate}
                                    onChange={onIndeterminateChange}>
                                    Ao marcar esta caixa, eu confirmo que li e aceito o Termos e Condições de Uso.
                                </CheckBox>
                                <View style={styles.viewBtn}>
                                    <Button
                                        accessoryLeft={isLoading ? () => <LoadingIndicatorComponent insideButton size='small' status='basic' /> : undefined}
                                        disabled={!checked}
                                        onPress={forms[params?.type || 0] ? forms[params?.type || 0].handleSubmit(submit) : undefined}
                                        status='warning'>
                                        CADASTRAR
                                    </Button>
                                </View>
                            </View>
                        </View>
                    </Modalize>
                </Portal>
            </SafeAreaLayout>
        </Host>
    )
}

export default SignUpScreen