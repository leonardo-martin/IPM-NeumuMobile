import AttachmentBoxComponent from '@components/attachmentBox'
import CardAddressComponent from '@components/cards/cardAddress'
import SelectComponent, { SelectItemData } from '@components/select'
import { useDatepickerService } from '@hooks/useDatepickerService'
import { RelationshipPatient } from '@models/PatientProfileCreator'
import { PatientSignUpProps } from '@models/SignUpProps'
import { Datepicker, IndexPath, Input, PopoverPlacements, Text } from '@ui-kitten/components'
import { sortByStringField } from '@utils/common'
import { formatCpf, formatPhone, isEmailValid, onlyNumbers } from '@utils/mask'
import { validate } from 'gerador-validador-cpf'
import React, { FC, ReactElement, useEffect, useState } from 'react'
import { Controller } from 'react-hook-form'
import { StyleSheet, View } from 'react-native'
import { DocumentPickerResponse } from 'react-native-document-picker'
import { CalendarIcon } from './icons'

const kinList: SelectItemData[] = [
    { id: '0', title: 'Irmão / Irmã' },
    { id: '1', title: 'Pai' },
    { id: '2', title: 'Mãe' },
    { id: '3', title: 'Primo / Prima' },
    { id: '4', title: 'Tio / Tia' },
    { id: '5', title: 'Sobrinho / Sobrinha' },
    { id: '6', title: 'Filho / Filha' },
    { id: '7', title: 'Bisavô / Bisavó' },
    { id: '8', title: 'Outros' },
    { id: '9', title: 'Cônjuge' },
    { id: '9', title: 'Avô / Avó' },
]

interface CardPatientRelationshipProps extends PatientSignUpProps {
    relationship: RelationshipPatient,
    styles?: StyleSheet.NamedStyles<any>
}

