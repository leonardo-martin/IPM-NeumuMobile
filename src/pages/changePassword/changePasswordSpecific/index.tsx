import React, { FC, ReactElement, useEffect, useState } from 'react'
import { SafeAreaView, ToastAndroid, View } from 'react-native'
import { changePasswdReqStyle } from './style'
import { Button, Input, Spinner, Text } from '@ui-kitten/components'
import { Controller, useForm } from 'react-hook-form'
import { changePassReq } from '@services/login.service'
import Toast from '@components/toast'
import { useRoute } from '@react-navigation/native'
import { cleanNumberMask, formatCpf, isEmailValid } from '@utils/mask'
import { validate } from 'gerador-validador-cpf'

interface ChangePasswordRequestParams {
    choice: 'CPF' | 'EMAIL'
}

interface ChangePasswdRequest {
    valueAs: string
}

const ChangePasswordRequest: FC = (): ReactElement => {

    const route = useRoute()
    const params = route.params as ChangePasswordRequestParams
    const [isLoading, setIsLoading] = useState(false)
    const [visibleToast, setVisibleToast] = useState<boolean>(false)
    const [message, setMessage] = useState<string>('')

    useEffect(() => setVisibleToast(false), [visibleToast])

    const { control, handleSubmit, reset, formState: { errors, isSubmitSuccessful } } = useForm<ChangePasswdRequest>()

    const handleRecoveryPasswd = async (data: ChangePasswdRequest) => {

        setIsLoading(!isLoading)
        try {
            const response = await changePassReq({
                userCpf: (params.choice === 'CPF') ? cleanNumberMask(data.valueAs) : '',
                userEmail: (params.choice === 'EMAIL') ? data.valueAs : ''
            })

            if (response.status !== 200 && response.status !== 201) {
                setMessage('Ocorreu um erro. Tente novamente mais tarde')
                setVisibleToast(true)
            } else {
                setMessage('Foi enviado um link para redefinir a senha. Verifique sua caixa de entrada')
                setVisibleToast(true)
            }
        } catch (error) {
            setMessage('Ocorreu um erro. Contate o administrador')
            setVisibleToast(true)
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
        <>
            <SafeAreaView style={changePasswdReqStyle.content}>
                <View style={changePasswdReqStyle.box}>
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
                                style={changePasswdReqStyle.input}
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
                    {errors.valueAs?.type === 'minLength' && <Text category='label' style={changePasswdReqStyle.text}>{errors.valueAs?.message}</Text>}
                    {errors.valueAs?.type === 'required' && <Text category='label' style={changePasswdReqStyle.text}>{errors.valueAs?.message}</Text>}
                    {errors.valueAs?.type === 'validate' && <Text category='label' style={changePasswdReqStyle.text}>{'Campo inválido'}</Text>}
                    <Button status='primary' accessoryLeft={isLoading ? LoadingIndicator : undefined}
                        disabled={isLoading}
                        style={changePasswdReqStyle.btn}
                        onPress={handleSubmit(handleRecoveryPasswd)}
                    >
                        REDEFINIR SENHA
                    </Button>
                    <Toast visible={visibleToast} message={message} gravity={ToastAndroid.TOP} />
                </View>
            </SafeAreaView>
        </>
    )
}

export default ChangePasswordRequest