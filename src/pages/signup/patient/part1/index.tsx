import CustomErrorMessage from '@components/error'
import CountryPicker from '@components/picker/CountryPicker'
import { COUNTRY } from '@constants/common'
import { CONECTESUS_URI } from '@constants/uri'
import { useDatepickerService } from '@hooks/useDatepickerService'
import { useModal } from '@hooks/useModal'
import { PatientSignUpProps } from '@models/SignUpProps'
import { ETypeOfDocument } from '@models/User'
import { registerStyle } from '@pages/signup/style'
import Clipboard from '@react-native-clipboard/clipboard'
import { useFocusEffect, useIsFocused } from '@react-navigation/native'
import { Datepicker, Icon, IconProps, IndexPath, Input, PopoverPlacements, Radio, RadioGroup, Select, SelectItem, Text, useStyleSheet } from '@ui-kitten/components'
import { getGender, openMailTo } from '@utils/common'
import { typeOfPersonalDocuments } from '@utils/constants'
import { cleanNumberMask, formatCpf, formatRNM, isEmailValid } from '@utils/mask'
import { validateCNS, validatePasswd, validateUniqueData } from '@utils/validators'
import { validate } from 'gerador-validador-cpf'
import React, { FC, ReactElement, useCallback, useEffect, useRef, useState } from 'react'
import { Controller } from 'react-hook-form'
import { Keyboard, Linking, Pressable, TouchableOpacity, View } from 'react-native'
import { Modalize } from 'react-native-modalize'
import { Portal } from 'react-native-portalize'

