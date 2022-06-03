import HeaderAuth from '@components/header/auth'
import RNWebView from '@components/webView'
import WaitingApprovalsScreen from '@pages/approvals-waiting'
import ChangePasswordChoice from '@pages/changePassword'
import PasswordChangeConfirmationScreen from '@pages/changePassword/extra/change-confirmation'
import PasswordRequestSuccessfullyScreen from '@pages/changePassword/extra/request-successfully'
import ChangePasswordWithToken from '@pages/changePassword/password-with-token'
import ChangePasswordRequest from '@pages/changePassword/selected-password-change-mode'
import ContactUsScren from '@pages/contact-us'
import SignIn from '@pages/signin'
import SignUpScreen from '@pages/signup'
import RegistrationConfirmation from '@pages/signup/confirmation'
import { createStackNavigator, StackCardInterpolationProps, TransitionPresets } from '@react-navigation/stack'
import { TransitionSpec } from '@react-navigation/stack/lib/typescript/src/types'
import React, { FC, ReactElement } from 'react'


const { Navigator, Screen, Group } = createStackNavigator()

const AuthRoutes: FC = (): ReactElement => {

  const transitionSpec: {
    open: TransitionSpec
    close: TransitionSpec
  } = {
    open: { animation: 'timing', config: { duration: 500 } },
    close: { animation: 'timing', config: { duration: 500 } }
  }

  const cardStyleInterpolator = (props: StackCardInterpolationProps) => {
    return {
      cardStyle: {
        opacity: props.current.progress
      }
    }
  }

  return (
    <Navigator
      initialRouteName="SignIn"
      screenOptions={{
        headerShown: false,
        gestureEnabled: false,
      }}
    >
      <Group screenOptions={{
        headerMode: 'float',
        headerShown: false,
        ...TransitionPresets.SlideFromRightIOS
      }}>
        <Screen name="SignIn" component={SignIn} />
        <Screen name="RegistrationConfirmation" component={RegistrationConfirmation} />
        <Screen name="PasswordRequestSuccessfully" component={PasswordRequestSuccessfullyScreen}
          options={{
            ...TransitionPresets.ModalSlideFromBottomIOS
          }} />
        <Screen name="PasswordChangeConfirmation" component={PasswordChangeConfirmationScreen}
          options={{
            ...TransitionPresets.ModalSlideFromBottomIOS
          }} />
        <Screen name="WebViewScreen" component={RNWebView} options={{
          gestureDirection: "horizontal",
          gestureEnabled: true,
        }} />

        <Screen name="WaitingApprovals" component={WaitingApprovalsScreen}
          options={{
            ...TransitionPresets.ScaleFromCenterAndroid
          }} />

      </Group>

      <Group screenOptions={{
        headerShown: true,
        header: () => <HeaderAuth />,
        transitionSpec: transitionSpec,
        cardStyleInterpolator: cardStyleInterpolator
      }}>
        <Screen name="ChangePasswordChoice" component={ChangePasswordChoice}
          options={{
            ...TransitionPresets.ModalSlideFromBottomIOS
          }} />
        <Screen name="ChangePasswordRequest" component={ChangePasswordRequest} />
        <Screen name="ChangePasswordWithToken" component={ChangePasswordWithToken}
          options={{
            ...TransitionPresets.ModalSlideFromBottomIOS
          }} />
        <Screen name="ContactUs" component={ContactUsScren}
          options={{
            ...TransitionPresets.ModalSlideFromBottomIOS
          }} />
      </Group>

      <Group screenOptions={{
        headerShown: false,
        transitionSpec: transitionSpec,
        cardStyleInterpolator: cardStyleInterpolator
      }}>
        <Screen name='SignUp' component={SignUpScreen}
          options={{
            ...TransitionPresets.ModalSlideFromBottomIOS
          }} />
      </Group>

    </Navigator>
  )
}

export default AuthRoutes
