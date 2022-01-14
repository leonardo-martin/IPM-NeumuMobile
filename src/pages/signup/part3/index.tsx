import React, { FC, ReactElement, useEffect, useState } from 'react'
import { ScrollView, View } from 'react-native'
import { Input, Text, useStyleSheet, RadioGroup, Radio, Button, CheckBox, Spinner } from '@ui-kitten/components'
import { Controller, useForm } from 'react-hook-form'
import { useRoute } from '@react-navigation/core'
import { UserData } from '@models/User'
import { SafeAreaLayout } from '@components/safeAreaLayout'
import { registerStyle } from '../style'
import { PatientProfileCreatorTypeEnum } from '@models/PatientProfileCreator'
import { formatCpf, formatPhone, isEmailValid } from 'utils/mask'
import { validate } from 'gerador-validador-cpf'
import { getRelationPatient, getExamType } from '@utils/common'

const SignUpPart3Screen: FC = (): ReactElement => {

  const styles = useStyleSheet(registerStyle)
  const route = useRoute()
  const { params }: any = route
  const { control, handleSubmit, setValue, clearErrors, setFocus, formState: { errors } } = useForm<UserData>(params?.data)
  const [selectedIndexRelationPatient, setSelectedIndexRelationPatient] = useState(-1)
  const [patientProfileCreator, setPatientProfileCreator] = useState<number | PatientProfileCreatorTypeEnum | undefined>()

  const [selectedIndexExamType, setSelectedIndexExamType] = useState(-1)

  const [isLoading, setIsLoading] = useState(false)

  const submit = (data: UserData) => {
    setIsLoading(!isLoading)
    try {
      console.log(JSON.stringify(data))
    } catch (error) {
      console.error('erro no cadastro', error)
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

    setValue('creator.data.name', "")
    setValue('creator.data.patientProfileCreatorType.description', "")
    setValue('creator.data.cpf', "")
    setValue('creator.data.crm', "")
    setValue('creator.data.phone', "")
    setValue('creator.data.email', "")
    setValue('creator.data.others', "")
    setValue('creator.data.neuromuscular-specialist', "")
    setValue('creator.data.patient-relation', "")
    clearErrors('creator.data')

    if (id !== patientProfileCreator) {
      setSelectedIndexExamType(-1)
      setValue('creator.data.examType', "")
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
    setValue('mothersName', params?.data?.mothersName?.trim())
    setValue('name', params?.data?.name?.trim())
    setValue('cpf', params?.data?.cpf?.trim())
    setValue('email', params?.data?.email?.trim())

    setValue('city', params?.data?.city)
    setValue('state', params?.data?.state)
    setValue('phone', params?.data?.phone)
    setValue('phone2', params?.data?.phone2)

    setValue('username', params?.data?.username?.trim())
    setValue('password', params?.data?.password)
    setValue('cns', params?.data?.cns)

    setSelectedIndexExamType(-1)
    setSelectedIndexRelationPatient(-1)
    setPatientProfileCreator(undefined)
    setValue('creator.data.examType', '')
    setValue('creator.patientProfileCreatorTypeId', undefined)
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
            {errors.creator?.patientProfileCreatorTypeId && <Text category='s1' style={styles.text}>{errors.creator?.patientProfileCreatorTypeId?.message}</Text>}
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
                {errors.creator?.data?.examType && <Text category='s1' style={styles.text}>{errors.creator?.data?.examType.message}</Text>}
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
                {errors.creator?.data?.phone && <Text category='s1' style={styles.text}>{errors.creator?.data?.phone?.message}</Text>}
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
            {errors.acceptTerms && <Text category='s1' style={styles.text}>{errors.acceptTerms?.message}</Text>}
          </View>
          <View style={{ flex: 1, alignItems: 'center', paddingVertical: 25 }}>
            <View style={styles.viewConfirmBtn}>
              <Button
                accessoryLeft={isLoading ? LoadingIndicator : undefined}
                disabled={!checked}
                onPress={handleSubmit(submit)}
                style={styles.registerBtn}
                testID="RegisterButton"
                status="warning"
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