import HeaderProfile from '@components/header/admin/profile'
import ListComponent from '@components/list'
import LoadingIndicatorComponent from '@components/loadingIndicator'
import { SafeAreaLayout } from '@components/safeAreaLayout'
import { useAppDispatch, useAppSelector } from '@hooks/redux'
import { EUserRole } from '@models/UserRole'
import { useFocusEffect, useNavigation } from '@react-navigation/native'
import { deleteUserSelf, getProfilePicture } from '@services/user.service'
import { logout } from '@store/ducks/auth'
import { RootState } from '@store/index'
import { Avatar, Button, Icon, IconProps, Spinner, Text, useStyleSheet } from '@ui-kitten/components'
import { matchMessage } from '@utils/common'
import { AxiosError } from 'axios'
import { STORAGE } from 'constants/storage'
import React, { FC, ReactElement, useCallback, useState } from 'react'
import { Alert, ImageStyle, StyleProp, TouchableOpacity, View } from 'react-native'
import Toast from 'react-native-toast-message'
import { AppStorageService } from 'services/app-storage.service'
import { commonData, operatorBaseData, patientBaseData, specialistBaseData } from './data'
import { profileStyle } from './style'

const ProfileScreen: FC = (): ReactElement => {

  const dispatch = useAppDispatch()
  const navigation = useNavigation<any>()
  const [accountIsBeingDeleted, setAccountIsBeingDeleted] = useState(false)
  const { sessionUser } = useAppSelector((state: RootState) => state.auth)
  const { ids } = useAppSelector((state: RootState) => state.user)
  const { profile, profilePic, profilePicId } = useAppSelector((state: RootState) => state.profile)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [deleteDisabled, setDeleteDisabled] = useState<boolean>(false)
  const styles = useStyleSheet(profileStyle)

  const renderIconDocumentAttach = (props: IconProps) => (
    <Icon {...props} style={styles.iconExam} name="document-attach-outline" size={15} pack='ionicons' />
  )

  const goToMyExams = () => {
    navigation.navigate('PatientDocuments')
  }

  const renderFooterComponent = () => (
    <>
      <View style={[styles.listFooter, styles.shadow]}>
        <Button
          onPress={goToMyExams}
          appearance='filled'
          status='success'
          accessoryLeft={renderIconDocumentAttach}>Meus Documentos</Button>
        {!deleteDisabled && deleteAccountConfirm()}
      </View>
    </>
  )

  const showModalDeleteAccount = () => {
    Alert.alert(
      'Deseja realmente DELETAR sua conta?',
      'Após confirmar, todos os seus dados serão deletados e esta ação não pode ser desfeita.',
      [
        {
          text: 'Sim',
          style: 'default',
          onPress: deleteAccount
        },
        {
          text: 'Cancelar',
          style: 'cancel'
        }
      ]
    )
  }

  const deleteAccount = async () => {
    setAccountIsBeingDeleted(true)

    try {
      const response = await deleteUserSelf()
      if (response.status === 200) {

        Alert.alert(
          'Sentiremos sua falta',
          '',
          [
            {
              text: 'DESCONECTAR',
              style: 'destructive',
              onPress: () => dispatch(logout())
            }
          ]
        )
      } else {
        Toast.show({
          type: 'danger',
          text2: 'Erro ao deletar a conta.',
        })
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        const message = error.response?.data?.message
        if (message) {
          const matchId = matchMessage(message)

          let errorMessage = 'Erro ao deletar a conta. Erro inesperado'
          if (matchId === 5) errorMessage = 'Para apagar a conta, você precisa sair dos programas nos quais foi inscrito'
          else if (matchId === 6) errorMessage = 'Para apagar a conta, você precisa cancelar todas suas consultas não confirmadas'
          else if (matchId === 7) errorMessage = 'Usuário especial não encontrado'
          else if (matchId === 8) errorMessage = 'Usuário não encontrado'
          else if (matchId === 9) errorMessage = 'Dados inconsistentes. Entre em contato com o administrador'

          Toast.show({
            type: 'warning',
            text2: errorMessage
          })
        } else {
          Toast.show({
            type: 'danger',
            text2: 'Erro ao deletar a conta. Tente novamente mais tarde',
          })
        }
      } else {
        Toast.show({
          type: 'danger',
          text2: 'Erro ao deletar a conta. Entre em contato com o administrador',
        })
      }
    } finally {
      setAccountIsBeingDeleted(false)
    }
  }

  const deleteAccountConfirm = () => (
    <View style={[styles.listFooter, styles.shadow]}>
      <TouchableOpacity
        style={styles.buttonContainer}
        onPress={showModalDeleteAccount}>
        <Text category='label' style={styles.textFooter}>Deletar Conta</Text>
      </TouchableOpacity>
    </View>
  )

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
    setIsLoading(false)

    return () => {
      setIsLoading(false)
    }
  }, [profilePic])

  const verifyIfUserTestIsLogged = async () => {
    const res = await AppStorageService.getItem(STORAGE.TESTE_USER)
    if (res)
      setDeleteDisabled(true)
    else
      setDeleteDisabled(false)
  }

  useFocusEffect(
    useCallback(() => {
      verifyIfUserTestIsLogged()
      setIsLoading(true)
      if (!profilePicId && ids) {
        loadProfilePic(ids.userId)
      } else {
        setIsLoading(false)
      }
      return () => {
        setIsLoading(false)
      }
    }, [ids, profilePicId])
  )

  return (
    <>
      {isLoading ? (
        <LoadingIndicatorComponent size='giant' status='primary' />
      ) : (
        <>
          <HeaderProfile />
          {accountIsBeingDeleted && (
            <View style={styles.backdropSpinner}>
              <Spinner size='giant' />
            </View>
          )}
          <SafeAreaLayout level='2' style={styles.safeArea}>
            <ListComponent
              itemStyle={styles.shadow}
              data={(sessionUser?.userRole.find(e => e.id === EUserRole.patient) ?
                patientBaseData : sessionUser?.userRole.find(e => e.id === EUserRole.operator) ?
                  operatorBaseData : sessionUser?.userRole.find(e => e.id === EUserRole.medicalDoctor || e.id === EUserRole.specialist) ?
                    specialistBaseData : commonData).filter(d => {
                      if (deleteDisabled && d.route === 'ChangePasswordChoice') return false
                      return true
                    })}
              showsVerticalScrollIndicator={false}
              ListHeaderComponent={() => (
                <>
                  <View style={styles.contentContainer}>
                    {profilePic !== '' && profilePic ? (
                      <Avatar
                        style={styles.avatar as StyleProp<ImageStyle>}
                        resizeMode='contain'
                        source={{ uri: `data:image/jpeg;base64,${profilePic}` }} />
                    ) : (
                      <Avatar
                        style={styles.avatar as StyleProp<ImageStyle>}
                        resizeMode='contain'
                        source={require('../../../assets/profile/profile.png')} />
                    )}
                    <View style={styles.body}>
                      <View style={styles.bodyContent}>
                        <Text style={styles.profileName}>@{sessionUser ? sessionUser.user : ''}</Text>
                        {profile?.address1 ? (
                          <View style={styles.viewLocation}>
                            <Icon style={styles.icon} name="location-outline" size={15} pack='ionicons' />
                            <Text status='info'>{profile?.city + " - " + profile?.state}</Text>
                          </View>
                        ) : null}
                        < Text style={styles.description}></Text>
                      </View>
                    </View>
                  </View>
                </>
              )}
              ListFooterComponent={
                sessionUser?.userRole.find(e => e.id === EUserRole.patient || e.id === EUserRole.medicalDoctor || e.id === EUserRole.specialist) ? renderFooterComponent
                  : undefined} />
          </SafeAreaLayout>
        </>
      )
      }

    </>
  )
}

export default ProfileScreen
