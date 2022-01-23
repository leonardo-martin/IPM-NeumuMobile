import React, { FC, ReactElement, useEffect, useState } from 'react'
import { BackHandler, View } from 'react-native'
import { Icon, IconProps, Layout, MenuItem, OverflowMenu, Text, TopNavigation, TopNavigationAction, useStyleSheet } from '@ui-kitten/components'
import { useNavigation, useRoute } from '@react-navigation/native'
import { headerStyle } from './style'
import { Message, Profile } from '@services/message.service'
import { BackIcon, OptionsIcon } from 'components/header/icons/icons'

const HeaderChatRoom: FC = (): ReactElement => {
    const [visible, setVisible] = useState(false)
    const styles = useStyleSheet(headerStyle)

    const { goBack, navigate } = useNavigation<any>()
    const route = useRoute()
    const { params } = route
    const [profile, setProfile] = useState<Profile | undefined>((params as Message).profile)

    useEffect(() => {
        setProfile((params as Message).profile)
    }, [params])    

    const renderLeftIcon = () => (
        <TopNavigationAction
            icon={BackIcon}
            onPress={goBack}
        />
    )

    const renderRightIcon = () => (
        <TopNavigationAction
            icon={OptionsIcon}
            onPress={() => setVisible(!visible)}
        />
    )

    useEffect(() => {
        const backHandler = BackHandler.addEventListener(
            "hardwareBackPress",
            () => {
                setVisible(false)
                return null
            }
        )
        return () => backHandler.remove()
    }, [])

    const goAbout = () => {
        navigate("DoctorProfile", {
            ...profile,
            location: 'São Paulo, 123 - CEP 12345-456 - SP',
            description: `Olá. Eu sou ${profile?.fullName}`,
            phone: '11 1111-1111'
        })
        setVisible(false)
    }

    const renderLeftDetailsIcon = (props: IconProps) => (
        <Icon {...props} name="information-circle-outline" size={30} pack='ionicons' />
    )

    const renderRightActions = () => (
        <>
            <View style={styles.viewActions}>
                <OverflowMenu
                    backdropStyle={styles.backdrop}
                    visible={visible}
                    anchor={renderRightIcon}
                    onBackdropPress={() => setVisible(!visible)}>
                    <MenuItem
                        accessoryLeft={renderLeftDetailsIcon}
                        title={(props) => <Text {...props} style={[props?.style, styles.text]}>Detalhes</Text>}
                        onPress={goAbout}
                    />
                </OverflowMenu>
            </View>
        </>
    )

    return (
        <Layout level="1" style={styles.layout}>
            <TopNavigation
                alignment="center"
                title={() => <Text style={[styles.text, styles.titleSecondary]}>{profile?.fullName}</Text>}
                accessoryLeft={renderLeftIcon}
                accessoryRight={renderRightActions}
            />
        </Layout>
    )
}

export default HeaderChatRoom