import React, { FC, ReactElement, useEffect, useState } from 'react'
import { SafeAreaView, View } from 'react-native'
import { changePasswdReqStyle } from './style'
import { Button, Input, Spinner, Text, useStyleSheet } from '@ui-kitten/components'
import { Controller, useForm } from 'react-hook-form'
import { changePassReq } from '@services/login.service'
import { useRoute } from '@react-navigation/native'
import { cleanNumberMask, formatCpf, isEmailValid } from '@utils/mask'
import { validate } from 'gerador-validador-cpf'
import { SafeAreaLayout } from '@components/safeAreaLayout'
import toast from '@helpers/toast'

interface ChangePasswordRequestParams {
    choice: 'CPF' | 'EMAIL'
}

interface ChangePasswdRequest {
    valueAs: string
}

const ChangePasswordRequest: FC = (): ReactElement => {

    const styles = useStyleSheet(changePasswdReqStyle)
    const route = useRoute()
    const params = route.params as ChangePasswordRequestParams
    const [isLoading, setIsLoading] = useState(false)

    const { control, handleSubmit, reset, formState: { errors, isSubmitSuccessful } } = useForm<ChangePasswdRequest>()

    const handleRecoveryPasswd = async (data: ChangePasswdRequest) => {

        setIsLoading(!isLoading)
        try {
            const response = await changePassReq({
                userCpf: (params.choice === 'CPF') ? cleanNumberMask(data.valueAs) : '',
                userEmail: (params.choice === 'EMAIL') ? data.valueAs : ''
            })

            if (response.status !== 200 && response.status !== 201) {
                toast.danger({ message: 'Ocorreu um erro. Tente novamente mais tarde.', duration: 1000 })
            } else {
                toast.success({ message: 'Foi enviado um link para redefinir a senha. Verifique sua caixa de entrada.', duration: 1000 })
            }
        } catch (error) {
            toast.danger({ message: 'Ocorreu um erro. Contate o administrador.', duration: 1000 })

        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        if (isSubmitSuccessful) {
            reset({})
        }
    }, [isSubmitSuccessful, reset])


    const LoadingIndicator = () => (
        <Spinner size='small' status='basic' />
    )

    return (
        <SafeAreaLayout level='1' style={styles.safeArea}>
            <SafeAreaView style={styles.content}>
                <View style={styles.box}>
                    <Controller
                        control={control}
                        rules={{
                            required: {
                                value: true,
                                message: 'Campo obrigatório'
                            },
                            minLength: {
                                value: (params.choice === 'CPF' ? 14 : params.choice === 'EMAIL' ? 5 : 5),
                                message: `Mín. ${(params.choice === 'CPF' ? 14 : params.choice === 'EMAIL' ? 5 : 5)} caracteres`
                            },
                            maxLength: {
                                value: (params.choice === 'CPF' ? 14 : params.choice === 'EMAIL' ? 60 : 60),
                                message: `Max. ${(params.choice === 'CPF' ? 14 : params.choice === 'EMAIL' ? 60 : 60)} caracteres`
                            },
                            validate: (e) => (params.choice === 'CPF' ? validate(e) : params.choice === 'EMAIL' ? isEmailValid(e) : undefined)
                        }}
                        render={({ field: { onChange, onBlur, value } }) => (
                            <Input
                                label={(params.choice === 'CPF' ? 'CPF' : params.choice === 'EMAIL' ? 'Endereço de E-mail' : 'Insira o valor') + " *"}
                                style={styles.input}
                                testID='emailOrCpf'
                                onBlur={onBlur}
                                onChangeText={onChange}
                                value={params.choice === 'CPF' ? formatCpf(value) : params.choice === 'EMAIL' ? value.replace(/[^0-9A-Za-z]*/, "") : value}
                                autoCapitalize='none'
                                keyboardType={params.choice === 'CPF' ? 'number-pad' : params.choice === 'EMAIL' ? 'email-address' : 'default'}
                                maxLength={params.choice === 'CPF' ? 14 : params.choice === 'EMAIL' ? 60 : 60}
                                placeholder={params.choice === 'CPF' ? '999.999.999-99' : params.choice === 'EMAIL' ? 'example@example.com' : ''}
                            />
                        )}
                        name='valueAs'
                        defaultValue=''
                    />
                    {errors.valueAs?.type === 'minLength' && <Text category='label' style={styles.text}>{errors.valueAs?.message}</Text>}
                    {errors.valueAs?.type === 'required' && <Text category='label' style={styles.text}>{errors.valueAs?.message}</Text>}
                    {errors.valueAs?.type === 'validate' && <Text category='label' style={styles.text}>{'Campo inválido'}</Text>}
                    <Button status='primary' accessoryLeft={isLoading ? LoadingIndicator : undefined}
                        disabled={isLoading}
                        style={styles.btn}
                        onPress={handleSubmit(handleRecoveryPasswd)}
                    >
                        REDEFINIR SENHA
                    </Button>
                </View>
            </SafeAreaView>
        </SafeAreaLayout>
    )
}

export default ChangePasswordRequest