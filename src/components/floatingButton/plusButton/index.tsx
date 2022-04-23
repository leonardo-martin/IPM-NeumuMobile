import AddPatientDiaryEntryDialog from '@components/dialog/addPatientDiaryEntryDialog'
import { useModal } from '@hooks/useModal'
import { useFocusEffect, useNavigation } from '@react-navigation/native'
import { Icon, Modal, useStyleSheet } from '@ui-kitten/components'
import React, { FC, ReactElement, useCallback, useState } from 'react'
import { Animated, StyleProp, TouchableWithoutFeedback, View, ViewStyle } from 'react-native'
import { floatingButtonStyle } from './style'

interface FloatingButtonProps {
    containerStyle?: StyleProp<ViewStyle>
}

const FloatingPlusButton: FC<FloatingButtonProps> = ({ containerStyle }): ReactElement => {

    const { ref } = useModal<Modal>()
    const styles = useStyleSheet(floatingButtonStyle)
    const [isOpen, setIsOpen] = useState<boolean>(false)
    const animation = useState(new Animated.Value(0))[0]
    const [visibleModal, setVisibleModal] = useState<boolean>(false)
    const navigation = useNavigation()

    const toggleMenu = (opened: boolean) => {
        const toValue = opened ? 0 : 1
        Animated.spring(animation, {
            toValue,
            friction: 5,
            useNativeDriver: true
        }).start()
        setIsOpen(!isOpen)
    }

    const pinStyle: Animated.AnimatedInterpolation = animation.interpolate({
        inputRange: [0, 1],
        outputRange: [0, -60]
    })

    const rotate: Animated.AnimatedInterpolation = animation.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '45deg']
    })

    const toggleNote = () => {
        setVisibleModal(true)
        toggleMenu(isOpen)
    }

    useFocusEffect(
        useCallback(() => {
            navigation.addListener('focus', () => {
                toggleMenu(true)
                return
            })
        }, [])
    )

    return (
        <>
            <View style={[styles.container, containerStyle]}>
                <TouchableWithoutFeedback onPress={toggleNote}>
                    <Animated.View style={[styles.button, styles.secondary, {
                        transform: [{
                            translateY: pinStyle
                        }]
                    }]}>
                        <Icon name='reader-outline' size={25} style={styles.iconSecondary} />
                    </Animated.View>
                </TouchableWithoutFeedback>

                <TouchableWithoutFeedback onPress={() => toggleMenu(isOpen)}>
                    <Animated.View style={[styles.button, styles.menu, {
                        transform: [{ rotate }]
                    }]}>
                        <Icon name='add'
                            size={25}
                            style={styles.icon} />
                    </Animated.View>
                </TouchableWithoutFeedback>
            </View>
            <AddPatientDiaryEntryDialog
                ref={ref}
                onVisible={setVisibleModal}
                onRefresh={() => setVisibleModal(false)}
                visible={visibleModal} />

        </>
    )
}
export default FloatingPlusButton