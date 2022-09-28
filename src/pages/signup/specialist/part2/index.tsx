import CustomErrorMessage from '@components/error'
import CountryPicker from '@components/picker/CountryPicker'
import { COUNTRY } from '@constants/common'
import { useModal } from '@hooks/useModal'
import { DoctorSignUpProps } from '@models/SignUpProps'
import { registerStyle } from '@pages/signup/style'
import { Icon, Input, Text, useStyleSheet } from '@ui-kitten/components'
import React, { FC, ReactElement, useEffect, useState } from 'react'
import { Controller } from 'react-hook-form'
import { Pressable, View } from 'react-native'
import { Modalize } from 'react-native-modalize'
import { Portal } from 'react-native-portalize'

const DoctorSignUpPart2Screen: FC<DoctorSignUpProps> = ({ form, onSubmit }): ReactElement => {

  const styles = useStyleSheet(registerStyle)
  const { ref: modalizeRef } = useModal<Modalize>()
  const [countryCode, setCountryCode] = useState<string>(COUNTRY.DIAL_CODE)
  const openCountryPicker = () => modalizeRef.current?.open()

  const CountrySelectBox = () => (
    <Pressable onPress={openCountryPicker} style={{
      flexDirection: 'row',
      alignItems: 'center',
    }}>
      <Text category='c1'>{countryCode}</Text>
      <Icon name='chevron-down-outline' size={10} />
    </Pressable>
  )

  useEffect(() => {
    form.setValue('countryCode', countryCode)
  }, [countryCode])

  return (
    <>
      <Portal>
        <CountryPicker ref={modalizeRef} setValue={setCountryCode} />
      </Portal>
      <View style={styles.box}>
        <Controller
          control={form.control}
          rules={{
            required: {
              value: true,
              message: 'Campo obrigatório'
            },
            minLength: {
              value: 8,
              message: `Mín. 8 caracteres`
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
              value={value}
              maxLength={15}
              ref={ref}
              returnKeyType="done"
              onSubmitEditing={() => form.setFocus('phone2')}
              underlineColorAndroid="transparent"
              textContentType="telephoneNumber"
              accessoryLeft={CountrySelectBox}
              placeholder="Digite seu telefone (DDD+número)"
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
              value: 8,
              message: `Mín. 8 caracteres`
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
              value={value}
              maxLength={15}
              ref={ref}
              returnKeyType="send"
              onSubmitEditing={form.handleSubmit(onSubmit)}
              underlineColorAndroid="transparent"
              textContentType="telephoneNumber"
              accessoryLeft={CountrySelectBox}
              placeholder="Digite seu telefone (DDD+número)"
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