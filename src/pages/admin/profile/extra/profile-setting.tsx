import { Divider, Input, InputProps, Layout, LayoutProps, Text } from '@ui-kitten/components'
import React, { FC, ReactElement } from 'react'
import { Controller, UseFormReturn } from 'react-hook-form'
import { StyleSheet } from 'react-native'

export interface ProfileSettingProps extends LayoutProps {
  hint: string
  form: UseFormReturn<any, any>
  name: string
  inputProps?: InputProps
}

const ProfileSetting: FC<ProfileSettingProps> = ({ style, hint, inputProps, form, name,
  ...layoutProps }): ReactElement => {

  return (
    <React.Fragment>
      <Layout
        level='1'
        {...layoutProps}
        style={[styles.container, style]}>
        <Text
          appearance='hint'
          category='label'>
          {hint}
        </Text>
        <Controller
          control={form.control}
          render={({ field: { onChange, onBlur, value, name, ref } }) => (
            <Input
              {...inputProps}
              ref={ref}
              size='small'
              value={value}
              testID={name}
              onBlur={onBlur}
              onChangeText={inputProps?.editable ? onChange : undefined}
              style={styles.input}
              textStyle={styles.textStyle}
            />
          )}
          name={name}
        />
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
  input: {
    width: '60%',
    borderWidth: 0,
    backgroundColor: 'transparent'
  },
  textStyle: {
    minHeight: 30,
    textAlignVertical: 'center',
    fontSize: 12
  }
})
