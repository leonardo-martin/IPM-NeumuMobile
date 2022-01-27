import React, { FC, ReactElement, useEffect, useState } from 'react'
import { ScrollView, View } from 'react-native'
import { Input, Text, useStyleSheet, RadioGroup, Radio, Button, CheckBox, Spinner } from '@ui-kitten/components'
import { Controller, useForm } from 'react-hook-form'
import { useRoute } from '@react-navigation/core'
import { UserData } from '@models/User'
import { SafeAreaLayout } from '@components/safeAreaLayout'
import { registerStyle } from '../style'
import { PatientProfileCreatorTypeEnum } from '@models/PatientProfileCreator'
import { cleanNumberMask, formatCpf, formatPhone, isEmailValid } from 'utils/mask'
import { validate } from 'gerador-validador-cpf'
import { getRelationPatient, getExamType, extractFieldString } from '@utils/common'
import { createPatientProfileCreator, createUser } from '@services/user.service'
import { useNavigation } from '@react-navigation/native'
import toast from '@helpers/toast'

const SignUpPart3Screen: FC = (): ReactElement => {

  const styles = useStyleSheet(registerStyle)
  const route = useRoute()
  const { params }: any = route
  const { control, handleSubmit, setValue, clearErrors, setFocus, resetField, formState: { errors } } = useForm<UserData>({
    defaultValues: {
      ...params?.data
    }
  })

  const [selectedIndexRelationPatient, setSelectedIndexRelationPatient] = useState(-1)
  const [patientProfileCreator, setPatientProfileCreator] = useState<number | PatientProfileCreatorTypeEnum | undefined>()
  const [selectedIndexExamType, setSelectedIndexExamType] = useState<number>(-1)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const navigation = useNavigation<any>()

  const submit = async (data: UserData) => {
    setIsLoading(!isLoading)
    try {
      data.cpf = cleanNumberMask(data.cpf)
      data.phone = cleanNumberMask(data.phone)
      data.phone2 = cleanNumberMask(data.phone2)

      if (data.creator.data['cpf'])
        data.creator.data['cpf'] = cleanNumberMask(data.creator.data['cpf'])

      if (data.creator.data['phone'])
        data.creator.data['phone'] = cleanNumberMask(data.creator.data['phone'])

      const response = await createUser(data, 'patient')

      if (response.status !== 201) {
        const message = response.data?.message

        if (message.toUpperCase().includes('Unique constraint'.toUpperCase())) {
          const field = extractFieldString(message)
          toast.danger({ message: field + ' já cadastrado', duration: 1000 })
        } else
          toast.danger({ message: 'Ocorreu um erro. Tente novamente mais tarde.', duration: 1000 })

      } else {

        await createPatientProfileCreator(data.creator, Number(response.data.patientId))

        navigation.navigate('RegistrationConfirmation')
      }
    } catch (error) {
      toast.danger({ message: 'Ocorreu um erro inesperado', duration: 1000 })

    } finally {
      setIsLoading(false)
    }
  }

  const [indeterminate, setIndeterminate] = useState<boolean | undefined>(true)
  const [checked, setChecked] = useState<boolean | undefined>(false)
  const onIndeterminateChange = (isChecked: boolean, isIndeterminate: boolean | undefined) => {
    setIndeterminate(isIndeterminate)
    setValue('acceptTerms', isChecked)
    if (isChecked) {
      clearErrors('acceptTerms')
      setChecked(true)
    } else setChecked(false)
  }

  const handleRadioSelected = (index: number) => {
    setSelectedIndexRelationPatient(index)
    const id = getRelationPatient(index)

    resetField('creator.data')
    clearErrors('creator.data')

    if (id !== patientProfileCreator) {
      setSelectedIndexExamType(-1)
    }
    setPatientProfileCreator(id)
    setValue("creator.patientProfileCreatorTypeId", id as PatientProfileCreatorTypeEnum)
    clearErrors("creator.patientProfileCreatorTypeId")

  }

  const handleRadioSelectedExamType = (index: number) => {
    setSelectedIndexExamType(index)
    setValue('creator.data.examType', getExamType(index))
    clearErrors('creator.data.examType')
  }

  useEffect(() => {
    setSelectedIndexExamType(-1)
    setSelectedIndexRelationPatient(-1)
    setPatientProfileCreator(undefined)
    resetField('creator.data.examType')
    resetField('creator.patientProfileCreatorTypeId')
    onIndeterminateChange(false, true)
  }, [])

  const LoadingIndicator = () => (
    <Spinner size='small' status='basic' />
  )

  return (
    <>
      <SafeAreaLayout style={styles.safeArea} level='1'>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          <View style={styles.viewLabel}>
            <Text category='label' status='primary' style={styles.labelTitle}>Para o melhor atendimento, o cadastro está sendo realizado por quem: *</Text>
          </View>
          <View style={styles.radioGroup}>
            <Controller
              control={control}
              rules={{
                required: {
                  value: true,
                  message: 'Campo obrigatório'
                },
              }}
              render={({ field: { onBlur, name, ref } }) => (
                <RadioGroup
                  ref={ref}
                  testID={name}
                  selectedIndex={selectedIndexRelationPatient}
                  onChange={handleRadioSelected}>
                  <Radio onBlur={onBlur}>{evaProps => <Text {...evaProps} category='label' style={styles.radioText}>Paciente</Text>}</Radio>
                  <Radio onBlur={onBlur}>{evaProps => <Text {...evaProps} category='label' style={styles.radioText}>Conhecido</Text>}</Radio>
                  <Radio onBlur={onBlur}>{evaProps => <Text {...evaProps} category='label' style={styles.radioText}>Médico Responsável</Text>}</Radio>
                  <Radio onBlur={onBlur}>{evaProps => <Text {...evaProps} category='label' style={styles.radioText}>Terapeuta Responsável</Text>}</Radio>
                  <Radio onBlur={onBlur}>{evaProps => <Text {...evaProps} category='label' style={styles.radioText}>Outro</Text>}</Radio>
                </RadioGroup>
              )}
              name='creator.patientProfileCreatorTypeId'
            />
            {errors.creator?.patientProfileCreatorTypeId && <Text category='s2' style={styles.text}>{errors.creator?.patientProfileCreatorTypeId?.message}</Text>}
          </View>
          {patientProfileCreator === PatientProfileCreatorTypeEnum.PatientSelf ?
            <>
              <View style={styles.viewLabel}>
                <Text category='label' status='primary' style={styles.labelTitle}>Tipo de Exame *</Text>
              </View>
              <View style={styles.radioGroup}>
                <Controller
                  control={control}
                  rules={{
                    required: {
                      value: true,
                      message: 'Campo obrigatório'
                    },
                  }}
                  render={({ field: { onBlur, name, ref } }) => (
                    <RadioGroup
                      testID={name}
                      ref={ref}
                      selectedIndex={selectedIndexExamType}
                      onChange={handleRadioSelectedExamType}>
                      <Radio onBlur={onBlur}>{evaProps => <Text {...evaProps} category='label' style={styles.radioText}>Exame Clínico</Text>}</Radio>
                      <Radio onBlur={onBlur}>{evaProps => <Text {...evaProps} category='label' style={styles.radioText}>Exame Genético</Text>}</Radio>
                    </RadioGroup>
                  )}
                  name='creator.data.examType'
                />
                {errors.creator?.data?.examType && <Text category='s2' style={styles.text}>{errors.creator?.data?.examType.message}</Text>}
              </View>
            </>
            :
            null
          }
          {patientProfileCreator !== undefined && patientProfileCreator !== PatientProfileCreatorTypeEnum.PatientSelf
            && patientProfileCreator !== PatientProfileCreatorTypeEnum.Other ?
            <>
              <View style={styles.boxMultiplesInputs}>
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
                    maxLength: {
                      value: 60,
                      message: `Max. 60 caracteres`
                    },
                  }}
                  render={({ field: { onChange, onBlur, value, name, ref } }) => (
                    <Input
                      size='small'
                      label="Nome Completo *"
                      style={styles.input}
                      keyboardType='default'
                      testID={name}
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                      ref={ref}
                      returnKeyType="next"
                      onSubmitEditing={() => setFocus('creator.data.cpf')}
                      underlineColorAndroid="transparent"
                      autoCapitalize="words"
                    />
                  )}
                  name='creator.data.name'
                  defaultValue=''
                />
                {errors.creator?.data?.name && <Text category='s2' style={[styles.text, { paddingBottom: 10 }]}>{errors.creator?.data?.name.message}</Text>}
                <Controller
                  control={control}
                  rules={{
                    required: {
                      value: true,
                      message: 'Campo obrigatório'
                    },
                    minLength: {
                      value: 14,
                      message: `Mín. 14 caracteres`
                    },
                    maxLength: {
                      value: 14,
                      message: `Max. 14 caracteres`
                    },
                    validate: (e) => validate(e)
                  }}
                  render={({ field: { onChange, onBlur, value, name, ref } }) => (
                    <Input
                      size='small'
                      label="CPF *"
                      style={styles.input}
                      keyboardType='number-pad'
                      testID={name}
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={formatCpf(value)}
                      underlineColorAndroid="transparent"
                      autoCapitalize='none'
                      maxLength={14}
                      ref={ref}
                      returnKeyType="next"
                      onSubmitEditing={() => setFocus('creator.data.email')}
                      placeholder={'999.999.999-99'}
                    />
                  )}
                  name='creator.data.cpf'
                  defaultValue=''
                />
                {errors.creator?.data?.cpf?.type === 'minLength' && <Text category='s2' style={[styles.text, { paddingBottom: 10 }]}>{errors.creator?.data?.cpf?.message}</Text>}
                {errors.creator?.data?.cpf?.type === 'required' && <Text category='s2' style={[styles.text, { paddingBottom: 10 }]}>{errors.creator?.data?.cpf?.message}</Text>}
                {errors.creator?.data?.cpf?.type === 'validate' && <Text category='s2' style={[styles.text, { paddingBottom: 10 }]}>CPF inválido</Text>}
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
                    maxLength: {
                      value: 60,
                      message: `Max. 60 caracteres`
                    },
                    validate: (e) => isEmailValid(e)
                  }}
                  render={({ field: { onChange, onBlur, value, name, ref } }) => (
                    <Input
                      size='small'
                      label="E-mail *"
                      style={styles.input}
                      keyboardType='email-address'
                      testID={name}
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value ? value.replace(/[^0-9A-Za-z]*/, "") : value}
                      underlineColorAndroid="transparent"
                      autoCapitalize='none'
                      maxLength={60}
                      ref={ref}
                      returnKeyType="next"
                      onSubmitEditing={() => setFocus('creator.data.phone')}
                      placeholder={'example@example.com'}
                    />
                  )}
                  name='creator.data.email'
                  defaultValue=''
                />
                {errors.creator?.data?.email?.type === 'minLength' && <Text category='s2' style={[styles.text, { paddingBottom: 10 }]}>{errors.creator?.data?.email?.message}</Text>}
                {errors.creator?.data?.email?.type === 'required' && <Text category='s2' style={[styles.text, { paddingBottom: 10 }]}>{errors.creator?.data?.email?.message}</Text>}
                {errors.creator?.data?.email?.type === 'validate' && <Text category='s2' style={[styles.text, { paddingBottom: 10 }]}>E-mail inválido</Text>}
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
                    maxLength: {
                      value: 15,
                      message: `Max. 15 caracteres`
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
                      onSubmitEditing={() => setFocus('creator.data.patient-relation')}
                      underlineColorAndroid="transparent"
                    />
                  )}
                  name='creator.data.phone'
                  defaultValue=''
                />
                {errors.creator?.data?.phone && <Text category='s2' style={styles.text}>{errors.creator?.data?.phone?.message}</Text>}
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
                    maxLength: {
                      value: 30,
                      message: `Max. 30 caracteres`
                    },
                  }}
                  render={({ field: { onChange, onBlur, value, name, ref } }) => (
                    <Input
                      size='small'
                      label="Qual a sua relação com o paciente? *"
                      style={styles.input}
                      keyboardType='default'
                      testID={name}
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                      underlineColorAndroid="transparent"
                      ref={ref}
                      onSubmitEditing={handleSubmit(submit)}
                      returnKeyType="send"
                    />
                  )}
                  name='creator.data.patient-relation'
                  defaultValue=''
                />
                {errors.creator?.data && errors.creator?.data['patient-relation'] && <Text category='s2' style={[styles.text, { paddingBottom: 10 }]}>{errors.creator?.data['patient-relation']?.message}</Text>}
              </View>
            </>
            :
            patientProfileCreator === PatientProfileCreatorTypeEnum.Other ?
              <>
                <View style={styles.boxMultiplesInputs}>
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
                      maxLength: {
                        value: 40,
                        message: `Max. 40 caracteres`
                      },
                    }}
                    render={({ field: { onChange, onBlur, value, name, ref } }) => (
                      <Input
                        size='small'
                        style={styles.input}
                        keyboardType='default'
                        testID={name}
                        onBlur={onBlur}
                        onChangeText={onChange}
                        value={value}
                        underlineColorAndroid="transparent"
                        ref={ref}
                        onSubmitEditing={handleSubmit(submit)}
                        returnKeyType="send"
                      />
                    )}
                    name='creator.data.patientProfileCreatorType.description'
                    defaultValue=''
                  />
                  {errors.creator?.data && errors.creator?.data['patientProfileCreatorType']?.description && <Text category='s2' status='danger' style={[styles.text, { paddingBottom: 10 }]}>{errors.creator?.data['patientProfileCreatorType']?.description?.message}</Text>}
                </View>
              </>
              : null
          }
          <View style={styles.viewCheckbox}>
            <Controller
              control={control}
              rules={{
                required: {
                  value: true,
                  message: 'Campo obrigatório'
                },
              }}
              render={({ field: { onBlur, name, value, ref } }) => (
                <CheckBox
                  ref={ref}
                  onBlur={onBlur}
                  testID={name}
                  style={styles.checkbox}
                  checked={value}
                  indeterminate={indeterminate}
                  onChange={onIndeterminateChange}>
                  Li e aceito os Termos e Condições de Uso.
                </CheckBox>
              )}
              name='acceptTerms'
            />
            {errors.acceptTerms && <Text category='s2' style={styles.text}>{errors.acceptTerms?.message}</Text>}
          </View>
          <View style={{ flex: 1, alignItems: 'center', paddingVertical: 25 }}>
            <View style={styles.viewConfirmBtn}>
              <Button
                accessoryLeft={isLoading ? LoadingIndicator : undefined}
                disabled={!checked || isLoading}
                onPress={!isLoading ? handleSubmit(submit) : undefined}
                style={styles.registerBtn}
                testID="RegisterButton"
                status='warning'
              >
                CADASTRAR
              </Button>
            </View>
          </View>
        </ScrollView>
      </SafeAreaLayout>
    </>
  )
}

export default SignUpPart3Screen