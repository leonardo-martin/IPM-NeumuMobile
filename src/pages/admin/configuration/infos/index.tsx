import React, { FC, ReactElement, useEffect, useState } from 'react'
import { DrawerContentComponentProps } from '@react-navigation/drawer'
import { SafeAreaView, TouchableOpacity, View } from 'react-native'
import { infoAppStyle } from './style'
import LogoPedroMolina from '../../../../assets/svg/logo.svg'
import { Text } from '@ui-kitten/components'
import Icon from 'react-native-vector-icons/Ionicons'
import * as Animatable from 'react-native-animatable'
import AsyncStorage from '@react-native-community/async-storage'

const InformationAppScreen: FC<DrawerContentComponentProps> = ({
    navigation
}): ReactElement => {

    const [contador, setContador] = useState<number>(0)
    const [easterEggActive, setEasterEggActive] = useState<boolean>(false)

    useEffect(() => {
        const activeEasterEgg = async () => {
            const teleNeumuStar = await AsyncStorage.getItem('@TN:star')
            if (!teleNeumuStar && easterEggActive)
                await AsyncStorage.setItem('@TN:star', "true")
            else if (teleNeumuStar)
                setEasterEggActive(true)
        }

        activeEasterEgg()
    }, [easterEggActive])


    const easterEggPress = async () => {
        if (contador < 10)
            setContador(contador + 1)
        else
            setEasterEggActive(true)
    }

    return (
        <>
            <SafeAreaView style={infoAppStyle.content}>
                <View style={infoAppStyle.viewInfoApp}>
                    <View style={infoAppStyle.viewText}>
                        <Text category="p1" style={infoAppStyle.text}>Versão 0.650</Text>
                    </View>
                    <LogoPedroMolina width="180" height="180" />
                    <View style={infoAppStyle.viewText}>
                        <Text category="p2" style={infoAppStyle.text} >
                            <Text category="p2" style={infoAppStyle.text}>{" "}Atos{" "}</Text>
                            Brasil &copy; {new Date().getFullYear()}</Text>
                        <Animatable.Text
                            animation="pulse"
                            easing="ease-out"
                            iterationCount="infinite"
                            style={{
                                alignSelf: 'center'
                            }}
                            onPress={easterEggPress}>
                            <TouchableOpacity>
                                <Icon
                                    name="fitness-outline"
                                    size={55}
                                    color={"#FC4619"}

                                />
                            </TouchableOpacity>
                        </Animatable.Text>

                    </View>
                </View>
            </SafeAreaView>
            {easterEggActive ?
                <View style={infoAppStyle.viewEasterEgg}>
                    <Text style={infoAppStyle.textEasterEgg} status="basic">
                        Tornou-se um NStar
                        <Animatable.Text
                            animation="flash"
                            easing="ease-in-out-back"
                            iterationCount="infinite"
                            delay={1000}
                            style={{ textAlign: 'center' }}>
                            <Icon
                                name="star"
                                size={18}
                                color={"#FFD700"}
                            />
                        </Animatable.Text></Text>

                </View>
                : null}
        </>
    )
}

export default InformationAppScreen
