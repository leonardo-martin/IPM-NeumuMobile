import React, { FC, ReactElement } from 'react'
import { SafeAreaView, View } from 'react-native'
import { Text, Button } from '@ui-kitten/components'
import { useAuth } from '../../contexts/auth'
import { dashboardStyle } from './style'

const DashboardScreen: FC = (): ReactElement => {

    const { currentUser, signOut } = useAuth()

    return (
        <SafeAreaView style={dashboardStyle.content}>
            <View style={dashboardStyle.content}>

                <Text style={dashboardStyle.text}>{`Hello ${currentUser?.user}`}</Text>
                <Button
                    onPress={signOut}
                    testID='RegisterButton'
                    status='primary'>
                    Sair
                </Button>
            </View>
        </SafeAreaView>
    )
}

export default DashboardScreen