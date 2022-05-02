import HeaderProfile from '@components/header/admin/profile'
import { useAppDispatch, useAppSelector } from '@hooks/redux'
import { useDatepickerService } from '@hooks/useDatepickerService'
import { EUserRole } from '@models/UserRole'
import { useFocusEffect } from '@react-navigation/native'
import { Button, Icon, IconProps, useStyleSheet } from '@ui-kitten/components'
import { formatCpf, formatPhone } from '@utils/mask'
import React, { FC, ReactElement, useCallback } from 'react'
import { useForm } from 'react-hook-form'
import { ImageStyle, ScrollView, StyleProp, View } from 'react-native'
import { getPatient, updatePatient } from 'services/patient.service'
import { getUserDetails, updateUser } from 'services/user.service'
import { RootState } from 'store'
import { setProfile } from 'store/ducks/profile'
import ProfileAvatar from './profile-avatar'
import ProfileSetting from './profile-setting'
import { editProfileStyle } from './style'

const EditProfileScreen: FC = (): ReactElement => {

  const { sessionUser } = useAppSelector((state: RootState) => state.auth)
  const styles = useStyleSheet(editProfileStyle)
  const { localeDateService, format } = useDatepickerService()
  const form = useForm()
  const dispatch = useAppDispatch()
  const { profile: userDetails } = useAppSelector((state: RootState) => state.profile)

  const loadFields = async () => {
    const response = await getPatient()
    form.reset({
      ...userDetails,
      dateOfBirth: userDetails?.dateOfBirth ? localeDateService.format(localeDateService.parse(userDetails?.dateOfBirth.toString(), "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'"), format) : '',
      cpf: userDetails?.cpf ? formatCpf(userDetails?.cpf) : userDetails?.cpf,
      phone1: userDetails?.phone1 ? formatPhone(userDetails?.phone1) : userDetails?.phone1,
      phone2: userDetails?.phone2 ? formatPhone(userDetails?.phone2) : userDetails?.phone2,
      username: userDetails?.cpf,

      mothersName: response.data?.mothersName,
      susNumber: response.data?.susNumber,
      sex: response.data?.sex
    })
  }
  useFocusEffect(
    useCallback(() => {
      loadFields()
    }, [userDetails])
  )

  const editProfile = async () => {
    const obj = form.getValues()

    try {
      await updateUser({
        name: obj.name,
        phone1: obj.phone1,
        phone2: obj.phone2,
        mothersName: obj.mothersName,

        address1: obj.address1,
        address2: obj.address2,
        state: obj.state,
        city: obj.city,
        postalCode: obj.postalCode,
        addressComplement: obj.addressComplement,
        country: obj.country
      })
      await updatePatient({
        susNumber: obj.susNumber
      })

      const res = await getUserDetails()
      dispatch(setProfile(res.data))
    } catch (error) {

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

  return (
    <>
      <HeaderProfile />
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}>
        <ProfileAvatar
          style={styles.profileAvatar as StyleProp<ImageStyle>}
          source={require('../../../../assets/profile/profile.png')}
          editButton={renderPhotoButton}
        />
        <ProfileSetting
          name='username'
          form={form}
          style={[styles.profileSetting, styles.section]}
          hint='Usuário'
          inputProps={{
            editable: false,
            textAlign: 'right',
            multiline: true,
            scrollEnabled: true
          }}
        />
        <ProfileSetting
          name='cpf'
          form={form}
          style={styles.profileSetting}
          hint='CPF'
          inputProps={{
            editable: false,
            textAlign: 'right',
            multiline: true,
            scrollEnabled: true
          }}
        />
        <ProfileSetting
          name='email'
          form={form}
          style={styles.profileSetting}
          hint='E-mail'
          inputProps={{
            editable: false,
            textAlign: 'right',
            multiline: true,
            scrollEnabled: true,
          }}
        />

        <ProfileSetting
          name='name'
          form={form}
          style={[styles.profileSetting, styles.section]}
          hint='Meu Nome'
          inputProps={{
            editable: true,
            textAlign: 'right',
            keyboardType: 'default',
            multiline: true,
            scrollEnabled: true,
            maxLength: 60,
            returnKeyType: "next",
            onSubmitEditing: () => form.setFocus('mothersName'),
            autoCapitalize: "words",
            textContentType: "name"
          }}
        />
        {sessionUser?.userRole.find(e => e.id === EUserRole.patient) && (
          <ProfileSetting
            name='mothersName'
            form={form}
            style={styles.profileSetting}
            hint='Nome da Mãe'
            inputProps={{
              editable: true,
              textAlign: 'right',
              keyboardType: 'default',
              multiline: true,
              scrollEnabled: true,
              maxLength: 60,
              returnKeyType: "next",
              autoCapitalize: "words"
              // onSubmitEditing: () => form.setFocus('dateOfBirth')
            }}
          />
        )}
        <ProfileSetting
          name='dateOfBirth'
          form={form}
          style={styles.profileSetting}
          hint='Data de Nascimento'
          inputProps={{
            editable: false,
            textAlign: 'right',
            multiline: true,
            scrollEnabled: true
          }}
        />

        <ProfileSetting
          name='phone1'
          form={form}
          style={styles.profileSetting}
          hint='Telefone 1'
          inputProps={{
            keyboardType: 'number-pad',
            editable: true,
            textAlign: 'right',
            multiline: true,
            scrollEnabled: true,
            maxLength: 15,
            textContentType: "telephoneNumber"
          }}
        />
        <ProfileSetting
          name='phone2'
          form={form}
          style={styles.profileSetting}
          hint='Telefone 2'
          inputProps={{
            keyboardType: 'number-pad',
            editable: true,
            textAlign: 'right',
            multiline: true,
            scrollEnabled: true,
            maxLength: 15,
            textContentType: "telephoneNumber"
          }}
        />

        {sessionUser?.userRole.find(e => e.id === EUserRole.patient) && (
          <ProfileSetting
            name='susNumber'
            form={form}
            style={styles.profileSetting}
            hint='Cartão Nacional de Saúde'
            inputProps={{
              keyboardType: 'number-pad',
              editable: true,
              textAlign: 'right',
              multiline: true,
              scrollEnabled: true,
              maxLength: 16
            }}
          />
        )}
        <View style={styles.editViewButton}>
          <Button
            size='small'
            status='primary'
            appearance='ghost'
            onPress={editProfile}>
            SALVAR
          </Button>
        </View>

        <ProfileSetting
          name='postalCode'
          form={form}
          style={[styles.profileSetting, styles.section]}
          hint='CEP'
          inputProps={{
            keyboardType: 'number-pad',
            editable: true,
            textAlign: 'right',
            multiline: true,
            scrollEnabled: true
          }}
        />
        <ProfileSetting
          name='address1'
          form={form}
          style={[styles.profileSetting]}
          hint='Endereço'
          inputProps={{
            editable: true,
            textAlign: 'right',
            multiline: true,
            scrollEnabled: true
          }}
        />
        <ProfileSetting
          name='address2'
          form={form}
          style={styles.profileSetting}
          hint='Número'
          inputProps={{
            keyboardType: 'number-pad',
            editable: true,
            textAlign: 'right',
            multiline: true,
            scrollEnabled: true
          }}
        />
        <ProfileSetting
          name='addressComplement'
          form={form}
          style={styles.profileSetting}
          hint='Complemento'
          inputProps={{
            editable: true,
            textAlign: 'right',
            multiline: true,
            scrollEnabled: true
          }}
        />
        <ProfileSetting
          name='city'
          form={form}
          style={styles.profileSetting}
          hint='Cidade'
          inputProps={{
            editable: true,
            textAlign: 'right',
            multiline: true,
            scrollEnabled: true
          }}
        />
        <ProfileSetting
          name='state'
          form={form}
          style={styles.profileSetting}
          hint='Estado'
          inputProps={{
            editable: true,
            textAlign: 'right',
            multiline: true,
            scrollEnabled: true,
            maxLength: 2,
          }}
        />
        <ProfileSetting
          name='country'
          form={form}
          style={styles.profileSetting}
          hint='País'
          inputProps={{
            editable: true,
            textAlign: 'right',
            multiline: true,
            scrollEnabled: true
          }}
        />

        <View style={styles.editViewButton}>
          <Button
            size='small'
            status='primary'
            appearance='ghost'
            onPress={editProfile}>
            SALVAR
          </Button>
        </View>
      </ScrollView>
    </>
  )
}

export default EditProfileScreen