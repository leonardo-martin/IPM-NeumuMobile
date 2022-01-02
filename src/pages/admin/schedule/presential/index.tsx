import React, { FC, ReactElement, useEffect, useRef, useState } from 'react'
import { ImageBackground, ImageStyle, LayoutRectangle, Platform, Pressable, ScrollView, StyleProp, View } from 'react-native'
import { DrawerContentComponentProps } from '@react-navigation/drawer'
import { useRoute } from '@react-navigation/core'
import { doctorScheduleStyle } from './style'
import { Avatar, Button, Card, Icon, IconProps, List, Modal, Spinner, Text, TranslationWidth, useStyleSheet, useTheme } from '@ui-kitten/components'
import { useAuth } from '@contexts/auth'
import { CreateAppointment } from '@models/Appointment'
import { formatDateToString } from '@utils/convertDate'
import { createAppointment } from '@services/appointment.service'
import { openMapsWithAddress } from '@utils/maps'
import { SafeAreaLayout } from '@components/safeAreaLayout'
import { DateFnsService } from '@ui-kitten/date-fns'
import { scrollToRef } from '@utils/common'
import { i18nConfig } from '@components/calendar/config'

const dateService = new DateFnsService('pt-BR', { i18n: { ...i18nConfig }, startDayOfWeek: 0 })

interface Data {
    id: number
    value: string
    layout: LayoutRectangle
}

const options = [
    {
        id: 1,
        title: '08:45',
        disabled: false
    },
    {
        id: 2,
        title: '13:15',
        disabled: false
    },
    {
        id: 3,
        title: '15:55',
        disabled: false
    },
    {
        id: 4,
        title: '16:55',
        disabled: false
    },
    {
        id: 5,
        title: '17:30',
        disabled: true
    }
]

