import { SafeAreaLayout } from '@components/safeAreaLayout'
import toast from '@helpers/toast'
import { UserAccRecoveryPasswd } from '@models/User'
import { useNavigation } from '@react-navigation/native'
import { changePass } from '@services/login.service'
import { Button, Icon, IconProps, Input, Spinner, Text, useStyleSheet } from '@ui-kitten/components'
import { validatePasswd } from '@utils/validators'
import React, { FC, ReactElement, useRef, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { View } from 'react-native'
import { resetPasswordByTokenStyle } from './style'

const MAX_TOKEN_LENGTH = 32

const ChangePasswordWithToken: FC = (): ReactElement => {

    const styles = useStyleSheet(resetPasswordByTokenStyle)
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [secureTextEntry, setSecureTextEntry] = useState(true)
    const [secureTextEntryRepeat, setSecureTextEntryRepeat] = useState(true)
    const form = useForm<UserAccRecoveryPasswd>()
    const navigation = useNavigation<any>()

    const password = useRef({})
    password.current = form.watch("password", "")

    const onSubmit = async (data: UserAccRecoveryPasswd) => {
        setIsLoading(!isLoading)

        try {
            const response = await changePass(data)
            if (response && response.status !== 200 && response.status !== 201) {
                let messageToast = 'Token expirado ou inválido'
                setIsLoading(false)
                toast.warning({ message: messageToast, duration: 3000 })
            } else {
                setIsLoading(false)
                navigation.navigate('PasswordChangeConfirmation')
            }

        } catch (error) {
            toast.warning({ message: 'Erro desconhecido. Contate o administrador', duration: 3000 })
        } finally {
            setIsLoading(false)
        }
    }

    const toggleSecureEntry = () => setSecureTextEntry(!secureTextEntry)
    const toggleSecureEntryRepeat = () => setSecureTextEntryRepeat(!secureTextEntryRepeat)

    const renderIconRightPassword = (props: IconProps) => (
        <Icon {...props} name={secureTextEntry ? 'eye-off' : 'eye'} onPress={toggleSecureEntry} pack='eva' />
    )

    const renderIconRightRepeat = (props: IconProps) => (
        <Icon {...props} name={secureTextEntryRepeat ? 'eye-off' : 'eye'} onPress={toggleSecureEntryRepeat} pack='eva' />
    )

    const LoadingIndicator = () => (
        <Spinner size='tiny' status='basic' />
    )

    return (
        <>
            <SafeAreaLayout level='1' style={styles.safeArea}>
                <View style={styles.container}>
                    <Text style={{ textAlign: 'center' }} category='label'>Insira o token para alterar a senha</Text>
                    <Controller
                        control={form.control}
                        rules={{
                            required: {
                                value: true,
                                message: 'Campo Obrigatório'
                            },
                            minLength: {
                                value: MAX_TOKEN_LENGTH,
                                message: `Mín. ${MAX_TOKEN_LENGTH} caracteres`
                            },
                            maxLength: {
                                value: MAX_TOKEN_LENGTH,
                                message: `Max. ${MAX_TOKEN_LENGTH} caracteres`
                            },
                        }}
                        render={({ field: { onChange, onBlur, value, name, ref } }) => (
                            <Input
                                size='small'
                                label='Token'
                                style={styles.input}
                                keyboardType='default'
                                testID={name}
                                onBlur={onBlur}
                                onChangeText={onChange}
                                value={value}
                                returnKeyType="next"
                                ref={ref}
                                onSubmitEditing={() => form.setFocus('password')}
                                underlineColorAndroid="transparent"
                                autoCapitalize="characters"
                                maxLength={MAX_TOKEN_LENGTH}
                            />
                        )}
                        name='token'
                    />
                    {form.formState.errors.token && <Text category='s2' style={styles.text}>{form.formState.errors.token?.message}</Text>}

                    <Controller
                        control={form.control}
                        rules={{
                            required: {
                                value: true,
                                message: 'Campo Obrigatório'
                            },
                            minLength: {
                                value: 8,
                                message: `Mín. 8 caracteres`
                            },
                            validate: (value) => value ? validatePasswd(value) : undefined
                        }}
                        render={({ field: { onChange, onBlur, value, name, ref } }) => (
                            <Input
                                size='small'
                                label="Nova Senha *"
                                style={styles.input}
                                keyboardType='default'
                                testID={name}
                                onBlur={onBlur}
                                onChangeText={onChange}
                                value={value}
                                maxLength={20}
                                accessoryRight={renderIconRightPassword}
                                secureTextEntry={secureTextEntry}
                                returnKeyType="next"
                                ref={ref}
                                onSubmitEditing={() => form.setFocus('newPassword')}
                                underlineColorAndroid="transparent"
                                autoCapitalize="none"
                                textContentType="password"
                                caption={(evaProps) => (
                                    <>
                                        <Text {...evaProps}>* 8 caracteres no mínimo</Text>
                                        <Text {...evaProps}>* 1 Letra Maiúscula no mínimo</Text>
                                        <Text {...evaProps}>* 1 Número no mínimo</Text>
                                        <Text {...evaProps}>* 1 Símbolo no mínimo: {'$*&@#'}</Text>
                                    </>
                                )}
                            />
                        )}
                        name='password'
                    />
                    {form.formState.errors.password?.type === 'minLength' && <Text category='s2' style={styles.text}>{form.formState.errors.password?.message}</Text>}
                    {form.formState.errors.password?.type === 'required' && <Text category='s2' style={styles.text}>{form.formState.errors.password?.message}</Text>}
                    {form.formState.errors.password?.type === 'validate' && <Text category='s2' style={styles.text}>Senha inválida</Text>}
                    <Controller
                        control={form.control}
                        rules={{
                            required: {
                                value: true,
                                message: 'Campo Obrigatório'
                            },
                            minLength: {
                                value: 8,
                                message: `Mín. 8 caracteres`
                            },
                            validate: {
                                valid: (e) => e ? validatePasswd(e) : undefined,
                                equal: (e) => e === password.current
                            }
                        }}
                        render={({ field: { onChange, onBlur, value, name, ref } }) => (
                            <Input
                                size='small'
                                label="Confirmar Senha *"
                                style={styles.input}
                                keyboardType='default'
                                testID={name}
                                onBlur={onBlur}
                                onChangeText={onChange}
                                value={value}
                                maxLength={20}
                                accessoryRight={renderIconRightRepeat}
                                secureTextEntry={secureTextEntryRepeat}
                                returnKeyType="send"
                                ref={ref}
                                onSubmitEditing={form.handleSubmit(onSubmit)}
                                underlineColorAndroid="transparent"
                                autoCapitalize="none"
                                textContentType="newPassword"
                            />
                        )}
                        name='newPassword'
                    />
                    {form.formState.errors.newPassword?.type === 'minLength' && <Text category='s2' style={styles.text}>{form.formState.errors.newPassword?.message}</Text>}
                    {form.formState.errors.newPassword?.type === 'required' && <Text category='s2' style={styles.text}>{form.formState.errors.newPassword?.message}</Text>}
                    {form.formState.errors.newPassword?.type === 'valid' && <Text category='s2' style={styles.text}>Senha inválida</Text>}
                    {form.formState.errors.newPassword?.type === 'equal' && <Text category='s2' style={styles.text}>Senhas não conferem</Text>}
                    <View style={styles.viewButton}>
                        <Button
                            size='small'
                            style={styles.button}
                            onPress={form.handleSubmit(onSubmit)}
                            accessoryRight={isLoading ? LoadingIndicator : undefined}
                            status="primary">
                            {eavProps => <Text {...eavProps}
                                style={[eavProps?.style, styles.uppercase]}
                            >Alterar</Text>}
                        </Button>
                    </View>
                </View>

            </SafeAreaLayout>
        </>
    )
}

export default ChangePasswordWithToken