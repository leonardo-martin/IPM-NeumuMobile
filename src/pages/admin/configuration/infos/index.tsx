import React, { FC, ReactElement } from 'react'
import { View } from 'react-native'
import { Text } from '@ui-kitten/components'
import { AppInfoService } from '@services/app-info.service'
import { SafeAreaLayout } from '@components/safeAreaLayout'

import { infoAppStyle } from './style'
import LogoPedroMolina from '@assets/svg/logo.svg'

const _VERSION: string = AppInfoService.getVersion()

const InformationAppScreen: FC = (): ReactElement => {

    return (
        <SafeAreaLayout style={infoAppStyle.content}>
            <View style={infoAppStyle.viewInfoApp}>
                <LogoPedroMolina width="180" height="180" />
                <View style={infoAppStyle.viewText}>
                    <View style={{ flexDirection: 'row' }}>
                        <Text category="label" status='basic' style={infoAppStyle.text}>IPM {"&"}</Text>
                        <Text category="label" status='primary' style={infoAppStyle.text}>{" "}ATOS{" "}</Text>
                        <Text category="label" status='basic' style={infoAppStyle.text}>Brasil</Text>
                    </View>
                    <Text category="c2" style={infoAppStyle.text}>Versão {_VERSION}</Text>
                </View>
            </View>
        </SafeAreaLayout>
    )
}

export default InformationAppScreen
