import AutoCompleteComponent from "@components/autoComplete"
import { API_IBGE_GOV, API_POSTAL_CODE_SEARCH } from "@constants/uri"
import { City, Country, UF } from "@models/Places"
import { UserDoctorData, UserPatientData } from "@models/User"
import { AutocompleteItem, Icon, IconProps, Input, Text } from "@ui-kitten/components"
import React, { Dispatch, FC, ReactElement, useEffect, useState } from "react"
import { Controller, UseFormReturn } from "react-hook-form"
import { StyleSheet } from "react-native"

const filter = (item: any, query: any) => item.sigla.toLowerCase().includes(query.toLowerCase())
const filterCity = (item: any, query: any) => item.nome.toLowerCase().includes(query.toLowerCase())
const filterCountry = (item: any, query: any) => item.nome.toLowerCase().includes(query.toLowerCase())

interface CardAddressProps {
    form: UseFormReturn<UserPatientData & UserDoctorData, any>
    styles?: StyleSheet.NamedStyles<any>
    handleFetchingData: Dispatch<React.SetStateAction<boolean>>
    isFetching?: boolean
    textFieldPrefix?: '' | 'creator.data.'
}

const CardAddressComponent: FC<CardAddressProps> = ({ form, styles,
    isFetching, handleFetchingData, textFieldPrefix = '' }): ReactElement => {

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
        form.setValue(`${textFieldPrefix}country` as const, text)
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
                form.resetField(`${textFieldPrefix}state` as const)
                form.resetField(`${textFieldPrefix}city` as const)
            }
            setCountry(countriesTemp[index]?.nome)
            form.setValue(`${textFieldPrefix}country` as const, countriesTemp[index]?.nome)
            if (countriesTemp[index]?.nome.toUpperCase().includes('BRA')) setIsDisabledState(false)
            form.clearErrors(`${textFieldPrefix}country` as const)
            form.setFocus(`${textFieldPrefix}state` as const)
        }
    }

    const onSubmitEditingCountry = (value?: string) => {
        const list = countriesTemp.filter(item => item.nome === value)
        if (list.length > 0) {
            if (value !== country) {
                form.resetField(`${textFieldPrefix}state` as const)
                form.resetField(`${textFieldPrefix}city` as const)
            }
            setIsDisabledState(false)
            form.clearErrors(`${textFieldPrefix}country` as const)
            form.setFocus(`${textFieldPrefix}state` as const)
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
        form.setValue(`${textFieldPrefix}state` as const, text)
        const list = statesTemp.filter(item => filter(item, text))
        if (list.length > 0)
            setStatesTemp(list)
        if (text === '')
            setStatesTemp(states)

    }

    const onSelectState = (index: number) => {
        const list = statesTemp.filter(item => filter(item, statesTemp[index]?.sigla))
        if (list.length > 0) {
            form.setValue(`${textFieldPrefix}state` as const, statesTemp[index]?.sigla)
            setIsDisabledCity(false)
            form.clearErrors(`${textFieldPrefix}state` as const)
            form.setFocus(`${textFieldPrefix}city` as const)
        }
    }

    const onSubmitEditingState = (value?: string) => {
        const list = statesTemp.filter(item => item.sigla === value)
        if (list.length > 0) {
            setIsDisabledCity(false)
            form.clearErrors(`${textFieldPrefix}state` as const)
            form.setFocus(`${textFieldPrefix}city` as const)
        }
    }

    /**
     * Cities
     */
    const [cities, setCities] = useState<City[]>([])
    const [citiesTemp, setCitiesTemp] = useState<City[]>([])
    const [isDisabledCity, setIsDisabledCity] = useState<boolean>(true)

    const findCities = async () => {
        const list: Array<City> = await fetch(`${API_IBGE_GOV}/localidades/estados/${form.getValues(`${textFieldPrefix}state` as const)}/municipios?orderBy=nome`, {
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
        form.setValue(`${textFieldPrefix}city` as const, text)
        const list = citiesTemp.filter(item => filterCity(item, text))
        if (list.length > 0)
            setCitiesTemp(list)
        if (text === '')
            setCitiesTemp(cities)
    }

    const onSelectCity = (index: number) => {
        const list = citiesTemp.filter(item => filterCity(item, citiesTemp[index]?.nome))
        if (list.length > 0) {
            form.setValue(`${textFieldPrefix}city` as const, citiesTemp[index]?.nome)
            form.clearErrors(`${textFieldPrefix}city` as const)
            form.setFocus(`${textFieldPrefix}phone` as const)
        }
    }

    const onSubmitEditingCity = (value?: string) => {
        const list = citiesTemp.filter(item => item.nome === value)
        if (list.length > 0) {
            form.clearErrors(`${textFieldPrefix}city` as const)
            form.setFocus(`${textFieldPrefix}phone` as const)
        }
    }

    const clearInputs = (field?: string) => {
        switch (field) {
            case `${textFieldPrefix}state` as const:
                form.resetField(`${textFieldPrefix}state` as const)
                setStatesTemp([])
                form.resetField(`${textFieldPrefix}city` as const)
                setCitiesTemp([])
                setCities([])
                break
            case `${textFieldPrefix}city` as const:
                form.resetField(`${textFieldPrefix}city` as const)
                setCitiesTemp(cities)
                break
            default:
                form.resetField(`${textFieldPrefix}country` as const)
                form.resetField(`${textFieldPrefix}city` as const)
                form.resetField(`${textFieldPrefix}state` as const)
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
        if ((op === `${textFieldPrefix}city` as const || op === `${textFieldPrefix}state` as const) && value)
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

    const loadDataFromPostalCode = async (value: string) => {
        handleFetchingData(true)
        const obj: any = await fetch(`${API_POSTAL_CODE_SEARCH.replace('$POSTAL_CODE', value)}`, {
            method: 'GET'
        }).then(async (response) => response && response.status === 200 ? await response.json() : null)

        form.resetField(`${textFieldPrefix}country` as const)
        form.resetField(`${textFieldPrefix}city` as const)
        form.resetField(`${textFieldPrefix}state` as const)
        form.resetField(`${textFieldPrefix}address1` as const)
        form.resetField(`${textFieldPrefix}address2` as const)
        form.resetField(`${textFieldPrefix}addressComplement` as const)
        form.resetField(`${textFieldPrefix}country` as const)

        setCountry(obj ? 'Brasil' : '')
        form.setValue(`${textFieldPrefix}city` as const, obj?.localidade)
        form.setValue(`${textFieldPrefix}address1` as const, obj?.logradouro)
        form.setValue(`${textFieldPrefix}address2` as const, obj?.bairro)
        form.setValue(`${textFieldPrefix}state` as const, obj?.uf)
        form.setValue(`${textFieldPrefix}addressComplement` as const, obj?.complemento)
        form.setValue(`${textFieldPrefix}country` as const, obj ? 'Brasil' : '')
        handleFetchingData(false)
    }

    return (
        <>
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
                        onEndEditing={(props) => loadDataFromPostalCode(props.nativeEvent.text)}
                        style={styles?.input}
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
                        editable={isFetching}
                        textContentType="postalCode"
                    />
                )}
                name={`${textFieldPrefix}postalCode` as const}
                defaultValue=''
            />
            {textFieldPrefix === 'creator.data.' ?
                form.formState.errors.creator?.data?.postalCode && (<Text category='s2' style={styles?.text}>{form.formState.errors.creator?.data?.postalCode?.message}</Text>) :
                textFieldPrefix === '' ?
                    form.formState.errors.postalCode && (<Text category='s2' style={styles?.text}>{form.formState.errors.postalCode?.message}</Text>)
                    : null
            }
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
                        style={styles?.input}
                        keyboardType='default'
                        testID={name}
                        onBlur={onBlur}
                        onChangeText={onChange}
                        value={value}
                        ref={ref}
                        returnKeyType="next"
                        underlineColorAndroid="transparent"
                        onSubmitEditing={() => form.setFocus(`${textFieldPrefix}address2` as const)}
                        editable={isFetching}
                        textContentType="streetAddressLine1"
                    />
                )}
                name={`${textFieldPrefix}address1` as const}
                defaultValue=''
            />
            {textFieldPrefix === 'creator.data.' ?
                form.formState.errors.creator?.data?.address1 && (<Text category='s2' style={styles?.text}>{form.formState.errors.creator?.data?.address1?.message}</Text>) :
                textFieldPrefix === '' ?
                    form.formState.errors.address1 && (<Text category='s2' style={styles?.text}>{form.formState.errors.address1?.message}</Text>)
                    : null
            }
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
                        style={styles?.input}
                        keyboardType='default'
                        testID={name}
                        onBlur={onBlur}
                        onChangeText={onChange}
                        value={value}
                        ref={ref}
                        maxLength={180}
                        returnKeyType="next"
                        underlineColorAndroid="transparent"
                        onSubmitEditing={() => form.setFocus(`${textFieldPrefix}addressComplement` as const)}
                        editable={isFetching}
                        textContentType="streetAddressLine2"
                    />
                )}
                name={`${textFieldPrefix}address2` as const}
                defaultValue=''
            />
            {textFieldPrefix === 'creator.data.' ?
                form.formState.errors.creator?.data?.address2 && (<Text category='s2' style={styles?.text}>{form.formState.errors.creator?.data?.address2?.message}</Text>) :
                textFieldPrefix === '' ?
                    form.formState.errors.address2 && (<Text category='s2' style={styles?.text}>{form.formState.errors.address2?.message}</Text>)
                    : null
            }
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
                        returnKeyType="next"
                        underlineColorAndroid="transparent"
                        onSubmitEditing={() => form.setFocus(`${textFieldPrefix}country` as const)}
                        editable={isFetching}
                    />
                )}
                name={`${textFieldPrefix}addressComplement` as const}
                defaultValue=''
            />
            {textFieldPrefix === 'creator.data.' ?
                form.formState.errors.creator?.data?.addressComplement && (<Text category='s2' style={styles?.text}>{form.formState.errors.creator?.data?.addressComplement?.message}</Text>) :
                textFieldPrefix === '' ?
                    form.formState.errors.addressComplement && (<Text category='s2' style={styles?.text}>{form.formState.errors.addressComplement?.message}</Text>)
                    : null
            }
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
                        editable={isFetching}
                    />
                )}
                name={`${textFieldPrefix}country` as const}
                defaultValue=''
            />
            {textFieldPrefix === 'creator.data.' ?
                form.formState.errors.creator?.data?.country && (<Text category='s2' style={styles?.text}>{form.formState.errors.creator?.data?.country?.message}</Text>) :
                textFieldPrefix === '' ?
                    form.formState.errors.country && (<Text category='s2' style={styles?.text}>{form.formState.errors.country?.message}</Text>)
                    : null
            }
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
                                accessoryRight={(props) => renderRightIcon(props, value, `${textFieldPrefix}state` as const)}
                                value={value}
                                autoCapitalize='characters'
                                maxLength={2}
                                ref={ref}
                                returnKeyType="next"
                                onSubmitEditing={() => onSubmitEditingState(value)}
                                editable={isFetching}
                                onFocus={() => value === '' ? findPlaces() : undefined}
                            />
                        )}
                        name={`${textFieldPrefix}state` as const}
                        defaultValue=''
                    />

                    {textFieldPrefix === 'creator.data.' ?
                        form.formState.errors.creator?.data?.state && (<Text category='s2' style={styles?.text}>{form.formState.errors.creator?.data?.state?.message}</Text>) :
                        textFieldPrefix === '' ?
                            form.formState.errors.state && (<Text category='s2' style={styles?.text}>{form.formState.errors.state?.message}</Text>)
                            : null
                    }
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
                                accessoryRight={(props) => renderRightIcon(props, value, `${textFieldPrefix}city` as const)}
                                value={value}
                                ref={ref}
                                returnKeyType="next"
                                autoCapitalize='words'
                                onSubmitEditing={() => onSubmitEditingCity(value)}
                                editable={isFetching}
                                onFocus={() => value === '' ? findCities() : undefined}
                            />
                        )}
                        name={`${textFieldPrefix}city` as const}
                        defaultValue=''
                    />
                    {textFieldPrefix === 'creator.data.' ?
                        form.formState.errors.creator?.data?.city && (<Text category='s2' style={styles?.text}>{form.formState.errors.creator?.data?.city?.message}</Text>) :
                        textFieldPrefix === '' ?
                            form.formState.errors.city && (<Text category='s2' style={styles?.text}>{form.formState.errors.city?.message}</Text>)
                            : null
                    }
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
                                style={styles?.input}
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
                                onSubmitEditing={() => form.setFocus(`${textFieldPrefix}city` as const)}
                                editable={isFetching}
                            />
                        )}
                        name={`${textFieldPrefix}state` as const}
                        defaultValue=''
                    />
                    {textFieldPrefix === 'creator.data.' ?
                        form.formState.errors.creator?.data?.state && (<Text category='s2' style={styles?.text}>{form.formState.errors.creator?.data?.state?.message}</Text>) :
                        textFieldPrefix === '' ?
                            form.formState.errors.state && (<Text category='s2' style={styles?.text}>{form.formState.errors.state?.message}</Text>)
                            : null
                    }
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
                                style={styles?.input}
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
                                editable={isFetching}
                            />
                        )}
                        name={`${textFieldPrefix}city` as const}
                        defaultValue=''
                    />
                    {textFieldPrefix === 'creator.data.' ?
                        form.formState.errors.creator?.data?.city && (<Text category='s2' style={styles?.text}>{form.formState.errors.creator?.data?.city?.message}</Text>) :
                        textFieldPrefix === '' ?
                            form.formState.errors.city && (<Text category='s2' style={styles?.text}>{form.formState.errors.city?.message}</Text>)
                            : null
                    }
                </>
            }
        </>

    )
}

export default CardAddressComponent