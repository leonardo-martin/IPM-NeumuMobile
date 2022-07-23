import HeaderAdmin from '@components/header/admin'
import { SafeAreaLayout } from '@components/safeAreaLayout'
import { _DATE_FROM_ISO_8601 } from '@constants/date'
import { useAppSelector } from '@hooks/redux'
import { useDatepickerService } from '@hooks/useDatepickerService'
import { AppointmentAvailabilityParams } from '@models/Appointment'
import { useFocusEffect, useIsFocused } from '@react-navigation/native'
import { doctorCreateAppointmentAvailability, doctorDeleteAppointmentAvailabilityBlock, getAppointmentAvailabilityListSummaryByDoctorId } from '@services/appointment.service'
import { Button, CheckBox, List, ListItem, Spinner, Text, useStyleSheet, useTheme } from '@ui-kitten/components'
import { getTimeBlocksByTime, getTimesByInterval, sortByNumber } from '@utils/common'
import { addMinutes } from 'date-fns'
import React, { createRef, FC, ReactElement, useCallback, useEffect, useState } from 'react'
import { Alert, ListRenderItemInfo, View } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'
import Animated, { Easing, FadeInRight, FadeOutRight, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated'
import Toast from 'react-native-toast-message'
import { RootState } from 'store'
import { professionalStyle } from './style'

interface ScheduleItem {
    id?: string
    title?: string
    checked: boolean
}

const ProfessionalScheduleScreen: FC = (): ReactElement => {

    const { ids } = useAppSelector((state: RootState) => state.user)
    const isFocused = useIsFocused()
    const styles = useStyleSheet(professionalStyle)
    const [selectedIndex, setSelectedIndex] = useState<number>(-1)
    const [scheduleList, setScheduleList] = useState<ScheduleItem[]>([])
    const [originalScheduleList, setOriginalScheduleList] = useState<ScheduleItem[]>([])
    const [allChecked, setAllChecked] = useState<boolean>(false)
    const [enableUndoButton, setEnableUndoButton] = useState<boolean>(false)
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [timeBlockList, setTimeBlockList] = useState<{
        [k: string]: number[]
    }>()
    const { localeDateService } = useDatepickerService()
    const dayOfWeekNames = localeDateService.getDayOfWeekNames()

    const theme = useTheme()
    const listRef = createRef<List>()
    const scheduleListRef = createRef<List>()
    const opacity = useSharedValue(0)

    useEffect(() => {
        if (!isFocused) setSelectedIndex(-1)
    }, [isFocused])

    const animatedStyle = useAnimatedStyle(() => {
        return {
            opacity: withTiming(opacity.value, {
                duration: 500,
                easing: Easing.bezier(0.25, 0.1, 0.25, 1),
            }),
        }
    })

    const loadData = async () => {
        // get all time blocks
        const resp = await getAppointmentAvailabilityListSummaryByDoctorId(ids?.medicalDoctorId as number)
        setTimeBlockList(resp.data)
    }

    useEffect(() => {
        if (timeBlockList) {
            const index = selectedIndex === 0 ? 7 : selectedIndex
            if (Object.keys(timeBlockList).includes(index.toString())) {
                onCheckedChangeFromServer(timeBlockList[index].sort(sortByNumber))
            } else {
                resetData()
            }
        }
        setEnableUndoButton(false)
    }, [timeBlockList])

    const resetData = () => {
        // startTime 06h | endTime 22h
        const array = getTimesByInterval(15, 345, 22)
        const newArray: ScheduleItem[] = array.map(e => {
            const timeBlock = getTimeBlocksByTime(localeDateService.parse(e as string, _DATE_FROM_ISO_8601))
            return {
                id: `${timeBlock}`,
                title: e,
                checked: false
            }
        })
        setOriginalScheduleList(newArray)
    }

    const alert = () => {
        Alert.alert(
            'Informativo',
            'Para que o seu perfil esteja visível aos pacientes, faça o cadastro do seu Endereço Comercial em seu perfil',
            [
                {
                    text: 'Ok',
                    style: 'default',
                }
            ]
        )
    }

    useFocusEffect(
        useCallback(() => {
            alert()
            setTimeBlockList([])
            opacity.value = 0
            if (listRef)
                listRef.current?.scrollToIndex({
                    index: 0,
                    animated: true
                })

        }, [])
    )

    useEffect(() => {
        if (selectedIndex !== -1 && timeBlockList) {
            const index = selectedIndex === 0 ? 7 : selectedIndex
            if (Object.keys(timeBlockList).includes(index.toString())) {
                onCheckedChangeFromServer(timeBlockList[index].sort(sortByNumber))
            } else {
                resetData()
            }
        } else if (selectedIndex === -1) {
            resetData()
        }
    }, [selectedIndex])


    useEffect(() => {
        JSON.stringify(scheduleList) === JSON.stringify(originalScheduleList)
            ? setEnableUndoButton(false) : setEnableUndoButton(true)
        updateGroup()
    }, [scheduleList])

    useEffect(() => {
        setScheduleList(originalScheduleList)
        updateGroup()
    }, [originalScheduleList])

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

    const onCheckedChangeFromServer = (list: number[]) => {
        let arr = scheduleList

        const listT: ScheduleItem[] = arr.map(item => {
            if (list.includes(Number(item.id)))
                return {
                    ...item, checked: true
                }
            else
                return {
                    ...item, checked: false
                }
        })
        setOriginalScheduleList(listT)
    }

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
        let saveItems: ScheduleItem[] = []
        let removeItems: ScheduleItem[] = []

        const dayOfWeek = selectedIndex === 0 ? 7 : selectedIndex
        if (timeBlockList) {
            const arr = timeBlockList[dayOfWeek] ?? []
            scheduleList.map(item => {
                if (item.checked && !arr.includes(Number(item.id)))
                    saveItems.push(item)
                else if (!item.checked && arr.includes(Number(item.id)))
                    removeItems.push(item)
            })
        } else {
            saveItems = scheduleList.filter(item => item.checked)
        }

        if (saveItems.length > 0 || removeItems.length > 0) {

            try {
                let amountSavedItems = 0

                // save items
                for (let index = 0; index < saveItems.length; index++) {
                    const element = saveItems[index]
                    let data: AppointmentAvailabilityParams = {
                        startTime: new Date(element.title as string).toISOString(),
                        endTime: addMinutes(new Date(element.title as string), 14).toISOString(),
                        dayOfWeek: dayOfWeek
                    }

                    const response = await doctorCreateAppointmentAvailability(data)
                    if (response.status === 201 || response.status === 200) {
                        amountSavedItems++
                    }
                }

                // remove items
                for (let index = 0; index < removeItems.length; index++) {
                    const element = removeItems[index]
                    let data: AppointmentAvailabilityParams = {
                        startTime: new Date(element.title as string).toISOString(),
                        endTime: addMinutes(new Date(element.title as string), 14).toISOString(),
                        dayOfWeek: dayOfWeek
                    }
                    const response = await doctorDeleteAppointmentAvailabilityBlock(data)
                    if (response.status === 201 || response.status === 200) {
                        amountSavedItems++
                    }
                }

                if (amountSavedItems > 0) loadData()

            } catch (e) {
                Toast.show({
                    type: 'danger',
                    text2: 'Erro ao editar os horários. Tente novamente mais tarde',
                })
            } finally {
                setIsLoading(false)
            }
        } else {
            setIsLoading(false)
            Toast.show({
                type: 'warning',
                text2: 'Nenhum horário selecionado',
            })
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
                    <Text appearance='hint' style={styles.freeAlert}>Inicialmente está disponível somente agendamento de consultas nas quais o atendimento for gratuito.</Text>
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
                                    <Text style={[styles.undoText, styles.uppercaseText, {
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
