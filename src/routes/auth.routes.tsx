import React, { FC, ReactElement } from 'react'
import { createStackNavigator, TransitionPresets } from '@react-navigation/stack'
import HeaderAuth from '@components/header/auth'

import SignIn from '@pages/signin'
import SignUpPart1Screen from '@pages/signup/part1'
import SignUpPart2Screen from '@pages/signup/part2'
import ChangePasswordChoice from '@pages/changePassword'
import ChangePasswordRequest from '@pages/changePassword/changePasswordSpecific'
import SignUpPart3Screen from '@pages/signup/part3'
import RegistrationConfirmation from '@pages/signup/confirmation'

const { Navigator, Screen, Group } = createStackNavigator()

const AuthRoutes: FC = (): ReactElement => {

  return (
    <Navigator
      initialRouteName="SignIn"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Group screenOptions={{
        headerMode: 'float',
        headerShown: false,
        gestureEnabled: false,
        ...TransitionPresets.FadeFromBottomAndroid
      }}>
        <Screen name="SignIn" component={SignIn} />
        <Screen name="RegistrationConfirmation" component={RegistrationConfirmation} />
      </Group>

      <Group screenOptions={{
        headerShown: true,
        header: () => <HeaderAuth />,
        gestureEnabled: false,
        transitionSpec: {
          open: { animation: 'timing', config: { duration: 500 } },
          close: { animation: 'timing', config: { duration: 500 } }
        },
        cardStyleInterpolator: ({ current: { progress } }) => {
          return {
            cardStyle: {
              opacity: progress
            }
          }
        }
      }}>
        <Screen name="SignUp" component={SignUpPart1Screen} />
        <Screen name="SignUpPart2" component={SignUpPart2Screen} />
        <Screen name="SignUpPart3" component={SignUpPart3Screen} />
        <Screen name="ChangePasswordChoice" component={ChangePasswordChoice} />
        <Screen name="ChangePasswordRequest" component={ChangePasswordRequest} />
      </Group>
    </Navigator>
  )
}

export default AuthRoutes
