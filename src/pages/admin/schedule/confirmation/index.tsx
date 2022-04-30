import LocalCalendarDialog from '@components/dialog/localCalendarDialog'
import { useModal } from '@hooks/useModal'
import { EventCalendar } from '@models/Calendar'
import { FlatData } from '@models/FlatData'
import { DrawerContentComponentProps } from '@react-navigation/drawer'
import { CommonActions, useFocusEffect, useRoute } from '@react-navigation/native'
import { addCalendarEvent } from '@services/calendar.service'
import { Modal, Text, useStyleSheet, useTheme } from '@ui-kitten/components'
import React, { createRef, FC, ReactElement, useCallback, useEffect, useRef, useState } from 'react'
import { Animated, BackHandler, Dimensions, FlatList, Image, ImageStyle, ListRenderItemInfo, Platform, Pressable, StatusBar, StyleProp, StyleSheet, TouchableOpacity, View } from 'react-native'
import { Calendar } from "react-native-calendar-events"
import { flatList } from './data'
import { confirmationScheduleStyle } from './styles'

const { width, height } = Dimensions.get('screen')

const ConfirmationScheduleScreen: FC<DrawerContentComponentProps> = ({
    navigation
}): ReactElement => {

    const [isVisibleCalendars, setIsVisibleCalendars] = useState(false)
    const openLocalCalendarModal = () => setIsVisibleCalendars(true)
    const closeLocalCalendarModal = () => setIsVisibleCalendars(false)
    const { ref } = useModal<Modal>()

    const theme = useTheme()
    const bgs = [theme['color-primary-500'], theme['color-primary-700'], theme['color-primary-900']]
    const scrollX = useRef<Animated.Value>(new Animated.Value(0)).current
    const flatRef = createRef<FlatList>()
    const styles = useStyleSheet(confirmationScheduleStyle)
    const { params } = useRoute()
    const [event, setEvent] = useState<EventCalendar | undefined>()

    const nextPage = (index: number) => flatRef.current?.scrollToIndex({ animated: true, index })
    const actions = CommonActions.reset({
        index: 0,
        routes: [
            { name: 'Dashboard' },
        ],
    })

    useFocusEffect(
        useCallback(() => {
            const onBackPress = () => {
                navigation.dispatch(actions)
                return true
            }
            const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress)
            return () => subscription.remove()
        }, [])
    )

    useEffect(() => {
        setEvent(params as EventCalendar)
    }, [params])


    const saveEvent = async (calendar: Calendar) => {
        if (event) {
            await addCalendarEvent(event, calendar, event.title)
            closeLocalCalendarModal()
        }
    }

    const Backdrop = ({ scrollX }: any) => {
        const backgroundColor = scrollX.interpolate({
            inputRange: bgs.map((_, i) => i * width),
            outputRange: bgs.map((bg) => bg)
        })
        return (
            <Animated.View style={[
                StyleSheet.absoluteFillObject,
                {
                    backgroundColor
                }
            ]} />
        )
    }

    const Square = ({ scrollX }: any) => {
        const YOLO: Animated.AnimatedModulo = Animated.modulo(
            Animated.divide(
                Animated.modulo(scrollX, width),
                new Animated.Value(width)
            ),
            1
        )
        const rotate: Animated.AnimatedInterpolation = YOLO.interpolate({
            inputRange: [0, .5, 1],
            outputRange: ['35deg', '0deg', '35deg']
        })

        const translateX: Animated.AnimatedInterpolation = YOLO.interpolate({
            inputRange: [0, .5, 1],
            outputRange: [0, -height, 0]
        })
        return (
            <Animated.View style={[styles.square, {
                transform: [
                    {
                        rotate
                    },
                    {
                        translateX
                    }]
            }]} />
        )
    }

    const Indicator = ({ scrollX }: any) => (
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
                    <Pressable key={`indicator-${i}`} onPress={() => nextPage(i)}>
                        <Animated.View
                            style={[styles.indicatorItem, {
                                opacity,
                                transform: [{ scale }]
                            }]} />
                    </Pressable>
                )
            })}
        </View>
    )

    const renderItem = (info: ListRenderItemInfo<FlatData>) => (
        <View style={styles.contentItem}>
            <View style={styles.item}>
                <Image source={info.item.image} style={styles.image as StyleProp<ImageStyle>} />
            </View>
            <View style={styles.itemDetails}>
                <Text style={styles.itemTitle}>{info.item.title}</Text>
                <Text style={styles.itemDescription}>{info.item.description}</Text>
                {/* {info.index === 0 && (
                    <Button status='success' onPress={openLocalCalendarModal}>Adicionar ao meu calendário</Button>
                )} */}
                {info.index === (flatList.length - 1) ?
                    <View style={styles.viewIcon}>
                        <TouchableOpacity onPress={() => navigation.dispatch(actions)}>
                            <Text style={styles.textClick}>Voltar ao Início</Text>
                        </TouchableOpacity>
                    </View>
                    : null}
            </View>
        </View >
    )

    return (
        <>
            <View style={styles.container}>
                <StatusBar hidden={Platform.OS === 'ios' ? true : false} backgroundColor='transparent' translucent />
                <Backdrop scrollX={scrollX} />
                <Square scrollX={scrollX} />
                <Animated.FlatList
                    ref={flatRef}
                    data={flatList}
                    renderItem={renderItem}
                    keyExtractor={item => item.key}
                    horizontal
                    scrollEventThrottle={32}
                    onScroll={Animated.event(
                        [{ nativeEvent: { contentOffset: { x: scrollX } } }],
                        { useNativeDriver: false }
                    )}
                    pagingEnabled
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.contentContainerFlatList}
                />
                <Indicator scrollX={scrollX} />
                <LocalCalendarDialog
                    ref={ref}
                    openModal={openLocalCalendarModal}
                    isVisible={isVisibleCalendars}
                    closeModal={closeLocalCalendarModal}
                    handleCalendarSelected={saveEvent}
                    label={'Meus Calendários (Disponíveis)'}
                />
            </View>
        </>
    )
}

export default ConfirmationScheduleScreen
