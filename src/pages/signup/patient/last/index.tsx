import CardPatientRelationshipComponent from '@components/cards/cardPatientRelationship'
import CustomErrorMessage from '@components/error'
import { useDatepickerService } from '@hooks/useDatepickerService'
import { useModal } from '@hooks/useModal'
import { PatientProfileCreatorTypeEnum, RelationshipPatient } from '@models/PatientProfileCreator'
import { PatientSignUpProps } from '@models/SignUpProps'
import { registerStyle } from '@pages/signup/style'
import { useFocusEffect } from '@react-navigation/native'
import { Card, Modal, Radio, RadioGroup, Text, useStyleSheet } from '@ui-kitten/components'
import { getRelationPatient } from '@utils/common'
import React, { FC, ReactElement, useCallback, useEffect, useState } from 'react'
import { Controller } from 'react-hook-form'
import { View } from 'react-native'
import { DocumentPickerResponse } from 'react-native-document-picker'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { creatorRelationship, profileCreator } from '../../data'

const PatientSignUpEndScreen: FC<PatientSignUpProps> = ({ form, onSubmit }): ReactElement => {

  const { localeDateService } = useDatepickerService()
  const styles = useStyleSheet(registerStyle)
  const { ref } = useModal<Modal>()
  const [isVisible, setIsVisible] = useState<boolean>()
  const [relationship, setRelationship] = useState<RelationshipPatient | undefined>()

  const [selectedIndexRelationPatient, setSelectedIndexRelationPatient] = useState(-1)
  const [patientProfileCreator, setPatientProfileCreator] = useState<number | PatientProfileCreatorTypeEnum | undefined>()
  const [fileResponse, setFileResponse] = useState<DocumentPickerResponse[] | undefined>()

  const dateForOver = localeDateService.addYear(localeDateService.today(), -18)
  const [isLegalAge, setIsLegalAge] = useState<boolean>(false)

  useFocusEffect(
    useCallback(() => {

      const patientDate = form.getValues('dateOfBirth')
      const result = patientDate ? localeDateService.compareDatesSafe(dateForOver, new Date(patientDate)) : -1

      if (result === 1) {
        setIsLegalAge(true)

        const opRelation = form.getValues('creator.patientProfileCreatorTypeId')
        if (opRelation) {
          setSelectedIndexRelationPatient(opRelation === '0' ? profileCreator.length - 1 : Number(opRelation) - 1)
          opRelation === '0' ?
            setPatientProfileCreator('0' as PatientProfileCreatorTypeEnum) : setPatientProfileCreator(opRelation as PatientProfileCreatorTypeEnum)
        }

      } else {
        setIsLegalAge(false)
        setSelectedIndexRelationPatient(profileCreator.length - 1)
        setPatientProfileCreator('0' as PatientProfileCreatorTypeEnum)
        form.setValue('creator.patientProfileCreatorTypeId', '0' as PatientProfileCreatorTypeEnum)
      }

      const idRelationship = form.getValues('creator.data.creatorRelationship')
      if (idRelationship)
        setRelationship(creatorRelationship.find((_, i) => i === idRelationship))
      else if (!idRelationship && !isLegalAge && result !== 1) setIsVisible(true)

      const file: DocumentPickerResponse = form.getValues('creator.data.guardian.attachment')
      if (file) {
        const arr = [...fileResponse ?? []]
        arr.push(file)
        setFileResponse(arr)
      }

    }, [])
  )

  const handleRadioSelected = (index: number) => {
    if (index !== selectedIndexRelationPatient) {
      form.resetField('creator')
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
    if (fileResponse) {
      form.setValue('creator.data.guardian.attachment', fileResponse[0])
      form.clearErrors('creator.data.guardian.attachment')
    } else {
      form.setValue('creator.data.guardian.attachment', undefined)
    }
  }, [fileResponse])

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
                        '(Somente para maiores de 18 anos)' : '')}</Text>}
                  </Radio>
                )
              })}
            </RadioGroup>
          )}
          name='creator.patientProfileCreatorTypeId'
        />
        <CustomErrorMessage name='creator.patientProfileCreatorTypeId' errors={form.formState.errors} />
      </View>
      {patientProfileCreator === PatientProfileCreatorTypeEnum.Other && relationship ?
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
              form={form}
              file={fileResponse}
              setFile={setFileResponse}
              styles={styles}
              onSubmit={onSubmit} />
          </View>
        </>
        : null
      }
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

export default PatientSignUpEndScreen