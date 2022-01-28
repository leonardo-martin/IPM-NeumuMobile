import React, { createRef, FC, ReactElement, useRef, useState, useCallback } from 'react'
import { Animated, Dimensions, FlatList, LayoutChangeEvent, TouchableOpacity, View } from 'react-native'
import { Text, useStyleSheet } from '@ui-kitten/components'
import { SafeAreaLayout } from '@components/safeAreaLayout'
import { AppStorage } from '@services/app-storage.service'
import OnboardingItem from './extra/onboarding-item'
import { ONBOARDING } from '@constants/storage'
import { onboardingStyles } from './style'
import { flatList } from './data'

interface OnboardingProps {
    setOnboarded: (value: boolean) => void
}

const { width } = Dimensions.get('screen')

const Onboarding: FC<OnboardingProps> = ({ setOnboarded }): ReactElement => {

    const styles = useStyleSheet(onboardingStyles)
    const scrollX = useRef<Animated.Value>(new Animated.Value(0)).current
    const [selectedIndex, setSelectedIndex] = useState<number | null>(0)
    const flatRef = createRef<FlatList>()

    const handleViewableItemsChanged = useCallback(({ viewableItems }: any) => {
        setSelectedIndex(viewableItems[0].index)
    }, [])

    const [size, setSize] = useState<number>()
    const onLayout = (event: LayoutChangeEvent) => {
        const { height } = event.nativeEvent.layout
        setSize(height)
    }

    const skipOnboarding = async () => {
        await AppStorage.setItem(ONBOARDING, JSON.stringify(true))
        setOnboarded(true)
    }

    const Indicator = ({ scrollX }: any) => (
        <>
            <View style={styles.indicator}>
                {flatList.map((_, i) => {
                    const inputRange = [(i - 1) * width, i * width, (i + 1) * width]
                    const scale: Animated.AnimatedInterpolation = scrollX.interpolate({
                        inputRange,
                        outputRange: [.8, 1.4, .8],
                        extrapolate: 'clamp'
                    })
                    const opacity: Animated.AnimatedInterpolation = scrollX.interpolate({
                        inputRange,
                        outputRange: [.6, .9, .8],
                        extrapolate: 'clamp'
                    })
                    return (
                        <Animated.View key={`indicator-${i}`}
                            style={[styles.indicatorItem, {
                                opacity,
                                transform: [{ scale }]
                            }]} />
                    )
                })}
            </View>
        </>
    )

    return (
        <SafeAreaLayout level='1' insets='top' style={styles.safeArea}>
            <View style={styles.container}>
                <View onLayout={onLayout} style={{
                    ...styles.skipContainer,
                    width,
                    minHeight: size
                }}>
                    {(selectedIndex !== (flatList.length - 1)) ?
                        <TouchableOpacity onPress={skipOnboarding}>
                            <Text style={styles.textTop}>Pular</Text>
                        </TouchableOpacity>
                        : null}
                </View>
                <Animated.FlatList
                    ref={flatRef}
                    data={flatList}
                    renderItem={({ item }) => <OnboardingItem exitOnboarding={skipOnboarding} item={item} index={selectedIndex} />}
                    keyExtractor={item => item.key}
                    horizontal
                    scrollEventThrottle={32}
                    onScroll={Animated.event(
                        [{ nativeEvent: { contentOffset: { x: scrollX } } }],
                        { useNativeDriver: false }
                    )}
                    pagingEnabled
                    showsHorizontalScrollIndicator={false}
                    onViewableItemsChanged={handleViewableItemsChanged}
                    viewabilityConfig={{
                        itemVisiblePercentThreshold: 50
                    }}
                />
                <Indicator scrollX={scrollX} />
            </View>

        </SafeAreaLayout>
    )
}

export default Onboarding