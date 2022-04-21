import HeaderProfile from '@components/header/admin/profile'
import { BOOTDEY_URI } from '@constants/uri'
import toast from '@helpers/toast'
import { useDatepickerService } from '@hooks/useDatepickerService'
import { useFetch } from '@hooks/useSwr'
import { DrawerContentComponentProps } from '@react-navigation/drawer'
import { useFocusEffect } from '@react-navigation/native'
import { Button, Icon, IconProps, useStyleSheet } from '@ui-kitten/components'
import { formatCpf, formatPhone } from '@utils/mask'
import React, { FC, ReactElement, useCallback, useEffect, useState } from 'react'
import { ImageStyle, ScrollView, StyleProp } from 'react-native'
import ProfileAvatar from './profile-avatar'
import ProfileSetting from './profile-setting'
import { editProfileStyle } from './style'

const EditProfileScreen: FC<DrawerContentComponentProps> = ({
  navigation
}): ReactElement => {

  const styles = useStyleSheet(editProfileStyle)
  const { localeDateService, format } = useDatepickerService()

  const [isFetching, setIsFetching] = useState<boolean>(false)
  const { data: userDetails, error } = useFetch(isFetching ? 'user' : null)

  useFocusEffect(
    useCallback(() => {
      setIsFetching(true)
      return () => setIsFetching(false)
    }, [])
  )

  useEffect(() => {
    if (error !== undefined && userDetails === undefined) {
      toast.danger({ message: 'Ocorreu um erro ao obter o perfil.', duration: 1000 })
    }
  }, [error, userDetails])

  const onDoneButtonPress = (): void => {
    // TODO
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
          source={{ uri: BOOTDEY_URI + '/img/Content/avatar/avatar6.png' }}
          editButton={renderPhotoButton}
        />
        <ProfileSetting
          style={[styles.profileSetting, styles.section]}
          hint='Nome Completo'
          value={userDetails?.name}
        />
        <ProfileSetting
          style={styles.profileSetting}
          hint='Data de Nascimento'
          value={userDetails?.dateOfBirth ? localeDateService.format(localeDateService.parse(userDetails?.dateOfBirth, "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'"), format) : ''}
        />
        <ProfileSetting
          style={styles.profileSetting}
          hint='CPF'
          value={userDetails?.cpf ? formatCpf(userDetails?.cpf) : userDetails?.cpf}
        />
        <ProfileSetting
          style={styles.profileSetting}
          hint='Telefone 1'
          value={userDetails?.phone1 ? formatPhone(userDetails?.phone1) : userDetails?.phone1}
        />
        <ProfileSetting
          style={styles.profileSetting}
          hint='Telefone 2'
          value={userDetails?.phone2 ? formatPhone(userDetails?.phone2) : userDetails?.phone2}
        />
        <ProfileSetting
          style={[styles.profileSetting, styles.section]}
          hint='CEP'
          value={userDetails?.postalCode}
        />
        <ProfileSetting
          style={[styles.profileSetting]}
          hint='Endereço 1'
          value={userDetails?.address1}
        />
        <ProfileSetting
          style={styles.profileSetting}
          hint='Endereço 2'
          value={userDetails?.address2}
        />
        <ProfileSetting
          style={styles.profileSetting}
          hint='Complemento'
          value={userDetails?.addressComplement}
        />
        <ProfileSetting
          style={styles.profileSetting}
          hint='Cidade'
          value={userDetails?.city}
        />
        <ProfileSetting
          style={styles.profileSetting}
          hint='Estado'
          value={userDetails?.state}
        />
        <ProfileSetting
          style={styles.profileSetting}
          hint='País'
          value={userDetails?.country}
        />

        <ProfileSetting
          style={[styles.profileSetting, styles.section]}
          hint='Usuário'
          value={userDetails?.cpf}
        />
        <ProfileSetting
          style={styles.profileSetting}
          hint='E-mail'
          value={userDetails?.email}
        />
        <Button
          disabled
          style={styles.editButton}
          onPress={onDoneButtonPress}>
          EDITAR PERFIL
        </Button>
      </ScrollView>
    </>
  )
}

export default EditProfileScreen