import { DrawerContentComponentProps } from '@react-navigation/drawer'
import React, { FC, ReactElement } from 'react'
import { SafeAreaView } from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons'
import ListComponent from '@components/menuList'
import { configurationStyle } from './style'

const ConfigurationScreen: FC<DrawerContentComponentProps> = ({
    navigation
}): ReactElement => {

    return (
        <>
            <SafeAreaView style={configurationStyle.content}>

                <ListComponent data={[
                    {
                        id: 1,
                        title: 'Conta',
                        accessoryLeft: () => (
                            <Icon name="key-outline" size={20} color={"#000"} />
                        )
                    },
                    {
                        id: 2,
                        title: 'Notificações',
                        accessoryLeft: () => (
                            <Icon name="notifications-outline" size={20} color={"#000"} />
                        )
                    },
                    {
                        id: 3,
                        title: 'Centro de Ajuda',
                        accessoryLeft: () => (
                            <Icon name="help-circle-outline" size={20} color={"#000"} />
                        ),
                        description: 'Dúvidas? Precisa de Ajuda?'
                    },
                    {
                        id: 4,
                        title: 'Termos e Política de Privacidade',
                        accessoryLeft: () => (
                            <Icon name="lock-closed-outline" size={20} color={"#000"} />
                        )
                    },
                    {
                        id: 5,
                        title: 'Informações do Aplicativo',
                        accessoryLeft: () => (
                            <Icon name="information-circle-outline" size={20} color={"#000"} />
                        ),
                        onPress: () => navigation.navigate('InformationApp')
                    }
                ]}
                    rightIconShow={false}
                    scrollEnabled={false}
                    divider={true}
                />

            </SafeAreaView>
        </>
    )
}

export default ConfigurationScreen
