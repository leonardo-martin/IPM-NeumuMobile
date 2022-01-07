import React, { FC, ReactElement } from 'react'
import { Platform, TouchableOpacity, View } from 'react-native'
import { Input, Text, Icon, useStyleSheet } from '@ui-kitten/components'
import { Controller, useForm } from 'react-hook-form'
import { UserData } from '@models/User'
import { useNavigation } from '@react-navigation/core'
import { SafeAreaLayout } from '@components/safeAreaLayout'
import { formatCpf, isEmailValid } from '@utils/mask'
import { validate } from 'gerador-validador-cpf'
import { registerStyle } from '../style'

const SignUpPart1Screen: FC = (): ReactElement => {

  const styles = useStyleSheet(registerStyle)
  const { control, handleSubmit, formState: { errors } } = useForm<UserData>()
  const navigation = useNavigation<any>()
  const submit = (data: UserData) => {
    navigation.navigate('SignUpPart2', { data: data })
  }

  return (
    <>
      <SafeAreaLayout style={styles.safeArea} level='1'>
        <SafeAreaLayout style={styles.content} level='1'>
          <View style={styles.box}>
            <Controller
              control={control}
              rules={{
                required: {
                  value: true,
                  message: 'Campo obrigatório'
                },
                minLength: {
                  value: 5,
                  message: `Mín. 5 caracteres`
                },
                maxLength: {
                  value: 60,
                  message: `Max. 60 caracteres`
                },
              }}
              render={({ field: { onChange, onBlur, value, name, ref } }) => (
                <Input
                  label="Nome da Mãe *"
                  style={styles.input}
                  keyboardType='default'
                  testID={name}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  underlineColorAndroid="transparent"
                  ref={ref}
                />
              )}
              name='mothersName'
              defaultValue=''
            />
            {errors.mothersName && <Text category='s2' style={[styles.text, { paddingBottom: 10 }]}>{errors.mothersName?.message}</Text>}
            <Controller
              control={control}
              rules={{
                required: {
                  value: true,
                  message: 'Campo obrigatório'
                },
                minLength: {
                  value: 5,
                  message: `Mín. 5 caracteres`
                },
                maxLength: {
                  value: 60,
                  message: `Max. 60 caracteres`
                },
              }}
              render={({ field: { onChange, onBlur, value, name } }) => (
                <Input
                  label="Nome Completo *"
                  style={styles.input}
                  keyboardType='default'
                  testID={name}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  underlineColorAndroid="transparent"
                />
              )}
              name='name'
              defaultValue=''
            />
            {errors.name && <Text category='s2' style={[styles.text, { paddingBottom: 10 }]}>{errors.name?.message}</Text>}
            <Controller
              control={control}
              rules={{
                required: {
                  value: true,
                  message: 'Campo obrigatório'
                },
                minLength: {
                  value: 14,
                  message: `Mín. 14 caracteres`
                },
                maxLength: {
                  value: 14,
                  message: `Max. 14 caracteres`
                },
                validate: (e) => validate(e)
              }}
              render={({ field: { onChange, onBlur, value, name } }) => (
                <Input
                  label="CPF *"
                  style={styles.input}
                  keyboardType='number-pad'
                  testID={name}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={formatCpf(value)}
                  underlineColorAndroid="transparent"
                  autoCapitalize='none'
                  maxLength={14}
                  placeholder={'999.999.999-99'}
                />
              )}
              name='cpf'
              defaultValue=''
            />
            {errors.cpf?.type === 'minLength' && <Text category='s2' style={[styles.text, { paddingBottom: 10 }]}>{errors.cpf?.message}</Text>}
            {errors.cpf?.type === 'required' && <Text category='s2' style={[styles.text, { paddingBottom: 10 }]}>{errors.cpf?.message}</Text>}
            {errors.cpf?.type === 'validate' && <Text category='s2' style={[styles.text, { paddingBottom: 10 }]}>CPF inválido</Text>}
            <Controller
              control={control}
              rules={{
                required: {
                  value: true,
                  message: 'Campo obrigatório'
                },
                minLength: {
                  value: 5,
                  message: `Mín. 5 caracteres`
                },
                maxLength: {
                  value: 60,
                  message: `Max. 60 caracteres`
                },
                validate: (e) => isEmailValid(e)
              }}
              render={({ field: { onChange, onBlur, value, name } }) => (
                <Input
                  label="E-mail *"
                  style={styles.input}
                  keyboardType='email-address'
                  testID={name}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value.replace(/[^0-9A-Za-z]*/, "")}
                  underlineColorAndroid="transparent"
                  autoCapitalize='none'
                  maxLength={60}
                  placeholder={'example@example.com'}
                />
              )}
              name='email'
              defaultValue=''
            />
            {errors.email?.type === 'minLength' && <Text category='s2' style={[styles.text, { paddingBottom: 10 }]}>{errors.email?.message}</Text>}
            {errors.email?.type === 'required' && <Text category='s2' style={[styles.text, { paddingBottom: 10 }]}>{errors.email?.message}</Text>}
            {errors.email?.type === 'validate' && <Text category='s2' style={[styles.text, { paddingBottom: 10 }]}>E-mail inválido</Text>}
          </View>
        </SafeAreaLayout>
        <SafeAreaLayout insets='bottom' level='1'>
          <View style={styles.viewBtn}>
            <TouchableOpacity
              onPress={handleSubmit(submit)}
              style={styles.button}
            >
              <Icon style={styles.icon} name={Platform.OS === 'ios' ? 'chevron-forward-outline' : Platform.OS === 'android' ? 'arrow-forward-outline' : 'arrow-forward-outline'} size={20} pack='ionicons' />
            </TouchableOpacity>
          </View>
        </SafeAreaLayout>
      </SafeAreaLayout>

    </>
  )
}

export default SignUpPart1Screen
