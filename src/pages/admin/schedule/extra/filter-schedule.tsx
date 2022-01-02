import React, { FC, ReactElement, useEffect, useState } from 'react'
import { AutocompleteItem, Button, Avatar, Spinner } from '@ui-kitten/components'
import { ImageBackground, View } from 'react-native'
import { DrawerContentComponentProps } from '@react-navigation/drawer'
import { API_IBGE_GOV } from '@env'
import { filterScheduleStyle } from './filter-schedule.style'
import AutoCompleteComponent from '@components/autoComplete'
import { City, UF } from '@models/Places'
import specialties from '@utils/specialties'
import ListComponentWithAvatar from '@components/menuList'
import { SafeAreaLayout } from '@components/safeAreaLayout'

const filter = (item: any, query: any) => item.sigla.toLowerCase().includes(query.toLowerCase())
const filterCity = (item: any, query: any) => item.nome.toLowerCase().includes(query.toLowerCase())
const filterSpecialty = (item: any, query: any) => item.toLowerCase().includes(query.toLowerCase())

const ChoiceScheduleScreen: FC<DrawerContentComponentProps> = ({
  navigation,
  state
}): ReactElement => {

  const [states, setStates] = useState<UF[]>([])
  const [statesTemp, setStatesTemp] = useState<UF[]>([])
  const [selectedState, setSelectedState] = useState<string>('')
  const [isDisabledCity, setIsDisabledCity] = useState<boolean>(true)

  const [showListDoctors, setShowListDoctors] = useState<boolean>(false)
  const [isLoadingActive, setIsLoadingActive] = useState<boolean>(false)

  useEffect(() => {
    setIsLoadingActive(false)
    setShowListDoctors(false)
  }, [])

  const filterDoctors = () => {
    setShowListDoctors(false)
    setIsLoadingActive(true)
    setTimeout(() => {
      setIsLoadingActive(false)
      setShowListDoctors(true)
    }, 2000)
  }

  const clearInputs = (field?: string) => {
    switch (field) {
      case 'city':
        setSelectedCity('')
        setCitiesTemp(cities)
        setSelectedSpecialty('')
        setIsDisabledSpecialty(true)
        break
      case 'specialty':
        setSpecialtyTemp(specialties)
        setSelectedSpecialty('')
        break
      default:
        setSelectedState('')
        setStatesTemp(states)
        setSelectedCity('')
        setCitiesTemp(cities)
        setIsDisabledCity(true)
        setSelectedCity('')
        setIsDisabledSpecialty(true)
        break
    }
  }

  /**
   * States
   */
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
    setSelectedState(text)
    const list = statesTemp.filter(item => filter(item, text))
    if (list.length > 0)
      setStatesTemp(list)
    if (text === '')
      setStatesTemp(states)

  }

  const onSelectState = (index: number) => {
    const list = statesTemp.filter(item => filter(item, statesTemp[index]?.sigla))
    if (list.length > 0) {
      setSelectedState(statesTemp[index]?.sigla)
      setIsDisabledCity(false)
    }
  }

  const renderOptionState = (item: any, index: any) => (
    <AutocompleteItem
      key={index}
      title={`${item?.sigla} - ${item?.nome}`}
    />
  )

  /**
   * Cities
   */
  const [cities, setCities] = useState<City[]>([])
  const [citiesTemp, setCitiesTemp] = useState<City[]>([])
  const [selectedCity, setSelectedCity] = useState<string>('')
  const [isDisabledSpecialty, setIsDisabledSpecialty] = useState<boolean>(true)

  const findCities = async () => {
    const list: Array<City> = await fetch(`${API_IBGE_GOV}/localidades/estados/${selectedState}/municipios`, {
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
    setSelectedCity(text)
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
      setSelectedCity(citiesTemp[index]?.nome)
      setIsDisabledSpecialty(false)
    }
  }

  /**
   * Specilities
   */

  const [specialtyTemp, setSpecialtyTemp] = useState<string[]>(specialties)
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>('')

  const renderOptionSpecialty = (item: any, index: any) => (
    <AutocompleteItem
      key={index}
      title={item}
    />
  )

  const onSelectSpecialty = (index: number) => {
    const list = specialtyTemp.filter(item => filterSpecialty(item, specialtyTemp[index]))
    if (list.length > 0) {
      setSelectedSpecialty(specialtyTemp[index])
    }
  }

  const onChangeTextSpecialty = (text: string) => {
    setSelectedSpecialty(text)
    const list = specialtyTemp.filter(item => filterSpecialty(item, text))
    if (list.length > 0)
      setSpecialtyTemp(list)
    if (text === '')
      setSpecialtyTemp(specialties)

  }

  return (
    <>
      <SafeAreaLayout insets='bottom' level='1' style={filterScheduleStyle.safeArea}>
        <View style={filterScheduleStyle.container}>
          <View style={filterScheduleStyle.layout}>
            <AutoCompleteComponent
              style={filterScheduleStyle.autoComplete}
              data={statesTemp}
              label="Estado"
              placeholder=''
              onSelect={onSelectState}
              onChangeText={onChangeTextState}
              renderOption={renderOptionState}
              clearInput={clearInputs}
              value={selectedState}
              autoCapitalize='characters'
              maxLength={2}
            />
            <AutoCompleteComponent
              style={filterScheduleStyle.autoComplete}
              data={citiesTemp}
              label="Cidade"
              placeholder=''
              onSelect={onSelectCity}
              onChangeText={onChangeTextCity}
              renderOption={renderOptionCity}
              clearInput={() => clearInputs('city')}
              value={selectedCity}
              disabled={isDisabledCity}
              autoCapitalize='words'
            />
            <AutoCompleteComponent
              style={filterScheduleStyle.autoComplete}
              data={specialtyTemp}
              label="Especialidade"
              placeholder=''
              onSelect={onSelectSpecialty}
              onChangeText={onChangeTextSpecialty}
              renderOption={renderOptionSpecialty}
              clearInput={() => clearInputs('specialty')}
              value={selectedSpecialty}
              disabled={isDisabledSpecialty}
              autoCapitalize='sentences'
            />
            <View style={filterScheduleStyle.viewButton}>
              <Button
                style={filterScheduleStyle.button}
                onPress={filterDoctors}
                status="primary"
                disabled={selectedCity === '' || selectedState === ''}
              >
                FILTRAR
              </Button>
            </View>
          </View>
          {showListDoctors ?
            <View style={filterScheduleStyle.viewDoctors}>
              <ListComponentWithAvatar data={[
                {
                  id: 1,
                  title: 'Johnny Depp',
                  description: "Ortopedista - CRM 1234",
                  accessoryLeft: (props: any) => (
                    <Avatar
                      {...props}
                      style={[props.style, { tintColor: null }]}
                      source={{ uri: 'https://bootdey.com/img/Content/avatar/avatar1.png' }}
                      ImageComponent={ImageBackground}
                    />
                  ),
                  onPress: () => navigation.navigate('PresentialSchedule', {
                    doctorId: 1,
                    doctorName: 'Johnny Depp',
                    specialty: 'Ortopedista',
                    crm: 1234,
                    tel: "43 3333-3333",
                    visitAddress: {
                      id: 1,
                      street: "Rua Alvorada, 1289 - conj 902 - Vila Olímpia - São Paulo",
                    }
                  })
                },
                {
                  id: 2,
                  title: 'Davy Jones',
                  description: "Ortopedista - CRM 1235",
                  accessoryLeft: (props: any) => (
                    <Avatar
                      {...props}
                      style={[props.style, { tintColor: null }]}
                      source={{ uri: 'https://bootdey.com/img/Content/avatar/avatar2.png' }}
                      ImageComponent={ImageBackground}
                    />
                  ),
                  onPress: () => navigation.navigate('PresentialSchedule', {
                    doctorId: 2,
                    doctorName: 'Davy Jones',
                    specialty: 'Ortopedista',
                    crm: 1235,
                    tel: "43 3333-3333",
                    visitAddress: {
                      id: 1,
                      street: "Rua Alvorada, 1289 - conj 902 - Vila Olímpia - São Paulo",
                    }
                  })
                },
                {
                  id: 3,
                  title: 'Davy Jones',
                  description: "Ortopedista - CRM 1236",
                  accessoryLeft: (props: any) => (
                    <Avatar
                      {...props}
                      style={[props.style, { tintColor: null }]}
                      source={{ uri: 'https://bootdey.com/img/Content/avatar/avatar4.png' }}
                      ImageComponent={ImageBackground}
                    />
                  ),
                  onPress: () => navigation.navigate('PresentialSchedule', {
                    doctorId: 3,
                    doctorName: 'Davy Jones',
                    specialty: 'Ortopedista',
                    crm: 1236,
                    tel: "43 3333-3333",
                    visitAddress: {
                      id: 1,
                      street: "Rua Alvorada, 1289 - conj 902 - Vila Olímpia - São Paulo",
                    }
                  })
                },
                {
                  id: 4,
                  title: 'Davy Jones',
                  description: "Ortopedista - CRM 1236",
                  accessoryLeft: (props: any) => (
                    <Avatar
                      {...props}
                      style={[props.style, { tintColor: null }]}
                      source={{ uri: 'https://bootdey.com/img/Content/avatar/avatar7.png' }}
                      ImageComponent={ImageBackground}
                    />
                  ),
                  onPress: () => navigation.navigate('PresentialSchedule', {
                    doctorId: 4,
                    doctorName: 'Davy Jones',
                    specialty: 'Ortopedista',
                    crm: 1234,
                    tel: "43 3333-3333",
                    visitAddress: {
                      id: 1,
                      street: "Rua Alvorada, 1289 - conj 902 - Vila Olímpia - São Paulo",
                    }
                  })
                }
              ]}
                rightIconShow={false}
                divider={true}
                scrollEnabled={false}
              />
            </View>
            :
            isLoadingActive ?
              <>
                <View style={filterScheduleStyle.sppiner}>
                  <Spinner size='giant' status='primary' />
                </View>
              </> : null
          }
        </View>
      </SafeAreaLayout>
    </>
  )
}

export default ChoiceScheduleScreen
