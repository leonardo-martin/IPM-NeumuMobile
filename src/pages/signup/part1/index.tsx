import React, { FC, ReactElement } from 'react'
import { SafeAreaView, View } from 'react-native'
import { registerStyle } from '../style'
import { Input, Button, Text } from '@ui-kitten/components'
import { Controller, useForm } from 'react-hook-form'
import { UserData } from '../../../models/User'
import { useNavigation } from '@react-navigation/core'

const SignUpPart1Screen: FC = (): ReactElement => {

  const { control, handleSubmit, formState: { errors } } = useForm<UserData>()
  const navigation = useNavigation<any>()
  const submit = (data: UserData) => {
    navigation.navigate('SignUpPart2', { data: data })
  }

  return (
    <>
      <SafeAreaView style={registerStyle.content}>
        <View style={registerStyle.box}>
          <Controller
            control={control}
            rules={{
              required: true
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Nome da Mãe *"
                style={registerStyle.input}
                keyboardType='default'
                testID='mothersName'
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                underlineColorAndroid="transparent"
              />
            )}
            name='mothersName'
            defaultValue=''
          />
          {errors.mothersName?.type === 'required' && <Text category='label' style={registerStyle.text}>This is required</Text>}
          <Controller
            control={control}
            rules={{
              required: true
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Nome *"
                style={registerStyle.input}
                keyboardType='default'
                testID='name'
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                underlineColorAndroid="transparent"
              />
            )}
            name='name'
            defaultValue=''
          />
          {errors.name?.type === 'required' && <Text category='label' style={registerStyle.text}>This is required</Text>}
          <Controller
            control={control}
            rules={{
              required: true,
              minLength: 11,
              pattern: /[0-9]/
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="CPF *"
                style={registerStyle.input}
                keyboardType='number-pad'
                testID='cpf'
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                underlineColorAndroid="transparent"
              />
            )}
            name='cpf'
            defaultValue=''
          />
          {errors.cpf?.type === 'pattern' && <Text category='label' style={registerStyle.text}>Invalid</Text>}
          {errors.cpf?.type === 'minLength' && <Text category='label' style={registerStyle.text}>Min 11</Text>}
          {errors.cpf?.type === 'required' && <Text category='label' style={registerStyle.text}>This is required</Text>}
          <Controller
            control={control}
            rules={{
              required: true,
              pattern: /[0-9]/
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Telefone 1 *"
                style={registerStyle.input}
                keyboardType='number-pad'
                testID='phone'
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                maxLength={12}
                underlineColorAndroid="transparent"
              />
            )}
            name='phone'
            defaultValue=''
          />
          {errors.phone?.type === 'pattern' && <Text category='label' style={registerStyle.text}>Invalid</Text>}
          {errors.phone?.type === 'required' && <Text category='label' style={registerStyle.text}>This is required</Text>}
          <Controller
            control={control}
            rules={{
              required: false,
              pattern: /[0-9]/
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Telefone 2"
                style={registerStyle.input}
                keyboardType='number-pad'
                testID='phone2'
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                maxLength={12}
                underlineColorAndroid="transparent"
              />
            )}
            name='phone2'
            defaultValue=''
          />
          {errors.phone2?.type === 'pattern' && <Text category='label' style={registerStyle.text}>Invalid</Text>}
          <Controller
            control={control}
            rules={{
              required: true,
              minLength: 15,
              pattern: /[0-9]/
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Cartão Nacional de Saúde (CNS) *"
                style={registerStyle.input}
                keyboardType='number-pad'
                testID='cns'
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                maxLength={16}
                underlineColorAndroid="transparent"
              />
            )}
            name='cns'
            defaultValue=''
          />
          {errors.cns?.type === 'minLength' && <Text category='label' style={registerStyle.text}>Min 15</Text>}
          {errors.cns?.type === 'pattern' && <Text category='label' style={registerStyle.text}>Invalid</Text>}
          {errors.cns?.type === 'required' && <Text category='label' style={registerStyle.text}>This is required</Text>}
          <Button
            onPress={handleSubmit(submit)}
            style={registerStyle.button}
            status="primary"
          >
            CONTINUAR
          </Button>
        </View>
      </SafeAreaView>
    </>
  )
}

export default SignUpPart1Screen
