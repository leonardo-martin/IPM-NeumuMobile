import { SafeAreaLayout } from '@components/safeAreaLayout'
import { Text, useStyleSheet } from '@ui-kitten/components'
import React, { FC, ReactElement } from 'react'
import { View } from 'react-native'
import { resetPasswordByTokenStyle } from './style'

const ChangePasswordWithToken: FC = (): ReactElement => {

    const styles = useStyleSheet(resetPasswordByTokenStyle)

    return (
        <>
            <SafeAreaLayout level='1' style={styles.safeArea}>
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <Text>Trocar a senha usando token</Text>
                </View>
            </SafeAreaLayout>
        </>
    )
}

export default ChangePasswordWithToken