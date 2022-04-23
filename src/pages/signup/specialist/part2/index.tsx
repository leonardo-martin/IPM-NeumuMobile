import { DoctorSignUpProps } from '@models/SignUpProps'
import { registerStyle } from '@pages/signup/style'
import { Input, Spinner, Text, useStyleSheet } from '@ui-kitten/components'
import { formatPhone } from '@utils/mask'
import CardAddressComponent from '@components/cards/cardAddress'
import React, { FC, ReactElement, useState } from 'react'
import { Controller } from 'react-hook-form'
import { View } from 'react-native'

const DoctorSignUpPart2Screen: FC<DoctorSignUpProps> = ({ form, onSubmit }): ReactElement => {

  const styles = useStyleSheet(registerStyle)
  const [isLoadingPostalCode, setIsLoadingPostalCode] = useState<boolean>(false)

  return (
    <>
      <View style={styles.box}>
        {isLoadingPostalCode ?
          <>
            <View style={styles.backdropSpinner}>
              <Spinner size='giant' />
            </View>
          </> : null}
        <CardAddressComponent
          styles={styles}
          form={form}
          isFetching={isLoadingPostalCode}
          handleFetchingData={setIsLoadingPostalCode}
          commercial
          />
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
              returnKeyType="next"
              onSubmitEditing={() => form.setFocus('phone2')}
              underlineColorAndroid="transparent"
              disabled={isLoadingPostalCode}
              textContentType="telephoneNumber"
            />
          )}
          name='phone'
          defaultValue=''
        />
        {form.formState.errors.phone && <Text category='s2' style={styles.text}>{form.formState.errors.phone?.message}</Text>}
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
              disabled={isLoadingPostalCode}
              textContentType="telephoneNumber"
            />
          )}
          name='phone2'
          defaultValue=''
        />
        {form.formState.errors.phone2 && <Text category='s2' style={styles.text}>{form.formState.errors.phone2?.message}</Text>}
      </View>
    </>
  )
}

export default DoctorSignUpPart2Screen