import React, { FC, ReactElement, useEffect, useState } from 'react'
import { ActivityIndicator, SafeAreaView, ToastAndroid, TouchableOpacity, View } from 'react-native'
import { changePasswdReqStyle } from './style'
import { Input, Text } from '@ui-kitten/components'
import { Controller, useForm } from 'react-hook-form'
import { changePassReq } from '@services/login'
import Toast from '@components/toast'
import { customTheme } from '../../../custom-theme'

interface ChangePasswdRequest {
    emailOrCpf: string
}

const ChangePasswordRequest: FC = (): ReactElement => {

    const [isLoading, setIsLoading] = useState(false)
    const [visibleToast, setVisibleToast] = useState<boolean>(false)
    const [message, setMessage] = useState<string>('')
    useEffect(() => setVisibleToast(false), [visibleToast])

    const { control, handleSubmit, reset, formState: { errors, isSubmitSuccessful } } = useForm<ChangePasswdRequest>()
    const handleRecoveryPasswd = async (data: ChangePasswdRequest) => {

        setIsLoading(!isLoading)
        try {
            const response = await changePassReq({
                userCpf: data.emailOrCpf,
                userEmail: data.emailOrCpf
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

    return (
        <>
            <SafeAreaView style={changePasswdReqStyle.content}>
                <View style={changePasswdReqStyle.box}>
                    <Text category='h4' style={changePasswdReqStyle.label}>Insira seu E-mail ou CPF</Text>
                    <Controller
                        control={control}
                        rules={{
                            required: {
                                value: true,
                                message: 'Campo obrigatório'
                            },
                            minLength: {
                                value: 6,
                                message: `Mín. ${6} caracteres`
                            }
                        }}
                        render={({ field: { onChange, onBlur, value } }) => (
                            <Input
                                style={changePasswdReqStyle.input}
                                keyboardType='default'
                                testID='emailOrCpf'
                                onBlur={onBlur}
                                onChangeText={onChange}
                                value={value}
                                autoCapitalize='none'
                                autoComplete='email'
                            />
                        )}
                        name='emailOrCpf'
                        defaultValue=''
                    />
                    {errors.emailOrCpf && <Text category='label' style={changePasswdReqStyle.text}>{errors.emailOrCpf?.message}</Text>}
                    <TouchableOpacity onPress={handleSubmit(handleRecoveryPasswd)}
                        disabled={isLoading}>
                        <View
                            style={{
                                ...changePasswdReqStyle.viewBtn,
                                backgroundColor: isLoading ? customTheme['color-primary-300'] : customTheme['color-primary-500']
                            }}
                        >
                            {isLoading ?
                                <ActivityIndicator size="small" color='white' />
                                :
                                <Text style={changePasswdReqStyle.btnText}>
                                    ENVIAR
                                </Text>
                            }
                        </View>
                    </TouchableOpacity>
                    <Toast visible={visibleToast} message={message} gravity={ToastAndroid.TOP} />
                </View>
            </SafeAreaView>
        </>
    )
}

export default ChangePasswordRequest