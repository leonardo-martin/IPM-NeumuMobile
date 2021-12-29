import React, { FC, ReactElement, useEffect } from 'react'
import { BackHandler, Platform, Share, View } from 'react-native'
import { Icon, IconProps, Layout, MenuItem, OverflowMenu, Text, TopNavigation, TopNavigationAction } from '@ui-kitten/components'
import { useNavigation, useRoute } from '@react-navigation/native'
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

    const BackIcon = (props: IconProps) => (
        <Icon {...props} name={Platform.OS === 'ios' ? 'arrow-ios-back-outline' : Platform.OS === 'android' ? 'arrow-back-outline' : 'arrow-back-outline'} size={25} pack='ionicons'/>
    )

    const OptionsIcon = (props: IconProps) => (
        <Icon {...props} name="ellipsis-vertical-outline" size={25} pack='ionicons'/>
    )

    const ShareIcon = (props: IconProps) => (
        <Icon {...props} name='share-social-outline' size={25} onPress={onShare} pack='ionicons'/>
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