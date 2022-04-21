import RNWebView from '@components/webView'
import { CONECTESUS_URI } from '@constants/uri'
import { useDatepickerService } from '@hooks/useDatepickerService'
import { useModal } from '@hooks/useModal'
import { PatientSignUpProps } from '@models/SignUpProps'
import { registerStyle } from '@pages/signup/style'
import { useFocusEffect, useIsFocused } from '@react-navigation/native'
import { Datepicker, Icon, IconProps, Input, PopoverPlacements, Radio, RadioGroup, Text, useStyleSheet, useTheme } from '@ui-kitten/components'
import { getGender, openMailTo } from '@utils/common'
import { formatCpf, isEmailValid } from '@utils/mask'
import { validateCNS, validatePasswd } from '@utils/validators'
import { validate } from 'gerador-validador-cpf'
import React, { FC, ReactElement, useCallback, useEffect, useRef, useState } from 'react'
import { Controller } from 'react-hook-form'
import { Dimensions, Keyboard, TouchableOpacity, View } from 'react-native'
import { Modalize } from 'react-native-modalize'
import { Portal } from 'react-native-portalize'
import WebView from 'react-native-webview'


const { height: initialHeight } = Dimensions.get('window')

const PatientSignUpPart1Screen: FC<PatientSignUpProps> = ({ form, onSubmit }): ReactElement => {

  const { localeDateService } = useDatepickerService()
  const { ref } = useModal<Modalize>()
  const refWebView = useRef<WebView>(null)
  const [height, setHeight] = useState(initialHeight)
  const isFocused = useIsFocused()

  const theme = useTheme()
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const styles = useStyleSheet(registerStyle)
  const [secureTextEntry, setSecureTextEntry] = useState(true)

  useFocusEffect(
    useCallback(() => {
      const genre = form.getValues('genre')
      if (genre) setSelectedIndex(genre === 'male' ? 0 : genre === 'female' ? 1 : 2)
    }, [])
  )

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

  const renderLabelCNS = () => (
    <React.Fragment>
      <View style={styles.labelCNSView}>
        <Text category="label" style={styles.labelCNSText}>
          Cartão Nacional de Saúde (CNS) * {" "}
        </Text>
        <TouchableOpacity
          onPress={() => ref.current?.open()}
          style={styles.toggleButton}
        >
          <Icon style={styles.iconCns} name="information-circle-outline" pack='ionicons' size={20} />
        </TouchableOpacity>
      </View>
    </React.Fragment>
  )

  const onLayout = ({ layout }: any) => {
    setHeight(layout.height)
  }

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
              onSubmitEditing={() => form.setFocus('mothersName')}
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
              onSubmitEditing={() => form.setFocus('cpf')}
              autoCapitalize="words"
            />
          )}
          name='mothersName'
          defaultValue=''
        />
        {form.formState.errors.mothersName && <Text category='s2' style={[styles.text, { paddingBottom: 10 }]}>{form.formState.errors.mothersName?.message}</Text>}
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
              onSubmitEditing={() => form.setFocus('cns')}
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
              onSubmitEditing={form.handleSubmit(onSubmit)}
            />
          )}
          name='cns'
          defaultValue=''
        />
        {form.formState.errors.cns?.type === 'required' && <Text category='s2' style={styles.text}>{form.formState.errors.cns?.message}</Text>}
        {form.formState.errors.cns?.type === 'minLength' && <Text category='s2' style={[styles.text, { paddingBottom: 10 }]}>{form.formState.errors.cns?.message}</Text>}
        {form.formState.errors.cns?.type === 'validate' && <Text category='s2' style={[styles.text, { paddingBottom: 10 }]}>CNS inválido</Text>}
      </View>
      <Portal>
        <Modalize
          ref={ref}
          onLayout={onLayout}
        >
          <RNWebView
            ref={refWebView}
            source={{ uri: CONECTESUS_URI }}
            style={{ height }}
          />
        </Modalize>
      </Portal>
    </>
  )
}

export default PatientSignUpPart1Screen
