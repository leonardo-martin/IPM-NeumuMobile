import { SafeAreaLayout } from '@components/safeAreaLayout'
import { useFocusEffect, useNavigation } from '@react-navigation/native'
import { Radio, RadioGroup, Text, useStyleSheet } from '@ui-kitten/components'
import React, { FC, ReactElement, useCallback, useEffect, useState } from 'react'
import { TouchableOpacity, View } from 'react-native'
import { choices, getChangePasswordChoices } from './data'
import { changePasswdReqStyle } from './style'

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
        if (selectedIndex !== -1)
            navigate('ChangePasswordRequest', {
                choice: getChangePasswordChoices(selectedIndex)
            })
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
                        {choices.map(c => (
                            <Radio
                                key={c}
                                status='primary'>
                                {evaProps => <Text {...evaProps} category='label' style={styles.radioText}>{c}</Text>}
                            </Radio>
                        ))}
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