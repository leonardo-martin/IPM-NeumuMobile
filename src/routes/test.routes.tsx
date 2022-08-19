import { useAppSelector } from '@hooks/redux'
import { CommonActions, useFocusEffect, useNavigation } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import React, { FC, ReactElement, useCallback } from 'react'
import { BackHandler, Button } from 'react-native'
import { RootState } from 'store'
import AtosDevTestScreen from '__test__/atos'

const { Navigator, Screen } = createStackNavigator()

const TestingRoutes: FC = (): ReactElement => {

    const { isAuthenticated } = useAppSelector((state: RootState) => state.auth)
    const navigation = useNavigation<any>()
    const actions = CommonActions.reset({
        index: 0,
        routes: [
            { name: !isAuthenticated ? 'SignIn' : 'Dashboard' },
        ],
    })

    const navigate = () => navigation.dispatch(actions)

    useFocusEffect(
        useCallback(() => {
            const onBackPress = () => {
                navigate()
                return true
            }
            const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress)
            return () => subscription.remove()
        }, [])
    )
    return (
        <Navigator
            initialRouteName="HomeTest"
            screenOptions={{
                headerTitle: 'Atos - Dev',
                headerLeft: () => (
                    <Button title='Back' onPress={navigate} />
                )
            }}
        >
            <Screen name="HomeTest" component={AtosDevTestScreen} />
        </Navigator>
    )
}

export default TestingRoutes
