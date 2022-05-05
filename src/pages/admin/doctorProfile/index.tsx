import { SafeAreaLayout } from '@components/safeAreaLayout'
import toast from '@helpers/toast'
import { MedicalDoctorDisplay } from '@models/Medical'
import { DrawerContentComponentProps } from '@react-navigation/drawer'
import { useFocusEffect, useRoute } from '@react-navigation/native'
import { patientGetAuthorizationRequests, patientGrantAuthorization } from '@services/patient.service'
import { Button, CheckBox, Divider, Text, useStyleSheet } from '@ui-kitten/components'
import React, { FC, ReactElement, useCallback, useState } from 'react'
import { Image, ImageStyle, Linking, Platform, Share, StyleProp, View } from 'react-native'
import { PhoneCallIcon, ShareIcon } from './extra/icons'
import { doctorProfileStyle } from './style'

const DoctorProfileScreen: FC<DrawerContentComponentProps> = (): ReactElement => {

  const styles = useStyleSheet(doctorProfileStyle)
  const route = useRoute()
  const [profile, setProfile] = useState<MedicalDoctorDisplay>()
  const [checked, setChecked] = useState(false)

  const loadChecked = async () => {
    const res = await patientGetAuthorizationRequests({ authorized: true })
    if (res && res.data) {
      res.data.forEach(e => {
        if (e.doctorId === profile?.medicalDoctorId) {
          setChecked(e.doctorId === profile?.medicalDoctorId)
        }
      })
    }
  }

  useFocusEffect(
    useCallback(() => {
      if(profile) loadChecked()
    }, [profile])
  )

  useFocusEffect(
    useCallback(() => {
      const doctor = route.params as MedicalDoctorDisplay
      setProfile(doctor)
    }, [route?.params])
  )

  const handleAuthorized = async (checked: boolean, _indeterminate: boolean) => {
    setChecked(checked)

    try {
      if (profile?.medicalDoctorId)
        await patientGrantAuthorization({ medicalDoctorId: profile.medicalDoctorId.toString(), authorization: checked })
    } catch (error) {
      toast.danger({ message: 'Erro ao permitir o compartilhamento', duration: 3000 })
    }
  }

  const onCallButtonPress = useCallback(async () => {

    if (profile?.phone1 !== undefined) {
      let url = `tel:${profile?.phone1}`
      if (Platform.OS === 'ios') url = `tel:${profile?.phone1}`
      else if (Platform.OS === 'android') url = `tel:${profile?.phone1}`

      const supported = await Linking.canOpenURL(url)

      if (supported) {
        await Linking.openURL(url)
      } else {
        toast.danger({ message: 'Ocorreu um erro ao abrir o Phone app.', duration: 1000 })
      }
    } else
      toast.info({ message: 'Nenhum telefone encontrado.', duration: 1000 })
  }, [profile])

  const onMessageButtonPress = (): void => {
    // TODO
  }

  const onShare = async () => {
    try {
      await Share.share({
        title: `Dr(a) ${profile?.name} - TeleNeuMu`,
        message: `Olá, eu sou ${profile?.name}. Aguardo seu contato pelo telefone ${profile?.name}`
      })
    } catch (error: any) {
      toast.danger({ message: 'Ocorreu um erro ao compartilhar.', duration: 1000 })
    }
  }

  return (
    <>
      <SafeAreaLayout level='1' style={styles.safeArea}>
        <View style={styles.content} >
          <Image
            style={styles.image as StyleProp<ImageStyle>}
            source={require('../../../assets/profile/doctor-card.png')}
          />
          <Text
            style={styles.profileName}
            status='basic'>
            {profile?.name}
          </Text>
          <View style={styles.locationContainer}>
            <Text
              style={styles.location}
              status='basic'>
              {profile?.address1 + ' - ' + profile?.city + ', ' + profile?.state}
            </Text>
          </View>
          <View style={styles.profileButtonsContainer}>
            <Button style={styles.profileButton}
              status='control'
              accessoryLeft={PhoneCallIcon}
              onPress={onCallButtonPress} />
            {/* <Button style={styles.profileButton}
            status='control'
            accessoryLeft={MessageCircleIcon}
            onPress={onMessageButtonPress}
          /> */}
            <Button style={styles.profileButton}
              status='control'
              accessoryLeft={ShareIcon}
              onPress={onShare} />
          </View>
        </View>
        <Divider style={styles.divider} />
        <View style={styles.viewAbout}>
          <Text style={styles.textAbout}>
            {profile?.specialty ?? ''}
          </Text>
          <Text
            style={styles.text}
            status='basic'>
            {'N° ' + profile?.crm}
          </Text>
        </View>
        <View style={{
          alignItems: 'center',
          padding: 20
        }}>
          <View style={styles.controlContainer}>
            <CheckBox
              checked={checked}
              onChange={handleAuthorized}
              style={styles.checkbox}
              status='control'>
              {evaProps => <Text style={[evaProps?.style, {
                textAlign: 'center', alignItems: 'center', alignSelf: 'center'
              }]}>Permitir o compartilhamento de informações com este Profissional de Saúde</Text>}
            </CheckBox>
          </View>
        </View>
      </SafeAreaLayout>
    </>
  )
}

export default DoctorProfileScreen