import React, { FC, ReactElement, useCallback, useEffect, useState } from 'react'
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
import { formatDateFromISOToString } from '@utils/convertDate'
import { useFocusEffect } from '@react-navigation/native'

const EditProfileScreen: FC<DrawerContentComponentProps> = ({
  navigation
}): ReactElement => {

  const styles = useStyleSheet(editProfileStyle)

  const { currentUser } = useAuth()
  const [isFetching, setIsFetching] = useState<boolean>(false)
  const { data: userDetails, error } = useFetch(isFetching ? 'user' : null)
  const [visibleToast, setVisibleToast] = useState(false)
  const [message, setMessage] = useState<string>('')
  useEffect(() => setVisibleToast(false), [visibleToast])

  useFocusEffect(
    useCallback(() => {
      setIsFetching(true)
      return () => setIsFetching(false)
    }, [])
  )

  useEffect(() => {
    if (error !== undefined && userDetails === undefined) {
      setMessage('Ocorreu um erro ao obter o perfil.')
      setVisibleToast(true)
    } else {
      setVisibleToast(false)
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
          hint='Data de Nascimento'
          value={userDetails?.dateOfBirth ? formatDateFromISOToString(userDetails?.dateOfBirth) : ''}
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