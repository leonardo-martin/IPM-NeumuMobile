import React, { FC, ReactElement, useEffect, useState } from 'react'
import { Animated, Easing, Image, ImageStyle, Platform, Pressable, StyleProp, useWindowDimensions, View } from 'react-native'
import { Icon, Text, useStyleSheet } from '@ui-kitten/components'
import { FlatData } from '@models/FlatData'
import { onboardingItemStyles } from './style'
import { flatList } from '../data'

interface OnboardingItemProps {
    item: FlatData
    index: number | null
    exitOnboarding: () => void
}

const OnboardingItem: FC<OnboardingItemProps> = ({ item, index, exitOnboarding }): ReactElement => {

    const styles = useStyleSheet(onboardingItemStyles)
    const { width } = useWindowDimensions()
    const opacity = useState(new Animated.Value(0))[0]

    const animationDuration: number = Platform.select({
        android: 160,
        default: 250,
    })

    useEffect(() => {
        if (index === (flatList.length - 1))
            Animated.timing(opacity, {
                toValue: 1,
                duration: animationDuration,
                easing: Easing.linear,
                useNativeDriver: false,
            }).start()
        else
            Animated.timing(opacity, {
                toValue: 0,
                duration: animationDuration,
                easing: Easing.linear,
                useNativeDriver: false,
            }).start()
    }, [index])

    return (
        <View style={[styles.container, { width }]}>
            <Image
                source={typeof item.image === 'string' ? {
                    uri: item.image
                } : item.image}
                style={[styles.image as StyleProp<ImageStyle>, {
                    width,
                    resizeMode: 'contain'
                }]}
            />
            <View style={{ flex: 0.3 }}>
                {index === (flatList.length - 1) && item.key === `${(index + 1)}` ?
                    <Pressable onPress={exitOnboarding}>
                        <View style={styles.view}>
                            <Text style={styles.title}>{item.title}</Text>
                            <Icon style={styles.icon} name='arrow-forward-circle-outline'
                                size={25} pack='ionicons' />
                        </View>
                    </Pressable> : <Text style={styles.title}>{item.title}</Text>}
                <Text style={styles.description}>{item.description}</Text>
            </View>
        </View>
    )
}

export default OnboardingItem

