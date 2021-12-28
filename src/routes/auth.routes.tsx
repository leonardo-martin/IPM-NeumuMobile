import React, { FC, ReactElement } from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import HeaderAuth from '@components/header/auth'

import SignIn from '@pages/signin'
import SignUpPart1Screen from '@pages/signup/part1'
import SignUpPart2Screen from '@pages/signup/part2'
import ChangePasswordChoice from '@pages/changePassword'
import ChangePasswordRequest from '@pages/changePassword/changePasswordSpecific'

const { Navigator, Screen, Group } = createStackNavigator()

const AuthRoutes: FC = (): ReactElement => {

  return (
    <Navigator
      initialRouteName="SignIn"
      screenOptions={{
        headerShown: false
      }}
    >
      <Screen name="SignIn" component={SignIn} />
      <Group screenOptions={{
        headerShown: true,
        header: () => <HeaderAuth />
      }}>
        <Screen name="SignUp" component={SignUpPart1Screen} />
        <Screen name="SignUpPart2" component={SignUpPart2Screen} />
        <Screen name="ChangePasswordChoice" component={ChangePasswordChoice} />
        <Screen name="ChangePasswordRequest" component={ChangePasswordRequest} />
      </Group>
    </Navigator>
  )
}

export default AuthRoutes
