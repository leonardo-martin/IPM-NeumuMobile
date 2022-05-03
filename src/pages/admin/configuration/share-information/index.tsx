import { SafeAreaLayout } from '@components/safeAreaLayout'
import { Text, useStyleSheet } from '@ui-kitten/components'
import React, { FC, ReactElement } from 'react'
import { View } from 'react-native'
import ShareInfoRoutes from 'routes/share-info.routes'
import { shareStyle } from './style'

const ShareInformationWithMedicalDoctorScreen: FC = (): ReactElement => {

    const styles = useStyleSheet(shareStyle)

    return (
        <SafeAreaLayout style={styles.safeArea}>
            <View style={styles.container}>
                <Text style={styles.title}>Aviso!</Text>
                <Text style={styles.message}>Ao aceitar o compartilhamento das informações com um
                    Profissional de Saúde, o Sr(a) está ciente que o mesmo terá acesso as suas informações somente para promover o melhor atendimento.</Text>
            </View>
            <ShareInfoRoutes />
        </SafeAreaLayout>
    )
}

export default ShareInformationWithMedicalDoctorScreen