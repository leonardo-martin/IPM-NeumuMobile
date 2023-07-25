import CustomErrorMessage from '@components/error'
import LoadingIndicatorComponent from '@components/loadingIndicator'
import { SafeAreaLayout } from '@components/safeAreaLayout'
import { EChoicesChangePassword, UserAccRecoveryPasswdRequest } from '@models/User'
import { useNavigation, useRoute } from '@react-navigation/native'
import { changePassReq } from '@services/login.service'
import { Button, Input, useStyleSheet } from '@ui-kitten/components'
import { cleanNumberMask, formatCpf } from '@utils/mask'
import React, { FC, ReactElement, useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { SafeAreaView, View } from 'react-native'
import Toast from 'react-native-toast-message'
import { ChangePasswordRequestParams, config } from '../data'
import { changePasswdReqStyle } from './style'

interface ChangePasswdRequest {
    choice: string
}

const ChangePasswordRequest: FC = (): ReactElement => {

    const navigation = useNavigation<any>()
    const form = useForm<ChangePasswdRequest>()
    const styles = useStyleSheet(changePasswdReqStyle)
    const route = useRoute()
    const params = route.params as ChangePasswordRequestParams
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        if (form.formState.isSubmitSuccessful) {
            form.reset({})
        }
    }, [form.formState.isSubmitSuccessful])

    const submit = React.useCallback(async (data: ChangePasswdRequest) => {

        setIsLoading(!isLoading)
        try {
            let inputValue: UserAccRecoveryPasswdRequest = {}
            switch (params.choice) {
                case EChoicesChangePassword.CPF:
                    inputValue = {
                        userCpf: cleanNumberMask(data.choice)
                    }
                    break;
                case EChoicesChangePassword.EMAIL:
                    inputValue = {
                        userEmail: data.choice
                    }
                    break;
                case EChoicesChangePassword.RNM:
                    inputValue = {
                        userRne: data.choice
                    }
                    break;
                default:
                    break;
            }

            const response = await changePassReq(inputValue)

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
    }, [params])

    return (
        <SafeAreaLayout level='1' style={styles.safeArea}>
            <SafeAreaView style={styles.content}>
                <View style={styles.box}>
                    <Controller
                        control={form.control}
                        rules={config[params.choice].rules || {}}
                        render={({ field: { onChange, onBlur, value } }) => (
                            <Input
                                {...config[params.choice].input || undefined}
                                style={styles.input}
                                onBlur={onBlur}
                                onChangeText={onChange}
                                value={params.choice === EChoicesChangePassword.CPF ?
                                    formatCpf(value) :
                                    params.choice === EChoicesChangePassword.EMAIL ?
                                        value.replace(/[^0-9A-Za-z]*/, "")
                                        : value}
                            />
                        )}
                        name='choice'
                        defaultValue=''
                    />
                    {form.formState.errors.choice?.type !== 'validate' && <CustomErrorMessage name='choice' errors={form.formState.errors} />}
                    {form.formState.errors.choice?.type === 'validate' && <CustomErrorMessage name='choice' errors={form.formState.errors} customMessage='Campo inválido' />}
                    <Button status='primary'
                        accessoryLeft={isLoading ?
                            () => <LoadingIndicatorComponent insideButton size='small' status='basic' />
                            : undefined}
                        disabled={isLoading}
                        style={styles.btn}
                        onPress={form.handleSubmit(submit)}>
                        {"Enviar E-mail".toUpperCase()}
                    </Button>
                </View>
            </SafeAreaView>
        </SafeAreaLayout>
    )
}

export default ChangePasswordRequest