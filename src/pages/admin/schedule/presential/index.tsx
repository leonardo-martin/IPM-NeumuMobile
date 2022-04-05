import React, { FC, ReactElement, useCallback, useEffect, useRef, useState } from 'react'
import { ActivityIndicator, ImageStyle, LayoutRectangle, Platform, Pressable, ScrollView, StyleProp, View } from 'react-native'
import { DrawerContentComponentProps } from '@react-navigation/drawer'
import { useRoute } from '@react-navigation/core'
import { Modalize } from 'react-native-modalize'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { Avatar, Button, Card, Icon, IconProps, List, Text, TranslationWidth, useStyleSheet, useTheme } from '@ui-kitten/components'
import { useIsFocused, useFocusEffect } from '@react-navigation/native'
import { options } from './data'
import { doctorScheduleStyle } from './style'

import { useAuth } from '@contexts/auth'
import { CreateAppointment } from '@models/Appointment'
import { formatDateTimeToString } from '@utils/convertDate'
import { createAppointment } from '@services/appointment.service'
import { openMapsWithAddress } from '@utils/maps'
import { SafeAreaLayout } from '@components/safeAreaLayout'
import { scrollToRef } from '@utils/common'
import { Profile as DoctorProfile } from '@services/message.service'
import ModalizeFixed from '@components/modalize'
import HeaderAdmin from '@components/header/admin'
import toast from '@helpers/toast'
import { BOOTDEY_URI } from '@constants/uri'
import { useDatepickerService } from '@hooks/useDatepickerService'

interface Data {
    id: number
    value: string
    layout: LayoutRectangle
}

