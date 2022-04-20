import CardPatientRelationshipComponent from '@components/cards/cardPatientRelationship'
import { useDatepickerService } from '@hooks/useDatepickerService'
import { useModal } from '@hooks/useModal'
import { PatientProfileCreatorTypeEnum, RelationshipPatient } from '@models/PatientProfileCreator'
import { PatientSignUpProps } from '@models/SignUpProps'
import { registerStyle } from '@pages/signup/style'
import { useFocusEffect } from '@react-navigation/native'
import { Card, Input, Modal, Radio, RadioGroup, Text, useStyleSheet } from '@ui-kitten/components'
import { getRelationPastExams, getRelationPatient } from '@utils/common'
import { onlyNumbers } from '@utils/mask'
import React, { FC, ReactElement, useCallback, useEffect, useState } from 'react'
import { Controller } from 'react-hook-form'
import { View } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { creatorRelationship, examResult, profileCreator } from '../data'

const PatientSignUpPart3Screen: FC<PatientSignUpProps> = ({ form, onSubmit }): ReactElement => {

  const { localeDateService } = useDatepickerService()
  const styles = useStyleSheet(registerStyle)
  const { ref } = useModal<Modal>()
  const [isVisible, setIsVisible] = useState<boolean>()
  const [relationship, setRelationship] = useState<RelationshipPatient | undefined>()

  const [selectedIndexRelationPatient, setSelectedIndexRelationPatient] = useState(-1)
  const [patientProfileCreator, setPatientProfileCreator] = useState<number | PatientProfileCreatorTypeEnum | undefined>()
  const [selectedIndexExamDNA, setSelectedIndexExamDNA] = useState(-1)
  const [selectedIndexGeneticProgram, setSelectedIndexGeneticProgram] = useState<number>(-1)
  const [showFields, setShowFields] = useState<boolean>(false)

  const dateForOver = localeDateService.addYear(localeDateService.today(), -18)
  const [isLegalAge, setIsLegalAge] = useState<boolean>()

  useFocusEffect(
    useCallback(() => {

      const patientDate = form.getValues('dateOfBirth')
      const result = patientDate ? localeDateService.compareDatesSafe(dateForOver, patientDate) : -1

      if (result === 1) {
        setIsLegalAge(true)

        const opRelation = form.getValues('creator.patientProfileCreatorTypeId')
        if (opRelation) {
          setSelectedIndexRelationPatient(opRelation === '0' ? profileCreator.length - 1 : Number(opRelation) - 1)
          opRelation === '0' ?
            setPatientProfileCreator('0' as PatientProfileCreatorTypeEnum) : setPatientProfileCreator(opRelation as PatientProfileCreatorTypeEnum)
        }
        const op = form.getValues('abrafeuRegistrationOptIn')
        if (op) setShowFields(op === 'true'), setSelectedIndexGeneticProgram(op === 'true' ? 0 : 1)

        const exam = form.getValues('pastExams.exam')
        if (exam) setSelectedIndexExamDNA(examResult.findIndex(e => e === exam))

      } else {
        setIsLegalAge(false)
        setSelectedIndexRelationPatient(profileCreator.length - 1)
        setPatientProfileCreator('0' as PatientProfileCreatorTypeEnum)
        form.setValue('creator.patientProfileCreatorTypeId', '0' as PatientProfileCreatorTypeEnum)
      }

      const idRelationship = form.getValues('creator.data.creatorRelationship')
      if (idRelationship)
        setRelationship(creatorRelationship.find((_, i) => i === idRelationship))
      else if(!idRelationship && !isLegalAge) setIsVisible(true)
    }, [])
  )

  const handleRadioSelected = (index: number) => {
    if (index !== selectedIndexRelationPatient) {
      setSelectedIndexGeneticProgram(-1)
      form.resetField('abrafeuRegistrationOptIn')
      form.resetField('pastExams.doctor.crm')
      form.resetField('pastExams.exam')
      form.resetField('creator')
      setSelectedIndexExamDNA(-1)
      setShowFields(false)
      setRelationship(undefined)
    }
    setSelectedIndexRelationPatient(index)
    const id = getRelationPatient(index)
    id ? setPatientProfileCreator(id as PatientProfileCreatorTypeEnum) : null
    form.setValue("creator.patientProfileCreatorTypeId", id as PatientProfileCreatorTypeEnum)
    form.clearErrors("creator.patientProfileCreatorTypeId")

    if (id === PatientProfileCreatorTypeEnum.Other && !relationship) setIsVisible(true)

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
    if (index === 1) setShowFields(false)
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

  useEffect(() => {
    if (relationship) {
      const relationToString = relationship as RelationshipPatient
      if (relationToString === 'Tutor Legal') {
        form.register('creator.data.guardian.attachment', {
          required: {
            value: true,
            message: 'Necessário documentação'
          }
        })
      } else {
        form.unregister('creator.data.guardian.attachment')
      }
    }
  }, [relationship])

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
              message: 'Selecione uma opção'
            },
          }}
          render={({ field: { onBlur, name, ref } }) => (
            <RadioGroup
              ref={ref}
              testID={name}
              selectedIndex={selectedIndexRelationPatient}
              onChange={handleRadioSelected}>
              {profileCreator.map((_item, i) => {
                return (
                  <Radio
                    disabled={!isLegalAge && _item.toLowerCase() !== 'outro'.toLowerCase()}
                    key={_item + i}
                    onBlur={onBlur}>
                    {evaProps => <Text {...evaProps} >{_item + " " +
                      (!isLegalAge && _item.toLowerCase() !== 'outro'.toLowerCase() ?
                        '(Para maior de idade)' : '')}</Text>}
                  </Radio>
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
                  message: 'Selecione uma opção'
                },
              }}
              render={({ field: { onBlur, name, ref } }) => (
                <RadioGroup
                  testID={name}
                  ref={ref}
                  selectedIndex={selectedIndexGeneticProgram}
                  onChange={handleRadioSelectedGeneticProgram}
                >
                  <Radio onBlur={onBlur}>{evaProps => <Text {...evaProps}>Sim</Text>}</Radio>
                  <Radio onBlur={onBlur}>{evaProps => <Text {...evaProps}>Não</Text>}</Radio>
                </RadioGroup>
              )}
              name='abrafeuRegistrationOptIn'
            />
            {form.formState.errors.abrafeuRegistrationOptIn && <Text category='s2' style={styles.text}>{form.formState.errors.abrafeuRegistrationOptIn.message}</Text>}
          </View>
        </>
        :
        patientProfileCreator === PatientProfileCreatorTypeEnum.Other && relationship ?
          <>
            <View style={{
              flexDirection: 'row',
              alignItems: 'center',
              paddingHorizontal: 15,
              paddingVertical: 5,
              justifyContent: 'space-between'
            }}>
              <View style={{
                flexDirection: 'row'
              }}>
                <Text category='c1' status='basic'>Selecionado:{" "}</Text>
                <Text category='label' status='basic'>{relationship}</Text>
              </View>
              <View style={{ flexDirection: 'row' }}>
                <TouchableOpacity onPress={() => setIsVisible(true)}>
                  <Text category='label' status='danger'>Alterar</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.box}>
              <CardPatientRelationshipComponent
                relationship={relationship}
                form={form}
                styles={styles}
                onSubmit={onSubmit} />
            </View>
          </>
          : null
      }
      {showFields && patientProfileCreator === PatientProfileCreatorTypeEnum.PatientSelf && (
        <>
          <View style={styles.box}>
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
                  message: 'Selecione uma opção'
                },
              }}
              render={({ field: { onBlur, name, ref } }) => (
                <RadioGroup
                  ref={ref}
                  testID={name}
                  selectedIndex={selectedIndexExamDNA}
                  onChange={handleRadioSelectedExamDNA}>
                  {examResult.map((_, i) => {
                    return (
                      <Radio key={_ + i} onBlur={onBlur}>{evaProps => <Text {...evaProps} >{_}</Text>}</Radio>
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
      <Modal
        style={styles.modal}
        backdropStyle={styles.backdrop}
        visible={isVisible}
        ref={ref}>
        <Card disabled>
          <Text style={styles.titleModal}>Qual sua relação com o paciente?</Text>
          <Controller
            control={form.control}
            rules={{
              required: {
                value: true,
                message: 'Selecione um opção'
              },
            }}
            render={({ field: { onBlur, name, ref, onChange, value } }) => (
              <RadioGroup
                testID={name}
                ref={ref}
                selectedIndex={value}
                onChange={(index) => {
                  onChange(index)
                  setRelationship(creatorRelationship.find((_, i) => i === index))
                  setIsVisible(false)
                  form.clearErrors('creator.data')
                }}
              >
                {creatorRelationship.map((item, i) => (
                  <Radio key={item} onBlur={onBlur}>{evaProps => <Text {...evaProps} >{item}</Text>}</Radio>
                ))}
              </RadioGroup>
            )}
            name='creator.data.creatorRelationship'
          />
        </Card>
      </Modal>
    </>
  )
}

export default PatientSignUpPart3Screen