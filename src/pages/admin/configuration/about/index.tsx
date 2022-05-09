import { SafeAreaLayout } from '@components/safeAreaLayout'
import { AppInfoService } from '@services/app-info.service'
import { Text, useStyleSheet } from '@ui-kitten/components'
import React, { FC, ReactElement } from 'react'
import { View } from 'react-native'
import { infoAppStyle } from './style'

const _VERSION: string = AppInfoService.getVersion()

const InformationAppScreen: FC = (): ReactElement => {

    const styles = useStyleSheet(infoAppStyle)

    return (
        <SafeAreaLayout level='1' insets='top' style={styles.safeArea}>
            <View style={[styles.container, { flex: .1 }]}>
                <Text category="p1" style={styles.text}>{'Versão do Aplicativo'.toUpperCase()}</Text>
                <Text category="label" style={styles.text}>{_VERSION}</Text>

            </View>
            <View style={[styles.container, { flex: .8, paddingHorizontal: 30 }]}>
                <Text style={styles.about}>
                    Olá! Somos um aplicativo desenvolvido pelo Instituto Pedro Molina com foco em promover uma inovação importante no contato entre pacientes, médicos e profissionais da saúde aos portadores de doenças neuromusculares.
                </Text>
            </View>
            <View style={[styles.container, { flex: .1 }]}>
                <Text style={styles.motivationalMessage}>
                    Nos ajude a transformar este sonho em realidade.
                </Text>
                <Text style={styles.regards}>Muito Obrigado!</Text>
            </View>
        </SafeAreaLayout>
    )
}

export default InformationAppScreen
