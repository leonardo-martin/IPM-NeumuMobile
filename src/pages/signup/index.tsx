import React, { FC, ReactElement, useState } from 'react'
import { View } from 'react-native'
import { Button, CheckBox, Spinner, useStyleSheet, useTheme } from '@ui-kitten/components'
import Stepper from '@components/stepper'
import { SafeAreaLayout } from '@components/safeAreaLayout'
import { useModalize } from '@hooks/useModalize'
import { Modalize } from 'react-native-modalize'
import { useForm, UseFormReturn } from 'react-hook-form'
import { UserData } from '@models/User'
import toast from '@helpers/toast'
import SignUpPart1Screen from './part1'
import SignUpPart2Screen from './part2'
import SignUpPart3Screen from './part3'
import { signupStyle } from './style'
import { cleanNumberMask } from '@utils/mask'
import { createPatientProfileCreator, createUser } from '@services/user.service'
import { extractFieldString } from '@utils/common'
import { useNavigation } from '@react-navigation/native'
import TermsConditions from '@components/acceptTerms'

export interface SignUpProps {
    form: UseFormReturn<UserData, any>
    onSubmit: (data: UserData) => void
}

const SignUpScreen: FC = (): ReactElement => {

    const formRegister = useForm<UserData>()
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const navigation = useNavigation<any>()
    const [active, setActive] = useState(0)
    const theme = useTheme()
    const styles = useStyleSheet(signupStyle)

    const { ref, open, close } = useModalize()
    const [sending, setSending] = useState<boolean>(false)
    const [isAllowSubmit, setIsAllowSubmit] = useState<boolean>(false)
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
    const onDone = () => (isAllowSubmit) ? open() : null

    const submit = async (data: UserData) => {
        setIsLoading(!isLoading)
        setSending(!sending)
        var messageError = ''
        try {
            data.cpf = cleanNumberMask(data.cpf)
            data.phone = cleanNumberMask(data.phone)
            data.phone2 = cleanNumberMask(data.phone2)

            if (data.creator && data.creator.data && data.creator?.data['cpf'])
                data.creator.data['cpf'] = cleanNumberMask(data.creator.data['cpf'])

            if (data.creator && data.creator.data && data.creator?.data['phone'])
                data.creator.data['phone'] = cleanNumberMask(data.creator.data['phone'])

            if (data.abrafeuRegistrationOptIn === 'false') {
                delete data.pastExams
            }
            const response = await createUser(data, 'patient')

            if (response.status !== 201) {
                const message = response.data?.message
                if (message.toUpperCase().includes('Unique constraint'.toUpperCase())) {
                    var field = extractFieldString(message)
                    field = (field === 'SUSNUMBER') ? 'Cartão Nacional de Saúde' : field
                    messageError = field + ' já cadastrado'
                } else {
                    messageError = 'Ocorreu um erro. Tente novamente mais tarde.'
                }
            } else await createPatientProfileCreator(data.creator, Number(response.data.patientId))

        } catch (error) {
            messageError = 'Ocorreu um erro inesperado'
        } finally {
            close()
            setIsLoading(false)
            setSending(false)
        }

        if (messageError !== '') toast.danger({ message: messageError, duration: 1000 })
        else navigation.navigate('RegistrationConfirmation')
    }

    const LoadingIndicator = () => (
        <Spinner size='small' status='basic' />
    )

    const content = [
        <SignUpPart1Screen form={formRegister} onSubmit={onNext} />,
        <SignUpPart2Screen form={formRegister} onSubmit={onNext} />,
        <SignUpPart3Screen form={formRegister} onSubmit={onNext} handleIsAllowSubmit={setIsAllowSubmit} />
    ]

    return (
        <>
            <SafeAreaLayout level='1' style={styles.safeArea}>
                <View style={styles.content}>
                    <Stepper
                        isAllowSubmit={isAllowSubmit}
                        active={active}
                        content={content}
                        onBack={onBack}
                        onFinish={onDone}
                        onNext={formRegister.handleSubmit(onNext)}
                        buttonStyle={styles.button}
                        buttonDoneStyle={{
                            ...styles.button,
                            backgroundColor: theme['color-success-default']
                        }}
                        stepStyle={styles.stepIndicator}
                        iconButton={true}
                    />
                </View>
                <Modalize ref={ref}
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
                                    onPress={formRegister.handleSubmit(submit)}
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