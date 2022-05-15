import AutoCompleteComponent from '@components/autoComplete'
import CustomErrorMessage from '@components/error'
import { SafeAreaLayout } from '@components/safeAreaLayout'
import toast from '@helpers/toast'
import { City, UF } from '@models/Places'
import { DrawerContentComponentProps } from '@react-navigation/drawer'
import { useFocusEffect, useRoute } from '@react-navigation/native'
import { getCities, getStates } from '@services/common.service'
import { getAll } from '@services/medical-specialty.service'
import { AutocompleteItem, Button, Icon, IconProps, Spinner, Text, useStyleSheet } from '@ui-kitten/components'
import { filterBy } from '@utils/common'
import { MedicalDoctorDisplay, MedicalSpecialtyDto } from 'models/Medical'
import React, { FC, ReactElement, useCallback, useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { Keyboard, View } from 'react-native'
import { getDisplayMedicalDoctorBySpecialtyArray } from 'services/medical-doctor.service'
import { filterScheduleStyle } from './filter-schedule.style'

interface FilterScheduleParams {
  city?: string
  state?: string
  specialty?: MedicalSpecialtyDto
}

type FilterProps = {
  type: 0 | 1
}

const FilterScheduleScreen: FC<DrawerContentComponentProps> = ({
  navigation
}): ReactElement => {

  const form = useForm<FilterScheduleParams>()
  const styles = useStyleSheet(filterScheduleStyle)
  const [releasedToSearch, setReleasedToSearch] = useState<boolean>(false)
  const [specialty, setSpecialty] = useState<MedicalSpecialtyDto[]>([])
  const [specialtyTemp, setSpecialtyTemp] = useState<MedicalSpecialtyDto[]>([])
  const [states, setStates] = useState<UF[]>([])
  const [statesTemp, setStatesTemp] = useState<UF[]>([])
  const [cities, setCities] = useState<City[]>([])
  const [citiesTemp, setCitiesTemp] = useState<City[]>([])
  const [isDisabledCity, setIsDisabledCity] = useState<boolean>(true)
  const [isFetching, setIsFetching] = useState<boolean>(false)
  const route = useRoute()
  const [params, setParams] = useState<FilterProps>()
  const [isEmpty, setIsEmpty] = useState<boolean>()

  useFocusEffect(
    useCallback(() => {
      form.reset({})
      setReleasedToSearch(false)
      clearInputs()
      fetchData()
    }, [])
  )

  const fetchData = async () => {
    const response = await getAll()
    setSpecialty(response.data)
    setSpecialtyTemp(response.data)
  }

  useEffect(() => {
    const paramsTmp = route.params as FilterProps
    setParams(paramsTmp)
    if (paramsTmp && paramsTmp.type === 1 && states.length === 0) findPlaces()
  }, [route.params])

  /**
  * States
  */

  const findPlaces = async () => {
    try {
      const list = await getStates()
      setStates(list)
      setStatesTemp(list)
    } catch (error) {
      setStates([])
      setStatesTemp([])
    }
  }

  const onChangeTextState = (query: string) => {
    form.setValue('state', query)
    const list = statesTemp.filter(item => filterBy(item, query, 'sigla'))
    setStates(list)
    if (list.length > 0) unLockCity()
    else setIsDisabledCity(true)
  }

  const onSelectState = (index: number) => {
    form.setValue('state', states[index]?.sigla)
    unLockCity()
  }

  const onSubmitEditing = (name: 'city' | 'state' | 'specialty') => {
    form.setFocus(name)
  }

  const unLockCity = () => {
    findCities()
    setIsDisabledCity(false)
  }

  /**
  * Cities
  */

  const findCities = async () => {
    try {
      const list = await getCities(form.getValues('state'))
      setCities(list)
      setCitiesTemp(list)
    } catch (error) {
      setCities([])
      setCitiesTemp([])
      toast.danger({ message: 'Ocorreu um erro. Tente novamente mais tarde', duration: 3000 })
    }
  }

  const onChangeTextCity = (query: string) => {
    form.setValue('city', query)
    setCities(citiesTemp.filter(item => filterBy(item, query, 'nome')))
  }

  const onSelectCity = (index: number) => {
    form.setValue('city', cities[index]?.nome)
  }


  /**
   * Specilities
   */

  const onChangeTextSpecialty = (query: string) => {
    form.setValue('specialty.description', query)
    const list = specialtyTemp.filter(item => filterBy(item, query, 'description'))
    setSpecialty(list)
    if (list.length > 0) {
      setReleasedToSearch(true)
    } else {
      setReleasedToSearch(false)
    }
  }

  const onSelectSpecialty = (index: number) => {
    form.setValue('specialty', specialty[index])
  }


  // Others
  const clearInputs = (field?: string) => {
    switch (field) {
      case 'state':
        form.resetField('state')
        form.resetField('city')
        findPlaces()
        setIsDisabledCity(true)
        break
      case 'city':
        form.resetField('city')
        findCities()
        break
      case 'specialty':
        setReleasedToSearch(false)
        form.resetField('specialty.description')
        setSpecialty(specialtyTemp)
        break
      default:
        form.resetField('city')
        form.resetField('state')
        form.resetField('specialty')
        setStatesTemp([])
        setStates([])
        setCitiesTemp([])
        setCities([])
        setIsDisabledCity(true)
        break
    }
  }

  const renderRightIcon = (props: IconProps, value?: string, op?: string) => {
    if ((op === 'city' || op === 'state' || op === 'specialty') && value)
      return (
        <Icon {...props} name='close-outline' pack='ionicons' onPress={() => clearInputs(op)} />
      )
    else if (!op && value)
      return (
        <Icon {...props} name='close-outline' pack='ionicons' onPress={clearInputs} />
      )
    else return <></>
  }

  const renderOptionSpecialty = (item: MedicalSpecialtyDto, index: any) => (
    <AutocompleteItem
      key={index}
      title={item.description}
    />
  )

  const renderOption = (item: City | UF, index: number) => (
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

  const LoadingIndicator = () => (
    <Spinner size='tiny' status='basic' />
  )

  const onSubmit = async (data: FilterScheduleParams) => {
    setIsEmpty(false)
    setIsFetching(!isFetching)
    Keyboard.dismiss()

    let result: MedicalDoctorDisplay[] = []
    try {
      const specialtyIdArray: number[] = [data.specialty?.id as number]
      const response = await getDisplayMedicalDoctorBySpecialtyArray(specialtyIdArray)
      result = response.data
    } catch (error) {
      toast.danger({ message: 'Erro ao buscar. Tente novamente mais tarde', duration: 3000 })
      result = []
    } finally {
      setIsFetching(false)
    }

    if (result.length > 0) {
      navigation.navigate('ScheduleSearchResult', { data: result })
    } else {
      setIsEmpty(true)
    }
  }

  return (
    <SafeAreaLayout style={styles.safeArea}>
      <View style={styles.container}>
        {params?.type === 1 && (
          <>
            <Controller
              control={form.control}
              render={({ field: { onBlur, name, value, ref } }) => (
                <AutoCompleteComponent
                  size='small'
                  testID={name}
                  data={states}
                  label="Estado"
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
                  onSubmitEditing={() => onSubmitEditing('city')}
                  style={styles.input}
                />
              )}
              name='state'
              defaultValue=''
            />
            <CustomErrorMessage name='state' errors={form.formState.errors} />
            <Controller
              control={form.control}
              render={({ field: { onBlur, name, value, ref } }) => (
                <AutoCompleteComponent
                  size='small'
                  testID={name}
                  data={cities}
                  label="Cidade"
                  onSelect={onSelectCity}
                  onBlur={onBlur}
                  onChangeText={onChangeTextCity}
                  renderOption={renderOption}
                  accessoryRight={(props) => renderRightIcon(props, value, 'city')}
                  value={value}
                  ref={ref}
                  returnKeyType="next"
                  autoCapitalize='words'
                  onSubmitEditing={() => onSubmitEditing('specialty')}
                  style={styles.input}
                  disabled={isDisabledCity}
                />
              )}
              name='city'
              defaultValue=''
            />
            <CustomErrorMessage name='city' errors={form.formState.errors} />
          </>
        )}

        <Controller
          control={form.control}
          rules={{
            required: {
              value: releasedToSearch ? false : true,
              message: 'Campo obrigatório'
            },
          }}
          render={({ field: { onBlur, name, value, ref } }) => (
            <AutoCompleteComponent
              size='small'
              ref={ref}
              onBlur={onBlur}
              testID={name}
              style={styles.input}
              data={specialty}
              label="Especialidade"
              placeholder=''
              onSelect={onSelectSpecialty}
              onChangeText={onChangeTextSpecialty}
              renderOption={renderOptionSpecialty}
              accessoryRight={(props) => renderRightIcon(props, value, 'specialty')}
              value={value}
              autoCapitalize='sentences'
            />
          )}
          name='specialty.description'
          defaultValue=''
        />
        <CustomErrorMessage name='specialty.description' errors={form.formState.errors} />
        <View style={styles.viewButton}>
          <Button
            size='small'
            style={styles.button}
            onPress={form.handleSubmit(onSubmit)}
            accessoryRight={isFetching ? LoadingIndicator : undefined}
            status="primary">
            PESQUISAR
          </Button>
        </View>
      </View>
      {isEmpty && (
        <View style={styles.messageNotFoundContainer}>
          <Text status='basic' style={styles.messageNotFound}>Não foram encontrados resultados para esta pesquisa</Text>
        </View>
      )}
    </SafeAreaLayout>
  )
}

export default FilterScheduleScreen

