import CustomErrorMessage from '@components/error'
import { DoctorSignUpProps } from '@models/SignUpProps'
import { registerStyle } from '@pages/signup/style'
import { Input, useStyleSheet } from '@ui-kitten/components'
import { formatPhone } from '@utils/mask'
import React, { FC, ReactElement } from 'react'
import { Controller } from 'react-hook-form'
import { View } from 'react-native'

const DoctorSignUpPart2Screen: FC<DoctorSignUpProps> = ({ form, onSubmit }): ReactElement => {

  const styles = useStyleSheet(registerStyle)

  return (
    <>
      <View style={styles.box}>
        <Controller
          control={form.control}
          rules={{
            required: {
              value: true,
              message: 'Campo obrigatório'
            },
            minLength: {
              value: 13,
              message: `Mín. 13 caracteres`
            },
          }}
          render={({ field: { onChange, onBlur, value, name, ref } }) => (
            <Input
              size='small'
              label="Telefone 1 *"
              style={styles.input}
              keyboardType='number-pad'
              testID={name}
              onBlur={onBlur}
              onChangeText={onChange}
              value={formatPhone(value)}
              maxLength={15}
              ref={ref}
              returnKeyType="done"
              onSubmitEditing={() => form.setFocus('phone2')}
              underlineColorAndroid="transparent"
              textContentType="telephoneNumber"
            />
          )}
          name='phone'
          defaultValue=''
        />
        <CustomErrorMessage name='phone' errors={form.formState.errors} />
        <Controller
          control={form.control}
          rules={{
            required: false,
            minLength: {
              value: 13,
              message: `Mín. 13 caracteres`
            },
          }}
          render={({ field: { onChange, onBlur, value, name, ref } }) => (
            <Input
              size='small'
              label="Telefone 2"
              style={[styles.input, { paddingBottom: 10 }]}
              keyboardType='number-pad'
              testID={name}
              onBlur={onBlur}
              onChangeText={onChange}
              value={formatPhone(value)}
              maxLength={15}
              ref={ref}
              returnKeyType="send"
              onSubmitEditing={form.handleSubmit(onSubmit)}
              underlineColorAndroid="transparent"
              textContentType="telephoneNumber"
            />
          )}
          name='phone2'
          defaultValue=''
        />
        <CustomErrorMessage name='phone2' errors={form.formState.errors} />
      </View>
    </>
  )
}

export default DoctorSignUpPart2Screen