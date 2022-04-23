import HeaderProfile from '@components/header/admin/profile'
import { BOOTDEY_URI } from '@constants/uri'
import toast from '@helpers/toast'
import { useDatepickerService } from '@hooks/useDatepickerService'
import { useFetch } from '@hooks/useSwr'
import { useFocusEffect } from '@react-navigation/native'
import { Button, Icon, IconProps, useStyleSheet } from '@ui-kitten/components'
import { formatCpf, formatPhone } from '@utils/mask'
import React, { FC, ReactElement, useCallback, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { ImageStyle, ScrollView, StyleProp, View } from 'react-native'
import ProfileAvatar from './profile-avatar'
import ProfileSetting from './profile-setting'
import { editProfileStyle } from './style'

const EditProfileScreen: FC = (): ReactElement => {

  const styles = useStyleSheet(editProfileStyle)
  const { localeDateService, format } = useDatepickerService()
  const form = useForm()

  const [isEditable, setIsEditable] = useState<boolean>(false)
  const [isFetching, setIsFetching] = useState<boolean>(false)
  const { data: userDetails, error } = useFetch(isFetching ? 'user' : null)

  useFocusEffect(
    useCallback(() => {
      setIsFetching(true)
      return () => setIsFetching(false)
    }, [])
  )

  useFocusEffect(
    useCallback(() => {
      setIsEditable(false)
    }, [])
  )

  useEffect(() => {
    if (error !== undefined && userDetails === undefined) {
      toast.danger({ message: 'Ocorreu um erro ao obter o perfil.', duration: 1000 })
    } else {
      form.reset({
        ...userDetails,
        dateOfBirth: userDetails?.dateOfBirth ? localeDateService.format(localeDateService.parse(userDetails?.dateOfBirth, "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'"), format) : '',
        cpf: userDetails?.cpf ? formatCpf(userDetails?.cpf) : userDetails?.cpf,
        phone1: userDetails?.phone1 ? formatPhone(userDetails?.phone1) : userDetails?.phone1,
        phone2: userDetails?.phone2 ? formatPhone(userDetails?.phone2) : userDetails?.phone2,
        username: userDetails?.cpf,
      })
    }
  }, [error, userDetails])

  const editProfile = (): void => {
    // setIsEditable(true)
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
          hint='Nome Completo'
          inputProps={{
            editable: isEditable,
            textAlign: 'right',
            multiline: true,
            scrollEnabled: true
          }}
        />
        <ProfileSetting
          name='dateOfBirth'
          form={form}
          style={styles.profileSetting}
          hint='Data de Nascimento'
          inputProps={{
            editable: isEditable,
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
          name='phone1'
          form={form}
          style={styles.profileSetting}
          hint='Telefone 1'
          inputProps={{
            editable: isEditable,
            textAlign: 'right',
            multiline: true,
            scrollEnabled: true
          }}
        />
        <ProfileSetting
          name='phone2'
          form={form}
          style={styles.profileSetting}
          hint='Telefone 2'
          inputProps={{
            editable: isEditable,
            textAlign: 'right',
            multiline: true,
            scrollEnabled: true
          }}
        />
        <View style={styles.editViewButton}>
          <Button
            disabled
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
            editable: isEditable,
            textAlign: 'right',
            multiline: true,
            scrollEnabled: true
          }}
        />
        <ProfileSetting
          name='address1'
          form={form}
          style={[styles.profileSetting]}
          hint='Endereço 1'
          inputProps={{
            editable: isEditable,
            textAlign: 'right',
            multiline: true,
            scrollEnabled: true
          }}
        />
        <ProfileSetting
          name='address2'
          form={form}
          style={styles.profileSetting}
          hint='Endereço 2'
          inputProps={{
            editable: isEditable,
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
            editable: isEditable,
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
            editable: isEditable,
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
            editable: isEditable,
            textAlign: 'right',
            multiline: true,
            scrollEnabled: true,
            maxLength: 2
          }}
        />
        <ProfileSetting
          name='country'
          form={form}
          style={styles.profileSetting}
          hint='País'
          inputProps={{
            editable: isEditable,
            textAlign: 'right',
            multiline: true,
            scrollEnabled: true
          }}
        />

        <View style={styles.editViewButton}>
          <Button
            disabled
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