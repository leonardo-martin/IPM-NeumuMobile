import React, { FC, ReactElement, useEffect, useState } from 'react'
import { Platform, ScrollView, TouchableOpacity, View } from 'react-native'
import { Input, Text, IconProps, Icon, useStyleSheet, AutocompleteItem, Spinner, useTheme } from '@ui-kitten/components'
import { Controller, useForm } from 'react-hook-form'
import { useRoute } from '@react-navigation/core'
import { UserData } from '@models/User'
import { SafeAreaLayout } from '@components/safeAreaLayout'
import AutoCompleteComponent from '@components/autoComplete'
import { City, Country, UF } from '@models/Places'
import { API_IBGE_GOV, API_POSTAL_CODE_SEARCH } from '@env'
import { formatPhone } from '@utils/mask'
import { registerStyle } from '../style'
import { useNavigation } from '@react-navigation/core'

const filter = (item: any, query: any) => item.sigla.toLowerCase().includes(query.toLowerCase())
const filterCity = (item: any, query: any) => item.nome.toLowerCase().includes(query.toLowerCase())
const filterCountry = (item: any, query: any) => item.nome.toLowerCase().includes(query.toLowerCase())

const SignUpPart2Screen: FC = (): ReactElement => {

  const theme = useTheme()
  const styles = useStyleSheet(registerStyle)
  const navigation = useNavigation<any>()
  const route = useRoute()
  const { params }: any = route
  const { control, handleSubmit, setValue, getValues, clearErrors, setFocus, resetField, formState: { errors } } = useForm<UserData>({
    defaultValues: {
      ...params?.data
    }
  })

  const submit = (data: UserData) => {
    navigation.navigate('SignUpPart3', { data: data })
  }

  /**
   * Countries
   */

  const [countries, setCountries] = useState<Country[]>([])
  const [countriesTemp, setCountriesTemp] = useState<Country[]>([])
  const [country, setCountry] = useState<string>('')

  const findCountries = async () => {
    const list: Array<Country> = await fetch(`${API_IBGE_GOV}/localidades/paises?orderBy=nome`, {
      method: 'GET'
    }).then(async (response) => await response.json())

    const listOrdened = list.sort((a, b) => a.nome.localeCompare(b.nome))
    setCountries(listOrdened)
    setCountriesTemp(listOrdened)
  }

  useEffect(() => {
    findCountries()
  }, [])

  const onChangeTextCountry = (text: string) => {
    setValue('country', text)
    const list = countriesTemp.filter(item => filterCountry(item, text))
    if (list.length > 0)
      setCountriesTemp(list)
    if (text === '')
      setCountriesTemp(countries)
  }

  const onSelectCountry = (index: number) => {
    const list = countriesTemp.filter(item => filterCountry(item, countriesTemp[index]?.nome))
    if (list.length > 0) {
      if (countriesTemp[index]?.nome !== country) {
        resetField('state')
        resetField('city')
      }
      setCountry(countriesTemp[index]?.nome)
      setValue('country', countriesTemp[index]?.nome)
      if (countriesTemp[index]?.nome.toUpperCase().includes('BRA')) setIsDisabledState(false)
      clearErrors('country')
      setFocus('state')
    }
  }

  const onSubmitEditingCountry = (value: string) => {
    const list = countriesTemp.filter(item => item.nome === value)
    if (list.length > 0) {
      if (value !== country) {
        resetField('state')
        resetField('city')
      }
      setIsDisabledState(false)
      clearErrors('country')
      setFocus('state')
    }
  }

  /**
     * States
     */

  const [states, setStates] = useState<UF[]>([])
  const [statesTemp, setStatesTemp] = useState<UF[]>([])
  const [isDisabledState, setIsDisabledState] = useState<boolean>(true)

  const findPlaces = async () => {
    const list: Array<UF> = await fetch(`${API_IBGE_GOV}/localidades/estados?orderBy=nome`, {
      method: 'GET'
    }).then(async (response) => await response.json())

    setStates(list)
    setStatesTemp(list)
  }

  useEffect(() => {
    if (!isDisabledState)
      findPlaces()
  }, [isDisabledState])


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
      clearErrors('state')
      setFocus('city')
    }
  }

  const onSubmitEditingState = (value: string) => {
    const list = statesTemp.filter(item => item.sigla === value)
    if (list.length > 0) {
      setIsDisabledCity(false)
      clearErrors('state')
      setFocus('city')
    }
  }

  /**
   * Cities
   */
  const [cities, setCities] = useState<City[]>([])
  const [citiesTemp, setCitiesTemp] = useState<City[]>([])
  const [isDisabledCity, setIsDisabledCity] = useState<boolean>(true)

  const findCities = async () => {
    const list: Array<City> = await fetch(`${API_IBGE_GOV}/localidades/estados/${getValues('state')}/municipios?orderBy=nome`, {
      method: 'GET'
    }).then(async (response) => await response.json())

    setCities(list)
    setCitiesTemp(list)
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

  const onSelectCity = (index: number) => {
    const list = citiesTemp.filter(item => filterCity(item, citiesTemp[index]?.nome))
    if (list.length > 0) {
      setValue('city', citiesTemp[index]?.nome)
      clearErrors('city')
      setFocus('phone')
    }
  }

  const onSubmitEditingCity = (value: string) => {
    const list = citiesTemp.filter(item => item.nome === value)
    if (list.length > 0) {
      clearErrors('city')
      setFocus('phone')
    }
  }

  const clearInputs = (field?: string) => {
    switch (field) {
      case 'state':
        resetField('state')
        setStatesTemp([])
        resetField('city')
        setCitiesTemp([])
        setCities([])
        break
      case 'city':
        resetField('city')
        setCitiesTemp(cities)
        break
      default:
        resetField('country')
        resetField('city')
        resetField('state')
        setCountriesTemp(countries)
        setStatesTemp([])
        setStates([])
        setCitiesTemp([])
        setCities([])
        setIsDisabledState(true)
        setIsDisabledCity(true)
        break
    }
  }

  const renderRightIcon = (props: IconProps, value: string, op?: string) => {
    if ((op === 'city' || op === 'state') && value)
      return (
        <Icon {...props} name='close-outline' pack='ionicons' onPress={() => clearInputs(op)} />
      )
    else if (!op && value)
      return (
        <Icon {...props} name='close-outline' pack='ionicons' onPress={clearInputs} />
      )
    else return <></>
  }

  const renderOption = (item: City | Country, index: number) => (
    <AutocompleteItem
      key={index}
      title={item?.nome}
    />
  )

  const renderOptionUF = (item: UF, index: number) => (
    <AutocompleteItem
      key={index}
      title={`${item?.sigla}`}
    />
  )

  const [isLoadingPostalCode, setIsLoadingPostalCode] = useState<boolean>(false)
  const loadDataFromPostalCode = async (value: string) => {
    setIsLoadingPostalCode(true)
    const obj: any = await fetch(`${API_POSTAL_CODE_SEARCH.replace('$POSTAL_CODE', value)}`, {
      method: 'GET'
    }).then(async (response) => response && response.status === 200 ? await response.json() : null)

    resetField('country')
    resetField('city')
    resetField('state')
    resetField('address1')
    resetField('address2')
    resetField('addressComplement')
    resetField('country')

    setCountry(obj ? 'Brasil' : '')
    setValue('city', obj?.localidade)
    setValue('address1', obj?.logradouro)
    setValue('address2', obj?.bairro)
    setValue('state', obj?.uf)
    setValue('addressComplement', obj?.complemento)
    setValue('country', obj ? 'Brasil' : '')
    setIsLoadingPostalCode(false)
  }

  return (
    <>
      <SafeAreaLayout style={styles.safeArea} level='1'>
        {isLoadingPostalCode ?
          <>
            <View style={styles.backdropSpinner}>
              <Spinner size='giant' />
            </View>
          </> : null}
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
                  label="CEP *"
                  style={styles.input}
                  keyboardType='number-pad'
                  testID={name}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  maxLength={8}
                  ref={ref}
                  returnKeyType="next"
                  underlineColorAndroid="transparent"
                  onSubmitEditing={() => loadDataFromPostalCode(value)}
                  disabled={isLoadingPostalCode}
                />
              )}
              name='postalCode'
              defaultValue=''
            />
            {errors.postalCode && <Text category='s2' style={styles.text}>{errors.postalCode?.message}</Text>}
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
                  label="Endereço 1 *"
                  style={styles.input}
                  keyboardType='default'
                  testID={name}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  ref={ref}
                  returnKeyType="next"
                  underlineColorAndroid="transparent"
                  onSubmitEditing={() => setFocus('address2')}
                  disabled={isLoadingPostalCode}
                />
              )}
              name='address1'
              defaultValue=''
            />
            {errors.address1 && <Text category='s2' style={styles.text}>{errors.address1?.message}</Text>}
            <Controller
              control={control}
              rules={{
                required: false,
                minLength: {
                  value: 2,
                  message: `Mín. 2 caracteres`
                },
              }}
              render={({ field: { onChange, onBlur, value, name, ref } }) => (
                <Input
                  size='small'
                  label="Endereço 2"
                  style={styles.input}
                  keyboardType='default'
                  testID={name}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  ref={ref}
                  maxLength={180}
                  returnKeyType="next"
                  underlineColorAndroid="transparent"
                  onSubmitEditing={() => setFocus('addressComplement')}
                  disabled={isLoadingPostalCode}
                />
              )}
              name='address2'
              defaultValue=''
            />
            {errors.address2 && <Text category='s2' style={styles.text}>{errors.address2?.message}</Text>}
            <Controller
              control={control}
              rules={{
                required: false,
                minLength: {
                  value: 2,
                  message: `Mín. 2 caracteres`
                },
              }}
              render={({ field: { onChange, onBlur, value, name, ref } }) => (
                <Input
                  size='small'
                  label="Complemento"
                  style={styles.input}
                  keyboardType='default'
                  testID={name}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  ref={ref}
                  maxLength={180}
                  returnKeyType="next"
                  underlineColorAndroid="transparent"
                  onSubmitEditing={() => setFocus('country')}
                  disabled={isLoadingPostalCode}
                />
              )}
              name='addressComplement'
              defaultValue=''
            />
            {errors.addressComplement && <Text category='s2' style={styles.text}>{errors.addressComplement?.message}</Text>}
            <Controller
              control={control}
              rules={{
                required: {
                  value: true,
                  message: 'Campo obrigatório'
                },
              }}
              render={({ field: { onBlur, name, value, ref } }) => (
                <AutoCompleteComponent
                  size='small'
                  testID={name}
                  data={countriesTemp}
                  label="País *"
                  onSelect={onSelectCountry}
                  onBlur={onBlur}
                  onChangeText={onChangeTextCountry}
                  renderOption={renderOption}
                  accessoryRight={(props) => renderRightIcon(props, value)}
                  value={value}
                  autoCapitalize='words'
                  ref={ref}
                  returnKeyType="next"
                  onSubmitEditing={() => onSubmitEditingCountry(value)}
                  disabled={isLoadingPostalCode}
                />
              )}
              name='country'
              defaultValue=''
            />
            {errors.country && <Text category='s2' style={styles.text}>{errors.country?.message}</Text>}
            {country.toUpperCase().includes('BRA') ?
              <>
                <Controller
                  control={control}
                  rules={{
                    required: {
                      value: true,
                      message: 'Campo obrigatório'
                    },
                  }}
                  render={({ field: { onBlur, name, value, ref } }) => (
                    <AutoCompleteComponent
                      size='small'
                      testID={name}
                      data={statesTemp}
                      label="Estado *"
                      onSelect={onSelectState}
                      onBlur={onBlur}
                      onChangeText={onChangeTextState}
                      renderOption={renderOptionUF}
                      accessoryRight={(props) => renderRightIcon(props, value, 'state')}
                      value={value}
                      autoCapitalize='characters'
                      maxLength={2}
                      ref={ref}
                      returnKeyType="next"
                      onSubmitEditing={() => onSubmitEditingState(value)}
                      disabled={isLoadingPostalCode}
                      onFocus={() => value === '' ? findPlaces() : undefined}
                    />
                  )}
                  name='state'
                  defaultValue=''
                />
                {errors.state && <Text category='s2' style={styles.text}>{errors.state?.message}</Text>}
                <Controller
                  control={control}
                  rules={{
                    required: {
                      value: true,
                      message: 'Campo obrigatório'
                    },
                  }}
                  render={({ field: { onBlur, name, value, ref } }) => (
                    <AutoCompleteComponent
                      size='small'
                      testID={name}
                      data={citiesTemp}
                      label="Cidade *"
                      onSelect={onSelectCity}
                      onBlur={onBlur}
                      onChangeText={onChangeTextCity}
                      renderOption={renderOption}
                      accessoryRight={(props) => renderRightIcon(props, value, 'city')}
                      value={value}
                      ref={ref}
                      returnKeyType="next"
                      autoCapitalize='words'
                      onSubmitEditing={() => onSubmitEditingCity(value)}
                      disabled={isLoadingPostalCode}
                      onFocus={() => value === '' ? findCities() : undefined}
                    />
                  )}
                  name='city'
                  defaultValue=''
                />
                {errors.city && <Text category='s2' style={styles.text}>{errors.city?.message}</Text>}
              </>
              :
              <>
                <Controller
                  control={control}
                  rules={{
                    required: {
                      value: true,
                      message: 'Campo obrigatório'
                    },
                    minLength: {
                      value: 2,
                      message: `Mín. 2 caracteres`
                    },
                  }}
                  render={({ field: { onChange, onBlur, value, name, ref } }) => (
                    <Input
                      size='small'
                      label="Estado *"
                      style={styles.input}
                      keyboardType='default'
                      testID={name}
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                      ref={ref}
                      maxLength={2}
                      returnKeyType="next"
                      autoCapitalize='characters'
                      underlineColorAndroid="transparent"
                      onSubmitEditing={() => setFocus('city')}
                      disabled={isLoadingPostalCode}
                    />
                  )}
                  name='state'
                  defaultValue=''
                />
                {errors.state && <Text category='s2' style={styles.text}>{errors.state?.message}</Text>}
                <Controller
                  control={control}
                  rules={{
                    required: {
                      value: true,
                      message: 'Campo obrigatório'
                    },
                    minLength: {
                      value: 2,
                      message: `Mín. 2 caracteres`
                    },
                  }}
                  render={({ field: { onChange, onBlur, value, name, ref } }) => (
                    <Input
                      size='small'
                      label="Cidade *"
                      style={styles.input}
                      keyboardType='default'
                      testID={name}
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                      ref={ref}
                      maxLength={40}
                      returnKeyType="next"
                      autoCapitalize='words'
                      underlineColorAndroid="transparent"
                      onSubmitEditing={() => setFocus('phone')}
                      disabled={isLoadingPostalCode}
                    />
                  )}
                  name='city'
                  defaultValue=''
                />
                {errors.city && <Text category='s2' style={styles.text}>{errors.city?.message}</Text>}
              </>
            }
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
                  value={formatPhone(value)}
                  maxLength={15}
                  ref={ref}
                  returnKeyType="next"
                  onSubmitEditing={() => setFocus('phone2')}
                  underlineColorAndroid="transparent"
                  disabled={isLoadingPostalCode}
                />
              )}
              name='phone'
              defaultValue=''
            />
            {errors.phone && <Text category='s2' style={styles.text}>{errors.phone?.message}</Text>}
            <Controller
              control={control}
              rules={{
                required: false,
                minLength: {
                  value: 13,
                  message: `Mín. 13 caracteres`
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
                  value={formatPhone(value)}
                  maxLength={15}
                  ref={ref}
                  returnKeyType="send"
                  onSubmitEditing={handleSubmit(submit)}
                  underlineColorAndroid="transparent"
                  disabled={isLoadingPostalCode}
                />
              )}
              name='phone2'
              defaultValue=''
            />
            {errors.phone2 && <Text category='s2' style={styles.text}>{errors.phone2?.message}</Text>}
            <View style={styles.viewBtn}>
              <TouchableOpacity
                onPress={!isLoadingPostalCode ? handleSubmit(submit) : undefined}
                style={[styles.button, {
                  backgroundColor: isLoadingPostalCode ? theme['color-primary-disabled'] : styles.button.backgroundColor
                }]}
              >
                <Icon style={styles.icon} name={Platform.OS === 'ios' ? 'chevron-forward-outline' : Platform.OS === 'android' ? 'arrow-forward-outline' : 'arrow-forward-outline'}
                  size={20} pack='ionicons' />
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </SafeAreaLayout>
    </>
  )
}

export default SignUpPart2Screen