import AutoCompleteComponent from '@components/autoComplete'
import CustomErrorMessage from '@components/error'
import LoadingIndicatorComponent from '@components/loadingIndicator'
import { SafeAreaLayout } from '@components/safeAreaLayout'
import { _DATE_FROM_ISO_8601 } from '@constants/date'
import { useDatepickerService } from '@hooks/useDatepickerService'
import { MedicalDoctorDisplay, MedicalSpecialtyDto } from '@models/Medical'
import { City, UF } from '@models/Places'
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native'
import { getCities, getStates } from '@services/common.service'
import { getDisplayMedicalDoctorByFilters } from '@services/medical-doctor.service'
import { getAll } from '@services/medical-specialty.service'
import { AutocompleteItem, Button, CalendarRange, Icon, IconProps, Input, PopoverPlacements, RangeDatepicker, Text, useStyleSheet } from '@ui-kitten/components'
import { filterBy, sortByStringField } from '@utils/common'
import React, { FC, ReactElement, useCallback, useEffect, useRef, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { Keyboard, TouchableOpacity, View } from 'react-native'
import Toast from 'react-native-toast-message'
import { filterScheduleStyle } from './filter-schedule.style'

interface FilterScheduleParams {
  city?: string
  state?: string
  specialty?: MedicalSpecialtyDto
  name?: string
}

type FilterProps = {
  type: 0 | 1
}

const FilterScheduleScreen: FC = (): ReactElement => {

  const navigation = useNavigation<any>()
  const [range, setRange] = useState<CalendarRange<Date>>({})
  const rangeDatepickerRef = useRef<RangeDatepicker>(null)
  const { localeDateService } = useDatepickerService()
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
      setRange({})
      setIsEmpty(false)
      setReleasedToSearch(false)
      clearInputs()
      fetchData()
    }, [])
  )

  const fetchData = async () => {
    const response = await getAll()
    setSpecialty(response.data.sort((a, b) => sortByStringField(a, b, 'description')) ?? response.data)
    setSpecialtyTemp(response.data.sort((a, b) => sortByStringField(a, b, 'description')) ?? response.data)
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
      Toast.show({
        type: 'danger',
        text2: 'Ocorreu um erro. Tente novamente mais tarde',
      })
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
      setReleasedToSearch(false)
    }
  }

  const onSelectSpecialty = (index: number) => {
    form.setValue('specialty', specialty[index])
    setReleasedToSearch(true)
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

  const onSubmit = async (data: FilterScheduleParams) => {
    setIsEmpty(false)
    setIsFetching(!isFetching)
    Keyboard.dismiss()

    let result: MedicalDoctorDisplay[] = []
    try {
      const specialtyIdArray: number[] = [data.specialty?.id as number]
      const response = await getDisplayMedicalDoctorByFilters({
        specialtyIdArray,
        appointmentVirtual: params?.type === 0,
        ...params?.type === 1 && {
          ...data.city !== '' && {
            city: data.city
          },
          ...data.state !== '' && {
            state: data.state
          },
        },
        ...data.name !== '' && {
          name: data.name
        },
        ...range && {
          ...range.startDate && {
            startTime: localeDateService.parse(range.startDate.toISOString(), _DATE_FROM_ISO_8601) || null,
          },
          ...range.endDate && {
            endTime: localeDateService.parse(range.endDate.toISOString(), _DATE_FROM_ISO_8601) || null
          }
        }
      })
      result = response.data
    } catch (error) {
      if ((error as any).response.status !== 404) {
        Toast.show({
          type: 'danger',
          text2: 'Erro ao buscar. Tente novamente mais tarde',
        })
      }
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
              label="Especialidade *"
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
        <Controller
          control={form.control}
          rules={{
            required: false,
            minLength: {
              value: 4,
              message: `Mín. 4 caracteres`
            },
          }}
          render={({ field: { onChange, onBlur, value, name, ref } }) => (
            <Input
              size='small'
              label="Nome do Especialista"
              style={styles.input}
              keyboardType='default'
              testID={name}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              ref={ref}
              maxLength={60}
              returnKeyType="next"
              underlineColorAndroid="transparent"
              autoCapitalize="words"
              textContentType="name"
            />
          )}
          name='name'
          defaultValue=''
        />
        <CustomErrorMessage name='name' errors={form.formState.errors} />
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
        <RangeDatepicker
          ref={rangeDatepickerRef}
          size='small'
          label={'Data da consulta'}
          range={range}
          onSelect={nextRange => setRange(nextRange)}
          style={styles.input}
          controlStyle={styles.rangeDatePicker}
          accessoryRight={(props) => <Icon {...props} name='calendar' />}
          dateService={localeDateService}
          placement={PopoverPlacements.BOTTOM}
          min={new Date(1900, 0, 0)}
          backdropStyle={styles.backdropDatepicker}
          boundingMonth={false}
          onPress={() => Keyboard.dismiss()}
          caption={(props) => (
            range && (range.startDate || range.endDate) ? (
              <View style={styles.caption}>
                <TouchableOpacity
                  onPress={() => rangeDatepickerRef.current?.clear()}>
                  <Text {...props}>LIMPAR</Text>
                </TouchableOpacity>
              </View>
            ) : <></>
          )}
        />
        <View style={styles.viewButton}>
          <Button
            size='small'
            disabled={!releasedToSearch}
            style={styles.button}
            onPress={form.handleSubmit(onSubmit)}
            accessoryRight={isFetching ? () => <LoadingIndicatorComponent insideButton size='tiny' status='basic' /> : undefined}
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

