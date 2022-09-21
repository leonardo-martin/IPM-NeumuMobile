import CustomErrorMessage from '@components/error'
import SelectComponent, { SelectItemData } from '@components/select'
import { useAppDispatch, useAppSelector } from '@hooks/redux'
import { useDatepickerService } from '@hooks/useDatepickerService'
import { PatientSignUpProps } from '@models/SignUpProps'
import { SpecialtiesDTO } from '@models/Specialties'
import Clipboard from '@react-native-clipboard/clipboard'
import { useFocusEffect } from '@react-navigation/native'
import { getSpecialties } from '@services/specialties.service'
import { setSpecialties } from '@store/ducks/common'
import { Datepicker, IndexPath, Input, PopoverPlacements, Select, SelectItem } from '@ui-kitten/components'
import { sortByStringField } from '@utils/common'
import { formatCpf, formatPhone, formatRNM, isEmailValid, onlyNumbers } from '@utils/mask'
import { validate } from 'gerador-validador-cpf'
import { ETypeOfDocument } from 'models/User'
import React, { Dispatch, FC, ReactElement, useCallback, useEffect, useState } from 'react'
import { Controller } from 'react-hook-form'
import { Keyboard, StyleSheet } from 'react-native'
import { DocumentPickerResponse } from 'react-native-document-picker'
import { RootState } from 'store'
import { typeOfPersonalDocuments } from 'utils/constants'
import { kinList } from './data'
import { CalendarIcon } from './icons'

interface CardPatientRelationshipProps extends PatientSignUpProps {
    styles?: StyleSheet.NamedStyles<any>
    file: DocumentPickerResponse[] | undefined
    setFile: Dispatch<React.SetStateAction<DocumentPickerResponse[] | undefined>>
}

