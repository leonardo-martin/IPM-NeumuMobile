import React, { FC, ReactElement } from 'react'
import { SafeAreaView, View } from 'react-native'
import { Text } from 'react-native-paper'
import HeaderComponent from '../../components/header'
import { useAuth } from '../../contexts/auth'
import { NavigationProps } from '../../models/Navigation'
import { dashboardStyle } from './style'

const Dashboard: FC<NavigationProps> = ({ navigation }): ReactElement => {

    const { currentUser } = useAuth()

    return (
        <SafeAreaView style={dashboardStyle.content}>
            <HeaderComponent
                title='Dashboard'
                navigation={navigation}
                hasBackButton={false} />
            <View style={dashboardStyle.content}>
              
                    <Text style={dashboardStyle.text}>Hello {currentUser?.user} !</Text>
               
            </View>
        </SafeAreaView>
    )
}

export default Dashboard