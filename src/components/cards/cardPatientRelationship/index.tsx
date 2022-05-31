import AttachmentBoxComponent from '@components/attachmentBox'
import CustomErrorMessage from '@components/error'
import SelectComponent, { SelectItemData } from '@components/select'
import { useDatepickerService } from '@hooks/useDatepickerService'
import { RelationshipPatient } from '@models/PatientProfileCreator'
import { PatientSignUpProps } from '@models/SignUpProps'
import { Datepicker, IndexPath, Input, PopoverPlacements } from '@ui-kitten/components'
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
    const sortedKinList: SelectItemData[] = kinList.sort((a, b) => sortByStringField(a, b, 'title'))
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
            <CustomErrorMessage name='creator.data.name' errors={form.formState.errors} />
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
                        onSubmitEditing={() => form.setFocus('creator.data.phone')}
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
            <CustomErrorMessage name='creator.data.phone' errors={form.formState.errors} />
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
            <CustomErrorMessage name='creator.data.phone2' errors={form.formState.errors} />
            {relationship === "Tutor Legal" && (
                <View style={{ paddingVertical: 10 }}>
                    <AttachmentBoxComponent
                        handleFile={setFileResponse}
                        file={fileResponse}
                        label='Anexar Documentação *' />
                    <CustomErrorMessage name='creator.data.guardian.attachment' errors={form.formState.errors} />
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
                    <CustomErrorMessage name='creator.data.kinship' errors={form.formState.errors} />
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
                    <CustomErrorMessage name='creator.data.specialty.crm' errors={form.formState.errors} />
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
                    <CustomErrorMessage name='creator.data.specialty.description' errors={form.formState.errors} />
                </>
            )}
        </>
    )
}

export default CardPatientRelationshipComponent