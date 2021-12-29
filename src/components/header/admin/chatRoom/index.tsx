import React, { FC, ReactElement, useEffect } from 'react'
import { BackHandler, Platform, Share, View } from 'react-native'
import { Layout, MenuItem, OverflowMenu, Text, TopNavigation, TopNavigationAction } from '@ui-kitten/components'
import { useNavigation, useRoute } from '@react-navigation/native'
import Icon from 'react-native-vector-icons/Ionicons'
import { headerStyle } from './style'

const HeaderChatRoom: FC = (): ReactElement => {
    const [visible, setVisible] = React.useState(false)

    const { goBack } = useNavigation<any>()
    const route = useRoute()

    const onShare = async () => {
        try {
            await Share.share({
                message:
                    'Baixe o app do TeleNeumu e conheça nosso trabalho.',
            })
        } catch (error: any) {
            console.log(error.message)
        }
    }

    const BackIcon = () => (
        <Icon name={Platform.OS === 'ios' ? 'chevron-back-outline' : Platform.OS === 'android' ? 'arrow-back-outline' : 'arrow-back-outline'}
            size={35} />
    )

    const OptionsIcon = () => (
        <Icon name="ellipsis-vertical-outline" size={25} />
    )

    const ShareIcon = () => (
        <Icon name='share-social-outline' size={20} onPress={onShare} />
    )

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

    const renderRightActions = () => (
        <React.Fragment>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <TopNavigationAction
                    icon={ShareIcon}
                    onPress={() => setVisible(!visible)}
                />
                <OverflowMenu
                    backdropStyle={headerStyle.backdrop}
                    visible={visible}
                    anchor={renderRightIcon}
                    onBackdropPress={() => setVisible(!visible)}>
                    <MenuItem
                        title={(props) => <Text {...props} style={[props?.style, {
                            fontSize: 20
                        }]}>Detalhes</Text>}
                        onPress={() => console.log("info")}
                    />
                </OverflowMenu>
            </View>
        </React.Fragment>
    )

    return (
        <Layout level="1" style={headerStyle.layout}>
            <TopNavigation
                alignment="center"
                title={() => <Text style={{ fontSize: 20 }}>{(route.params as any).username}</Text>}
                accessoryLeft={renderLeftIcon}
                accessoryRight={renderRightActions}
            />
        </Layout>
    )
}

export default HeaderChatRoom