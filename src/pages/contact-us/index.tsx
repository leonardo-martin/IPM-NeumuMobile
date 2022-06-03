import { SafeAreaLayout } from '@components/safeAreaLayout'
import { INSTITUTE_URI } from '@constants/uri'
import { Button, Icon, IconElement, IconProps, Text, useStyleSheet } from '@ui-kitten/components'
import { openMailTo } from '@utils/common'
import React, { FC, ReactElement } from 'react'
import { Image, ImageStyle, Linking, StyleProp, TouchableOpacity, View } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'
import { contactUsStyle } from './style'

const ContactUsScren: FC = (): ReactElement => {

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
            <ScrollView
                contentContainerStyle={{ flex: 1 }}
                showsVerticalScrollIndicator={false}>
                <View style={styles.container}>
                    <View style={styles.containerSocial}>
                        <Text style={styles.text}>Redes Sociais</Text>
                        <View style={{
                            flexDirection: 'row'
                        }}>
                            <Button
                                style={[styles.button, styles.instagram, styles.shadow]}
                                accessoryLeft={InstagramIcon}
                                onPress={() => openSocialLink('https://www.instagram.com/institutopedromolina')}
                            />

                            <Button
                                style={[styles.button, styles.youtube, styles.shadow]}
                                accessoryLeft={YoutubeIcon}
                                onPress={() => openSocialLink('https://www.youtube.com/channel/UCssN4wsXsTRCmaiMVyaRBOQ')}
                            />

                            <Button
                                style={[styles.button, styles.linkedin, styles.shadow]}
                                accessoryLeft={LinkedInIcon}
                                onPress={() => openSocialLink('https://www.linkedin.com/in/ipm-social-579897240')}
                            />

                            <Button
                                style={[styles.button, styles.mail, styles.shadow]}
                                accessoryLeft={MailIcon}
                                onPress={openMailTo}
                            />

                        </View>
                    </View>
                    <View style={styles.containerSocial}>
                        <Text style={styles.text}>INSTITUTO PEDRO MOLINA</Text>
                        <TouchableOpacity
                            style={{
                                alignItems: 'center'
                            }}
                            onPress={() => openSocialLink(INSTITUTE_URI)}>
                            <Image source={require('../../assets/commons/logo_ipm.png')}
                                style={styles.image as StyleProp<ImageStyle>} />
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaLayout >
    )
}

export default ContactUsScren