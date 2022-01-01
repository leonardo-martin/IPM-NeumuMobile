import React, { FC, ReactElement, useEffect, useState } from 'react'
import { ImageBackground, ImageStyle, ScrollView, StyleProp } from 'react-native'
import { Button, Icon, IconProps, useStyleSheet } from '@ui-kitten/components'
import ProfileAvatar from './profile-avatar'
import ProfileSetting from './profile-setting'
import { DrawerContentComponentProps } from '@react-navigation/drawer'
import { useFetch } from '@hooks/useSwr'
import { useAuth } from '@contexts/auth'
import { editProfileStyle } from './style'
import Toast from '@components/toast'
import { UserPermission } from '@services/permission.service'

const EditProfileScreen: FC<DrawerContentComponentProps> = ({
  navigation
}): ReactElement => {
  const [visibleToast, setVisibleToast] = useState(false)
  const [message, setMessage] = useState<string>('')
  const styles = useStyleSheet(editProfileStyle)

  useEffect(() => setVisibleToast(false), [visibleToast])

  const { currentUser } = useAuth()
  const { data: userDetails, error } = useFetch('/user')

  useEffect(() => {
    if (error !== undefined) {
      setMessage('Ocorreu um erro ao obter o perfil.')
      setVisibleToast(true)
    }
  }, [error])

  const onDoneButtonPress = (): void => {
    // TODO
  }

  const CameraIcon = (props: IconProps) => (
    <Icon {...props} style={[props.style, {
      textAlign: 'center'
    }]} name='pencil-outline' pack='ionicons' size={15} />
  )

  const handlePickAvatar = async () => {
    const isAllowed = await UserPermission.getCameraPermission()
    if (isAllowed) {
      console.log('liberado')
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

  return (
    <>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}>
        <ProfileAvatar
          style={styles.profileAvatar as StyleProp<ImageStyle>}
          source={{ uri: 'https://bootdey.com/img/Content/avatar/avatar6.png' }}
          ImageComponent={ImageBackground}
          editButton={renderPhotoButton}
        />
        <ProfileSetting
          style={[styles.profileSetting, styles.section]}
          hint='Nome Completo'
          value={userDetails?.name}
        />
        <ProfileSetting
          style={styles.profileSetting}
          hint='CPF'
          value={userDetails?.cpf}
        />
        <ProfileSetting
          style={styles.profileSetting}
          hint='Telefone 1'
          value={userDetails?.phone1}
        />
        <ProfileSetting
          style={styles.profileSetting}
          hint='Telefone 2'
          value={userDetails?.phone2}
        />

        <ProfileSetting
          style={[styles.profileSetting, styles.section]}
          hint='Nome de Usuário'
          value={currentUser ? currentUser?.user : ''}
        />
        <ProfileSetting
          style={styles.profileSetting}
          hint='E-mail'
          value={userDetails?.email}
        />
        <Button
          style={styles.editButton}
          onPress={onDoneButtonPress}>
          EDITAR PERFIL
        </Button>
      </ScrollView>
      <Toast visible={visibleToast} message={message} xOffset={0} />
    </>
  )
}

export default EditProfileScreen