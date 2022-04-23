import ListComponent from '@components/list'
import { useTheme } from '@contexts/theme'
import { Divider, Text, Toggle } from '@ui-kitten/components'
import React, { FC, ReactElement } from 'react'
import { TouchableOpacity } from 'react-native'
import { data } from './data'
import { configurationStyle } from './style'


const ConfigurationScreen: FC = (): ReactElement => {

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
            renderItem={undefined}
        //TODO! - Desabilitado para lançamento da v1
        // ListFooterComponent={renderFooter}
        />
    )
}

export default ConfigurationScreen