import TermsConditions from '@components/acceptTerms'
import RegisterHeader from '@components/header/register'
import { SafeAreaLayout } from '@components/safeAreaLayout'
import Stepper from '@components/stepper'
import toast from '@helpers/toast'
import { PatientProfileCreatorTypeEnum, RelationshipPatient } from '@models/PatientProfileCreator'
import { RegisterParams } from '@models/SignUpProps'
import { UserDoctorData, UserPatientData } from '@models/User'
import { useNavigation, useRoute } from '@react-navigation/native'
import { createPatientProfileCreator, createUser } from '@services/user.service'
import { Button, CheckBox, Spinner, useStyleSheet } from '@ui-kitten/components'
import { extractFieldString } from '@utils/common'
import { cleanNumberMask } from '@utils/mask'
import React, { FC, ReactElement, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Platform, View } from 'react-native'
import { DocumentPickerResponse } from 'react-native-document-picker'
import { Modalize } from 'react-native-modalize'
import { Host, Portal } from 'react-native-portalize'
import { uploadTutorFile } from 'services/document.service'
import { creatorRelationship } from './patient/data'
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

    const onBack = () => setActive((p) => p - 1)
    const onNext = () => setActive((p) => p + 1)
    const onDone = () => modalizeRef.current?.open()

    const submit = async (data: UserPatientData | UserDoctorData) => {
        setIsLoading(!isLoading)
        setSending(!sending)

        var messageError = ''

        try {

            data.cpf = cleanNumberMask(data.cpf)
            data.phone = cleanNumberMask(data.phone)
            data.phone2 = cleanNumberMask(data.phone2)

            // defined that the username is your CPF
            data.username = data.cpf

            if (params?.type === 0) {
                const newData = data as UserPatientData

                let allowedToCreate: boolean = true

                if (newData.creator && newData.creator.data && newData.creator?.data['cpf'])
                    newData.creator.data['cpf'] = cleanNumberMask(newData.creator.data['cpf'])

                if (newData.creator && newData.creator.data && newData.creator?.data['phone'])
                    newData.creator.data['phone'] = cleanNumberMask(newData.creator.data['phone'])

                if (newData.creator && newData.creator.data && newData.creator?.data['phone2'])
                    newData.creator.data['phone2'] = cleanNumberMask(newData.creator.data['phone2'])

                if (newData.abrafeuRegistrationOptIn === 'false') {
                    delete newData.pastExams
                }

                if (newData.creator?.patientProfileCreatorTypeId === PatientProfileCreatorTypeEnum.Other) {

                    const id = newData.creator.data['creatorRelationship']
                    newData.creator.data['creatorRelationship'] = creatorRelationship.find((_, index) => index === id)

                    if (newData.creator.data['creatorRelationship'] as RelationshipPatient === 'Familiar') {
                        const kinship: {
                            id: number,
                            title: string
                        } = JSON.parse(JSON.stringify(newData.creator.data['kinship']))
                        newData.creator.data['kinship'] = kinship.title
                    } else {
                        delete newData.creator.data['kinship']
                    }

                    if (newData.creator.data['creatorRelationship'] as RelationshipPatient !== 'Profissional de Saúde') {
                        delete newData.creator.data['specialty']
                    }

                    if (newData.creator.data['creatorRelationship'] as RelationshipPatient !== 'Tutor Legal') {
                        delete newData.creator.data['guardian']
                    } else {
                        allowedToCreate = false
                        try {
                            const file = newData.creator.data['guardian'].attachment as DocumentPickerResponse
                            const formData = new FormData()
                            formData.append('fileFormat', file.name)
                            formData.append('file', {
                                uri: Platform.OS === 'android'
                                    ? file.uri
                                    : file.uri.replace('file://', ''),
                                name: file.name,
                                type: file.type
                            })

                            const result = await uploadTutorFile(formData, newData.cpf as string, newData.creator.data['cpf'])
                            if (result.status === 201) {
                                allowedToCreate = true
                                newData.creator.data['guardian'].attachment.uri = '[hidden]'
                            }

                        } catch (error) {
                            messageError = 'Erro ao enviar a documentação'
                        }
                    }
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
                    } else await createPatientProfileCreator(Number(response.data.patientId), newData.creator)
                }
            } else if (params?.type === 1) {
                const response = await createUser(data as UserDoctorData, 'doctor')
                if (response.status !== 201) {
                    const message = response.data?.message
                    if (message.toUpperCase().includes('Unique constraint'.toUpperCase())) {
                        var field = extractFieldString(message)
                        messageError = field + ' já cadastrado'
                    } else {
                        messageError = 'Ocorreu um erro. Tente novamente mais tarde.'
                    }
                }
            }

        } catch (error) {
            messageError = 'Ocorreu um erro inesperado. Entre em contato com o administrador'
        } finally {
            modalizeRef.current?.close()
            setIsLoading(false)
            setSending(false)
        }

        if (messageError !== '') toast.danger({ message: messageError, duration: 3000 })
        else navigation.navigate('RegistrationConfirmation')
    }

    const LoadingIndicator = () => (
        <Spinner size='small' status='basic' />
    )

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
                form={forms[params.type]}
                active={active}
                onBack={onBack}
                onNext={onNext}
                onFinish={onDone}
                numberScreens={steps[params.type].length}
            />
            <SafeAreaLayout level='1' style={styles.safeArea}>
                <View style={styles.content}>
                    <Stepper
                        active={active}
                        content={steps[params.type] ? steps[params.type] : []}
                        stepStyle={styles.stepIndicator}
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
                                        accessoryLeft={isLoading ? LoadingIndicator : undefined}
                                        disabled={!checked || isLoading}
                                        onPress={forms[params.type] ? forms[params.type].handleSubmit(submit) : undefined}
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