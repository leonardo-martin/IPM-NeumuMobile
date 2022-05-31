import { SafeAreaLayout } from '@components/safeAreaLayout'
import { useNavigation, useRoute } from '@react-navigation/native'
import { Button, Text, useStyleSheet } from '@ui-kitten/components'
import { ApprovalsMessageError } from '@models/Common'
import React, { FC, ReactElement, useEffect, useState } from 'react'
import { View } from 'react-native'
import { approvalsWaitingStyle } from './style'

const COLOR_LEVEL = '4'

const WaitingApprovalsScreen: FC = (): ReactElement => {

    const styles = useStyleSheet(approvalsWaitingStyle)
    const navigation = useNavigation<any>()
    const back = () => navigation.navigate('SignIn')
    const route = useRoute()
    const [params, setParams] = useState<{ message: string }>()

    useEffect(() => {
        setParams(route.params as { message: string })
    }, [route.params])

    return (
        <>
            <SafeAreaLayout insets='top' level={COLOR_LEVEL} style={styles.safeArea}>
                <View style={styles.container}>
                    {params?.message === ApprovalsMessageError.REJECTED ?
                        <>
                            <Text style={[styles.text, styles.title]}>Infelizmente seu acesso foi recusado</Text>
                            <Text style={styles.text}>Entre em contato via e-mail para mais detalhes.</Text></>
                        :
                        <>
                            <Text style={[styles.text, styles.title]}>Obrigado por fazer parte do TeleNeuMu!</Text>
                            <Text style={styles.text}>Estamos validando algumas informações e em breve o seu acesso será liberado.</Text>
                        </>
                    }
                    <View style={{ paddingTop: 15 }} >
                        <Button
                            onPress={back}
                            size='small'
                            status='info'
                            appearance='ghost'>Voltar ao login</Button>
                    </View>
                </View>
                {params?.message === ApprovalsMessageError.NOTVERIFIED && (
                    <View style={styles.containerBottom}>
                        <Text style={[styles.text, { fontSize: 12 }]}>Caso esteja demorando mais do que o normal, entre em contato via e-email.</Text>
                    </View>
                )}
            </SafeAreaLayout>
        </>
    )

}

export default WaitingApprovalsScreen