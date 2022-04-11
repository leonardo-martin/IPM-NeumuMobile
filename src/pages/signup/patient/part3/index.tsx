import React, { FC, ReactElement, useCallback, useEffect, useState } from 'react'
import { View } from 'react-native'
import { Input, Text, useStyleSheet, RadioGroup, Radio } from '@ui-kitten/components'
import { Controller } from 'react-hook-form'
import { registerStyle } from '@pages/signup/style'
import { PatientProfileCreatorTypeEnum } from '@models/PatientProfileCreator'
import { onlyNumbers } from '@utils/mask'
import { getRelationPatient, getRelationPastExams } from '@utils/common'
import { useFocusEffect } from '@react-navigation/native'
import { PatientSignUpProps } from '@models/SignUpProps'

const options = ['Paciente', 'Outro']

const items = [
  'Confirmado DFEU 1',
  'Confirmado DFEU 2',
  'Não Confirmado DFEU',
  'Resultado Pendente',
  'Não Testado'
]

const PatientSignUpPart3Screen: FC<PatientSignUpProps> = ({ form, onSubmit }): ReactElement => {

  const styles = useStyleSheet(registerStyle)

  const [selectedIndexRelationPatient, setSelectedIndexRelationPatient] = useState(-1)
  const [patientProfileCreator, setPatientProfileCreator] = useState<number | PatientProfileCreatorTypeEnum | undefined>()
  const [selectedIndexExamDNA, setSelectedIndexExamDNA] = useState(-1)
  const [selectedIndexGeneticProgram, setSelectedIndexGeneticProgram] = useState<number>(-1)
  const [showFields, setShowFields] = useState<boolean>(false)

  useFocusEffect(
    useCallback(() => {
      const opRelation = form.getValues('creator.patientProfileCreatorTypeId')
      if (opRelation) {
        const relation = getRelationPatient(Number(opRelation) - 1)
        setSelectedIndexRelationPatient(Number(opRelation) - 1)
        relation ? setPatientProfileCreator(relation as PatientProfileCreatorTypeEnum) : null
      }
      const op = form.getValues('abrafeuRegistrationOptIn')
      if (op) setShowFields(op === 'true'), setSelectedIndexGeneticProgram(op === 'true' ? 0 : 1)

      const exam = form.getValues('pastExams.exam')
      if (exam) setSelectedIndexExamDNA(items.findIndex(e => e === exam))
    }, [])
  )

  const handleRadioSelected = (index: number) => {
    if (index !== selectedIndexRelationPatient) {
      setSelectedIndexGeneticProgram(-1)
      form.resetField('abrafeuRegistrationOptIn')
      form.resetField('pastExams.doctor.crm')
      form.resetField('pastExams.exam')
      setSelectedIndexExamDNA(-1)
      setShowFields(false)
    }
    setSelectedIndexRelationPatient(index)
    const id = getRelationPatient(index)
    id ? setPatientProfileCreator(id as PatientProfileCreatorTypeEnum) : null
    form.setValue("creator.patientProfileCreatorTypeId", id as PatientProfileCreatorTypeEnum)
    form.clearErrors("creator.patientProfileCreatorTypeId")

  }

  useEffect(() => {
    (selectedIndexGeneticProgram === 0) ? form.setValue('creator.data.examType', 'genetic')
      : (selectedIndexGeneticProgram === 1) ? form.setValue('creator.data.examType', 'clinical')
        : form.resetField('creator.data.examType')
  }, [selectedIndexGeneticProgram])

  const handleRadioSelectedGeneticProgram = (index: number) => {
    setSelectedIndexGeneticProgram(index)

    form.setValue('abrafeuRegistrationOptIn', (index === 1) ? 'false' : 'true')
    form.clearErrors('abrafeuRegistrationOptIn')
    if (index === 1)  setShowFields(false)
    else setShowFields(true)


    setSelectedIndexExamDNA(-1)
    form.resetField('pastExams.doctor.crm')
    form.resetField('pastExams.exam')
  }

  const handleRadioSelectedExamDNA = (index: number) => {
    setSelectedIndexExamDNA(index)
    const exam = getRelationPastExams(index)
    exam ? form.setValue('pastExams.exam', exam) : null
  }

  return (
    <>
      <View style={styles.viewLabel}>
        <Text category='label' status='primary' style={styles.labelTitle}>Para o melhor atendimento, o cadastro está sendo realizado por quem: *</Text>
      </View>
      <View style={styles.radioGroup}>
        <Controller
          control={form.control}
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
              {options.map((_, i) => {
                return (
                  <Radio key={_ + i} onBlur={onBlur}>{evaProps => <Text {...evaProps} category='label' style={styles.radioText}>{_}</Text>}</Radio>
                )
              })}
            </RadioGroup>
          )}
          name='creator.patientProfileCreatorTypeId'
        />
        {form.formState.errors.creator?.patientProfileCreatorTypeId && <Text category='s2' style={styles.text}>{form.formState.errors.creator?.patientProfileCreatorTypeId?.message}</Text>}
      </View>
      {patientProfileCreator === PatientProfileCreatorTypeEnum.PatientSelf ?
        <>
          <View style={styles.viewLabel}>
            <Text category='label' status='primary' style={styles.labelTitle}>Você deseja participar do programa de mapeamento genético? *</Text>
          </View>
          <View style={styles.radioGroup}>
            <Controller
              control={form.control}
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
                  selectedIndex={selectedIndexGeneticProgram}
                  onChange={handleRadioSelectedGeneticProgram}
                >
                  <Radio onBlur={onBlur}>{evaProps => <Text {...evaProps} category='label' style={styles.radioText}>Sim</Text>}</Radio>
                  <Radio onBlur={onBlur}>{evaProps => <Text {...evaProps} category='label' style={styles.radioText}>Não</Text>}</Radio>
                </RadioGroup>
              )}
              name='abrafeuRegistrationOptIn'
            />
            {form.formState.errors.abrafeuRegistrationOptIn && <Text category='s2' style={styles.text}>{form.formState.errors.abrafeuRegistrationOptIn.message}</Text>}
          </View>
        </>
        :
        null
      }
      {showFields && patientProfileCreator === PatientProfileCreatorTypeEnum.PatientSelf && (
        <>
          <View style={styles.box}>
            <Controller
              control={form.control}
              rules={{
                required: false,
                minLength: {
                  value: 5,
                  message: `Mín. 5 caracteres`
                },
              }}
              render={({ field: { onChange, onBlur, value, name, ref } }) => (
                <Input
                  size='small'
                  label="CRM do Médico Responsável *"
                  style={styles.input}
                  keyboardType='number-pad'
                  placeholder=''
                  testID={name}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value ? onlyNumbers(value) : value}
                  ref={ref}
                  maxLength={6}
                  underlineColorAndroid="transparent"
                  onSubmitEditing={form.handleSubmit(onSubmit)}
                />
              )}
              name='pastExams.doctor.crm'
              defaultValue=''
            />
            {form.formState.errors.pastExams?.doctor?.crm && <Text category='s2' style={styles.text}>{form.formState.errors.pastExams?.doctor?.crm?.message}</Text>}
          </View>
          <View style={styles.viewLabel}>
            <Text category='label' status='primary' style={styles.labelTitle}>Assinale uma das alternativas abaixo em relação ao teste genético: *</Text>
          </View>
          <View style={styles.radioGroup}>
            <Controller
              control={form.control}
              rules={{
                required: {
                  value: selectedIndexGeneticProgram === 0,
                  message: 'Campo obrigatório'
                },
              }}
              render={({ field: { onBlur, name, ref } }) => (
                <RadioGroup
                  ref={ref}
                  testID={name}
                  selectedIndex={selectedIndexExamDNA}
                  onChange={handleRadioSelectedExamDNA}>
                  {items.map((_, i) => {
                    return (
                      <Radio key={_ + i} onBlur={onBlur}>{evaProps => <Text {...evaProps} category='label' style={styles.radioText}>{_}</Text>}</Radio>
                    )
                  })}
                </RadioGroup>
              )}
              name='pastExams.exam'
            />
            {form.formState.errors.pastExams?.exam && <Text category='s2' style={styles.text}>{form.formState.errors.pastExams?.exam?.message}</Text>}
          </View>
        </>
      )}
    </>
  )
}

export default PatientSignUpPart3Screen