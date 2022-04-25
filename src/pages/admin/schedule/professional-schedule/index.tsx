import HeaderAdmin from '@components/header/admin'
import { SafeAreaLayout } from '@components/safeAreaLayout'
import { _DATE_FROM_ISO_8601 } from '@constants/date'
import toast from '@helpers/toast'
import { useDatepickerService } from '@hooks/useDatepickerService'
import { AppointmentAvailabilityParams } from '@models/Appointment'
import { useFocusEffect } from '@react-navigation/native'
import { doctorCreateAppointmentAvailability } from '@services/appointment.service'
import { Button, CheckBox, List, ListItem, Spinner, Text, useStyleSheet, useTheme } from '@ui-kitten/components'
import { getTimesByInterval } from '@utils/common'
import { addHours } from 'date-fns'
import React, { createRef, FC, ReactElement, useCallback, useEffect, useState } from 'react'
import { ListRenderItemInfo, View } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'
import Animated, { Easing, FadeInRight, FadeOutRight, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated'
import { professionalStyle } from './style'

interface ScheduleItem {
    id?: string
    title?: string
    checked: boolean
}

const ProfessionalScheduleScreen: FC = (): ReactElement => {

    const styles = useStyleSheet(professionalStyle)
    const [selectedIndex, setSelectedIndex] = useState<number>(-1)
    const [scheduleList, setScheduleList] = useState<ScheduleItem[]>([])
    const [originalScheduleList, setOriginalScheduleList] = useState<ScheduleItem[]>([])
    const [allChecked, setAllChecked] = useState<boolean>(false)
    const [enableUndoButton, setEnableUndoButton] = useState<boolean>(false)
    const [isLoading, setIsLoading] = useState<boolean>(false)

    const { localeDateService } = useDatepickerService()
    const dayOfWeekNames = localeDateService.getDayOfWeekNames()
    const theme = useTheme()
    const listRef = createRef<List>()
    const scheduleListRef = createRef<List>()
    const opacity = useSharedValue(0)

    const animatedStyle = useAnimatedStyle(() => {
        return {
            opacity: withTiming(opacity.value, {
                duration: 500,
                easing: Easing.bezier(0.25, 0.1, 0.25, 1),
            }),
        }
    })

    const loadData = () => {
        const array = getTimesByInterval(30, 390, 18)
        const newArray: ScheduleItem[] = array.map((e, i) => {
            return {
                id: `${i}`,
                title: e,
                checked: false
            }
        })

        setOriginalScheduleList(newArray)
        setScheduleList(newArray)
    }

    useFocusEffect(
        useCallback(() => {
            loadData()
            setSelectedIndex(-1)
            opacity.value = 0
            if (listRef)
                listRef.current?.scrollToIndex({
                    index: 0,
                    animated: true
                })
        }, [])
    )

    useEffect(() => {
        if (selectedIndex !== -1) {
            loadData()
        }
    }, [selectedIndex])


    useEffect(() => {
        JSON.stringify(scheduleList) === JSON.stringify(originalScheduleList)
            ? setEnableUndoButton(false) : setEnableUndoButton(true)
        updateGroup()
    }, [scheduleList])

    const fadeAnimation = (info: ListRenderItemInfo<any>) => {
        if (info.index === selectedIndex) {
            opacity.value = 0
            setSelectedIndex(-1)
        } else {
            opacity.value = 1
            setSelectedIndex(info.index)
        }
        scheduleListRef.current?.scrollToIndex({
            index: 0,
            animated: true
        })
    }

    const renderItems = (info: ListRenderItemInfo<any>) => (
        <ListItem
            onPress={() => fadeAnimation(info)}
            title={(evaProps) => (
                <Text {...evaProps} style={[evaProps?.style, styles.listItemText, {
                    color: (info.index === selectedIndex) ? theme['text-control-color'] : theme['text-hint-color']
                }]}>{info.item}
                </Text>
            )}
            style={[styles.listItem, {
                backgroundColor: (info.index === selectedIndex) ? theme['color-primary-focus'] : styles.listItem.backgroundColor,
            }]}
        />
    )

    const renderScheduelItems = (info: ListRenderItemInfo<any>) => (
        <View style={styles.scheduleItems} key={info.item.title}>
            <Text style={[styles.scheduleItemText, {
                color: selectedIndex === -1 ? theme['text-hint-color'] : theme['text-basic-color']
            }]}>{localeDateService.format(localeDateService.parse(info.item.title, _DATE_FROM_ISO_8601), 'HH:mm')}</Text>
            <CheckBox
                style={{ paddingEnd: 5 }}
                disabled={selectedIndex === -1}
                checked={info.item.checked}
                onChange={(checked: boolean) => {
                    onGroupCheckedChange(checked, info.index)
                }}
                status='primary'
            />
        </View>
    )

    const onGroupCheckedChange = (checked: boolean, index?: number) => {
        let arr = scheduleList
        if (index !== undefined) {
            arr = arr.map((item, i) => {
                if (i === index)
                    return { ...item, checked: checked }
                else
                    return { ...item }
            })
            setAllChecked(false)
        } else if (!index) {
            arr = arr.map(item => {
                return { ...item, checked: checked }
            })
        }
        setScheduleList(arr)
        updateGroup()
    }

    const updateGroup = () => {
        const everyChecked = scheduleList.every((item: any) => item.checked === true)
        setAllChecked(everyChecked)
    }

    const submit = async () => {
        setIsLoading(true)


        const dados: AppointmentAvailabilityParams = {
            startTime: localeDateService.today().toISOString(),
            endTime: addHours(localeDateService.today(), 5).toISOString(),
            dayOfWeek: selectedIndex
        }
        try {
            const response = await doctorCreateAppointmentAvailability(dados)
            console.log('response', response)
        } catch (e) {
            toast.danger({ message: 'Erro ao salvar os horários. Tente novamente mais tarde.', duration: 1000 })
        } finally {
            setIsLoading(false)
        }

    }

    const undoSchedule = () => {
        setScheduleList(originalScheduleList)
    }

    const LoadingIndicator = () => (
        <Spinner size='tiny' status='basic' />
    )

    return (
        <>
            <HeaderAdmin />
            <SafeAreaLayout style={styles.safeArea}>
                <View style={styles.container}>
                    <View style={styles.containerTitle}>
                        <Text style={styles.title}>Selecione o dia e defina seus horários</Text>
                        <List
                            initialScrollIndex={0}
                            ref={listRef}
                            keyExtractor={(item) => item}
                            extraData={selectedIndex}
                            showsHorizontalScrollIndicator={false}
                            style={styles.listStyle}
                            decelerationRate='fast'
                            horizontal
                            scrollEventThrottle={16}
                            data={dayOfWeekNames}
                            renderItem={renderItems}
                        />
                    </View>
                    <View style={styles.containerSchedule}>
                        <View style={styles.headerSchedule}>
                            <Text style={styles.title}>Horários</Text>
                            <CheckBox
                                status='primary'
                                disabled={selectedIndex === -1}
                                checked={allChecked}
                                onChange={(checked) => onGroupCheckedChange(checked)}
                                style={{ flexDirection: 'row-reverse', paddingHorizontal: 5 }}>
                                {evaProps => <Text {...evaProps}>Todos</Text>}
                            </CheckBox>
                        </View>
                        <List
                            ref={scheduleListRef}
                            initialScrollIndex={0}
                            scrollEnabled={selectedIndex !== -1}
                            keyExtractor={(item) => item.id}
                            contentContainerStyle={styles.listContentContainerSchedule}
                            style={{ maxHeight: 300 }}
                            showsVerticalScrollIndicator
                            data={scheduleList}
                            scrollEventThrottle={16}
                            renderItem={renderScheduelItems} />
                        {enableUndoButton && (
                            <Animated.View
                                entering={FadeInRight}
                                exiting={FadeOutRight}
                                style={animatedStyle}>
                                <TouchableOpacity
                                    onPress={!isLoading ? undoSchedule : undefined}
                                    style={styles.undoButton}>
                                    <Text
                                        style={[styles.undoText, styles.uppercaseText, {
                                            color: !enableUndoButton ? theme['text-hint-color'] : theme['text-danger-color']
                                        }]}>Desfazer</Text>
                                </TouchableOpacity>
                            </Animated.View>
                        )}
                    </View>
                </View>
                <View style={styles.saveButton}>
                    <Button
                        size='medium'
                        disabled={!enableUndoButton}
                        accessoryRight={isLoading ? LoadingIndicator : undefined}
                        onPress={submit}>
                        {evaProps => <Text {...evaProps} style={[evaProps?.style, styles.uppercaseText]}>Salvar</Text>}
                    </Button>
                </View>
            </SafeAreaLayout>
        </>
    )
}

export default ProfessionalScheduleScreen
