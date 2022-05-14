import { BackIcon, OptionsIcon } from '@components/header/icons'
import { useAppSelector } from '@hooks/redux'
import { ChatListEntryDto } from '@models/ChatMessage'
import { useNavigation, useRoute } from '@react-navigation/native'
import { Icon, IconProps, Layout, MenuItem, OverflowMenu, Text, TopNavigation, TopNavigationAction, useStyleSheet } from '@ui-kitten/components'
import React, { FC, ReactElement, useEffect, useState } from 'react'
import { BackHandler, View } from 'react-native'
import { RootState } from 'store'
import { headerStyle } from './style'

const HeaderChatRoom: FC = (): ReactElement => {
    const [visible, setVisible] = useState(false)
    const styles = useStyleSheet(headerStyle)

    const { goBack, navigate } = useNavigation<any>()
    const route = useRoute()
    const { params } = route
    const [profile, setProfile] = useState<ChatListEntryDto | undefined>((params as ChatListEntryDto))
    const { ids } = useAppSelector((state: RootState) => state.user)

    useEffect(() => {
        setProfile((params as ChatListEntryDto))
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
            // location: 'São Paulo, 123 - CEP 12345-456 - SP',
            // description: `Olá. Eu sou ${profile?.fullName}`,
            // phone: '11 1111-1111'
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
                title={profile?.senderID === ids?.userId ? profile?.receiverName : profile?.senderName}
                accessoryLeft={renderLeftIcon}
                //! Desabilitado temporariamente
                // accessoryRight={renderRightActions}
            />
        </Layout>
    )
}

export default HeaderChatRoom