const CardPatientRelationshipComponent: FC<CardPatientRelationshipProps> = ({ form, onSubmit, relationship, styles }): ReactElement => {

    const [selectedIndex, setSelectedIndex] = useState<IndexPath | IndexPath[] | undefined>()
    const { localeDateService } = useDatepickerService()
    const [sortedKinList, setSortedKinList] = useState<SelectItemData[]>(kinList.sort((a, b) => sortByStringField(a, b, 'title')))
    const [fileResponse, setFileResponse] = useState<DocumentPickerResponse[] | undefined>()
    const dateForOver = localeDateService.addYear(localeDateService.today(), -18)

    useEffect(() => {
        if (selectedIndex)
            form.setValue('creator.data.kinship', sortedKinList.find((_, i) => new IndexPath(i).row === (selectedIndex as IndexPath).row))
        else form.setValue('creator.data.kinship', '')
    }, [selectedIndex])

    useEffect(() => {
        if (fileResponse) {
            form.setValue('creator.data.guardian.attachment', fileResponse[0])
            form.clearErrors('creator.data.guardian.attachment')

        } else {
            form.setValue('creator.data.guardian.attachment', undefined)
        }
    }, [fileResponse])

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
            {form.formState.errors.creator?.data?.name && <Text category='s2' style={styles?.text}>{form.formState.errors.creator?.data?.name?.message}</Text>}
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
            {form.formState.errors.creator?.data?.cpf?.type === 'minLength' && <Text category='s2' style={[styles?.text, { paddingBottom: 10 }]}>{form.formState.errors.creator?.data?.cpf?.message}</Text>}
            {form.formState.errors.creator?.data?.cpf?.type === 'required' && <Text category='s2' style={[styles?.text, { paddingBottom: 10 }]}>{form.formState.errors.creator?.data?.cpf?.message}</Text>}
            {form.formState.errors.creator?.data?.cpf?.type === 'valid' && <Text category='s2' style={[styles?.text, { paddingBottom: 10 }]}>CPF inválido</Text>}
            {form.formState.errors.creator?.data?.cpf?.type === 'equal' && <Text category='s2' style={[styles?.text, { paddingBottom: 10 }]}>CPF não pode ser igual ao do paciente</Text>}
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
                        caption='* Necessário ser maior de 18 anos'
                    />
                )}
                name='creator.data.dateOfBirth'
            />
            {form.formState.errors.creator?.data?.dateOfBirth && <Text category='s2' style={[styles?.text, { paddingBottom: 10 }]}>{form.formState.errors.creator?.data?.dateOfBirth?.message}</Text>}
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
                        onSubmitEditing={() => form.setFocus('creator.data.phone')}
                        textContentType="emailAddress"
                    />
                )}
                name='creator.data.email'
                defaultValue=''
            />
            {form.formState.errors.creator?.data?.email?.type === 'minLength' && <Text category='s2' style={[styles?.text, { paddingBottom: 10 }]}>{form.formState.errors.creator?.data?.email?.message}</Text>}
            {form.formState.errors.creator?.data?.email?.type === 'required' && <Text category='s2' style={[styles?.text, { paddingBottom: 10 }]}>{form.formState.errors.creator?.data?.email?.message}</Text>}
            {form.formState.errors.creator?.data?.email?.type === 'valid' && <Text category='s2' style={[styles?.text, { paddingBottom: 10 }]}>E-mail inválido</Text>}
            {form.formState.errors.creator?.data?.email?.type === 'equal' && <Text category='s2' style={[styles?.text, { paddingBottom: 10 }]}>E-mail não pode ser igual ao do paciente</Text>}

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
                        style={styles?.input}
                        keyboardType='number-pad'
                        testID={name}
                        onBlur={onBlur}
                        onChangeText={onChange}
                        value={formatPhone(value)}
                        maxLength={15}
                        ref={ref}
                        returnKeyType="next"
                        onSubmitEditing={() => form.setFocus('creator.data.phone2')}
                        underlineColorAndroid="transparent"
                        textContentType="telephoneNumber"
                    />
                )}
                name='creator.data.phone'
                defaultValue=''
            />
            {form.formState.errors.creator?.data?.phone && <Text category='s2' style={styles?.text}>{form.formState.errors.creator?.data?.phone?.message}</Text>}
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
                        style={styles?.input}
                        keyboardType='number-pad'
                        testID={name}
                        onBlur={onBlur}
                        onChangeText={onChange}
                        value={formatPhone(value)}
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
            {form.formState.errors.creator?.data?.phone2 && <Text category='s2' style={styles?.text}>{form.formState.errors.creator?.data?.phone2?.message}</Text>}

            {relationship === "Tutor Legal" && (
                <View style={{ paddingVertical: 10 }}>
                    <AttachmentBoxComponent
                        handleFile={setFileResponse}
                        file={fileResponse}
                        label='Anexar Documentação *' />
                    {form.formState.errors.creator?.data?.guardian?.attachment && <Text category='s2' style={styles?.text}>{form.formState.errors.creator?.data?.guardian?.attachment?.message}</Text>}

                </View>
            )}

            {relationship === "Familiar" && (
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
                    {form.formState.errors.creator?.data?.kinship && <Text category='s2' style={[styles?.text, { paddingBottom: 10 }]}>{form.formState.errors.creator?.data?.kinship?.message}</Text>}
                </>
            )}

            {relationship === "Profissional de Saúde" && (
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
                                label="Conselho Regional de Medicina (CRM) *"
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
                    {form.formState.errors?.creator?.data?.specialty?.crm && <Text category='s2' style={styles?.text}>{form.formState.errors?.creator?.data?.specialty?.crm.message}</Text>}
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
                                label="Especialidade *"
                                style={styles?.input}
                                keyboardType='default'
                                placeholder=''
                                testID={name}
                                onBlur={onBlur}
                                onChangeText={onChange}
                                value={value}
                                ref={ref}
                                maxLength={50}
                                underlineColorAndroid="transparent"
                                onSubmitEditing={form.handleSubmit(onSubmit)}
                                autoCapitalize='words'
                                returnKeyType="send"
                            />
                        )}
                        name='creator.data.specialty.description'
                        defaultValue=''
                    />
                    {form.formState.errors?.creator?.data?.specialty?.description && <Text category='s2' style={styles?.text}>{form.formState.errors?.creator?.data?.specialty?.description.message}</Text>}
                </>
            )}
        </>
    )
}

export default CardPatientRelationshipComponent