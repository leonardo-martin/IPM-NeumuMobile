import React, { FC, ReactElement, useCallback, useState } from 'react'
import { Image, ImageStyle, Linking, ScrollView, Share, StyleProp, View } from 'react-native'
import { Button, Divider, Text, useStyleSheet } from '@ui-kitten/components'
import { DrawerContentComponentProps } from '@react-navigation/drawer'
import { useFocusEffect, useRoute } from '@react-navigation/native'
import { Profile as DoctorProfile } from '@services/message.service'
import { doctorProfileStyle } from './style'
import { MessageCircleIcon, PhoneCallIcon, ShareIcon } from './extra/icons'

const DoctorProfileScreen: FC<DrawerContentComponentProps> = ({
  navigation
}): ReactElement => {

  const styles = useStyleSheet(doctorProfileStyle)
  const route = useRoute()
  const { params } = route
  const [profile, setProfile] = useState<DoctorProfile | undefined>(undefined)

  useFocusEffect(
    useCallback(() => {
      const profile = route?.params as DoctorProfile
      setProfile(new DoctorProfile(
        profile.id,
        profile.firstName,
        profile.lastName,
        profile.photo,
        profile.phone,
        profile.location,
        profile.description
      ))
    }, [params])
  )

  const onCallButtonPress = (): void => {
    if (profile?.phone !== undefined)
      Linking.openURL(`tel:${profile?.phone}`)
    else console.warn('não há telefone atrelado ao perfil')
  }

  const onMessageButtonPress = (): void => {
    // TODO
  }

  const onShare = async () => {
    try {
      await Share.share({
        title: `Dr(a) ${profile?.fullName} - TeleNeumu`,
        message: `Olá, eu sou ${profile?.fullName}. Aguardo seu contato pelo telefone ${profile?.phone}`
      })
    } catch (error: any) {
      console.error(error.message)
    }
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header} >
        <Image
          style={styles.image as StyleProp<ImageStyle>}
          source={{ uri: 'https://image.flaticon.com/icons/png/512/2894/premium/2894760.png' }}
        />
        <Text
          style={styles.profileName}
          category='h5'
          status='basic'>
          {profile?.fullName}
        </Text>
        <View style={styles.locationContainer}>
          <Text
            style={styles.location}
            status='basic'>
            {profile?.location}
          </Text>
        </View>
        <View style={styles.profileButtonsContainer}>
          <Button style={styles.profileButton}
            status='control'
            accessoryLeft={PhoneCallIcon}
            onPress={onCallButtonPress} />
          <Button style={styles.profileButton}
            status='control'
            accessoryLeft={MessageCircleIcon}
            onPress={onCallButtonPress} />
          <Button style={styles.profileButton}
            status='control'
            accessoryLeft={ShareIcon}
            onPress={onShare} />
        </View>
      </View>
      <View style={styles.viewAbout}>
        <Divider style={styles.divider} />
        <Text style={styles.textAbout}>
          {profile?.description}
        </Text>
      </View>
    </ScrollView>
  )
}

export default DoctorProfileScreen