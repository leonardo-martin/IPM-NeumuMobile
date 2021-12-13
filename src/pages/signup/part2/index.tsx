import React, { FC, ReactElement, useEffect, useState } from 'react'
import { SafeAreaView, View } from 'react-native'
import { registerStyle } from '../style'
import { Input, Button, Text, IconProps, Icon } from '@ui-kitten/components'
import { useRoute } from '@react-navigation/core'
import { UserData } from '@models/User'
import { Controller, useForm } from 'react-hook-form'
import { TouchableWithoutFeedback } from '@ui-kitten/components/devsupport'

const SignUpPart2Screen: FC = (): ReactElement => {

  const [secureTextEntry, setSecureTextEntry] = useState(true)
  const route = useRoute()
  const { params }: any = route
  const { control, handleSubmit, setValue, formState: { errors } } = useForm<UserData>()

  useEffect(() => {
    setValue('mothersName', params?.data.mothersName)
    setValue('name', params?.data.name)
    setValue('cpf', params?.data.cpf)
    setValue('phone', params?.data.phone)
    setValue('phone2', params?.data.phone2)
  }, [])

  const toggleSecureEntry = () => {
    setSecureTextEntry(!secureTextEntry)
  }

  const renderIconRightPassword = (props: IconProps) => (
    <TouchableWithoutFeedback onPress={toggleSecureEntry}>
      <Icon {...props} name={secureTextEntry ? 'eye-off' : 'eye'} />
    </TouchableWithoutFeedback>
  )

  const submit = (data: UserData) => {
    console.log(data)
  }

  return (
    <>
      <SafeAreaView style={registerStyle.content}>
        <View style={registerStyle.box}>
          <Controller
            control={control}
            rules={{
              required: true,
              pattern: /^\S+@\S+$/
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="E-mail *"
                style={registerStyle.input}
                keyboardType='email-address'
                testID='email'
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                underlineColorAndroid="transparent"
              />
            )}
            name='email'
            defaultValue=''
          />
          {errors.email?.type === 'pattern' && <Text category='s1' style={registerStyle.text}>Invalid</Text>}
          {errors.email?.type === 'required' && <Text category='s1' style={registerStyle.text}>Campo obrigatório</Text>}
          <Controller
            control={control}
            rules={{
              required: true
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Usuário *"
                style={registerStyle.input}
                keyboardType='default'
                testID='username'
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                maxLength={30}
                underlineColorAndroid="transparent"
              />
            )}
            name='username'
            defaultValue=''
          />
          {errors.username?.type === 'required' && <Text category='s1' style={registerStyle.text}>Campo obrigatório</Text>}
          <Controller
            control={control}
            rules={{
              required: true,
              minLength: 8
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Senha *"
                style={registerStyle.input}
                keyboardType='default'
                testID='password'
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                maxLength={16}
                accessoryRight={renderIconRightPassword}
                secureTextEntry={secureTextEntry}
                returnKeyType="send"
                underlineColorAndroid="transparent"
              />
            )}
            name='password'
            defaultValue=''
          />
          {errors.password?.type === 'minLength' && <Text category='s1' style={registerStyle.text}>Min 8</Text>}
          {errors.password?.type === 'required' && <Text category='s1' style={registerStyle.text}>Campo obrigatório</Text>}
          <Button
            onPress={handleSubmit(submit)}
            style={registerStyle.button}
            status='primary'>
            ENVIAR
          </Button>
        </View>
      </SafeAreaView>
    </>
  )
}

export default SignUpPart2Screen