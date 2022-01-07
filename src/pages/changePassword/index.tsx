import React, { FC, ReactElement, useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native'
import { changePasswdReqStyle } from './style'
import { Radio, RadioGroup, Text, useStyleSheet } from '@ui-kitten/components'
import { useNavigation } from '@react-navigation/native'
import { SafeAreaLayout } from '@components/safeAreaLayout'

const ChangePasswordChoice: FC = (): ReactElement => {

    const [selectedIndex, setSelectedIndex] = useState(-1)
    const { navigate } = useNavigation<any>()
    const styles = useStyleSheet(changePasswdReqStyle)

    useEffect(() => {
        if (selectedIndex === 0) {
            navigate('ChangePasswordRequest', {
                choice: 'CPF'
            })
            setSelectedIndex(-1)
        } else if (selectedIndex === 1) {
            navigate('ChangePasswordRequest', {
                choice: 'EMAIL'
            })
            setSelectedIndex(-1)
        }
    }, [selectedIndex])

    return (
        <>
            <SafeAreaLayout level='1' style={styles.safeArea}>
                <SafeAreaView style={styles.content}>
                    <Text category='label' style={styles.label}>Como deseja recuperar sua senha?</Text>
                    <RadioGroup
                        selectedIndex={selectedIndex}
                        onChange={index => setSelectedIndex(index)}
                        style={styles.controlContainer}>
                        <Radio
                            status='primary'>
                            {evaProps => <Text {...evaProps} status='primary' category='label' style={styles.radioText}>CPF</Text>}
                        </Radio>
                        <Radio
                            status='primary'>
                            {evaProps => <Text {...evaProps} status='primary' category='label' style={styles.radioText}>Endereço de E-mail</Text>}
                        </Radio>
                    </RadioGroup>
                </SafeAreaView>
            </SafeAreaLayout>
        </>
    )
}

export default ChangePasswordChoice