const PatientSignUpPart1Screen: FC<PatientSignUpProps> = ({ form, onSubmit }): ReactElement => {

  const { localeDateService } = useDatepickerService()
  const isFocused = useIsFocused()
  const { ref: modalizeRef } = useModal<Modalize>()
  const [countryCode, setCountryCode] = useState<string>(COUNTRY.DIAL_CODE)

  const [selectedIndex, setSelectedIndex] = useState(-1)
  const styles = useStyleSheet(registerStyle)
  const [secureTextEntry, setSecureTextEntry] = useState(true)
  const [secureTextEntryRepeat, setSecureTextEntryRepeat] = useState(true)
  const [selectedTypeOfDocument, setSelectedTypeOfDocument] = useState<IndexPath | IndexPath[]>()

  const emailConfirm = form.watch("email")
  const password = useRef<string | undefined>()
  password.current = form.watch("password", "")

  const typeOfDocument = form.watch("typeOfDocument")

  useFocusEffect(
    useCallback(() => {
      const sex = form.getValues('sex')
      if (sex) setSelectedIndex(sex === 'male' ? 0 : sex === 'female' ? 1 : 2)
      const doc = form.getValues('typeOfDocument')
      if (doc)
        setSelectedTypeOfDocument(new IndexPath(typeOfPersonalDocuments.indexOf(typeOfPersonalDocuments.find(e => e.label === doc) || {} as { value: number; label: string; })))
    }, [])
  )

  useEffect(() => {
    setSecureTextEntry(true)
  }, [isFocused])

  useEffect(() => {
    if (selectedTypeOfDocument && typeOfPersonalDocuments) {
      const type = typeOfPersonalDocuments[Number(selectedTypeOfDocument) - 1]
      if (type && type.label !== form.getValues('typeOfDocument')) {
        form.setValue('cpf', undefined)
        form.setValue('rne', undefined)
        form.setValue('typeOfDocument', type.label)
      }
    }
  }, [selectedTypeOfDocument, typeOfPersonalDocuments])

  const handleGender = (index: number) => {
    setSelectedIndex(index)
    form.setValue('sex', getGender(index) as string)
    if (index !== -1) form.clearErrors('sex')
  }

  const CalendarIcon = (props: IconProps) => (
    <Icon {...props} name='calendar-outline' pack='eva' />
  )

  const toggleSecureEntry = () => setSecureTextEntry(!secureTextEntry)
  const toggleSecureEntryRepeat = () => setSecureTextEntryRepeat(!secureTextEntryRepeat)

  const renderIconRightPassword = (props: IconProps) => (
    <Icon {...props} name={secureTextEntry ? 'eye-off' : 'eye'} onPress={toggleSecureEntry} pack='eva' />
  )

  const renderIconRightRepeat = (props: IconProps) => (
    <Icon {...props} name={secureTextEntryRepeat ? 'eye-off' : 'eye'} onPress={toggleSecureEntryRepeat} pack='eva' />
  )

  const openLink = (url: string) => Linking.openURL(url)

  const renderLabelCNS = () => (
    <React.Fragment>
      <View style={styles.labelCNSView}>
        <Text category="label" style={styles.labelCNSText}>
          Cartão Nacional de Saúde
        </Text>
        <TouchableOpacity
          onPress={() => openLink(CONECTESUS_URI)}
          style={styles.toggleButton}
        >
          <Icon style={styles.iconCns} name="information-circle-outline" pack='ionicons' size={20} />
        </TouchableOpacity>
      </View>
    </React.Fragment>
  )

  const openCountryPicker = () => modalizeRef.current?.open()

  const CountrySelectBox = () => (
    <Pressable onPress={openCountryPicker} style={{
      flexDirection: 'row',
      alignItems: 'center',
    }}>
      <Text category='c1'>{countryCode}</Text>
      <Icon name='chevron-down-outline' size={10} />
    </Pressable>
  )

  useEffect(() => {
    form.setValue('countryCode', countryCode)
  }, [countryCode])

  return (
    <>
      <Portal>
        <CountryPicker ref={modalizeRef} setValue={setCountryCode} />
      </Portal>
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
              onSubmitEditing={() => form.setFocus('mothersName')}
              underlineColorAndroid="transparent"
              autoCapitalize="words"
              textContentType="name"
            />
          )}
          name='name'
          defaultValue=''
        />
        <CustomErrorMessage name='name' errors={form.formState.errors} />
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
              onSubmitEditing={() => form.setFocus('typeOfDocument')}
              autoCapitalize="words"
            />
          )}
          name='mothersName'
          defaultValue=''
        />
        <CustomErrorMessage name='mothersName' errors={form.formState.errors} />

        <Controller
          control={form.control}
          rules={{
            required: {
              value: true,
              message: 'Campo obrigatório'
            }
          }}
          render={({ field: { onBlur, value, name, ref } }) => (
            <Select
              size='small'
              label="Documento *"
              style={styles.input}
              placeholder='Selecione'
              testID={name}
              onBlur={onBlur}
              ref={ref}
              selectedIndex={selectedTypeOfDocument}
              onSelect={setSelectedTypeOfDocument}
              value={value}
            >
              {typeOfPersonalDocuments && typeOfPersonalDocuments.map((item: any, index: number) => (
                <SelectItem key={item.value} title={item.label} />
              ))}
            </Select>
          )}
          name='typeOfDocument'
          defaultValue=''
        />
        <CustomErrorMessage name='typeOfDocument' errors={form.formState.errors} />

        {typeOfDocument === ETypeOfDocument.CPF && (
          <>
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
                validate: {
                  valid: (e) => e ? validate(e) : undefined,
                  unique: (e) => e ? validateUniqueData({ cpf: cleanNumberMask(e) }) : undefined
                }
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
            {form.formState.errors.cpf?.type !== 'valid' && form.formState.errors.cpf?.type !== 'unique' && <CustomErrorMessage name='cpf' errors={form.formState.errors} />}
            {form.formState.errors.cpf?.type === 'valid' && <CustomErrorMessage name='cpf' errors={form.formState.errors} customMessage={'CPF inválido'} />}
            {form.formState.errors.cpf?.type === 'unique' && <CustomErrorMessage name='cpf' errors={form.formState.errors} customMessage={'CPF já cadastrado'} />}
          </>
        )}

        {typeOfDocument === ETypeOfDocument.RNM && (
          <>
            <Controller
              control={form.control}
              rules={{
                required: {
                  value: true,
                  message: 'Campo obrigatório'
                },
                validate: {
                  unique: (e) => e ? validateUniqueData({ rne: e }) : undefined
                }
              }}
              render={({ field: { onChange, onBlur, value, name, ref } }) => (
                <Input
                  size='small'
                  label="RNM *"
                  style={styles.input}
                  keyboardType='default'
                  testID={name}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={formatRNM(value)}
                  underlineColorAndroid="transparent"
                  autoCapitalize='characters'
                  ref={ref}
                  maxLength={40}
                  returnKeyType="next"
                  onSubmitEditing={() => form.setFocus('dateOfBirth')}
                />
              )}
              name='rne'
              defaultValue=''
            />
            {form.formState.errors.rne?.type !== 'unique' && <CustomErrorMessage name='rne' errors={form.formState.errors} />}
            {form.formState.errors.rne?.type === 'unique' && <CustomErrorMessage name='rne' errors={form.formState.errors} customMessage={'RNM já cadastrado'} />}
          </>
        )}

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
              date={value}
              onSelect={onChange}
              accessoryRight={CalendarIcon}
              onBlur={onBlur}
              ref={ref}
              testID={name}
              style={styles.input}
              dateService={localeDateService}
              max={localeDateService.addDay(localeDateService.today(), -1)}
              placement={PopoverPlacements.BOTTOM}
              min={new Date(1900, 0, 0)}
              backdropStyle={styles.backdropDatepicker}
              boundingMonth={false}
              onPress={() => Keyboard.dismiss()}
              caption='* Em caso de menor de idade, necessário um responsável'
            />
          )}
          name='dateOfBirth'
        />
        <CustomErrorMessage name='dateOfBirth' errors={form.formState.errors} />
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
          name='sex'
        />
        <CustomErrorMessage name='sex' errors={form.formState.errors} />
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
            validate: {
              valid: (e) => e ? isEmailValid(e) : undefined,
              unique: (e) => e ? validateUniqueData({ email: e }) : undefined
            }
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
              onSubmitEditing={() => form.setFocus('emailConfirmation')}
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
        {form.formState.errors.email?.type !== 'valid' && form.formState.errors.email?.type !== 'unique' && <CustomErrorMessage name='email' errors={form.formState.errors} />}
        {form.formState.errors.email?.type === 'valid' && <CustomErrorMessage name='email' errors={form.formState.errors} customMessage={'E-mail inválido'} />}
        {form.formState.errors.email?.type === 'unique' && <CustomErrorMessage name='email' errors={form.formState.errors} customMessage={'E-mail já cadastrado'} />}
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
            validate: {
              valid: (e) => e ? isEmailValid(e) : undefined,
              equal: (e) => e === emailConfirm
            }
          }}
          render={({ field: { onChange, onBlur, value, name, ref } }) => (
            <Input
              onFocus={() => (__DEV__) ? undefined : Clipboard.setString('')}
              onSelectionChange={() => (__DEV__) ? undefined : Clipboard.setString('')}
              size='small'
              label='Confirmar E-mail *'
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
            />
          )}
          name='emailConfirmation'
          defaultValue=''
        />
        {form.formState.errors.emailConfirmation?.type !== 'valid' && form.formState.errors.emailConfirmation?.type !== 'equal' && <CustomErrorMessage name='emailConfirmation' errors={form.formState.errors} />}
        {form.formState.errors.emailConfirmation?.type === 'valid' && <CustomErrorMessage name='emailConfirmation' errors={form.formState.errors} customMessage={'E-mail inválido'} />}
        {form.formState.errors.emailConfirmation?.type === 'equal' && <CustomErrorMessage name='emailConfirmation' errors={form.formState.errors} customMessage={'E-mails não conferem'} />}
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
              onSubmitEditing={() => form.setFocus('confirmPassword')}
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
        {form.formState.errors.password?.type !== 'validate' && <CustomErrorMessage name='password' errors={form.formState.errors} />}
        {form.formState.errors.password?.type === 'validate' && <CustomErrorMessage name='password' errors={form.formState.errors} customMessage='Senha inválida' />}
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
              onFocus={() => (__DEV__) ? undefined : Clipboard.setString('')}
              onSelectionChange={() => (__DEV__) ? undefined : Clipboard.setString('')}
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
              onSubmitEditing={() => form.setFocus('phone')}
              underlineColorAndroid="transparent"
              autoCapitalize="none"
              textContentType="newPassword"
            />
          )}
          name='confirmPassword'
        />
        {(form.formState.errors.confirmPassword?.type !== 'valid' && form.formState.errors.confirmPassword?.type !== 'equal') && <CustomErrorMessage name='confirmPassword' errors={form.formState.errors} />}
        {(form.formState.errors.confirmPassword?.type === 'valid') && <CustomErrorMessage name='confirmPassword' errors={form.formState.errors} customMessage='Senha inválida' />}
        {(form.formState.errors.confirmPassword?.type === 'equal') && <CustomErrorMessage name='confirmPassword' errors={form.formState.errors} customMessage='Senhas não conferem' />}
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
          }}
          render={({ field: { onChange, onBlur, value, name, ref } }) => (
            <Input
              size='small'
              label="Telefone 1 *"
              style={styles.input}
              keyboardType='number-pad'
              testID={name}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              maxLength={15}
              ref={ref}
              returnKeyType="done"
              onSubmitEditing={() => form.setFocus('phone2')}
              underlineColorAndroid="transparent"
              textContentType="telephoneNumber"
              accessoryLeft={CountrySelectBox}
            />
          )}
          name='phone'
          defaultValue=''
        />
        <CustomErrorMessage name='phone' errors={form.formState.errors} />
        <Controller
          control={form.control}
          rules={{
            required: false,
            minLength: {
              value: 8,
              message: `Mín. 8 caracteres`
            },
          }}
          render={({ field: { onChange, onBlur, value, name, ref } }) => (
            <Input
              size='small'
              label="Telefone 2"
              style={[styles.input, { paddingBottom: 10 }]}
              keyboardType='number-pad'
              testID={name}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              maxLength={15}
              ref={ref}
              returnKeyType="next"
              onSubmitEditing={() => form.setFocus('susNumber')}
              underlineColorAndroid="transparent"
              textContentType="telephoneNumber"
              accessoryLeft={CountrySelectBox}
            />
          )}
          name='phone2'
          defaultValue=''
        />
        <CustomErrorMessage name='phone2' errors={form.formState.errors} />
        <Controller
          control={form.control}
          rules={{
            minLength: {
              value: 14,
              message: `Mín. 14 caracteres`
            },
            validate: {
              valid: (e) => e !== null && e !== "" ? validateCNS(e) : true,
              unique: (e) => e !== null && e !== "" ? validateUniqueData({ susNumber: e }) : true
            }
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
              maxLength={15}
              underlineColorAndroid="transparent"
              ref={ref}
              returnKeyType="send"
              onSubmitEditing={form.handleSubmit(onSubmit)}
              caption='Opcional'
            />
          )}
          name='susNumber'
          defaultValue=''
        />
        {form.formState.errors.susNumber?.type !== 'valid' && form.formState.errors.susNumber?.type !== 'unique' && <CustomErrorMessage name='susNumber' errors={form.formState.errors} />}
        {form.formState.errors.susNumber?.type === 'valid' && <CustomErrorMessage name='susNumber' errors={form.formState.errors} customMessage={'Cartão SUS inválido'} />}
        {form.formState.errors.susNumber?.type === 'unique' && <CustomErrorMessage name='susNumber' errors={form.formState.errors} customMessage={'Cartão SUS já cadastrado'} />}
      </View>
    </>
  )
}

export default PatientSignUpPart1Screen
