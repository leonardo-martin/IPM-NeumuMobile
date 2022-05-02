import AutoCompleteComponent from '@components/autoComplete'
import HeaderGenericWithTitleAndAddIcon from '@components/header/admin/generic-with-add-icon'
import { SafeAreaLayout } from '@components/safeAreaLayout'
import toast from '@helpers/toast'
import { useAppSelector } from '@hooks/redux'
import { City, UF } from '@models/Places'
import { VisitAddressDTO } from '@models/VisitAddress'
import { useFocusEffect } from '@react-navigation/native'
import { getAddressByPostalCode, getStates, getCities } from '@services/common.service'
import { createVisitAddress, getVisitAddressListByDoctorId, updateVisitAddress } from '@services/visit-address.service'
import { AutocompleteItem, Button, Icon, IconProps, Input, Text, useStyleSheet } from '@ui-kitten/components'
import React, { FC, ReactElement, useCallback, useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { View } from 'react-native'
import { RootState } from 'store'
import { filterBy } from 'utils/common'
import { visitAddressStyle } from './style'

const VisitAddressScreen: FC = (): ReactElement => {

    const { ids } = useAppSelector((state: RootState) => state.user)
    const styles = useStyleSheet(visitAddressStyle)
    const form = useForm<VisitAddressDTO>()
    const [editable, setEditable] = useState<boolean>()

    const verifyData = (arr: VisitAddressDTO[]) => {
        if (arr && arr.length > 0) {
            form.reset(
                arr[0].street?.toUpperCase() === 'VIRTUAL' ? {} : {
                    ...arr[0]
                }
            )
        } else
            form.reset()
    }

    const loadData = async () => {
        const response = await getVisitAddressListByDoctorId(ids?.medicalDoctorId.toString() ?? "0")
        verifyData(response.data)
    }

    useFocusEffect(
        useCallback(() => {
            loadData()
        }, [])
    )

    const onSubmit = async (data: VisitAddressDTO) => {
        try {
            let response = null
            if (data.id) response = await updateVisitAddress(data)
            else response = await createVisitAddress(data)

            if (response && response.data) {
                let list = []
                list.push(response.data)
                verifyData(list)
            }
            toast.success({ message: 'Dados atualizados com sucesso!', duration: 3000 })
        } catch (error) {
            toast.danger({ message: 'Erro ao atualizar os dados. Tente novamente mais tarde', duration: 3000 })
        }
    }

    const loadDataFromPostalCode = async (value: string) => {
        setEditable(false)
        const obj = await getAddressByPostalCode(value)
        form.setValue('city', obj?.localidade)
        form.setValue('state', obj?.uf)
        form.setValue('complement', obj?.complemento)
        form.setValue('street', obj?.logradouro)
        form.setValue('district', obj?.bairro)
        setEditable(true)
    }

    /**
    * States
    */

    const [states, setStates] = useState<UF[]>([])
    const [statesTemp, setStatesTemp] = useState<UF[]>([])
    const [isDisabledState, setIsDisabledState] = useState<boolean>(true)

    const findPlaces = async () => {
        const list = await getStates()
        setStates(list)
        setStatesTemp(list)
    }

    useEffect(() => {
        if (!isDisabledState)
            findPlaces()
    }, [isDisabledState])


    const onChangeTextState = (text: string) => {
        form.setValue('state', text)
        const list = statesTemp.filter(item => filterBy(item, text, 'nome'))
        if (list.length > 0)
            setStatesTemp(list)
        if (text === '')
            setStatesTemp(states)

    }

    const onSelectState = (index: number) => {
        const list = statesTemp.filter(item => filterBy(item, statesTemp[index]?.sigla, 'sigla'))
        if (list.length > 0) {
            form.setValue('state', statesTemp[index]?.sigla)
            setIsDisabledCity(false)
            form.clearErrors('state')
            form.setFocus('state')
        }
    }

    const onSubmitEditingState = (value?: string) => {
        const list = statesTemp.filter(item => item.sigla === value)
        if (list.length > 0) {
            setIsDisabledCity(false)
            form.clearErrors('state')
            form.setFocus('state')
        }
    }


    /**
     * Cities
     */
    const [cities, setCities] = useState<City[]>([])
    const [citiesTemp, setCitiesTemp] = useState<City[]>([])
    const [isDisabledCity, setIsDisabledCity] = useState<boolean>(true)


    const findCities = async () => {
        try {
            const list = await getCities(form.getValues('state'))
            setCities(list)
            setCitiesTemp(list)
        } catch (error) {
            toast.danger({ message: 'Ocorreu um erro. Tente novamente mais tarde', duration: 3000 })
        }
    }

    useEffect(() => {
        if (!isDisabledCity)
            findCities()
    }, [isDisabledCity])

    const onChangeTextCity = (text: string) => {
        form.setValue('city', text)
        const list = citiesTemp.filter(item => filterBy(item, text, 'nome'))
        if (list.length > 0)
            setCitiesTemp(list)
        if (text === '')
            setCitiesTemp(cities)
    }

    const onSelectCity = (index: number) => {
        const list = citiesTemp.filter(item => filterBy(item, citiesTemp[index]?.nome, 'nome'))
        if (list.length > 0) {
            form.setValue('city', citiesTemp[index]?.nome)
            form.clearErrors('city')
            form.setFocus('city')
        }
    }

    const onSubmitEditingCity = (value?: string) => {
        const list = citiesTemp.filter(item => item.nome === value)
        if (list.length > 0) {
            form.clearErrors('city')
            form.setFocus('city')
        }
    }


    // Others

    const renderOption = (item: City, index: number) => (
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

    const clearInputs = (field?: string) => {
        switch (field) {
            case 'state':
                form.setValue('state', '')
                form.setValue('city', '')
                setStatesTemp([])
                setCitiesTemp([])
                setCities([])
                break
            case 'city':
                form.setValue('city', '')
                setCitiesTemp(cities)
                break
            default:
                form.setValue('state', '')
                form.setValue('city', '')
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

    return (
        <>
            <HeaderGenericWithTitleAndAddIcon title='Endereço Comercial' hideIcon={true} />
            <SafeAreaLayout level='1' style={styles.safeArea}>
                <View style={styles.box}>
                    
                    <Controller
                        control={form.control}
                        rules={{
                            required: {
                                value: false,
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
                                label="CEP"
                                onEndEditing={(props) => loadDataFromPostalCode(props.nativeEvent.text)}
                                style={styles.input}
                                keyboardType='number-pad'
                                testID={name}
                                onBlur={onBlur}
                                onChangeText={onChange}
                                value={value}
                                maxLength={8}
                                ref={ref}
                                returnKeyType="next"
                                onSubmitEditing={() => value ? loadDataFromPostalCode(value) : undefined}
                                underlineColorAndroid="transparent"
                                textContentType="postalCode"
                            />
                        )}
                        name='cep'
                        defaultValue=''
                    />
                    {form.formState.errors.cep && (<Text category='s2' style={styles.text}>{form.formState.errors.cep?.message}</Text>)}

                    <Controller
                        control={form.control}
                        rules={{
                            required: {
                                value: false,
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
                                label="Endereço"
                                style={styles?.input}
                                keyboardType='default'
                                testID={name}
                                onBlur={onBlur}
                                onChangeText={onChange}
                                value={value}
                                ref={ref}
                                returnKeyType="next"
                                underlineColorAndroid="transparent"
                                onSubmitEditing={() => form.setFocus('district')}
                                textContentType="fullStreetAddress"
                                editable={editable}
                            />
                        )}
                        name='street'
                        defaultValue=''
                    />
                    {form.formState.errors.street && (<Text category='s2' style={styles.text}>{form.formState.errors.street?.message}</Text>)}

                    <Controller
                        control={form.control}
                        rules={{
                            required: {
                                value: false,
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
                                label="Bairro"
                                style={styles?.input}
                                keyboardType='default'
                                testID={name}
                                onBlur={onBlur}
                                onChangeText={onChange}
                                value={value}
                                ref={ref}
                                returnKeyType="next"
                                underlineColorAndroid="transparent"
                                onSubmitEditing={() => form.setFocus('number')}
                                textContentType="streetAddressLine2"
                                editable={editable}
                            />
                        )}
                        name='district'
                        defaultValue=''
                    />
                    {form.formState.errors.district && (<Text category='s2' style={styles.text}>{form.formState.errors.district?.message}</Text>)}

                    <Controller
                        control={form.control}
                        rules={{
                            required: {
                                value: false,
                                message: 'Campo obrigatório'
                            },
                            minLength: {
                                value: 1,
                                message: `Mín. 1 caracteres`
                            },
                        }}
                        render={({ field: { onChange, onBlur, value, name, ref } }) => (
                            <Input
                                size='small'
                                label="Número"
                                style={styles.input}
                                keyboardType='number-pad'
                                testID={name}
                                onBlur={onBlur}
                                onChangeText={onChange}
                                value={value}
                                underlineColorAndroid="transparent"
                                autoCapitalize='none'
                                maxLength={10}
                                ref={ref}
                                returnKeyType="next"
                                onSubmitEditing={() => form.setFocus('complement')}
                                editable={editable}
                            />
                        )}
                        name='number'
                        defaultValue=''
                    />

                    <Controller
                        control={form.control}
                        rules={{
                            required: {
                                value: false,
                                message: 'Campo obrigatório'
                            },
                        }}
                        render={({ field: { onBlur, name, value, ref } }) => (
                            <AutoCompleteComponent
                                size='small'
                                testID={name}
                                data={statesTemp}
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
                                onSubmitEditing={() => onSubmitEditingState(value)}
                                onFocus={() => value === '' ? findPlaces() : undefined}
                                style={styles.input}
                                textContentType="addressState"
                                editable={editable}
                            />
                        )}
                        name='state'
                        defaultValue=''
                    />

                    <Controller
                        control={form.control}
                        rules={{
                            required: {
                                value: false,
                                message: 'Campo obrigatório'
                            },
                        }}
                        render={({ field: { onBlur, name, value, ref } }) => (
                            <AutoCompleteComponent
                                size='small'
                                testID={name}
                                data={citiesTemp}
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
                                onSubmitEditing={() => onSubmitEditingCity(value)}
                                onFocus={() => value === '' ? findCities() : undefined}
                                style={styles.input}
                                textContentType="addressCity"
                                editable={editable}
                            />
                        )}
                        name='city'
                        defaultValue=''
                    />

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
                                style={styles?.input}
                                keyboardType='default'
                                testID={name}
                                onBlur={onBlur}
                                onChangeText={onChange}
                                value={value}
                                ref={ref}
                                maxLength={180}
                                returnKeyType="send"
                                onSubmitEditing={form.handleSubmit(onSubmit)}
                                underlineColorAndroid="transparent"
                                editable={editable}
                            />
                        )}
                        name='complement'
                        defaultValue=''
                    />
                    <View style={styles.containerBtn}>
                        <Button
                            size='small'
                            status='primary'
                            appearance='ghost'
                            onPress={form.handleSubmit(onSubmit)}>
                            SALVAR
                        </Button>
                    </View>
                </View>
            </SafeAreaLayout>
        </>

    )
}

export default VisitAddressScreen