import LoadingIndicatorComponent from '@components/loadingIndicator'
import { SafeAreaLayout } from '@components/safeAreaLayout'
import { useNavigation, useRoute } from '@react-navigation/native'
import { changePassReq } from '@services/login.service'
import { Button, Input, Text, useStyleSheet } from '@ui-kitten/components'
import { cleanNumberMask, formatCpf, isEmailValid } from '@utils/mask'
import { validate } from 'gerador-validador-cpf'
import React, { FC, ReactElement, useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { SafeAreaView, View } from 'react-native'
import Toast from 'react-native-toast-message'
import { changePasswdReqStyle } from './style'

interface ChangePasswordRequestParams {
    choice: 'CPF' | 'EMAIL'
}

interface ChangePasswdRequest {
    valueAs: string
}

const ChangePasswordRequest: FC = (): ReactElement => {

    const navigation = useNavigation<any>()
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
                Toast.show({
                    type: 'danger',
                    text2: 'Ocorreu um erro. Tente novamente mais tarde',
                })
            } else {
                navigation.navigate('PasswordRequestSuccessfully')
            }

        } catch (error) {
            Toast.show({
                type: 'danger',
                text2: 'Ocorreu um erro. Contate o administrador',
            })

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
                    <Button status='primary' accessoryLeft={isLoading ? () => <LoadingIndicatorComponent insideButton size='small' status='basic' /> : undefined}
                        disabled={isLoading}
                        style={styles.btn}
                        onPress={handleSubmit(handleRecoveryPasswd)}>
                        {"Enviar E-mail".toUpperCase()}
                    </Button>
                </View>
            </SafeAreaView>
        </SafeAreaLayout>
    )
}

export default ChangePasswordRequest