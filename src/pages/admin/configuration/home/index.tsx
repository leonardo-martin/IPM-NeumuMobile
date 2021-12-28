import React, { FC, ReactElement } from 'react'
import { Divider, Text, Toggle } from '@ui-kitten/components'
import { DrawerContentComponentProps } from '@react-navigation/drawer'

import { data } from './data'
import { configurationStyle } from './style'
import { useTheme } from '@contexts/theme'
import ListComponent from '@components/list'
import { TouchableOpacity } from 'react-native'

const ConfigurationScreen: FC<DrawerContentComponentProps> = ({
    navigation
}): ReactElement => {

    const { theme, toggleTheme } = useTheme()

    const renderFooter = () => (
        <>
            <TouchableOpacity
                activeOpacity={1.0}
                style={configurationStyle.container}
                onPress={toggleTheme}>
                <Text
                    category='s2'>
                    {theme !== 'light' ? 'Modo Escuro' : 'Modo Claro'}
                </Text>
                <Toggle
                    checked={theme !== 'light'}
                    onChange={toggleTheme}
                />
            </TouchableOpacity>
            <Divider />
        </>

    )


    return (
        <ListComponent
            data={data}
            ListFooterComponent={renderFooter}
        />
    )
}

export default ConfigurationScreen