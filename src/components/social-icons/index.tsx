import { SafeAreaLayout } from '@components/safeAreaLayout'
import { INSTITUTE_URI } from '@constants/uri'
import { Button, Icon, IconElement, IconProps, useStyleSheet } from '@ui-kitten/components'
import { openMailTo } from '@utils/common'
import React, { FC, ReactElement } from 'react'
import { Image, ImageStyle, Linking, Pressable, StyleProp, View } from 'react-native'
import { contactUsStyle } from './style'

const SocialIconsComponent: FC = (): ReactElement => {

    const styles = useStyleSheet(contactUsStyle)

    const InstagramIcon = (props: IconProps): IconElement => (
        <Icon {...props} name='instagram'
            style={styles.icon}
            pack='font-awesome' />
    )

    const YoutubeIcon = (props: IconProps): IconElement => (
        <Icon {...props} name='youtube'
            style={styles.icon}
            pack='font-awesome' />
    )

    const LinkedInIcon = (props: IconProps): IconElement => (
        <Icon {...props} name='linkedin-in'
            style={styles.icon}
            pack='font-awesome' />
    )

    const MailIcon = (props: IconProps): IconElement => (
        <Icon {...props} name='envelope'
            style={styles.icon}
            pack='font-awesome' />
    )

    const openSocialLink = (path: string) => {
        Linking.openURL(path)
    }

    return (
        <SafeAreaLayout level='1' style={styles.safeArea}>
            <View style={styles.container}>
                <Button
                    style={[styles.button, styles.instagram]}
                    accessoryLeft={InstagramIcon}
                    onPress={() => openSocialLink('https://www.instagram.com/institutopedromolina')}
                />

                <Button
                    style={[styles.button, styles.youtube]}
                    accessoryLeft={YoutubeIcon}
                    onPress={() => openSocialLink('https://www.youtube.com/channel/UCssN4wsXsTRCmaiMVyaRBOQ')}
                />

                <Button
                    style={[styles.button, styles.linkedin]}
                    accessoryLeft={LinkedInIcon}
                    onPress={() => openSocialLink('https://www.linkedin.com/in/ipm-social-579897240')}
                />
                <View style={{
                    justifyContent: 'center'
                }}>
                    <Pressable
                        onPress={() => openSocialLink(INSTITUTE_URI)}>
                        <Image source={require('../../assets/commons/logo_ipm.png')}
                            style={styles.image as StyleProp<ImageStyle>} />
                    </Pressable>
                </View>
            </View>
        </SafeAreaLayout >
    )
}

export default SocialIconsComponent