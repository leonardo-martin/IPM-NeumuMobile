import React, { FC, ReactElement, useEffect, useState } from 'react'
import { View } from 'react-native'
import { Input, Text, IconProps, Icon, useStyleSheet, AutocompleteItem, Spinner } from '@ui-kitten/components'
import { Controller } from 'react-hook-form'
import AutoCompleteComponent from '@components/autoComplete'
import { City, Country, UF } from '@models/Places'
import { API_IBGE_GOV, API_POSTAL_CODE_SEARCH } from '@env'
import { formatPhone } from '@utils/mask'
import { registerStyle } from '@pages/signup/style'
import { DoctorSignUpProps } from '@models/SignUpProps'

const filter = (item: any, query: any) => item.sigla.toLowerCase().includes(query.toLowerCase())
const filterCity = (item: any, query: any) => item.nome.toLowerCase().includes(query.toLowerCase())
const filterCountry = (item: any, query: any) => item.nome.toLowerCase().includes(query.toLowerCase())

const DoctorSignUpPart2Screen: FC<DoctorSignUpProps> = ({ form, onSubmit }): ReactElement => {

  const styles = useStyleSheet(registerStyle)

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
    form.setValue('country', text)
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
        form.resetField('state')
        form.resetField('city')
      }
      setCountry(countriesTemp[index]?.nome)
      form.setValue('country', countriesTemp[index]?.nome)
      if (countriesTemp[index]?.nome.toUpperCase().includes('BRA')) setIsDisabledState(false)
      form.clearErrors('country')
      form.setFocus('state')
    }
  }

  const onSubmitEditingCountry = (value?: string) => {
    const list = countriesTemp.filter(item => item.nome === value)
    if (list.length > 0) {
      if (value !== country) {
        form.resetField('state')
        form.resetField('city')
      }
      setIsDisabledState(false)
      form.clearErrors('country')
      form.setFocus('state')
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
    form.setValue('state', text)
    const list = statesTemp.filter(item => filter(item, text))
    if (list.length > 0)
      setStatesTemp(list)
    if (text === '')
      setStatesTemp(states)

  }

  const onSelectState = (index: number) => {
    const list = statesTemp.filter(item => filter(item, statesTemp[index]?.sigla))
    if (list.length > 0) {
      form.setValue('state', statesTemp[index]?.sigla)
      setIsDisabledCity(false)
      form.clearErrors('state')
      form.setFocus('city')
    }
  }

  const onSubmitEditingState = (value?: string) => {
    const list = statesTemp.filter(item => item.sigla === value)
    if (list.length > 0) {
      setIsDisabledCity(false)
      form.clearErrors('state')
      form.setFocus('city')
    }
  }

  /**
   * Cities
   */
  const [cities, setCities] = useState<City[]>([])
  const [citiesTemp, setCitiesTemp] = useState<City[]>([])
  const [isDisabledCity, setIsDisabledCity] = useState<boolean>(true)

  const findCities = async () => {
    const list: Array<City> = await fetch(`${API_IBGE_GOV}/localidades/estados/${form.getValues('state')}/municipios?orderBy=nome`, {
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
    form.setValue('city', text)
    const list = citiesTemp.filter(item => filterCity(item, text))
    if (list.length > 0)
      setCitiesTemp(list)
    if (text === '')
      setCitiesTemp(cities)
  }

  const onSelectCity = (index: number) => {
    const list = citiesTemp.filter(item => filterCity(item, citiesTemp[index]?.nome))
    if (list.length > 0) {
      form.setValue('city', citiesTemp[index]?.nome)
      form.clearErrors('city')
      form.setFocus('phone')
    }
  }

  const onSubmitEditingCity = (value?: string) => {
    const list = citiesTemp.filter(item => item.nome === value)
    if (list.length > 0) {
      form.clearErrors('city')
      form.setFocus('phone')
    }
  }

  const clearInputs = (field?: string) => {
    switch (field) {
      case 'state':
        form.resetField('state')
        setStatesTemp([])
        form.resetField('city')
        setCitiesTemp([])
        setCities([])
        break
      case 'city':
        form.resetField('city')
        setCitiesTemp(cities)
        break
      default:
        form.resetField('country')
        form.resetField('city')
        form.resetField('state')
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

  const renderRightIcon = (props: IconProps, value?: string, op?: string) => {
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

    form.resetField('country')
    form.resetField('city')
    form.resetField('state')
    form.resetField('address1')
    form.resetField('address2')
    form.resetField('addressComplement')
    form.resetField('country')

    setCountry(obj ? 'Brasil' : '')
    form.setValue('city', obj?.localidade)
    form.setValue('address1', obj?.logradouro)
    form.setValue('address2', obj?.bairro)
    form.setValue('state', obj?.uf)
    form.setValue('addressComplement', obj?.complemento)
    form.setValue('country', obj ? 'Brasil' : '')
    setIsLoadingPostalCode(false)
  }

  return (
    <>
      <View style={styles.box}>
        {isLoadingPostalCode ?
          <>
            <View style={styles.backdropSpinner}>
              <Spinner size='giant' />
            </View>
          </> : null}
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
              onSubmitEditing={() => value ? loadDataFromPostalCode(value) : undefined}
              disabled={isLoadingPostalCode}
            />
          )}
          name='postalCode'
          defaultValue=''
        />
        {form.formState.errors.postalCode && <Text category='s2' style={styles.text}>{form.formState.errors.postalCode?.message}</Text>}
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
              label="Endereço Residencial 1 *"
              style={styles.input}
              keyboardType='default'
              testID={name}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              ref={ref}
              returnKeyType="next"
              underlineColorAndroid="transparent"
              onSubmitEditing={() => form.setFocus('address2')}
              disabled={isLoadingPostalCode}
            />
          )}
          name='address1'
          defaultValue=''
        />
        {form.formState.errors.address1 && <Text category='s2' style={styles.text}>{form.formState.errors.address1?.message}</Text>}
        <Controller
          control={form.control}
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
              label="Endereço Residencial 2"
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
              onSubmitEditing={() => form.setFocus('addressComplement')}
              disabled={isLoadingPostalCode}
            />
          )}
          name='address2'
          defaultValue=''
        />
        {form.formState.errors.address2 && <Text category='s2' style={styles.text}>{form.formState.errors.address2?.message}</Text>}
        <Controller
          control={form.control}
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
              onSubmitEditing={() => form.setFocus('country')}
              disabled={isLoadingPostalCode}
            />
          )}
          name='addressComplement'
          defaultValue=''
        />
        {form.formState.errors.addressComplement && <Text category='s2' style={styles.text}>{form.formState.errors.addressComplement?.message}</Text>}
        <Controller
          control={form.control}
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
        {form.formState.errors.country && <Text category='s2' style={styles.text}>{form.formState.errors.country?.message}</Text>}
        {country.toUpperCase().includes('BRA') ?
          <>
            <Controller
              control={form.control}
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
            {form.formState.errors.state && <Text category='s2' style={styles.text}>{form.formState.errors.state?.message}</Text>}
            <Controller
              control={form.control}
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
            {form.formState.errors.city && <Text category='s2' style={styles.text}>{form.formState.errors.city?.message}</Text>}
          </>
          :
          <>
            <Controller
              control={form.control}
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
                  onSubmitEditing={() => form.setFocus('city')}
                  disabled={isLoadingPostalCode}
                />
              )}
              name='state'
              defaultValue=''
            />
            {form.formState.errors.state && <Text category='s2' style={styles.text}>{form.formState.errors.state?.message}</Text>}
            <Controller
              control={form.control}
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
                  onSubmitEditing={() => form.setFocus('phone')}
                  disabled={isLoadingPostalCode}
                />
              )}
              name='city'
              defaultValue=''
            />
            {form.formState.errors.city && <Text category='s2' style={styles.text}>{form.formState.errors.city?.message}</Text>}
          </>
        }
        <Controller
          control={form.control}
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
              onSubmitEditing={() => form.setFocus('phone2')}
              underlineColorAndroid="transparent"
              disabled={isLoadingPostalCode}
            />
          )}
          name='phone'
          defaultValue=''
        />
        {form.formState.errors.phone && <Text category='s2' style={styles.text}>{form.formState.errors.phone?.message}</Text>}
        <Controller
          control={form.control}
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
              onSubmitEditing={form.handleSubmit(onSubmit)}
              underlineColorAndroid="transparent"
              disabled={isLoadingPostalCode}
            />
          )}
          name='phone2'
          defaultValue=''
        />
        {form.formState.errors.phone2 && <Text category='s2' style={styles.text}>{form.formState.errors.phone2?.message}</Text>}
      </View>
    </>
  )
}

export default DoctorSignUpPart2Screen