const CardPatientRelationshipComponent: FC<CardPatientRelationshipProps> = ({ form, onSubmit, styles, ...props }): ReactElement => {

    const [selectedSpecialty, setSelectedSpecialty] = useState<IndexPath | IndexPath[]>()
    const [selectedIndex, setSelectedIndex] = useState<IndexPath | IndexPath[] | undefined>()
    const { localeDateService } = useDatepickerService()
    const sortedKinList: SelectItemData[] = kinList.sort((a, b) => sortByStringField(a, b, 'title'))
    const dateForOver = localeDateService.addYear(localeDateService.today(), -18)
    const [selectedTypeOfDocument, setSelectedTypeOfDocument] = useState<IndexPath | IndexPath[]>()

    const emailConfirm = form.watch("creator.data.email")
    const relationship = form.watch("creator.data.creatorRelationship")
    const typeOfDocument = form.watch("creator.data.typeOfDocument")

    useEffect(() => {
        if (selectedIndex)
            form.setValue('creator.data.kinship', sortedKinList.find((_, i) => new IndexPath(i).row === (selectedIndex as IndexPath).row))
        else form.setValue('creator.data.kinship', '')
    }, [selectedIndex])

    const verifyCpf = (value: string) => {
        if (value === form.getValues('cpf')) {
            return false
        } else {
            return true
        }
    }

    const verifyEmail = (value: string) => {
        if (value === form.getValues('email')) {
            return false
        } else {
            return true
        }
    }

    // useFocusEffect(
    //     useCallback(() => {
    //         if (relationship === 3)
    //             form.register('creator.data.guardian.attachment', {
    //                 required: {
    //                     value: true,
    //                     message: 'Necessário documentação'
    //                 },
    //                 value: undefined
    //             })

    //         return () => {
    //             form.unregister('creator.data.guardian.attachment')
    //         }

    //     }, [relationship])
    // )

    const dispatch = useAppDispatch()
    const { specialties } = useAppSelector((state: RootState) => state.common)

    const loadSpecialties = async () => {
        if (specialties.length === 0) {
            const res = await getSpecialties()
            dispatch(setSpecialties(res.data))
        }
    }

    useFocusEffect(
        useCallback(() => {
            loadSpecialties()
        }, [])
    )

    useFocusEffect(
        useCallback(() => {
            const specialty = form.getValues('creator.data.specialty.description')
            if (specialty)
                setSelectedSpecialty(new IndexPath(specialties.indexOf(specialties.find(e => e.description === specialty) || {} as SpecialtiesDTO)))
            const doc = form.getValues('creator.data.typeOfDocument')
            if (doc)
                setSelectedTypeOfDocument(new IndexPath(typeOfPersonalDocuments.indexOf(typeOfPersonalDocuments.find(e => e.label === doc) || {} as { value: number; label: string; })))

        }, [])
    )

    useEffect(() => {
        if (selectedSpecialty) {
            form.setValue('creator.data.specialty.description', specialties[Number(selectedSpecialty) - 1].description || '')
            form.clearErrors('creator.data.specialty.description')
        } else form.setValue('creator.data.specialty.description', '')
    }, [selectedSpecialty])

    useEffect(() => {
        if (selectedTypeOfDocument && typeOfPersonalDocuments) {
            const type = typeOfPersonalDocuments[Number(selectedTypeOfDocument) - 1]
            if (type && type.label !== form.getValues('creator.data.typeOfDocument')) {
                form.setValue('creator.data.cpf', undefined)
                form.setValue('creator.data.rne', undefined)
                form.setValue('creator.data.typeOfDocument', type.label)
            }
        }
    }, [selectedTypeOfDocument, typeOfPersonalDocuments])

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
                        label="Nome Completo *"
                        style={styles?.input}
                        keyboardType='default'
                        testID={name}
                        onBlur={onBlur}
                        onChangeText={onChange}
                        value={value}
                        ref={ref}
                        maxLength={60}
                        returnKeyType="next"
                        onSubmitEditing={() => form.setFocus('creator.data.mothersName')}
                        underlineColorAndroid="transparent"
                        autoCapitalize="words"
                        textContentType="name"
                    />
                )}
                name='creator.data.name'
                defaultValue=''
            />
            <CustomErrorMessage name='creator.data.name' errors={form.formState.errors} />

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
                        style={styles?.input}
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
                name='creator.data.typeOfDocument'
                defaultValue=''
            />
            <CustomErrorMessage name='creator.data.typeOfDocument' errors={form.formState.errors} />

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
                                equal: (e) => e ? verifyCpf(e) : undefined
                            }
                        }}
                        render={({ field: { onChange, onBlur, value, name, ref } }) => (
                            <Input
                                size='small'
                                label="CPF *"
                                style={styles?.input}
                                keyboardType='number-pad'
                                testID={name}
                                onBlur={onBlur}
                                onChangeText={(value) => {
                                    onChange(value)
                                    verifyCpf(value)
                                }}
                                value={formatCpf(value)}
                                underlineColorAndroid="transparent"
                                autoCapitalize='none'
                                maxLength={14}
                                ref={ref}
                                returnKeyType="next"
                                onSubmitEditing={() => form.setFocus('creator.data.dateOfBirth')}
                            />
                        )}
                        name='creator.data.cpf'
                        defaultValue=''
                    />
                    {(form.formState.errors.creator?.data?.cpf?.type !== 'valid' && form.formState.errors.creator?.data?.cpf?.type !== 'equal') && <CustomErrorMessage name='creator.data.cpf' errors={form.formState.errors} />}
                    {(form.formState.errors.creator?.data?.cpf?.type === 'valid') && <CustomErrorMessage name='creator.data.cpf' errors={form.formState.errors} customMessage='CPF inválido' />}
                    {(form.formState.errors.creator?.data?.cpf?.type === 'equal') && <CustomErrorMessage name='creator.data.cpf' errors={form.formState.errors} customMessage='CPF não pode ser igual ao do paciente' />}

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
                            minLength: {
                                value: 9,
                                message: `Mín. 9 caracteres`
                            },
                        }}
                        render={({ field: { onChange, onBlur, value, name, ref } }) => (
                            <Input
                                size='small'
                                label="RNM *"
                                placeholder='A123456-7'
                                style={styles?.input}
                                keyboardType='default'
                                testID={name}
                                onBlur={onBlur}
                                onChangeText={onChange}
                                value={formatRNM(value)}
                                underlineColorAndroid="transparent"
                                autoCapitalize='words'
                                ref={ref}
                                maxLength={9}
                                returnKeyType="next"
                                onSubmitEditing={() => form.setFocus('creator.data.dateOfBirth')}
                            />
                        )}
                        name='creator.data.rne'
                        defaultValue=''
                    />
                    <CustomErrorMessage name='creator.data.rne' errors={form.formState.errors} />
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
                        date={value ? value : dateForOver}
                        onSelect={onChange}
                        accessoryRight={CalendarIcon}
                        onBlur={onBlur}
                        ref={ref}
                        testID={name}
                        dateService={localeDateService}
                        max={dateForOver}
                        placement={PopoverPlacements.BOTTOM}
                        min={new Date(1900, 0, 0)}
                        backdropStyle={styles?.backdropDatepicker}
                        boundingMonth={false}
                        style={styles?.input}
                        onPress={() => Keyboard.dismiss()}
                        caption='* Necessário ser maior de 18 anos'
                    />
                )}
                name='creator.data.dateOfBirth'
            />
            <CustomErrorMessage name='creator.data.dateOfBirth' errors={form.formState.errors} />
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
                        equal: (e) => e ? verifyEmail(e) : undefined
                    }
                }}
                render={({ field: { onChange, onBlur, value, name, ref } }) => (
                    <Input
                        size='small'
                        label='E-mail *'
                        style={styles?.input}
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
                        onSubmitEditing={() => form.setFocus('creator.data.emailConfirmation')}
                        textContentType="emailAddress"
                    />
                )}
                name='creator.data.email'
                defaultValue=''
            />
            {(form.formState.errors.creator?.data?.email?.type !== 'valid' && form.formState.errors.creator?.data?.email?.type !== 'equal') && <CustomErrorMessage name='creator.data.email' errors={form.formState.errors} />}
            {(form.formState.errors.creator?.data?.email?.type === 'valid') && <CustomErrorMessage name='creator.data.email' errors={form.formState.errors} customMessage='E-mail inválido' />}
            {(form.formState.errors.creator?.data?.email?.type === 'equal') && <CustomErrorMessage name='creator.data.email' errors={form.formState.errors} customMessage='E-mail não pode ser igual ao do paciente' />}
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
                        style={styles?.input}
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
                        onSubmitEditing={() => form.setFocus('creator.data.phone')}
                        textContentType="emailAddress"
                    />
                )}
                name='creator.data.emailConfirmation'
                defaultValue=''
            />
            {form.formState.errors.creator?.data?.emailConfirmation?.type !== 'valid' && form.formState.errors.creator?.data?.emailConfirmation?.type !== 'equal' && <CustomErrorMessage name='creator.data.emailConfirmation' errors={form.formState.errors} />}
            {form.formState.errors.creator?.data?.emailConfirmation?.type === 'valid' && <CustomErrorMessage name='creator.data.emailConfirmation' errors={form.formState.errors} customMessage={'E-mail inválido'} />}
            {form.formState.errors.creator?.data?.emailConfirmation?.type === 'equal' && <CustomErrorMessage name='creator.data.emailConfirmation' errors={form.formState.errors} customMessage={'E-mails não conferem'} />}
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
                        style={styles?.input}
                        keyboardType='number-pad'
                        testID={name}
                        onBlur={onBlur}
                        onChangeText={onChange}
                        value={value}
                        maxLength={15}
                        ref={ref}
                        returnKeyType="done"
                        onSubmitEditing={() => form.setFocus('creator.data.phone2')}
                        underlineColorAndroid="transparent"
                        textContentType="telephoneNumber"
                    />
                )}
                name='creator.data.phone'
                defaultValue=''
            />
            <CustomErrorMessage name='creator.data.phone' errors={form.formState.errors} />
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
                        style={styles?.input}
                        keyboardType='number-pad'
                        testID={name}
                        onBlur={onBlur}
                        onChangeText={onChange}
                        value={value}
                        maxLength={15}
                        ref={ref}
                        returnKeyType="send"
                        onSubmitEditing={() => form.setFocus('creator.data.company')}
                        underlineColorAndroid="transparent"
                        textContentType="telephoneNumber"
                    />
                )}
                name='creator.data.phone2'
                defaultValue=''
            />
            <CustomErrorMessage name='creator.data.phone2' errors={form.formState.errors} />
            {/* {relationship === 3 && (
                <View style={{ paddingVertical: 10 }}>
                    <AttachmentBoxComponent
                        handleFile={props.setFile}
                        file={props.file}
                        label='Anexar Documentação *' />
                    <CustomErrorMessage name='creator.data.guardian.attachment' errors={form.formState.errors} />
                </View>
            )} */}

            {relationship === 2 && (
                <>
                    <Controller
                        control={form.control}
                        rules={{
                            required: {
                                value: true,
                                message: 'Campo obrigatório'
                            }
                        }}
                        render={({ field: { name, ref, value, onChange } }) => (
                            <SelectComponent
                                placeholder='Selecione'
                                size='small'
                                testID={name}
                                value={value}
                                ref={ref}
                                label='Grau de parentesco *'
                                selectedIndex={selectedIndex}
                                onSelect={(index: IndexPath | IndexPath[]) => {
                                    onChange(index)
                                    setSelectedIndex(index)
                                }}
                                clearSelected={setSelectedIndex}
                                items={sortedKinList}
                                style={styles?.input}
                            />
                        )}
                        name='creator.data.kinship'
                    />
                    <CustomErrorMessage name='creator.data.kinship' errors={form.formState.errors} />
                </>
            )}

            {relationship === 4 && (
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
                                label="Número de Registro *"
                                style={styles?.input}
                                keyboardType='number-pad'
                                placeholder=''
                                testID={name}
                                onBlur={onBlur}
                                onChangeText={onChange}
                                value={value ? onlyNumbers(value) : value}
                                ref={ref}
                                maxLength={6}
                                underlineColorAndroid="transparent"
                                onSubmitEditing={() => form.setFocus('creator.data.specialty.description')}
                            />
                        )}
                        name='creator.data.specialty.crm'
                        defaultValue=''
                    />
                    <CustomErrorMessage name='creator.data.specialty.crm' errors={form.formState.errors} />
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
                                label="Especialidade *"
                                style={styles?.input}
                                placeholder='Selecione'
                                testID={name}
                                onBlur={onBlur}
                                ref={ref}
                                selectedIndex={selectedSpecialty}
                                onSelect={setSelectedSpecialty}
                                value={value}
                            >
                                {specialties.map((item, index) => (
                                    <SelectItem key={item.id} title={item.description} />
                                ))}
                            </Select>
                        )}
                        name='creator.data.specialty.description'
                        defaultValue=''
                    />
                    <CustomErrorMessage name='creator.data.specialty.description' errors={form.formState.errors} />
                </>
            )}
        </>
    )
}

export default CardPatientRelationshipComponent