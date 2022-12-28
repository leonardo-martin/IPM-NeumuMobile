import { Divider, Input, InputProps, Layout, LayoutProps, Text } from '@ui-kitten/components'
import React, { FC, ReactElement, useRef } from 'react'
import { StyleSheet, TouchableWithoutFeedback, View } from 'react-native'

export interface ProfileSettingProps extends LayoutProps {
  hint: string
  inputProps?: InputProps
}

const ProfileSetting: FC<ProfileSettingProps> = ({ style,
  hint, inputProps, ...layoutProps }): ReactElement => {

  const inputRef = useRef<Input>(null)
  const onFocus = () => inputRef.current?.focus()

  return (
    <React.Fragment>
      <Layout
        level='1'
        {...layoutProps}
        style={[styles.container, style]}>
        <TouchableWithoutFeedback onPressIn={onFocus}>
          <View style={styles.view} >
            <Text
              style={styles.label}
              appearance='hint'>
              {hint}
            </Text>
            <Input
              {...inputProps}
              ref={inputRef}
              size='small'
              style={styles.input}
              textStyle={styles.textStyle}
            />
          </View>
        </TouchableWithoutFeedback>
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
  label: {
    fontSize: 14
  },
  textStyle: {
    minHeight: 30,
    textAlignVertical: 'center',
    fontSize: 16,
    fontWeight: '600'
  }
})
