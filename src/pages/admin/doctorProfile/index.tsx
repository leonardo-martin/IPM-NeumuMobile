import React, { FC, ReactElement, useEffect, useState } from 'react'
import { ImageStyle, Linking, ScrollView, Share, StyleProp, View } from 'react-native'
import { Avatar, Button, Icon, IconProps, Text, useStyleSheet, useTheme } from '@ui-kitten/components'
import { ImageOverlay, OverlayImageStyle } from './extra/image-overlay'
import { DrawerContentComponentProps } from '@react-navigation/drawer'
import { useRoute } from '@react-navigation/native'
import { Profile as DoctorProfile } from '@services/message.service'
import { doctorProfileStyle } from './style'

const DoctorProfileScreen: FC<DrawerContentComponentProps> = ({
  navigation, state
}): ReactElement => {

  const theme = useTheme()
  const route = useRoute()
  const { params } = route
  const [profile, setProfile] = useState<DoctorProfile | undefined>(undefined)

  useEffect(() => {
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

  const styles = useStyleSheet(doctorProfileStyle)

  const MessageCircleIcon = (props: IconProps) => (
    <Icon {...props} name='message-circle-outline' pack='eva' />
  )

  const PhoneCallIcon = (props: IconProps) => (
    <Icon {...props} name='phone-call-outline' pack='eva' />
  )

  const PinIcon = (): ReactElement => {
    return (
      <Icon
        width={16}
        height={16}
        fill={theme['text-control-color']}
        name='pin-outline'
        pack='eva'
      />
    )
  }

  const onCallButtonPress = (): void => {
    if (profile?.phone !== undefined)
      Linking.openURL(`tel:${profile?.phone}`)
    else console.warn('não há telefone atrelado ao perfil')
  }

  const onMessageButtonPress = (): void => {
    // TODO
  }

  // TODO
  const onShare = async () => {
    try {
      await Share.share({
        message: `${profile?.fullName} - ${profile?.description}`
      })
    } catch (error: any) {
      console.log(error.message)
    }
  }

  return (
    <ScrollView style={styles.container}>
      <ImageOverlay
        style={styles.header as StyleProp<OverlayImageStyle>}
        source={require('../../../assets/wallpaper_doctor_profile.jpg')}>
        <Avatar
          style={styles.profileAvatar as StyleProp<ImageStyle>}
          source={{ uri: profile?.photo }}
        />
        <Text
          style={styles.profileName}
          category='h5'
          status='control'>
          {profile?.fullName}
        </Text>
        <View style={styles.locationContainer}>
          <Text
            style={styles.location}
            status='control'>
            {profile?.location}
          </Text>
        </View>
        <View style={styles.profileButtonsContainer}>
          <Button
            style={styles.profileButton}
            status='primary'
            accessoryLeft={PhoneCallIcon}
            onPress={onCallButtonPress}>
            LIGAR
          </Button>
          <Button
            style={styles.profileButton}
            status='control'
            accessoryLeft={MessageCircleIcon}
            onPress={onMessageButtonPress}>
            MENSAGEM
          </Button>
        </View>
      </ImageOverlay>
      <Text
        style={styles.sectionLabel}
        category='s1'>
        Sobre
      </Text>
      <Text
        style={styles.profileDescription}
        appearance='hint'>
        {profile?.description}
      </Text>
    </ScrollView>
  )
}

export default DoctorProfileScreen