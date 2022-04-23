import { useDatepickerService } from '@hooks/useDatepickerService'
import { DoctorSignUpProps } from '@models/SignUpProps'
import { registerStyle } from '@pages/signup/style'
import { useFocusEffect, useIsFocused } from '@react-navigation/native'
import { Datepicker, Icon, IconProps, IndexPath, Input, PopoverPlacements, Radio, RadioGroup, Select, SelectItem, Text, useStyleSheet } from '@ui-kitten/components'
import { getGender, openMailTo } from '@utils/common'
import { formatCpf, isEmailValid, onlyNumbers } from '@utils/mask'
import specialties from '@utils/specialties'
import { validatePasswd } from '@utils/validators'
import { validate } from 'gerador-validador-cpf'
import React, { FC, ReactElement, useCallback, useEffect, useState } from 'react'
import { Controller } from 'react-hook-form'
import { Keyboard, TouchableOpacity, View } from 'react-native'

const DoctorSignUpPart1Screen: FC<DoctorSignUpProps> = ({ form }): ReactElement => {

  const { localeDateService } = useDatepickerService()
  const dateForOver = localeDateService.addYear(localeDateService.today(), -18)
  const [selectedSpecialty, setSelectedSpecialty] = useState<IndexPath | IndexPath[]>()

  const isFocused = useIsFocused()

  const [selectedIndex, setSelectedIndex] = useState(-1)
  const styles = useStyleSheet(registerStyle)
  const [secureTextEntry, setSecureTextEntry] = useState(true)

  useFocusEffect(
    useCallback(() => {
      const genre = form.getValues('genre')
      if (genre) setSelectedIndex(genre === 'male' ? 0 : genre === 'female' ? 1 : 2)

      const specialty = form.getValues('specialty.description')
      if (specialty) setSelectedSpecialty(new IndexPath(specialties.indexOf(specialty)))
    }, [])
  )

  useEffect(() => {
    if (selectedSpecialty)
      form.setValue('specialty.description', specialties[Number(selectedSpecialty) - 1])
    else form.setValue('specialty.description', '')
  }, [selectedSpecialty])

  useEffect(() => {
    setSecureTextEntry(true)
  }, [isFocused])

  const handleGender = (index: number) => {
    setSelectedIndex(index)
    form.setValue('genre', getGender(index) as string)
    if (index !== -1) form.clearErrors('genre')
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

  return (
    <>
      <View style={styles.box}>
        <Controller
          control={form.control}
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
              onSubmitEditing={() => form.setFocus('cpf')}
              underlineColorAndroid="transparent"
              autoCapitalize="words"
              textContentType="name"
            />
          )}
          name='name'
          defaultValue=''
        />
        {form.formState.errors.name && <Text category='s2' style={[styles.text, { paddingBottom: 10 }]}>{form.formState.errors.name?.message}</Text>}
        <Controller
          control={form.control}
          rules={{
            required: {
              value: true,
              message: 'Campo obrigatório'
            },
            minLength: {
              value: 14,
              message: `Mín. 14 caracteres`
            },
            validate: (e) => e ? validate(e) : undefined
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
              onSubmitEditing={() => form.setFocus('dateOfBirth')}
            />
          )}
          name='cpf'
          defaultValue=''
        />
        {form.formState.errors.cpf?.type === 'minLength' && <Text category='s2' style={[styles.text, { paddingBottom: 10 }]}>{form.formState.errors.cpf?.message}</Text>}
        {form.formState.errors.cpf?.type === 'required' && <Text category='s2' style={[styles.text, { paddingBottom: 10 }]}>{form.formState.errors.cpf?.message}</Text>}
        {form.formState.errors.cpf?.type === 'validate' && <Text category='s2' style={[styles.text, { paddingBottom: 10 }]}>CPF inválido</Text>}
        <Controller
          control={form.control}
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
              date={value ? value : dateForOver}
              onSelect={onChange}
              accessoryRight={CalendarIcon}
              onBlur={onBlur}
              ref={ref}
              testID={name}
              style={styles.input}
              dateService={localeDateService}
              max={dateForOver}
              placement={PopoverPlacements.BOTTOM}
              min={new Date(1900, 0, 0)}
              backdropStyle={styles.backdropDatepicker}
              boundingMonth={false}
              onPress={() => Keyboard.dismiss()}
              caption='* Necessário ser maior de 18 anos'
            />
          )}
          name='dateOfBirth'
        />
        {form.formState.errors.dateOfBirth?.type === 'required' && <Text category='s2' style={[styles.text, { paddingBottom: 10 }]}>{form.formState.errors.dateOfBirth?.message}</Text>}
        <Text style={styles.labelBasic}>Gênero *</Text>
        <Controller
          control={form.control}
          rules={{
            required: {
              value: true,
              message: 'Selecione uma opção'
            }
          }}
          render={({ field: { name, ref } }) => (
            <RadioGroup
              style={{ paddingBottom: 10 }}
              testID={name}
              ref={ref}
              selectedIndex={selectedIndex}
              onChange={handleGender}>
              <Radio
                status='basic'>
                {evaProps => <Text {...evaProps}>Masculino</Text>}
              </Radio>
              <Radio
                status='basic'>
                {evaProps => <Text {...evaProps}>Feminino</Text>}
              </Radio>
              <Radio
                status='basic'>
                {evaProps => <Text {...evaProps}>Prefiro não informar</Text>}
              </Radio>
            </RadioGroup>
          )}
          name='genre'
        />
        {form.formState.errors.genre?.type === 'required' && <Text category='s2' style={[styles.text, { paddingBottom: 10 }]}>{form.formState.errors.genre?.message}</Text>}
        <Controller
          control={form.control}
          rules={{
            required: {
              value: true,
              message: 'Campo obrigatório'
            },
            minLength: {
              value: 5,
              message: `Mín. 5 caracteres`
            },
            validate: (e) => e ? isEmailValid(e) : undefined
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
              value={value ? value.replace(/[^0-9A-Za-z]*/, "").toLowerCase() : value}
              underlineColorAndroid="transparent"
              autoCapitalize='none'
              maxLength={60}
              ref={ref}
              returnKeyType="next"
              onSubmitEditing={() => form.setFocus('password')}
              textContentType="emailAddress"
              caption={(evaProps) => (
                <>
                  <View style={{ flexDirection: 'row' }}>
                    <Text {...evaProps}>* Em caso de não recebimento, entre em{" "}</Text>
                    <TouchableOpacity onPress={openMailTo}>
                      <Text {...evaProps} style={[evaProps?.style, styles.contactLink]}>contato</Text>
                    </TouchableOpacity>
                  </View>
                </>
              )}
            />
          )}
          name='email'
          defaultValue=''
        />
        {form.formState.errors.email?.type === 'minLength' && <Text category='s2' style={[styles.text, { paddingBottom: 10 }]}>{form.formState.errors.email?.message}</Text>}
        {form.formState.errors.email?.type === 'required' && <Text category='s2' style={[styles.text, { paddingBottom: 10 }]}>{form.formState.errors.email?.message}</Text>}
        {form.formState.errors.email?.type === 'validate' && <Text category='s2' style={[styles.text, { paddingBottom: 10 }]}>E-mail inválido</Text>}
        <Controller
          control={form.control}
          rules={{
            required: {
              value: true,
              message: 'Campo obrigatório'
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
              label="Senha *"
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
              onSubmitEditing={() => form.setFocus('crm')}
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
          defaultValue=''
        />
        {form.formState.errors.password?.type === 'minLength' && <Text category='s2' style={styles.text}>{form.formState.errors.password?.message}</Text>}
        {form.formState.errors.password?.type === 'required' && <Text category='s2' style={styles.text}>{form.formState.errors.password?.message}</Text>}
        {form.formState.errors.password?.type === 'validate' && <Text category='s2' style={styles.text}>Senha inválida</Text>}

        <Controller
          control={form.control}
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
              label="Conselho Regional de Medicina (CRM) *"
              style={styles.input}
              keyboardType='number-pad'
              placeholder=''
              testID={name}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value ? onlyNumbers(value) : value}
              ref={ref}
              maxLength={6}
              underlineColorAndroid="transparent"
              onSubmitEditing={() => form.setFocus('specialty.description')}
            />
          )}
          name='crm'
          defaultValue=''
        />
        {form.formState.errors.crm && <Text category='s2' style={styles.text}>{form.formState.errors.crm?.message}</Text>}
        <Controller
          control={form.control}
          rules={{
            required: {
              value: true,
              message: 'Campo obrigatório'
            }
          }}
          render={({ field: { onChange, onBlur, value, name, ref } }) => (
            <Select
              size='small'
              label="Especialidade *"
              style={styles.input}
              placeholder='Selecione'
              testID={name}
              onBlur={onBlur}
              ref={ref}
              selectedIndex={selectedSpecialty}
              onSelect={setSelectedSpecialty}
              value={value}
            >
              {specialties.map((item, index) => (
                <SelectItem key={item + index} title={item} />
              ))}
            </Select>
          )}
          name='specialty.description'
          defaultValue=''
        />
        {form.formState.errors.specialty?.description && <Text category='s2' style={styles.text}>{form.formState.errors.specialty.description?.message}</Text>}
      </View>
    </>
  )
}

export default DoctorSignUpPart1Screen