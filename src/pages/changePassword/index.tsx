import React, { FC, ReactElement, useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native'
import { changePasswdReqStyle } from './style'
import { Radio, RadioGroup, Text } from '@ui-kitten/components'
import { useNavigation } from '@react-navigation/native'

const ChangePasswordChoice: FC = (): ReactElement => {

    const [selectedIndex, setSelectedIndex] = useState(-1)
    const { navigate } = useNavigation<any>()

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
            <SafeAreaView style={changePasswdReqStyle.content}>
                <Text category='label' style={changePasswdReqStyle.label}>Como deseja recuperar sua senha?</Text>
                <RadioGroup
                    selectedIndex={selectedIndex}
                    onChange={index => setSelectedIndex(index)}
                    style={changePasswdReqStyle.controlContainer}>
                    <Radio
                        status='primary'>
                        {evaProps => <Text {...evaProps} status='primary' category='label' style={changePasswdReqStyle.radioText}>CPF</Text>}
                    </Radio>
                    <Radio
                        status='primary'>
                        {evaProps => <Text {...evaProps} status='primary' category='label' style={changePasswdReqStyle.radioText}>Endereço de E-mail</Text>}
                    </Radio>
                </RadioGroup>
            </SafeAreaView>
        </>
    )
}

export default ChangePasswordChoice