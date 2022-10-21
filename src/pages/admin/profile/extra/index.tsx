import HeaderProfile from '@components/header/admin/profile'
import LoadingIndicatorComponent from '@components/loadingIndicator'
import { useAppDispatch, useAppSelector } from '@hooks/redux'
import { useDatepickerService } from '@hooks/useDatepickerService'
import { PatientDisplay } from '@models/Patient'
import { EUserRole } from '@models/UserRole'
import { useFocusEffect } from '@react-navigation/native'
import { getAddressByPostalCode } from '@services/common.service'
import { launchImageLibraryFromDevice, readFileFromDevice, uploadUserFile, userDelete } from '@services/document.service'
import { getDoctor } from '@services/medical-doctor.service'
import { getOne } from '@services/medical-specialty.service'
import { getPatientDisplay, updatePatient } from '@services/patient.service'
import { getProfilePicture, getUserDetails, updateUser } from '@services/user.service'
import { setProfile, setProfilePic } from '@store/ducks/profile'
import { Button, Icon, IconProps, useStyleSheet } from '@ui-kitten/components'
import { getDocumentType, getEntityType } from '@utils/entity'
import { cleanNumberMask, formatCpf, formatPostalCode } from '@utils/mask'
import { validateCNS } from '@utils/validators'
import { compareAsc, subYears } from 'date-fns'
import React, { FC, ReactElement, useCallback, useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { Alert, ImageStyle, Keyboard, Platform, RefreshControl, ScrollView, StyleProp, View } from 'react-native'
import { Asset } from 'react-native-image-picker'
import Toast from 'react-native-toast-message'
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
  const { profile: userDetails, profilePic, profilePicId } = useAppSelector((state: RootState) => state.profile)
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
      if (sessionUser && !profilePicId) {
        await loadProfilePic(sessionUser.userId)
      }
    } catch (error) {
      Toast.show({
        type: 'danger',
        text2: 'Erro ao carregar o perfil',
      })
    }
    setIsLoading(false)
  }

  const loadProfilePic = useCallback(async (userId: number) => {
    try {
      if (!profilePicId)
        await dispatch(await getProfilePicture(userId))
    } catch (error) {
      Toast.show({
        type: 'danger',
        text2: 'Erro carregar a foto de perfil',
      })
    }
  }, [profilePic])

  useFocusEffect(
    useCallback(() => {
      setIsLoading(true)
      if (sessionUser && userDetails) {
        loadFields()
      }
    }, [userDetails, sessionUser])
  )

  const editProfile = async () => {
    const obj = form.getValues()
    Toast.hide()
    Keyboard.dismiss()
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
    }

    if (!obj.address2 || obj.address2 === '' || obj.address2 === '0') {
      Toast.show({
        type: 'info',
        text2: obj.address2 === '0' ? 'Número inválido, digite outro' : 'É necessário inserir o número',
      })
      return
    }

    setIsLoading(true)
    let userDto = {
      address1: obj.address1,
      address2: obj.address2,
      state: obj.state,
      city: obj.city,
      postalCode: cleanNumberMask(obj.postalCode) ?? obj.postalCode,
      addressComplement: obj.addressComplement,
      country: obj.country,
      phone1: cleanNumberMask(obj.phone1) ?? obj.phone1,
      phone2: cleanNumberMask(obj.phone2) ?? obj.phone2,
    }

    try {

      if (patientDisplay) {
        await updatePatient({
          ...patientDisplay.patientDto,
          susNumber: obj.susNumber === '' || !obj.susNumber ? null : obj.susNumber,
        })
      }
      await updateUser(userDto)
      updateUserStore()
      loadFields()
    } catch (error) {
      setIsLoading(false)
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
    try {
      const response = await launchImageLibraryFromDevice()
      if (response.assets) {
        Alert.alert(
          'Deseja alterar sua foto de perfil?',
          '',
          [
            {
              text: 'Sim',
              style: 'default',
              onPress: () => changeProfilePic(response.assets)
            },
            {
              text: 'Não',
              style: 'cancel'
            }
          ]
        )
      }

    } catch (err: any) {
      console.error(err)
      Toast.show({
        type: 'danger',
        text2: 'Ocorreu um erro ao abrir a biblioteca',
      })
    }
  }

  const changeProfilePic = async (file?: Asset[]) => {
    const formData = new FormData()

    if (!ids?.userId) {
      Toast.show({
        type: 'warning',
        text2: 'Erro ao carregar dados do perfil. Faça login novamente',
      })
      return
    }

    if (file && file[0]) {
      formData.append('fileFormat', file[0].fileName)
      formData.append('file', {
        uri: Platform.OS === 'android'
          ? file[0].uri
          : file[0].uri && file[0].uri.replace('file://', ''),
        name: file[0].fileName,
        type: file[0].type
      })
      formData.append('entityId', ids?.userId.toString())
      formData.append('entityType', getEntityType('user'))
      formData.append('documentType', getDocumentType('user'))

      const response = await uploadUserFile(formData)
      if (response && response.status === 201) {

        if (file[0].uri) {
          const base64 = await readFileFromDevice(file[0].uri)
          if (base64)
            dispatch(setProfilePic({ base64: base64, id: response.data.id }))
        }
        if (profilePicId) {
          await userDelete(profilePicId)
        }
        Toast.show({
          type: 'success',
          text2: 'Foto de perfil de atualizada com sucesso!',
        })

      } else {
        Toast.show({
          type: 'danger',
          text2: 'Erro ao atualizar foto de perfil',
        })
      }
    }
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

  const refreshProfile = () => {
    setRefreshing(true)
    if (sessionUser && profilePic) {
      loadProfilePic(sessionUser.userId)
    }
  }

  return (
    <>
      <HeaderProfile showSaveButton disableSaveButton={isLoading} actionSaveButton={editProfile} />
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
              onRefresh={refreshProfile}
            />
          }
        >
          {profilePic !== '' && profilePic ? (
            <ProfileAvatar
              style={styles.profileAvatar as StyleProp<ImageStyle>}
              resizeMode='contain'
              source={{ uri: `data:image/jpeg;base64,${profilePic}` }}
              editButton={renderPhotoButton}
            />
          ) : (
            <ProfileAvatar
              style={styles.profileAvatar as StyleProp<ImageStyle>}
              resizeMode='contain'
              source={require('../../../../assets/profile/profile.png')}
              editButton={renderPhotoButton}
            />
          )}
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
                value: 8,
                message: `Mín. 8 caracteres`
              },
            }}
            render={({ field }) => (
              <ProfileSetting
                style={styles.profileSetting}
                hint='Telefone 1'
                inputProps={{
                  value: field.value,
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
                value: 8,
                message: `Mín. 8 caracteres`
              },
            }}
            render={({ field }) => (
              <ProfileSetting
                style={styles.profileSetting}
                hint='Telefone 2'
                inputProps={{
                  value: field.value,
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
                      maxLength: 9,
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