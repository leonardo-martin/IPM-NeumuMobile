import React, { FC, ReactElement, useEffect, useState } from 'react'
import { Linking, Platform, ScrollView, TouchableOpacity, View } from 'react-native'
import { Input, Text, Icon, useStyleSheet, Datepicker, IconProps, PopoverPlacements, RadioGroup, Radio } from '@ui-kitten/components'
import { Controller, useForm } from 'react-hook-form'
import { UserData } from '@models/User'
import { useNavigation } from '@react-navigation/core'
import { SafeAreaLayout } from '@components/safeAreaLayout'
import { formatCpf, isEmailValid } from '@utils/mask'
import { validate } from 'gerador-validador-cpf'
import { registerStyle } from '../style'
import { localeDateService } from '@components/calendar/config'
import { getGender } from '@utils/common'
import { validateCNS } from '@utils/validators'
import { useIsFocused } from '@react-navigation/native'

const SignUpPart1Screen: FC = (): ReactElement => {

  const [selectedIndex, setSelectedIndex] = useState(-1)
  const styles = useStyleSheet(registerStyle)
  const [secureTextEntry, setSecureTextEntry] = useState(true)
  const { control, handleSubmit, setFocus, setValue, clearErrors, formState: { errors } } = useForm<UserData>()
  const navigation = useNavigation<any>()
  const submit = (data: UserData) => {
    navigation.navigate('SignUpPart2', {
      data: {
        ...data,
        dateOfBirth: data.dateOfBirth.toISOString(),
        cns: data.cns === '' ? null : data.cns
      }
    })
  }

  const isFocused = useIsFocused()

  useEffect(() => {
    setSecureTextEntry(true)
  }, [isFocused])

  const handleGender = (index: number) => {
    setSelectedIndex(index)
    setValue('genre', getGender(index) as string)
    if (index !== -1) clearErrors('genre')
  }

  const CalendarIcon = (props: IconProps) => (
    <Icon {...props} name='calendar-outline' pack='eva' />
  )

  const toggleSecureEntry = () => {
    setSecureTextEntry(!secureTextEntry)
  }

  const renderIconRightPassword = (props: IconProps) => (
    <Icon {...props} name={secureTextEntry ? 'eye-off' : 'eye'} onPress={toggleSecureEntry} pack='eva' />
  )

  const renderLabelCNS = () => (
    <React.Fragment>
      <View style={styles.labelCNSView}>
        <Text category="label" style={styles.labelCNSText}>
          Cartão Nacional de Saúde (CNS){" "}
        </Text>
        <TouchableOpacity
          onPress={() => Linking.openURL('https://www.gov.br/saude/pt-br/acesso-a-informacao/acoes-e-programas/cartao-nacional-de-saude')}
          style={styles.toggleButton}
        >
          <Icon style={styles.iconCns} name="information-circle-outline" pack='ionicons' size={20} />
        </TouchableOpacity>
      </View>
    </React.Fragment>
  )

  return (
    <>
      <SafeAreaLayout style={styles.safeArea} level='1'>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
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
              }}
              render={({ field: { onChange, onBlur, value, name, ref } }) => (
                <Input
                  size='small'
                  label="Nome da Mãe *"
                  style={styles.input}
                  keyboardType='default'
                  testID={name}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  underlineColorAndroid="transparent"
                  ref={ref}
                  maxLength={60}
                  returnKeyType="next"
                  onSubmitEditing={() => setFocus('name')}
                  autoCapitalize="words"
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
              }}
              render={({ field: { onChange, onBlur, value, name, ref } }) => (
                <Input
                  size='small'
                  label="Nome Completo *"
                  style={styles.input}
                  keyboardType='default'
                  testID={name}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  ref={ref}
                  maxLength={60}
                  returnKeyType="next"
                  onSubmitEditing={() => setFocus('cpf')}
                  underlineColorAndroid="transparent"
                  autoCapitalize="words"
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
                validate: (e) => validate(e)
              }}
              render={({ field: { onChange, onBlur, value, name, ref } }) => (
                <Input
                  size='small'
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
                  ref={ref}
                  returnKeyType="next"
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
                }
              }}
              render={({ field: { onChange, onBlur, value, name, ref } }) => (
                <Datepicker
                  size='small'
                  label='Data de Nascimento *'
                  placeholder='Data de Nascimento'
                  date={value}
                  onSelect={onChange}
                  accessoryRight={CalendarIcon}
                  onBlur={onBlur}
                  ref={ref}
                  testID={name}
                  dateService={localeDateService}
                  max={new Date()}
                  placement={PopoverPlacements.BOTTOM}
                  min={new Date(1900, 0, 0)}
                />
              )}
              name='dateOfBirth'
            />
            {errors.dateOfBirth?.type === 'required' && <Text category='s2' style={[styles.text, { paddingBottom: 10 }]}>{errors.dateOfBirth?.message}</Text>}
            <Text style={styles.labelBasic}>Gênero *</Text>
            <Controller
              control={control}
              rules={{
                required: {
                  value: true,
                  message: 'Campo obrigatório'
                }
              }}
              render={({ field: { name, ref } }) => (
                <RadioGroup
                  testID={name}
                  ref={ref}
                  selectedIndex={selectedIndex}
                  onChange={handleGender}>
                  <Radio
                    status='primary'>
                    {evaProps => <Text {...evaProps} category='label' style={styles.radioText}>Masculino</Text>}
                  </Radio>
                  <Radio
                    status='primary'>
                    {evaProps => <Text {...evaProps} category='label' style={styles.radioText}>Feminino</Text>}
                  </Radio>
                  <Radio
                    status='primary'>
                    {evaProps => <Text {...evaProps} category='label' style={styles.radioText}>Prefiro não informar</Text>}
                  </Radio>
                </RadioGroup>
              )}
              name='genre'
            />
            {errors.genre?.type === 'required' && <Text category='s2' style={[styles.text, { paddingBottom: 10 }]}>{errors.genre?.message}</Text>}
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
                validate: (e) => isEmailValid(e)
              }}
              render={({ field: { onChange, onBlur, value, name, ref } }) => (
                <Input
                  size='small'
                  label='E-mail *'
                  style={styles.input}
                  keyboardType='email-address'
                  testID={name}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value.replace(/[^0-9A-Za-z]*/, "")}
                  underlineColorAndroid="transparent"
                  autoCapitalize='none'
                  maxLength={60}
                  ref={ref}
                  returnKeyType="next"
                  onSubmitEditing={() => setFocus('username')}
                  placeholder={'example@example.com'}
                />
              )}
              name='email'
              defaultValue=''
            />
            {errors.email?.type === 'minLength' && <Text category='s2' style={[styles.text, { paddingBottom: 10 }]}>{errors.email?.message}</Text>}
            {errors.email?.type === 'required' && <Text category='s2' style={[styles.text, { paddingBottom: 10 }]}>{errors.email?.message}</Text>}
            {errors.email?.type === 'validate' && <Text category='s2' style={[styles.text, { paddingBottom: 10 }]}>E-mail inválido</Text>}
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
              }}
              render={({ field: { onChange, onBlur, value, ref, name } }) => (
                <Input
                  size='small'
                  label="Usuário *"
                  style={styles.input}
                  keyboardType='default'
                  testID={name}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  maxLength={40}
                  ref={ref}
                  returnKeyType="next"
                  onSubmitEditing={() => setFocus('password')}
                  underlineColorAndroid="transparent"
                  autoCapitalize="none"
                />
              )}
              name='username'
              defaultValue=''
            />
            {errors.username && <Text category='s2' style={styles.text}>{errors.username?.message}</Text>}
            <Controller
              control={control}
              rules={{
                required: {
                  value: true,
                  message: 'Campo obrigatório'
                },
                minLength: {
                  value: 8,
                  message: `Mín. 8 caracteres`
                },
              }}
              render={({ field: { onChange, onBlur, value, name, ref } }) => (
                <Input
                  size='small'
                  label="Senha *"
                  style={styles.input}
                  keyboardType='default'
                  testID={name}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  maxLength={40}
                  accessoryRight={renderIconRightPassword}
                  secureTextEntry={secureTextEntry}
                  returnKeyType="next"
                  ref={ref}
                  onSubmitEditing={() => setFocus('cns')}
                  underlineColorAndroid="transparent"
                  autoCapitalize="none"
                />
              )}
              name='password'
              defaultValue=''
            />
            {errors.password && <Text category='s2' style={styles.text}>{errors.password?.message}</Text>}
            <Controller
              control={control}
              rules={{
                required: false,
                minLength: {
                  value: 15,
                  message: `Mín. 15 caracteres`
                },
                validate: (e) => e !== "" ? validateCNS(e) : true
              }}
              render={({ field: { onChange, onBlur, value, name, ref } }) => (
                <Input
                  size='small'
                  label={renderLabelCNS}
                  style={styles.input}
                  keyboardType='number-pad'
                  testID={name}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  maxLength={16}
                  underlineColorAndroid="transparent"
                  ref={ref}
                  returnKeyType="send"
                  onSubmitEditing={handleSubmit(submit)}
                />
              )}
              name='cns'
              defaultValue=''
            />
            {errors.cns?.type === 'minLength' && <Text category='s2' style={[styles.text, { paddingBottom: 10 }]}>{errors.cns?.message}</Text>}
            {errors.cns?.type === 'validate' && <Text category='s2' style={[styles.text, { paddingBottom: 10 }]}>CNS inválido</Text>}
            <View style={styles.viewBtn}>
              <TouchableOpacity
                onPress={handleSubmit(submit)}
                style={styles.button}
              >
                <Icon style={styles.icon} name={Platform.OS === 'ios' ? 'chevron-forward-outline' : Platform.OS === 'android' ? 'arrow-forward-outline' : 'arrow-forward-outline'} size={20} pack='ionicons' />
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </SafeAreaLayout>

    </>
  )
}

export default SignUpPart1Screen
