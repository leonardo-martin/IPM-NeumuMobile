import React, { FC, ReactElement, useCallback, useEffect, useState } from 'react'
import { SafeAreaView, TouchableOpacity, View } from 'react-native'
import { changePasswdReqStyle } from './style'
import { Radio, RadioGroup, Text, useStyleSheet } from '@ui-kitten/components'
import { useFocusEffect, useNavigation } from '@react-navigation/native'
import { SafeAreaLayout } from '@components/safeAreaLayout'

const ChangePasswordChoice: FC = (): ReactElement => {

    const [selectedIndex, setSelectedIndex] = useState(-1)
    const { navigate } = useNavigation<any>()
    const styles = useStyleSheet(changePasswdReqStyle)

    const changeWithToken = () => navigate('ChangePasswordWithToken')
    useFocusEffect(
        useCallback(() => {
            setSelectedIndex(-1)
        }, [])
    )

    useEffect(() => {
        if (selectedIndex === 0) {
            navigate('ChangePasswordRequest', {
                choice: 'CPF'
            })
        } else if (selectedIndex === 1) {
            navigate('ChangePasswordRequest', {
                choice: 'EMAIL'
            })
        }
    }, [selectedIndex])

    return (
        <>
            <SafeAreaLayout level='1' style={styles.safeArea}>
                <Text category='label' status='primary' style={styles.label}>Como deseja recuperar sua senha?</Text>
                <View style={styles.content}>
                    <RadioGroup
                        selectedIndex={selectedIndex}
                        onChange={index => setSelectedIndex(index)}
                        style={styles.controlContainer}>
                        <Radio
                            status='primary'>
                            {evaProps => <Text {...evaProps} category='label' style={styles.radioText}>CPF</Text>}
                        </Radio>
                        <Radio
                            status='primary'>
                            {evaProps => <Text {...evaProps} category='label' style={styles.radioText}>Endereço de E-mail</Text>}
                        </Radio>
                    </RadioGroup>
                </View>
                <View style={[styles.viewDetails, { flexDirection: 'row', flex: .1 }]}>
                    <Text category='c1' style={styles.message}>Já recebeu o TOKEN? Clique</Text>
                    <TouchableOpacity
                        onPress={changeWithToken}>
                        <Text category='c1' style={[styles.boldText, { textTransform: 'uppercase' }]}>{" "}aqui</Text>
                    </TouchableOpacity>
                </View>

            </SafeAreaLayout>
        </>
    )
}

export default ChangePasswordChoice