const PresentialScheduleScreen: FC<DrawerContentComponentProps> = ({
    navigation
}): ReactElement => {

    const { localeDateService } = useDatepickerService()
    const { currentUser } = useAuth()
    const theme = useTheme()
    const styles = useStyleSheet(doctorScheduleStyle)
    const scrollViewDaysInMonthRef = useRef<ScrollView>(null)
    const [currentDate] = useState<Date>(localeDateService.today())
    const [dateSelected, setDateSelected] = useState<Date>(currentDate)
    const [dateTimeSelected, setDateTimeSelected] = useState<Date | undefined>(undefined)
    const [timeSelected, setTimeSelected] = useState<string | undefined>(undefined)
    const [count, setCount] = useState<number>(0)
    const [daysInMonth, setDaysInMonth] = useState<string[]>([])
    const [numColumns, setNumColumns] = useState<number>(0)
    const [dataSourceCords, setDataSourceCords] = useState<Data[]>([])
    const isFocused = useIsFocused()
    const [confirmDate, setConfirmDate] = useState<Date>(new Date())
    const [scheduleData, setScheduleData] = useState<CreateAppointment | undefined>()
    const [loading, setLoading] = useState<boolean>()

    const route = useRoute()
    const { params }: any = route
    const modalizeRef = useRef<Modalize>(null)

    useEffect(() => {
        setDateSelected(currentDate)
        setDateTimeSelected(undefined)
        setTimeSelected(undefined)
        setCount(0)
        newDaysInMonthArray(currentDate)
        scrollToRef(scrollViewDaysInMonthRef, 0, 0)
        handleClose()
    }, [isFocused])

    useFocusEffect(
        useCallback(() => {
            const array = Array.from({ length: localeDateService.getNumberOfDaysInMonth(dateSelected) }, (x, i) => localeDateService.format(localeDateService.addDay(localeDateService.getMonthStart(dateSelected), i), 'DD'))
            setDaysInMonth(array)
            setNumColumns(array.length)
        }, [dateSelected])
    )

    const confirmSchedule = async () => {
        setLoading(false)
        const startTime = localeDateService.clone(dateTimeSelected as Date)

        const time = (timeSelected as string).split(':')
        startTime.setHours(Number(time[0]))
        startTime.setMinutes(Number(time[1]))
        startTime.setSeconds(0)

        setConfirmDate(startTime)
        const dateString = formatDateTimeToString(startTime)

        setScheduleData(
            new CreateAppointment(
                currentUser?.userId,
                params?.doctorId,
                dateString,
                dateString,
                params?.visitAddress.id))
        modalizeRef.current?.open()
    }

    const handleClose = () => {
        modalizeRef.current?.close()
    }

    const toSchedule = async () => {
        setLoading(true)
        try {
            // TODO
            await createAppointment(scheduleData)

            const endTime = localeDateService.clone(confirmDate)
            endTime.setMinutes(endTime.getMinutes() + 30)

            navigation.navigate('ConfirmationSchedule', {
                title: 'Consulta Presencial - TeleNeumu',
                description: 'Esta é uma marcação de uma consulta presencial com o seu médico',
                location: params?.visitAddress.street,
                dtStart: confirmDate.getTime().toString(),
                dtEnd: endTime.getTime().toString(),
                allDay: false
            })

        } catch (error) {
            toast.danger({ message: 'Ocorreu um erro. Tente novamente mais tarde.', duration: 1000 })
        } finally {
            setLoading(false)
            handleClose()
        }

    }

    const newDaysInMonthArray = (date: Date) => {
        const array = Array.from({ length: localeDateService.getNumberOfDaysInMonth(date) }, (x, i) => localeDateService.format(localeDateService.addDay(localeDateService.getMonthStart(date), i), 'DD'))
        setDaysInMonth(array)
    }

    const next = () => {
        const date = localeDateService.addMonth(dateSelected, 1)
        setDateSelected(date)
        setCount(count + 1)
        newDaysInMonthArray(date)
    }

    const previous = () => {
        if (count === 1) {
            const date = localeDateService.addMonth(dateSelected, -1)
            setDateSelected(date)
            setCount(count - 1)
            newDaysInMonthArray(date)
        }
    }

    const handleDateSelected = (item: number) => {
        const date = localeDateService.clone(dateSelected)
        date.setDate(item)
        if (date.getTime() !== dateTimeSelected?.getTime()) {
            setDateTimeSelected(date)
            setTimeSelected(undefined)
        }
        else {
            setDateTimeSelected(undefined)
            setTimeSelected(undefined)
        }
    }

    const handleTimeSelected = (item: Date) => {
        const time = localeDateService.format(item, 'HH:mm')
        if (time === timeSelected) setTimeSelected(undefined)
        else setTimeSelected(time)
    }

    const navigateToDoctorProfile = () => {
        const profile = new DoctorProfile(
            params?.doctorId,
            params?.doctorName,
            '',
            BOOTDEY_URI + '/img/Content/avatar/avatar6.png',
        )
        navigation.navigate("DoctorProfile", {
            ...profile,
            location: params?.visitAddress.street,
            description: `Olá. Eu sou ${profile.fullName}`,
            phone: params?.tel
        })
    }
    const footerCard = (props: IconProps) => (
        <View style={styles.footerCard}>
            <Icon {...props} style={[props.style, {
                ...styles.icon
            }]} name={Platform.OS === 'ios' ? 'chevron-forward-outline' : Platform.OS === 'android' ? 'arrow-forward-outline' : 'arrow-forward-outline'}
                pack='ionicons' size={20}
                onPress={navigateToDoctorProfile} />
        </View>
    )

    const renderItem = ({ item, index }: any) => (
        <View style={styles.daysItem} key={index}
            onLayout={(event) => {
                const layout = event.nativeEvent.layout
                dataSourceCords[index] = {
                    id: index,
                    value: item,
                    layout: { ...layout }
                }
                setDataSourceCords(dataSourceCords)
                if (index === (numColumns - 1)) {
                    if (dateTimeSelected && localeDateService.compareDatesSafe(currentDate, dateTimeSelected) === 0) {
                        scrollToRef(scrollViewDaysInMonthRef, dataSourceCords.find(v => v.value === localeDateService.format(currentDate, 'DD'))?.layout.x, 0)
                    } else {
                        const item = dataSourceCords.find(v => dateTimeSelected && v.value === localeDateService.format(dateTimeSelected, 'DD') && dateSelected.getMonth() === dateTimeSelected.getMonth())
                        if (item) scrollToRef(scrollViewDaysInMonthRef, item.layout.x, 0)
                        else scrollToRef(scrollViewDaysInMonthRef, dataSourceCords[0]?.layout.x, 0)
                    }
                }
            }}>
            {
                (localeDateService.compareDatesSafe(new Date(dateSelected.getFullYear(), dateSelected.getMonth(), item), currentDate) === (1 || 0)) ||
                    (dateSelected.getMonth() === currentDate.getMonth() && Number(item) === currentDate.getDate())
                    ?
                    <Pressable
                        onPress={() => handleDateSelected(Number(item))}>
                        <View
                            style={[styles.daysInMonthView, {
                                backgroundColor: dateTimeSelected && item === localeDateService.format(dateTimeSelected, 'DD') && dateTimeSelected.getMonth() === dateSelected.getMonth() ? theme['color-primary-500'] : theme['color-basic-400'],
                            }]}
                        >
                            <Text style={[styles.daysInMonthText, {
                                color: dateTimeSelected && item === localeDateService.format(dateTimeSelected, 'DD') && dateTimeSelected.getMonth() === dateSelected.getMonth() ? theme['text-control-color'] : theme['text-hint-color']
                            }]}>{item}</Text>
                        </View>
                    </Pressable>
                    :
                    <View
                        style={[styles.daysInMonthView, {
                            backgroundColor: theme['color-basic-disabled']
                        }]}
                    >
                        <Text style={[styles.daysInMonthText, {
                            color: theme['text-disabled-color']
                        }]}>{item}</Text>
                    </View>

            }
        </View>
    )


    return (
        <>
            <HeaderAdmin />
            <SafeAreaLayout level='1' style={styles.safeArea}>
                <ScrollView
                    contentContainerStyle={styles.contentContainerScrollView}
                    showsVerticalScrollIndicator={false}>
                    <View style={styles.viewContent}>
                        <Card
                            style={{
                                backgroundColor: theme['background-basic-color-2']
                            }}
                            footer={footerCard}
                            status='info'>
                            <View style={styles.viewDoctorProfile}>
                                <Avatar
                                    style={styles.avatarDoctor as StyleProp<ImageStyle>}
                                    source={{ uri: BOOTDEY_URI + '/img/Content/avatar/avatar1.png' }}
                                />
                                <View>
                                    <Text
                                        category="h5"
                                        status="basic"
                                    >{params?.doctorName}</Text>
                                    <Text
                                        category="p1"
                                        status="basic"
                                        style={styles.textDoctorInfo}
                                    >{params?.specialty}</Text>
                                    <Text
                                        category="c1"
                                        status="basic"
                                        style={styles.textDoctorInfo}
                                    >CRM: {params?.crm}</Text>
                                    <Text
                                        category="c1"
                                        status="basic"
                                        style={styles.textDoctorInfo}
                                    >Tel: {params?.tel}</Text>
                                    <Text
                                        category="c1"
                                        status="basic"
                                        style={styles.textDoctorInfo}
                                    >{params?.visitAddress.street}
                                    </Text>
                                    <View style={styles.viewLocation}>
                                        <Text
                                            onPress={() => openMapsWithAddress(params?.visitAddress.street)}
                                            category="c1"
                                            style={styles.textLocation}
                                        >Ver no mapa</Text>
                                        <Icon style={styles.icon} name="location-outline" size={15} pack='ionicons'
                                            onPress={() => openMapsWithAddress(params?.visitAddress.street)} />
                                    </View>
                                </View>
                            </View>
                        </Card>
                        <View style={styles.daysInMonth}>
                            <Text style={styles.text}>Para quando é a consulta?</Text>
                            <View style={styles.monthContainer}>
                                <Icon name='caret-back-outline' size={25} pack='ionicons' style={[styles.arrowIcon, {
                                    color: count === 0 ? theme['text-primary-disabled-color'] : theme['text-primary-color']
                                }]} onPress={count === 0 ? undefined : previous} />
                                <Text style={styles.textMonth}>{localeDateService.getMonthName(dateSelected, TranslationWidth.LONG)}</Text>
                                <Icon name='caret-forward-outline' size={25} pack='ionicons' style={[styles.arrowIcon, {
                                    color: count === 1 ? theme['text-primary-disabled-color'] : theme['text-primary-color']
                                }]} onPress={count === 1 ? undefined : next} />
                            </View>
                            <ScrollView
                                showsHorizontalScrollIndicator={false}
                                horizontal={true}
                                ref={scrollViewDaysInMonthRef}>
                                <List
                                    style={{
                                        backgroundColor: theme['background-basic-color-1']
                                    }}
                                    key={numColumns}
                                    data={daysInMonth}
                                    renderItem={renderItem}
                                    numColumns={numColumns}
                                />
                            </ScrollView>
                        </View>

                        <View style={{ paddingVertical: 15 }}>
                            <Text style={styles.text}>Horários disponíveis</Text>
                            {dateTimeSelected ?
                                <View style={styles.timesContainer}>
                                    {options.map(item => (
                                        <Pressable key={`${item.id}-${item.title}`}
                                            onPress={() => !item.disabled ? handleTimeSelected(item.title) : undefined}>
                                            <View style={[styles.timesCard, {
                                                backgroundColor: timeSelected === localeDateService.format(item.title, 'HH:mm') && !item.disabled ? theme['color-primary-500'] : item.disabled ? theme['color-basic-disabled'] : theme['color-basic-400'],
                                            }]}>
                                                <Text style={[styles.timesText, {
                                                    color: timeSelected === localeDateService.format(item.title, 'HH:mm') && !item.disabled ? theme['color-control-default'] : item.disabled ? theme['text-disabled-color'] : theme['text-hint-color']
                                                }]}>{localeDateService.format(item.title, 'HH:mm')}</Text>
                                            </View>
                                        </Pressable>
                                    ))}
                                </View>
                                :
                                <View style={styles.timesContainer}>
                                    <Text style={[styles.timesText, styles.textWithoutSelectedDate]}>Selecione o dia desejado</Text>
                                </View>
                            }
                        </View>
                        <View style={styles.viewBtn}>
                            <Button
                                style={styles.btnToSchedule}
                                onPress={confirmSchedule}
                                status="success"
                                disabled={!timeSelected || !dateTimeSelected}
                            >CONFIRMAR</Button>
                        </View>
                    </View>
                </ScrollView>
            </SafeAreaLayout >
            <ModalizeFixed ref={modalizeRef} snapPoint={300} adjustToContentHeight={true} closeOnOverlayTap={false} >
                <View>
                    <Text style={styles.textConfirmExit}>Confirmar o agendamento para</Text>
                    <Text style={styles.textConfirmExit}>{formatDateTimeToString(confirmDate)}?</Text>
                </View>
                <TouchableOpacity style={[styles.contentButton, {
                    backgroundColor: loading ? theme['color-primary-disabled'] : styles.contentButton.backgroundColor
                }]} activeOpacity={0.75} onPress={!loading ? toSchedule : undefined}>
                    {loading ? <ActivityIndicator size="small" color={theme['color-basic-500']} /> : <Text style={styles.contentButtonText}>{'Sim'.toUpperCase()}</Text>}
                </TouchableOpacity>
                <TouchableOpacity style={[styles.contentButton, styles.buttonOutline]} activeOpacity={0.75} onPress={!loading ? handleClose : undefined}>
                    <Text style={[styles.contentButtonText, styles.buttonTextOutline]}>{'Não'.toUpperCase()}</Text>
                </TouchableOpacity>
            </ModalizeFixed>
        </>
    )
}

export default PresentialScheduleScreen
