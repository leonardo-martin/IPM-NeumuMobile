import HeaderProfile from '@components/header/admin/profile'
import { useAppDispatch, useAppSelector } from '@hooks/redux'
import { useDatepickerService } from '@hooks/useDatepickerService'
import { PatientDisplay } from '@models/Patient'
import { EUserRole } from '@models/UserRole'
import { useFocusEffect } from '@react-navigation/native'
import { getAddressByPostalCode } from '@services/common.service'
import { getDoctor } from '@services/medical-doctor.service'
import { getPatientDisplay, updatePatient } from '@services/patient.service'
import { getUserDetails, updateUser } from '@services/user.service'
import { setProfile } from '@store/ducks/profile'
import { Button, Icon, IconProps, useStyleSheet } from '@ui-kitten/components'
import { cleanNumberMask, formatCpf, formatPhone, formatPostalCode } from '@utils/mask'
import { validateCNS } from '@utils/validators'
import LoadingIndicatorComponent from 'components/loadingIndicator'
import { compareAsc, subYears } from 'date-fns'
import React, { FC, ReactElement, useCallback, useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { ImageStyle, Keyboard, RefreshControl, ScrollView, StyleProp, View } from 'react-native'
import Toast from 'react-native-toast-message'
import { getOne } from 'services/medical-specialty.service'
import { RootState } from 'store'
import BadgeProfile from './badge-profile'
import ProfileAvatar from './profile-avatar'
import ProfileSetting from './profile-setting'
import { extraProfileStyle } from './style'

const EditProfileScreen: FC = (): ReactElement => {

  const { sessionUser } = useAppSelector((state: RootState) => state.auth)
  const styles = useStyleSheet(extraProfileStyle)
  const { localeDateService, format } = useDatepickerService()
  const form = useForm()
  const dispatch = useAppDispatch()
  const { ids } = useAppSelector((state: RootState) => state.user)
  const { profile: userDetails } = useAppSelector((state: RootState) => state.profile)
  const [refreshing, setRefreshing] = useState<boolean>(false)
  const [underage, setUnderage] = useState<boolean>(true)
  const [patientDisplay, setPatientDisplay] = useState<PatientDisplay>()
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const loadFields = async () => {
    let obj: any = {
      ...userDetails,
      dateOfBirth: userDetails?.dateOfBirth ? localeDateService.format(localeDateService.parse(userDetails?.dateOfBirth.toString(), "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'"), format) : '',
      username: userDetails?.cpf,
      postalCode: formatPostalCode(userDetails?.postalCode) ?? userDetails?.postalCode,
    }

    try {
      if (sessionUser?.userRole.find(e => e.id === EUserRole.patient)) {
        let result = compareAsc(subYears(new Date(), 18), userDetails?.dateOfBirth as string)
        if (result !== 1) {
          setUnderage(true)
        } else {
          setUnderage(false)
        }
        const response = await getPatientDisplay()
        if (response.status === 200) {
          setPatientDisplay(response.data)
          obj = {
            ...obj,
            mothersName: response.data.patientDto.mothersName,
            susNumber: response.data.patientDto.susNumber,
            sex: response.data.patientDto.sex ?? undefined,
            ...underage && patientDisplay?.patientProfileCreatorDto.patientProfileCreatorTypeId !== 1 && {
              responsiblePersonEmail: response.data.responsiblePersonEmail ?? JSON.parse(response.data.patientProfileCreatorDto.data as string).email,
              responsiblePersonName: JSON.parse(response.data.patientProfileCreatorDto.data as string).name
            }
          }
        }
        else setPatientDisplay(undefined)
      }

      if (sessionUser?.userRole.find(e => e.id === EUserRole.medicalDoctor) && ids) {
        const response = await getDoctor(ids?.medicalDoctorId)
        if (response.status === 200) {
          const res = await getOne(response.data.specialtyId)
          obj = {
            ...obj,
            specialty: {
              crm: response.data.crm,
              description: res.data.description
            }
          }
        }
      }

      form.reset(obj)
    } catch (error) {
      Toast.show({
        type: 'danger',
        text2: 'Erro ao carregar o perfil',
      })
    }
    setIsLoading(false)
  }

  useFocusEffect(
    useCallback(() => {
      setIsLoading(true)
      loadFields()
    }, [userDetails])
  )

  const editProfile = async (type: 1 | 2) => {
    const obj = form.getValues()
    Toast.hide()
    let userDto = null
    switch (type) {
      case 1:
        userDto = {
          name: obj.name,
          phone1: obj.phone1,
          phone2: obj.phone2,
        }

        if (sessionUser?.userRole.find(e => e.id === EUserRole.patient)) {
          if (obj.susNumber !== '' && obj.susNumber) {
            if (!validateCNS(obj.susNumber)) {
              Toast.show({
                type: 'warning',
                text2: 'Cartão Nacional de Saúde inválido',
              })
              return
            }
          } else {
            if (patientDisplay?.patientDto.susNumber && !obj.susNumber) {
              Toast.show({
                type: 'info',
                text2: 'Cartão Nacional de Saúde ausente',
              })
              return
            }
          }
          if (patientDisplay) {
            await updatePatient({
              ...patientDisplay.patientDto,
              susNumber: obj.susNumber === '' || !obj.susNumber ? null : obj.susNumber,
            })
          }
        }

        break
      case 2:
        if (!obj.address2 || obj.address2 === '' || obj.address2 === '0') {
          Toast.show({
            type: 'info',
            text2: obj.address2 === '0' ? 'Número inválido, digite outro' : 'É necessário inserir o número',
          })
          return
        }
        userDto = {
          address1: obj.address1,
          address2: obj.address2,
          state: obj.state,
          city: obj.city,
          postalCode: cleanNumberMask(obj.postalCode) ?? obj.postalCode,
          addressComplement: obj.addressComplement,
          country: obj.country
        }
        break
      default:
        break
    }

    try {

      await updateUser(userDto)
      updateUserStore()
      loadFields()
    } catch (error) {
      Toast.show({
        type: 'danger',
        text2: 'Erro ao atualizar o perfil. Tente novamente mais tarde',
      })
    }
  }

  const CameraIcon = (props: IconProps) => (
    <Icon {...props} style={[props.style, {
      textAlign: 'center'
    }]} name='pencil-outline' pack='ionicons' size={15} />
  )

  const handlePickAvatar = async () => {
    console.log('liberado')
  }

  const renderPhotoButton = (): ReactElement => (
    <Button
      style={styles.editAvatarButton}
      status='basic'
      accessoryLeft={CameraIcon}
      onPress={handlePickAvatar}
    />
  )

  const updateUserStore = async () => {
    const res = await getUserDetails()
    dispatch(setProfile(res.data))
    Toast.show({
      type: 'success',
      text2: 'Perfil atualizado',
    })
    setRefreshing(false)
  }

  const loadDataFromPostalCode = async (value: string) => {
    try {
      const obj = await getAddressByPostalCode(value)

      form.setValue('country', 'Brasil')
      form.setValue('city', obj?.localidade)
      form.setValue('state', obj?.uf)
      form.setValue('address1', obj?.logradouro)
      form.setValue('addressComplement', obj?.complemento)
      Keyboard.dismiss()
    } catch (error) {
      Toast.show({
        type: 'danger',
        text2: 'Erro ao buscar endereço. Tente novamente mais tarde',
      })
    }
  }

  useEffect(() => {
    if (refreshing) updateUserStore()
  }, [refreshing])

  return (
    <>
      <HeaderProfile />
      {isLoading ? (
        <LoadingIndicatorComponent size='giant' status='primary' />
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={styles.container}
          contentContainerStyle={styles.contentContainer}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => setRefreshing(true)}
            />
          }
        >
          <ProfileAvatar
            style={styles.profileAvatar as StyleProp<ImageStyle>}
            source={require('../../../../assets/profile/profile.png')}
            editButton={renderPhotoButton}
          />
          <Controller
            control={form.control}
            render={({ field }) => (
              <ProfileSetting
                style={[styles.profileSetting, styles.section]}
                hint='Usuário'
                inputProps={{
                  value: field.value ? `@${field.value}` : '',
                  editable: false,
                  disabled: true,
                  textAlign: 'right',
                  multiline: true,
                  scrollEnabled: true
                }}
              />
            )}
            name='username'
          />
          <Controller
            control={form.control}
            render={({ field }) => (
              <ProfileSetting
                style={styles.profileSetting}
                hint='CPF'
                inputProps={{
                  value: formatCpf(field.value),
                  editable: false,
                  disabled: true,
                  textAlign: 'right',
                  multiline: true,
                  scrollEnabled: true,
                  keyboardType: 'number-pad',
                }}
              />
            )}
            name='cpf'
          />
          <Controller
            control={form.control}
            render={({ field }) => (
              <ProfileSetting
                style={styles.profileSetting}
                hint='E-mail'
                inputProps={{
                  value: field.value,
                  editable: false,
                  disabled: true,
                  textAlign: 'right',
                  multiline: true,
                  scrollEnabled: true
                }}
              />
            )}
            name='email'
          />

          <BadgeProfile title='Dados Pessoais' />
          <Controller
            control={form.control}
            render={({ field }) => (
              <ProfileSetting
                style={[styles.profileSetting, styles.section]}
                hint='Meu Nome'
                inputProps={{
                  value: field.value,
                  editable: false,
                  disabled: true,
                  textAlign: 'right',
                  keyboardType: 'default',
                  multiline: true,
                  scrollEnabled: true,
                  maxLength: 60,
                  returnKeyType: "default",
                  autoCapitalize: "words",
                  textContentType: "name"
                }}
              />
            )}
            name='name'
          />
          {sessionUser && sessionUser?.userRole.find(e => e.id === EUserRole.patient) && (
            <Controller
              control={form.control}
              render={({ field }) => (
                <ProfileSetting
                  style={styles.profileSetting}
                  hint='Nome da Mãe'
                  inputProps={{
                    value: field.value,
                    editable: false,
                    disabled: true,
                    textAlign: 'right',
                    keyboardType: 'default',
                    multiline: true,
                    scrollEnabled: true,
                    maxLength: 60,
                    returnKeyType: "default",
                    autoCapitalize: "words",
                    textContentType: "familyName"
                  }}
                />
              )}
              name='mothersName'
            />
          )}
          <Controller
            control={form.control}
            render={({ field }) => (
              <ProfileSetting
                style={styles.profileSetting}
                hint='Data de Nascimento'
                inputProps={{
                  value: field.value,
                  editable: false,
                  disabled: true,
                  textAlign: 'right',
                  keyboardType: 'default',
                  multiline: true,
                  scrollEnabled: true,
                  maxLength: 60,
                  returnKeyType: "default",
                  autoCapitalize: "words",
                  textContentType: "familyName"
                }}
              />
            )}
            name='dateOfBirth'
          />
          <Controller
            control={form.control}
            rules={{
              minLength: {
                value: 13,
                message: `Mín. 13 caracteres`
              },
            }}
            render={({ field }) => (
              <ProfileSetting
                style={styles.profileSetting}
                hint='Telefone 1'
                inputProps={{
                  value: formatPhone(field.value),
                  onBlur: field.onBlur,
                  onChangeText: field.onChange,
                  keyboardType: 'number-pad',
                  editable: true,
                  textAlign: 'right',
                  multiline: true,
                  scrollEnabled: true,
                  maxLength: 15,
                  textContentType: "telephoneNumber",
                  returnKeyType: "default",
                }}
              />
            )}
            name='phone1'
          />
          <Controller
            control={form.control}
            rules={{
              minLength: {
                value: 13,
                message: `Mín. 13 caracteres`
              },
            }}
            render={({ field }) => (
              <ProfileSetting
                style={styles.profileSetting}
                hint='Telefone 2'
                inputProps={{
                  value: formatPhone(field.value),
                  onBlur: field.onBlur,
                  onChangeText: field.onChange,
                  keyboardType: 'number-pad',
                  editable: true,
                  textAlign: 'right',
                  multiline: true,
                  scrollEnabled: true,
                  maxLength: 15,
                  textContentType: "telephoneNumber"
                }}
              />
            )}
            name='phone2'
          />
          {sessionUser?.userRole.find(e => e.id === EUserRole.patient) && (
            <Controller
              control={form.control}
              rules={{
                minLength: {
                  value: 14,
                  message: `Mín. 14 caracteres`
                },
              }}
              render={({ field }) => (
                <ProfileSetting
                  style={styles.profileSetting}
                  hint='Cartão Nacional de Saúde'
                  inputProps={{
                    onBlur: field.onBlur,
                    onChangeText: field.onChange,
                    value: field.value,
                    keyboardType: 'number-pad',
                    textAlign: 'right',
                    multiline: true,
                    scrollEnabled: true,
                    maxLength: 15,
                    disabled: validateCNS(patientDisplay?.patientDto.susNumber ?? '')
                  }}
                />
              )}
              name='susNumber'
              defaultValue=''
            />
          )}
          <View style={styles.editViewButton}>
            <Button
              size='small'
              status='primary'
              appearance='ghost'
              onPress={() => editProfile(1)}>
              SALVAR
            </Button>
          </View>


          {/* ############################ */}
          {sessionUser?.userRole.find(e => e.id === EUserRole.patient) && (
            <>
              <BadgeProfile title='Informação de Contato' />
              <Controller
                control={form.control}
                rules={{
                  minLength: {
                    value: 5,
                    message: `Mín. 5 caracteres`
                  },
                }}
                render={({ field }) => (
                  <ProfileSetting
                    style={[styles.profileSetting, styles.section]}
                    hint='CEP'
                    inputProps={{
                      value: formatPostalCode(field.value),
                      onBlur: field.onBlur,
                      onChangeText: field.onChange,
                      keyboardType: 'number-pad',
                      editable: true,
                      textAlign: 'right',
                      multiline: true,
                      scrollEnabled: true,
                      maxLength: 8,
                      textContentType: "postalCode",
                      returnKeyType: "default",
                      onEndEditing: () => loadDataFromPostalCode(field.value),
                      onSubmitEditing: () => field.value ? loadDataFromPostalCode(field.value) : undefined
                    }}
                  />
                )}
                name='postalCode'
              />
              <Controller
                control={form.control}
                rules={{
                  minLength: {
                    value: 5,
                    message: `Mín. 5 caracteres`
                  },
                }}
                render={({ field }) => (
                  <ProfileSetting
                    style={[styles.profileSetting]}
                    hint='Endereço'
                    inputProps={{
                      value: field.value,
                      onBlur: field.onBlur,
                      onChangeText: field.onChange,
                      keyboardType: 'default',
                      editable: true,
                      textAlign: 'right',
                      multiline: true,
                      scrollEnabled: true,
                      textContentType: "fullStreetAddress",
                      returnKeyType: "default",
                    }}
                  />
                )}
                name='address1'
              />

              <Controller
                control={form.control}
                rules={{
                  required: true,
                  minLength: {
                    value: 1,
                    message: `Mín. 1 caracteres`
                  },
                }}
                render={({ field }) => (
                  <ProfileSetting
                    style={[styles.profileSetting]}
                    hint='Número'
                    inputProps={{
                      value: field.value,
                      onBlur: field.onBlur,
                      onChangeText: field.onChange,
                      keyboardType: 'number-pad',
                      editable: true,
                      textAlign: 'right',
                      multiline: true,
                      scrollEnabled: true,
                      returnKeyType: "default",
                    }}
                  />
                )}
                name='address2'
              />

              <Controller
                control={form.control}
                rules={{
                  required: false,
                  minLength: {
                    value: 2,
                    message: `Mín. 2 caracteres`
                  },
                  maxLength: {
                    value: 180,
                    message: `Max. 180 caracteres`
                  },
                }}
                render={({ field }) => (
                  <ProfileSetting
                    style={[styles.profileSetting]}
                    hint='Complemento'
                    inputProps={{
                      value: field.value,
                      onBlur: field.onBlur,
                      onChangeText: field.onChange,
                      keyboardType: 'default',
                      editable: true,
                      textAlign: 'right',
                      multiline: true,
                      scrollEnabled: true,
                      returnKeyType: "default",
                    }}
                  />
                )}
                name='addressComplement'
              />
              <Controller
                control={form.control}
                render={({ field }) => (
                  <ProfileSetting
                    style={[styles.profileSetting]}
                    hint='Cidade'
                    inputProps={{
                      value: field.value,
                      onBlur: field.onBlur,
                      onChangeText: field.onChange,
                      keyboardType: 'default',
                      editable: true,
                      textAlign: 'right',
                      multiline: true,
                      scrollEnabled: true,
                      returnKeyType: "default",
                      autoCapitalize: 'words'
                    }}
                  />
                )}
                name='city'
              />
              <Controller
                control={form.control}
                rules={{
                  minLength: {
                    value: 2,
                    message: `Mín. 2 caracteres`
                  },
                }}
                render={({ field }) => (
                  <ProfileSetting
                    style={[styles.profileSetting]}
                    hint='Estado'
                    inputProps={{
                      value: field.value,
                      onBlur: field.onBlur,
                      onChangeText: field.onChange,
                      keyboardType: 'default',
                      editable: true,
                      textAlign: 'right',
                      scrollEnabled: true,
                      returnKeyType: "default",
                      autoCapitalize: 'characters',
                      maxLength: 2,
                    }}
                  />
                )}
                name='state'
              />
              <Controller
                control={form.control}
                render={({ field }) => (
                  <ProfileSetting
                    style={[styles.profileSetting]}
                    hint='País'
                    inputProps={{
                      value: field.value,
                      onBlur: field.onBlur,
                      onChangeText: field.onChange,
                      keyboardType: 'default',
                      editable: true,
                      textAlign: 'right',
                      scrollEnabled: true,
                      returnKeyType: "default",
                      autoCapitalize: 'words'
                    }}
                  />
                )}
                name='country'
              />
              <View style={styles.editViewButton}>
                <Button
                  size='small'
                  status='primary'
                  appearance='ghost'
                  onPress={() => editProfile(2)}>
                  SALVAR
                </Button>
              </View>
            </>
          )}

          {sessionUser?.userRole.find(e => e.id === EUserRole.medicalDoctor) && (
            <>
              <BadgeProfile title='Dados Profissionais' />

              <Controller
                control={form.control}
                render={({ field }) => (
                  <ProfileSetting
                    style={[styles.profileSetting, styles.section]}
                    hint='N° de Registro'
                    inputProps={{
                      onBlur: field.onBlur,
                      onChangeText: field.onChange,
                      value: field.value,
                      keyboardType: 'number-pad',
                      textAlign: 'right',
                      scrollEnabled: true,
                      disabled: true
                    }}
                  />
                )}
                name='specialty.crm'
                defaultValue=''
              />
              <Controller
                control={form.control}
                render={({ field }) => (
                  <ProfileSetting
                    style={styles.profileSetting}
                    hint='Especialidade'
                    inputProps={{
                      value: field.value,
                      onBlur: field.onBlur,
                      onChangeText: field.onChange,
                      editable: false,
                      disabled: true,
                      textAlign: 'right',
                      keyboardType: 'default',
                      multiline: true,
                      scrollEnabled: true,
                      returnKeyType: "default",
                      autoCapitalize: "words",
                      textContentType: "name"
                    }}
                  />
                )}
                name='specialty.description'
              />
            </>
          )}

          {/* ############################ */}
          {sessionUser?.userRole.find(e => e.id === EUserRole.patient) && underage
            && patientDisplay?.patientProfileCreatorDto.patientProfileCreatorTypeId !== 1 && (
              <>
                <BadgeProfile title='Informação do Responsável' />
                <Controller
                  control={form.control}
                  render={({ field }) => (
                    <ProfileSetting
                      style={[styles.profileSetting, styles.section]}
                      hint='Nome Completo'
                      inputProps={{
                        value: field.value,
                        onBlur: field.onBlur,
                        onChangeText: field.onChange,
                        editable: false,
                        disabled: true,
                        textAlign: 'right',
                        keyboardType: 'default',
                        multiline: true,
                        scrollEnabled: true,
                        maxLength: 60,
                        returnKeyType: "default",
                        autoCapitalize: "words",
                        textContentType: "name"
                      }}
                    />
                  )}
                  name='responsiblePersonName'
                />
                <Controller
                  control={form.control}
                  render={({ field }) => (
                    <ProfileSetting
                      style={styles.profileSetting}
                      hint='E-mail'
                      inputProps={{
                        value: field.value,
                        editable: false,
                        disabled: true,
                        textAlign: 'right',
                        multiline: true,
                        scrollEnabled: true
                      }}
                    />
                  )}
                  name='responsiblePersonEmail'
                />
              </>
            )}
        </ScrollView>
      )}

    </>
  )
}

export default EditProfileScreen