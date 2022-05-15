import { Divider, Input, InputProps, Layout, LayoutProps, Text } from '@ui-kitten/components'
import React, { FC, ReactElement } from 'react'
import { StyleSheet, View } from 'react-native'

export interface ProfileSettingProps extends LayoutProps {
  hint: string
  inputProps?: InputProps
}

const ProfileSetting: FC<ProfileSettingProps> = ({ style,
  hint, inputProps, ...layoutProps }): ReactElement => {

  return (
    <React.Fragment>
      <Layout
        level='1'
        {...layoutProps}
        style={[styles.container, style]}>
        <View style={styles.view}>
          <Text
            appearance='hint'
            category='label'>
            {hint}
          </Text>
          <Input
            {...inputProps}
            size='small' style={styles.input}
            textStyle={styles.textStyle}
          />
        </View>
      </Layout>
      <Divider />
    </React.Fragment>
  )
}

export default ProfileSetting

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  view: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  input: {
    borderWidth: 0,
    backgroundColor: 'transparent',
    width: '50%'
  },
  textStyle: {
    minHeight: 30,
    textAlignVertical: 'center',
    fontSize: 12
  }
})