const PresentialScheduleScreen: FC<DrawerContentComponentProps> = ({
    navigation
}): ReactElement => {

    const { currentUser } = useAuth()
    const theme = useTheme()
    const styles = useStyleSheet(doctorScheduleStyle)
    const [visibleErrorModal, setVisibleErrorModal] = useState<boolean>(false)
    const scrollViewDaysInMonthRef = useRef<ScrollView>(null)
    const [currentDate] = useState<Date>(dateService.today())
    const [monthSelected, setMonthSelected] = useState<Date>(currentDate)
    const [dateSelected, setDateSelected] = useState<Date | undefined>(undefined)
    const [timeSelected, setTimeSelected] = useState<string | undefined>(undefined)
    const [count, setCount] = useState<number>(0)
    const [daysInMonth, setDaysInMonth] = useState<string[]>(Array.from({ length: dateService.getNumberOfDaysInMonth(monthSelected) }, (x, i) => dateService.format(dateService.addDay(dateService.getMonthStart(monthSelected), i), 'DD')))
    const [numColumns, setNumColumns] = useState<number>(daysInMonth.length)
    const [dataSourceCords, setDataSourceCords] = useState<Data[]>([])

    const [confirmDate, setConfirmDate] = useState<Date | string | undefined>('')
    const [visibleConfirmModal, setVisibleConfirmModal] = useState<boolean>(false)
    const [scheduleData, setScheduleData] = useState<CreateAppointment | undefined>()
    const [loading, setLoading] = useState<boolean>()

    const route = useRoute()
    const { params }: any = route

    const closeModal = () => {
        setVisibleErrorModal(false)
        setVisibleConfirmModal(false)
    }

    const confirmSchedule = () => {
        setLoading(false)
        const startTime = dateService.clone(dateSelected as Date)

        const time = (timeSelected as string).split(':')
        startTime.setHours(Number(time[0]))
        startTime.setMinutes(Number(time[1]))
        startTime.setSeconds(0)

        setConfirmDate(startTime)
        const dateString = formatDateToString(startTime)

        setScheduleData(
            new CreateAppointment(
                currentUser?.userId,
                params?.doctorId,
                dateString,
                dateString,
                params?.visitAddress.id))
        setVisibleConfirmModal(true)

    }

    const toSchedule = async () => {
        setLoading(true)
        try {
            await createAppointment(scheduleData)
            setVisibleConfirmModal(false)
            setLoading(false)
        } catch (error) {
            setVisibleConfirmModal(false)
            setVisibleErrorModal(true)
        }

    }

    const LoadingIndicator = (props: any) => (
        <View style={[props.style]}>
            <Spinner status="info" size='small' />
        </View>
    )

    const footerCard = (props: IconProps) => (
        <View style={styles.footerCard}>
            <Icon {...props} style={[props.style, {
                ...styles.icon
            }]} name={Platform.OS === 'ios' ? 'chevron-forward-outline' : Platform.OS === 'android' ? 'arrow-forward-outline' : 'arrow-forward-outline'}
                pack='ionicons' size={20} />
        </View>
    )


    useEffect(() => {
        setNumColumns(daysInMonth.length)
    }, [monthSelected])

    const newDaysInMonthArray = (date: Date) => {
        const array = Array.from({ length: dateService.getNumberOfDaysInMonth(date) }, (x, i) => dateService.format(dateService.addDay(dateService.getMonthStart(date), i), 'dd'))
        setDaysInMonth(array)
    }

    const next = () => {
        const date = dateService.addMonth(monthSelected, 1)
        setMonthSelected(date)
        setCount(count + 1)
        newDaysInMonthArray(date)
    }

    const previous = () => {
        if (count === 1) {
            const date = dateService.addMonth(monthSelected, -1)
            setMonthSelected(date)
            setCount(count - 1)
            newDaysInMonthArray(date)
        }
    }

    const handleDateSelected = (item: number) => {
        const date = dateService.clone(monthSelected)
        date.setDate(item)
        if (date.getTime() !== dateSelected?.getTime()) {
            setDateSelected(date)
            setTimeSelected(undefined)
        }
        else {
            setDateSelected(undefined)
            setTimeSelected(undefined)
        }
    }

    const handleTimeSelected = (item: string) => {
        if (item === timeSelected) setTimeSelected(undefined)
        else setTimeSelected(item)
    }


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
                    if (dateSelected && dateService.compareDatesSafe(currentDate, dateSelected) === 0) {
                        scrollToRef(scrollViewDaysInMonthRef, dataSourceCords.find(v => v.value === dateService.format(currentDate, 'dd'))?.layout.x, 0)
                    } else {
                        const item = dataSourceCords.find(v => dateSelected && v.value === dateService.format(dateSelected, 'dd') && monthSelected.getMonth() === dateSelected.getMonth())
                        if (item) scrollToRef(scrollViewDaysInMonthRef, item.layout.x, 0)
                        else scrollToRef(scrollViewDaysInMonthRef, dataSourceCords[0]?.layout.x, 0)
                    }
                }
            }}>
            {
                (dateService.compareDatesSafe(new Date(monthSelected.getFullYear(), monthSelected.getMonth(), item), currentDate) === (1 || 0)) ||
                    (monthSelected.getMonth() === currentDate.getMonth() && Number(item) === currentDate.getDate())
                    ?
                    <Pressable
                        onPress={() => handleDateSelected(Number(item))}>
                        <View
                            style={[styles.daysInMonthView, {
                                backgroundColor: dateSelected && item === dateService.format(dateSelected, 'dd') && dateSelected.getMonth() === monthSelected.getMonth() ? theme['color-primary-500'] : theme['color-basic-400'],
                            }]}
                        >
                            <Text style={[styles.daysInMonthText, {
                                color: dateSelected && item === dateService.format(dateSelected, 'dd') && dateSelected.getMonth() === monthSelected.getMonth() ? theme['text-control-color'] : theme['text-hint-color']
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
                                source={{ uri: 'https://bootdey.com/img/Content/avatar/avatar1.png' }}
                                ImageComponent={ImageBackground} />
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
                            <Text style={styles.textMonth}>{dateService.getMonthName(monthSelected, TranslationWidth.LONG)}</Text>
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
                        {dateSelected ?
                            <View style={styles.timesContainer}>
                                {options.map(item => (
                                    <Pressable key={`${item.id}-${item.title}`}
                                        onPress={() => !item.disabled ? handleTimeSelected(item.title) : undefined}>
                                        <View style={[styles.timesCard, {
                                            backgroundColor: timeSelected === item.title && !item.disabled ? theme['color-primary-500'] : item.disabled ? theme['color-basic-disabled'] : theme['color-basic-400'],
                                        }]}>
                                            <Text style={[styles.timesText, {
                                                color: timeSelected === item.title && !item.disabled ? theme['color-control-default'] : item.disabled ? theme['text-disabled-color'] : theme['text-hint-color']
                                            }]}>{item.title}</Text>
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
                            disabled={!timeSelected || !dateSelected}
                        >CONFIRMAR</Button>
                    </View>
                </View>

                <Modal
                    style={styles.modalContainerError}
                    backdropStyle={styles.backdrop}
                    visible={visibleConfirmModal}
                    onBackdropPress={closeModal}
                >
                    <Card style={styles.cardContainer}>
                        <View style={styles.viewCloseIcon}>
                            <Icon style={styles.iconModal} size={30} name='close-outline' pack='ionicons' onPress={closeModal} />
                        </View>
                        <View style={{ flexDirection: 'column', justifyContent: 'center' }}>
                            <Text
                                style={styles.textConfirmModal}
                                status="basic"
                            >Confirma o agendamento em</Text>
                            <Text
                                style={styles.textConfirmModal}
                                status="basic"
                            >{formatDateToString(confirmDate as Date)}</Text>
                        </View>
                        <View style={styles.viewConfirmButtonModal}>
                            <Button
                                size="giant"
                                appearance='ghost'
                                onPress={toSchedule}
                                accessoryRight={loading ? LoadingIndicator : undefined}>{!loading ? "SIM" : ""}</Button>
                        </View>
                    </Card>
                </Modal>
                <Modal
                    style={styles.modalContainerError}
                    backdropStyle={styles.backdrop}
                    visible={visibleErrorModal}
                    onBackdropPress={closeModal}
                >
                    <Card style={styles.cardContainer}>
                        <View style={styles.viewCloseIcon}>
                            <Icon style={styles.iconModal} size={30} name='close-outline' pack='ionicons' onPress={closeModal} />
                        </View>
                        <Text
                            style={styles.textError}
                            status="danger" category='h6'
                        >Erro ao agendar a consulta. Tente novamente mais tarde.</Text>

                    </Card>
                </Modal>
            </ScrollView>
        </SafeAreaLayout >

    )
}

export default PresentialScheduleScreen
