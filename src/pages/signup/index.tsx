import React, { FC, ReactElement, useRef, useState } from 'react'
import { View } from 'react-native'
import { Button, CheckBox, Spinner, useStyleSheet, useTheme } from '@ui-kitten/components'
import Stepper from '@components/stepper'
import { SafeAreaLayout } from '@components/safeAreaLayout'
import { Modalize } from 'react-native-modalize'
import { useForm } from 'react-hook-form'
import { UserPatientData, UserDoctorData } from '@models/User'
import toast from '@helpers/toast'
import { cleanNumberMask } from '@utils/mask'
import { createPatientProfileCreator, createUser } from '@services/user.service'
import { extractFieldString } from '@utils/common'
import { useNavigation, useRoute } from '@react-navigation/native'
import TermsConditions from '@components/acceptTerms'
import { RegisterParams } from '@models/SignUpProps'

import PatientSignUpPart1Screen from './patient/part1'
import PatientSignUpPart2Screen from './patient/part2'
import PatientSignUpPart3Screen from './patient/part3'
import DoctorSignUpPart1Screen from './doctor/part1'
import DoctorSignUpPart2Screen from './doctor/part2'
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
    const theme = useTheme()
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

            if (params?.type === 0) {
                const newData = data as UserPatientData

                if (newData.creator && newData.creator.data && newData.creator?.data['cpf'])
                    newData.creator.data['cpf'] = cleanNumberMask(newData.creator.data['cpf'])

                if (newData.creator && newData.creator.data && newData.creator?.data['phone'])
                    newData.creator.data['phone'] = cleanNumberMask(newData.creator.data['phone'])

                if (newData.abrafeuRegistrationOptIn === 'false') {
                    delete newData.pastExams
                }
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

        if (messageError !== '') toast.danger({ message: messageError, duration: 1000 })
        else navigation.navigate('RegistrationConfirmation')
    }

    const LoadingIndicator = () => (
        <Spinner size='small' status='basic' />
    )

    const patientSteps = [
        <PatientSignUpPart1Screen register={params} form={patientForm} onSubmit={onNext} />,
        <PatientSignUpPart2Screen register={params} form={patientForm} onSubmit={onNext} />,
        <PatientSignUpPart3Screen register={params} form={patientForm} onSubmit={onNext} />
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
        <>
            <SafeAreaLayout level='1' style={styles.safeArea}>
                <View style={styles.content}>
                    <Stepper
                        active={active}
                        content={steps[params.type] ? steps[params.type] : []}
                        onBack={onBack}
                        onFinish={forms[params.type] ? forms[params.type].handleSubmit(onDone) : () => { }}
                        onNext={forms[params.type] ? forms[params.type].handleSubmit(onNext) : () => { }}
                        buttonStyle={styles.button}
                        buttonDoneStyle={{
                            ...styles.button,
                            backgroundColor: theme['color-success-default']
                        }}
                        stepStyle={styles.stepIndicator}
                        iconButton={true}
                    />
                </View>
                <Modalize
                    ref={modalizeRef}
                    withReactModal={true}
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
                                    status='warning'
                                >
                                    CADASTRAR
                                </Button>
                            </View>
                        </View>
                    </View>
                </Modalize>
            </SafeAreaLayout>
        </>
    )
}

export default SignUpScreen