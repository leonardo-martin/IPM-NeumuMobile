import React, { FC, ReactElement, useState } from 'react'
import { Linking, SafeAreaView, TouchableOpacity, View } from 'react-native'
import { registerStyle } from '../style'
import { Input, Button, Text, Modal, Card } from '@ui-kitten/components'
import { Controller, useForm } from 'react-hook-form'
import { UserData } from '@models/User'
import { useNavigation } from '@react-navigation/core'
import Icon from 'react-native-vector-icons/Ionicons'

const SignUpPart1Screen: FC = (): ReactElement => {

  const [visible, setVisible] = useState<boolean>(false)
  const { control, handleSubmit, formState: { errors } } = useForm<UserData>()
  const navigation = useNavigation<any>()
  const submit = (data: UserData) => {
    navigation.navigate('SignUpPart2', { data: data })
  }

  const renderLabelCNS = () => (
    <React.Fragment>
      <View style={registerStyle.labelCNSView}>
        <Text category="label" style={registerStyle.labelCNSText}>
          Cartão Nacional de Saúde (CNS) *
        </Text>
        <Icon name="help-circle-outline" size={20} color={'#8F9BB3'} onPress={() => setVisible(true)} />
      </View>
    </React.Fragment>
  )

  return (
    <>
      <SafeAreaView style={registerStyle.content}>
        <View style={registerStyle.box}>
          <Controller
            control={control}
            rules={{
              required: true
            }}
            render={({ field: { onChange, onBlur, value, ref, ...field } }) => (
              <Input
                label="Nome da Mãe *"
                style={registerStyle.input}
                keyboardType='default'
                testID='mothersName'
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                underlineColorAndroid="transparent"
                {...field}
                ref={ref}

              />
            )}
            name='mothersName'
            defaultValue=''
          />
          {errors.mothersName?.type === 'required' && <Text category='s2' style={[registerStyle.text, { paddingBottom: 10 }]}>Campo obrigatório</Text>}
          <Controller
            control={control}
            rules={{
              required: true
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Nome *"
                style={registerStyle.input}
                keyboardType='default'
                testID='name'
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                underlineColorAndroid="transparent"
              />
            )}
            name='name'
            defaultValue=''
          />
          {errors.name?.type === 'required' && <Text category='s2' style={[registerStyle.text, { paddingBottom: 10 }]}>Campo obrigatório</Text>}
          <Controller
            control={control}
            rules={{
              required: true,
              minLength: 11,
              pattern: /[0-9]/
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="CPF *"
                style={registerStyle.input}
                keyboardType='number-pad'
                testID='cpf'
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                underlineColorAndroid="transparent"
              />
            )}
            name='cpf'
            defaultValue=''
          />
          {errors.cpf?.type === 'pattern' && <Text category='s2' style={[registerStyle.text, { paddingBottom: 10 }]}>Invalid</Text>}
          {errors.cpf?.type === 'minLength' && <Text category='s2' style={[registerStyle.text, { paddingBottom: 10 }]}>Min 11</Text>}
          {errors.cpf?.type === 'required' && <Text category='s2' style={[registerStyle.text, { paddingBottom: 10 }]}>Campo obrigatório</Text>}
          <Controller
            control={control}
            rules={{
              required: true,
              pattern: /[0-9]/
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Telefone 1 *"
                style={registerStyle.input}
                keyboardType='number-pad'
                testID='phone'
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                maxLength={12}
                underlineColorAndroid="transparent"
              />
            )}
            name='phone'
            defaultValue=''
          />
          {errors.phone?.type === 'pattern' && <Text category='s2' style={[registerStyle.text, { paddingBottom: 10 }]}>Invalid</Text>}
          {errors.phone?.type === 'required' && <Text category='s2' style={[registerStyle.text, { paddingBottom: 10 }]}>Campo obrigatório</Text>}
          <Controller
            control={control}
            rules={{
              required: false,
              pattern: /[0-9]/
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Telefone 2"
                style={[registerStyle.input, { paddingBottom: 10 }]}
                keyboardType='number-pad'
                testID='phone2'
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                maxLength={12}
                underlineColorAndroid="transparent"
              />
            )}
            name='phone2'
            defaultValue=''
          />
          {errors.phone2?.type === 'pattern' && <Text category='s2' style={[registerStyle.text, { paddingBottom: 10 }]}>Invalid</Text>}
          <Controller
            control={control}
            rules={{
              required: true,
              minLength: 15,
              pattern: /[0-9]/
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label={renderLabelCNS}
                style={registerStyle.input}
                keyboardType='number-pad'
                testID='cns'
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                maxLength={16}
                underlineColorAndroid="transparent"
              />
            )}
            name='cns'
            defaultValue=''
          />
          {errors.cns?.type === 'minLength' && <Text category='s2' style={[registerStyle.text, { paddingBottom: 10 }]}>Min 15</Text>}
          {errors.cns?.type === 'pattern' && <Text category='s2' style={[registerStyle.text, { paddingBottom: 10 }]}>Invalid</Text>}
          {errors.cns?.type === 'required' && <Text category='s2' style={[registerStyle.text, { paddingBottom: 10 }]}>Campo obrigatório</Text>}

          <Button
            onPress={handleSubmit(submit)}
            style={registerStyle.button}
            status="primary"
          >
            CONTINUAR
          </Button>

          {/* <Modal
            visible={visible}
            backdropStyle={registerStyle.backdrop}
            onBackdropPress={() => setVisible(false)} >
            <Card disabled={true} >
              <View style={registerStyle.labelCNSViewCard}>
                <Text style={registerStyle.labelCNSTextCenter}>O Cartão Nacional de Saúde (CNS) é o documento de identificação do usuário do SUS.</Text>
              </View>
              <TouchableOpacity
                onPress={() => Linking.openURL('https://www.gov.br/saude/pt-br/acesso-a-informacao/acoes-e-programas/cartao-nacional-de-saude')}
                hitSlop={{
                  left: 10,
                  right: 10,
                  top: 10,
                  bottom: 10
                }}
              >
                <Text status="primary" style={registerStyle.labelCNSTextCenter}>
                  SAIBA MAIS
                </Text>
              </TouchableOpacity>
            </Card>
          </Modal> */}
        </View>
      </SafeAreaView>
    </>
  )
}

export default SignUpPart1Screen
