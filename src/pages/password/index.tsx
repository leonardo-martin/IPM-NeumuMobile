import React, { FC, ReactElement } from 'react'
import { SafeAreaView, View } from 'react-native'
import HeaderAuth from '../../components/header/auth'
import { recoveryStyle } from './style'
import { Input, Button, Text } from '@ui-kitten/components'
import { Controller, useForm } from 'react-hook-form'

interface Recovery {
    email: string
}

const RecoveryPasswordScreen: FC = (): ReactElement => {

    const { control, handleSubmit, formState: { errors } } = useForm<Recovery>()
    const handleRecoveryPasswd = (data: Recovery) => {

    }

    return (
        <>
            <HeaderAuth
                hasBackButton={true} />
            <SafeAreaView style={recoveryStyle.content}>
                <View style={recoveryStyle.box}>
                    <Text category='h4' style={recoveryStyle.label}>Insira seu E-mail</Text>
                    <Controller
                        control={control}
                        rules={{
                            required: true,
                            pattern: /^\S+@\S+$/
                        }}
                        render={({ field: { onChange, onBlur, value } }) => (
                            <Input
                                style={recoveryStyle.input}
                                keyboardType='default'
                                testID='email'
                                onBlur={onBlur}
                                onChangeText={onChange}
                                value={value}
                            />
                        )}
                        name='email'
                        defaultValue=''
                    />
                    {errors.email?.type === 'pattern' && <Text category='label' style={recoveryStyle.text}>Invalid</Text>}
                    {errors.email?.type === 'required' && <Text category='label' style={recoveryStyle.text}>This is required</Text>}
                    <Button
                        onPress={handleSubmit(handleRecoveryPasswd)}
                        style={recoveryStyle.button}
                        status='primary'>
                        ENVIAR
                    </Button>
                </View>
            </SafeAreaView>
        </>
    )
}

export default RecoveryPasswordScreen