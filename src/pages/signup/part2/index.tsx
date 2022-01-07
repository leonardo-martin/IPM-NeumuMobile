import React, { FC, ReactElement, useEffect, useState } from 'react'
import { Linking, Platform, TouchableOpacity, View } from 'react-native'
import { Input, Text, IconProps, Icon, useStyleSheet, AutocompleteItem } from '@ui-kitten/components'
import { Controller, useForm } from 'react-hook-form'
import { useRoute } from '@react-navigation/core'
import { UserData } from '@models/User'
import { SafeAreaLayout } from '@components/safeAreaLayout'
import AutoCompleteComponent from '@components/autoComplete'
import { City, UF } from '@models/Places'
import { API_IBGE_GOV } from '@env'
import { formatPhone } from '@utils/mask'
import { validateCNS } from '@utils/validators'
import { registerStyle } from '../style'

const filter = (item: any, query: any) => item.sigla.toLowerCase().includes(query.toLowerCase())
const filterCity = (item: any, query: any) => item.nome.toLowerCase().includes(query.toLowerCase())

const SignUpPart2Screen: FC = (): ReactElement => {

  const styles = useStyleSheet(registerStyle)
  const [secureTextEntry, setSecureTextEntry] = useState(true)
  const route = useRoute()
  const { params }: any = route
  const { control, handleSubmit, setValue, getValues, formState: { errors } } = useForm<UserData>()

  const submit = (data: UserData) => {
    console.log(data)
  }

  useEffect(() => {
    setValue('mothersName', params?.data.mothersName)
    setValue('name', params?.data.name)
    setValue('cpf', params?.data.cpf)
    setValue('email', params?.data.email)
  }, [])

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

  const clearInputs = (field?: string) => {
    switch (field) {
      case 'city':
        setValue('city', '')
        setCitiesTemp(cities)
        break
      default:
        setValue('city', '')
        setValue('state', '')
        setStatesTemp(states)
        setCitiesTemp(cities)
        setIsDisabledCity(true)
        break
    }
  }

  /**
   * Cities
   */
  const [cities, setCities] = useState<City[]>([])
  const [citiesTemp, setCitiesTemp] = useState<City[]>([])
  const [isDisabledCity, setIsDisabledCity] = useState<boolean>(true)

  const findCities = async () => {
    const list: Array<City> = await fetch(`${API_IBGE_GOV}/localidades/estados/${getValues('state')}/municipios`, {
      method: 'GET'
    }).then(async (response) => await response.json())

    const listOrdened = list.sort((a, b) => a.nome.localeCompare(b.nome))
    setCities(listOrdened)
    setCitiesTemp(listOrdened)
  }

  useEffect(() => {
    if (!isDisabledCity)
      findCities()
  }, [isDisabledCity])

  const onChangeTextCity = (text: string) => {
    setValue('city', text)
    const list = citiesTemp.filter(item => filterCity(item, text))
    if (list.length > 0)
      setCitiesTemp(list)
    if (text === '')
      setCitiesTemp(cities)
  }

  const renderOptionCity = (item: any, index: any) => (
    <AutocompleteItem
      key={index}
      title={item?.nome}
    />
  )

  const onSelectCity = (index: number) => {
    const list = citiesTemp.filter(item => filterCity(item, citiesTemp[index]?.nome))
    if (list.length > 0) {
      setValue('city', citiesTemp[index]?.nome)
    }
  }

  /**
   * States
   */

  const [states, setStates] = useState<UF[]>([])
  const [statesTemp, setStatesTemp] = useState<UF[]>([])

  const findPlaces = async () => {
    const list: Array<UF> = await fetch(`${API_IBGE_GOV}/localidades/estados`, {
      method: 'GET'
    }).then(async (response) => await response.json())

    const listOrdened = list.sort((a, b) => a.sigla.localeCompare(b.sigla))
    setStates(listOrdened)
    setStatesTemp(listOrdened)
  }

  useEffect(() => {
    findPlaces()
  }, [])


  const onChangeTextState = (text: string) => {
    setValue('state', text)
    const list = statesTemp.filter(item => filter(item, text))
    if (list.length > 0)
      setStatesTemp(list)
    if (text === '')
      setStatesTemp(states)

  }

  const onSelectState = (index: number) => {
    const list = statesTemp.filter(item => filter(item, statesTemp[index]?.sigla))
    if (list.length > 0) {
      setValue('state', statesTemp[index]?.sigla)
      setIsDisabledCity(false)
    }
  }

  const renderOptionState = (item: any, index: any) => (
    <AutocompleteItem
      key={index}
      title={`${item?.sigla} - ${item?.nome}`}
    />
  )

  const renderRightIcon = (props: IconProps, value: string, op?: string) => {
    if (op === 'city' && value !== '')
      return (
        <Icon {...props} name='close-outline' pack='ionicons' onPress={() => clearInputs(op)} />
      )
    else if (!op && value !== '')
      return (
        <Icon {...props} name='close-outline' pack='ionicons' onPress={clearInputs} />
      )
    else return <></>
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
              }}
              render={({ field: { onBlur, name, value } }) => (
                <AutoCompleteComponent
                  testID={name}
                  style={styles.autoComplete}
                  data={statesTemp}
                  label="Estado *"
                  placeholder=''
                  onSelect={onSelectState}
                  onBlur={onBlur}
                  onChangeText={onChangeTextState}
                  renderOption={renderOptionState}
                  accessoryRight={(props) => renderRightIcon(props, value)}
                  value={value}
                  autoCapitalize='characters'
                  maxLength={2}
                />
              )}
              name='state'
              defaultValue=''
            />
            {errors.state && <Text category='s1' style={styles.text}>{errors.state?.message}</Text>}
            <Controller
              control={control}
              rules={{
                required: {
                  value: true,
                  message: 'Campo obrigatório'
                },
              }}
              render={({ field: { onBlur, name, value } }) => (
                <AutoCompleteComponent
                  testID={name}
                  style={styles.autoComplete}
                  data={citiesTemp}
                  label="Cidade"
                  placeholder=''
                  onSelect={onSelectCity}
                  onBlur={onBlur}
                  onChangeText={onChangeTextCity}
                  renderOption={renderOptionCity}
                  accessoryRight={(props) => renderRightIcon(props, value, 'city')}
                  value={value}
                  disabled={isDisabledCity}
                  autoCapitalize='words'
                />
              )}
              name='city'
              defaultValue=''
            />
            {errors.city && <Text category='s1' style={styles.text}>{errors.city?.message}</Text>}
            <Controller
              control={control}
              rules={{
                required: {
                  value: true,
                  message: 'Campo obrigatório'
                },
                minLength: {
                  value: 13,
                  message: `Mín. 13 caracteres`
                },
                maxLength: {
                  value: 15,
                  message: `Max. 15 caracteres`
                },
              }}
              render={({ field: { onChange, onBlur, value, name } }) => (
                <Input
                  label="Telefone 1 *"
                  style={styles.input}
                  keyboardType='number-pad'
                  testID={name}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={formatPhone(value)}
                  maxLength={15}
                  underlineColorAndroid="transparent"
                />
              )}
              name='phone'
              defaultValue=''
            />
            {errors.phone && <Text category='s1' style={styles.text}>{errors.phone?.message}</Text>}
            <Controller
              control={control}
              rules={{
                required: false,
                minLength: {
                  value: 13,
                  message: `Mín. 13 caracteres`
                },
                maxLength: {
                  value: 15,
                  message: `Max. 15 caracteres`
                },
              }}
              render={({ field: { onChange, onBlur, value, name } }) => (
                <Input
                  label="Telefone 2"
                  style={[styles.input, { paddingBottom: 10 }]}
                  keyboardType='number-pad'
                  testID={name}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={formatPhone(value)}
                  maxLength={15}
                  underlineColorAndroid="transparent"
                />
              )}
              name='phone2'
              defaultValue=''
            />
            {errors.phone2 && <Text category='s1' style={styles.text}>{errors.phone2?.message}</Text>}
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
                  value: 30,
                  message: `Max. 30 caracteres`
                },
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="Usuário *"
                  style={styles.input}
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
            {errors.username && <Text category='s1' style={styles.text}>{errors.username?.message}</Text>}
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
                maxLength: {
                  value: 16,
                  message: `Max. 16 caracteres`
                },
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="Senha *"
                  style={styles.input}
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
            {errors.password && <Text category='s1' style={styles.text}>{errors.password?.message}</Text>}
            <Controller
              control={control}
              rules={{
                required: false,
                minLength: {
                  value: 15,
                  message: `Mín. 15 caracteres`
                },
                maxLength: {
                  value: 16,
                  message: `Max. 16 caracteres`
                },
                validate: (e) => e !== "" ? validateCNS(e) : true
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label={renderLabelCNS}
                  style={styles.input}
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
            {errors.cns?.type === 'minLength' && <Text category='s2' style={[styles.text, { paddingBottom: 10 }]}>{errors.cns?.message}</Text>}
            {errors.cns?.type === 'validate' && <Text category='s2' style={[styles.text, { paddingBottom: 10 }]}>CNS inválido</Text>}
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

export default SignUpPart2Screen