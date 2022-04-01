import React, { FC, ReactElement } from 'react'
import { createStackNavigator, TransitionPresets } from '@react-navigation/stack'
import Onboarding from '@pages/onboarding'

interface OnboardingProps {
    setOnboarded: (value: boolean) => void
}

const { Navigator, Screen, Group } = createStackNavigator()

const OnboardingRoutes: FC<OnboardingProps> = ({ setOnboarded }): ReactElement => {

    return (
        <Navigator
            initialRouteName="Onboarding"
        >
            <Group screenOptions={{
                headerShown: false,
                ...TransitionPresets.ModalFadeTransition
            }}>
                <Screen name="Onboarding">
                    {() => <Onboarding setOnboarded={setOnboarded} />}
                </Screen>
            </Group>
        </Navigator>
    )
}

export default OnboardingRoutes
