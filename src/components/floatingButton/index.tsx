import React, { createRef, FC, ReactElement, useState } from 'react'
import { StyleProp, View, ViewStyle, Animated, TouchableWithoutFeedback } from 'react-native'
import { Icon, Modal, useStyleSheet } from '@ui-kitten/components'

import { floatingButtonStyle } from './style'
import NewNoteModal from './notesModal'

interface FloatingButtonProps {
    containerStyle?: StyleProp<ViewStyle>
}

const FloatingButton: FC<FloatingButtonProps> = ({ containerStyle }): ReactElement => {

    const ref = createRef<Modal>()
    const styles = useStyleSheet(floatingButtonStyle)
    const [isOpen, setIsOpen] = useState<boolean>(false)
    const animation = useState(new Animated.Value(0))[0]
    const [visibleModal, setVisibleModal] = useState<boolean>(false)

    const toggleMenu = () => {
        const toValue = isOpen ? 0 : 1
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
        toggleMenu()
    }

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

                <TouchableWithoutFeedback onPress={toggleMenu}>
                    <Animated.View style={[styles.button, styles.menu, {
                        transform: [{ rotate }]
                    }]}>
                        <Icon name='add-outline'
                            size={25}
                            style={styles.icon} />
                    </Animated.View>
                </TouchableWithoutFeedback>
            </View>
            <NewNoteModal
                ref={ref}
                onVisible={setVisibleModal}
                visible={visibleModal} />

        </>
    )
}
export default FloatingButton