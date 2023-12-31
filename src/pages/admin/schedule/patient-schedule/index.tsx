import HeaderAdmin from '@components/header/admin'
import LoadingIndicatorComponent from '@components/loadingIndicator'
import ModalizeFixed from '@components/modalize'
import { SafeAreaLayout } from '@components/safeAreaLayout'
import { _DATE_FROM_ISO_8601, _DEFAULT_FORMAT_DATETIME } from '@constants/date'
import { useAppSelector } from '@hooks/redux'
import { useDatepickerService } from '@hooks/useDatepickerService'
import { useModal } from '@hooks/useModal'
import { CreateAppointment } from '@models/Appointment'
import { MedicalDoctorDisplay } from '@models/Medical'
import { VisitAddressDTO } from '@models/VisitAddress'
import { useRoute } from '@react-navigation/core'
import { useFocusEffect, useNavigation } from '@react-navigation/native'
import { AppInfoService } from '@services/app-info.service'
import { createAppointment, getAppointmentAvailabilityListSummaryByDoctorId, getAppointmentAvailabilityWithBookedAppointments } from '@services/appointment.service'
import { getVisitAddressListByDoctorId } from '@services/visit-address.service'
import { Avatar, Button, Card, Icon, IconProps, List, Text, TranslationWidth, useStyleSheet, useTheme } from '@ui-kitten/components'
import { getTimeBlocksByTime, getTimesByInterval, scrollToRef } from '@utils/common'
import { openMapsWithAddress } from '@utils/maps'
import { addHours, addMinutes, compareAsc } from 'date-fns'
import React, { FC, ReactElement, useCallback, useEffect, useRef, useState } from 'react'
import { ActivityIndicator, ImageStyle, LayoutRectangle, Platform, Pressable, ScrollView, StyleProp, TouchableOpacity, View } from 'react-native'
import { Modalize } from 'react-native-modalize'
import { Host, Portal } from 'react-native-portalize'
import Animated, { Easing, SlideInRight, SlideOutRight, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated'
import Toast from 'react-native-toast-message'
import { RootState } from 'store'
import { doctorScheduleStyle } from './style'

interface Data {
    id: number
    value: string
    layout: LayoutRectangle
}

const PresentialScheduleScreen: FC = (): ReactElement => {

    const { localeDateService } = useDatepickerService()
    const navigation = useNavigation<any>()
    const { ids } = useAppSelector((state: RootState) => state.user)
    const times = getTimesByInterval(localeDateService, 15, 345, 18)
    const theme = useTheme()
    const opacity = useSharedValue(0)
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
    const [confirmDate, setConfirmDate] = useState<Date>(new Date())
    const [scheduleData, setScheduleData] = useState<CreateAppointment | undefined>()
    const [loading, setLoading] = useState<boolean>(false)
    const [params, setParams] = useState<MedicalDoctorDisplay>()
    const [availableTimes, setAvailableTimes] = useState<string[]>([])
    const [visitAddress, setVisitAddress] = useState<VisitAddressDTO>()
    const [fullAddress, setFullAddress] = useState<string>('')
    const [isLoading, setIsLoading] = useState<boolean>(true)

    const route = useRoute()
    const { ref } = useModal<Modalize>()

    const getVisitAddressFromId = async (id: number) => {
        const response = await getVisitAddressListByDoctorId(id.toString())
        if (response.data && response.data.length > 0) {
            setVisitAddress(response.data[0])
            setFullAddress(`${response.data[0]?.street}, ${response.data[0]?.number} - ${response.data[0]?.city}`)
        } else {
            setVisitAddress(undefined)
            setFullAddress('')
        }
    }

    useFocusEffect(
        useCallback(() => {
            setIsLoading(true)
            const param = route.params as MedicalDoctorDisplay
            setParams(param)
            setAvailableTimes([])
            setDateTimeSelected(undefined)
            if (param?.medicalDoctorId) {
                getVisitAddressFromId(param.medicalDoctorId)
            }

            handleClose()

            return () => {
                setIsLoading(false)
                setDateSelected(currentDate)
                setDateTimeSelected(undefined)
                setTimeSelected(undefined)
                setCount(0)
            }
        }, [route.params])
    )

    useEffect(() => {
        if (!isLoading)
            scrollToRef(scrollViewDaysInMonthRef, 0, 0)
    }, [isLoading])

    const getDaysAvailables = async (date: Date, medicalDoctorId?: string) => {
        const appointmentList = await getAppointmentAvailabilityListSummaryByDoctorId((medicalDoctorId || params?.medicalDoctorId) as number)
        let arr = Array.from({ length: localeDateService.getNumberOfDaysInMonth(date) }, (x, i) => localeDateService.format(localeDateService.addDay(localeDateService.getMonthStart(date), i), 'DD'))
        arr = localeDateService.getMonth(dateSelected) === localeDateService.getMonth(localeDateService.today()) ?
            arr.filter(d => Number(d) >= Number(localeDateService.format(localeDateService.today(), 'DD')))
            : arr || arr
        const list = arr.filter((day: string) => {
            const tDate = localeDateService.clone(dateSelected)
            tDate.setDate(Number(day))
            const dayOfWeek = localeDateService.getDayOfWeek(tDate)
            if (appointmentList.data[dayOfWeek.toString()])
                return day
        })
        setDaysInMonth(list)
        setNumColumns(list.length)
        setIsLoading(false)
    }

    useFocusEffect(
        useCallback(() => {
            if ((route.params as any)?.medicalDoctorId && dateSelected) {
                getDaysAvailables(dateSelected, (route.params as any)?.medicalDoctorId)
                if (availableTimes.length === 0) opacity.value = 0
                else opacity.value = 1
            }
        }, [dateSelected, route.params])
    )

    const onSubmit = async () => {
        const startTime = localeDateService.clone(dateTimeSelected as Date)

        const time = (timeSelected as string).split(':')
        startTime.setHours(Number(time[0]), Number(time[1]), 0, 0)

        setConfirmDate(startTime)
        const startTimeString = startTime.toISOString()
        const endTimeString = addMinutes(startTime, 14).toISOString()

        setScheduleData(
            new CreateAppointment(
                ids?.patientId,
                params?.medicalDoctorId ?? 0,
                startTimeString,
                endTimeString,
                visitAddress?.id ?? 0))
        ref.current?.open()
    }

    const handleClose = () => ref.current?.close()

    const toSchedule = async () => {
        setLoading(!loading)
        try {
            const response = await createAppointment(scheduleData)
            if (response.status === 201) {
                navigation.navigate('ConfirmationSchedule', {
                    title: `${AppInfoService.getAppName()} | Consulta Presencial`,
                    description: 'Esta é uma marcação de uma consulta presencial com o seu médico',
                    location: fullAddress,
                    startDate: localeDateService.parse(scheduleData?.startTime as string, _DATE_FROM_ISO_8601).getTime().toString(),
                    endDate: addMinutes(localeDateService.parse(scheduleData?.endTime as string, _DATE_FROM_ISO_8601), 1).getTime().toString(),
                    allDay: false
                })
            } else {
                const message = response.data?.message?.message
                if (message !== "") {
                    if (message === "ScheduleConflictException")
                        Toast.show({
                            type: 'info',
                            text2: 'Já existe uma solicitação para este horário. Aguarde a confirmação do Profissional de Saúde',
                        })
                    else {
                        if ((response.data?.message as string).includes('visitAddress')) {
                            Toast.show({
                                type: 'danger',
                                text2: 'Especialista não possui um endereço comercial cadastrado.',
                            })
                        } else Toast.show({
                            type: 'danger',
                            text2: 'Erro ao agendar consulta. Tente novamente mais tarde',
                        })
                    }

                } else
                    Toast.show({
                        type: 'danger',
                        text2: 'Erro ao agendar consulta. Tente novamente mais tarde',
                    })
            }
            handleClose()
            setLoading(false)
        } catch (error) {
            handleClose()
            setLoading(false)
            Toast.show({
                type: 'danger',
                text2: 'Erro desconhecido. Contate o administrador',
            })
        }
    }

    const next = () => {
        const date = localeDateService.addMonth(dateSelected, 1)
        setDateSelected(date)
        setCount(count + 1)
    }

    const previous = () => {
        if (count === 1) {
            const date = localeDateService.addMonth(dateSelected, -1)
            setDateSelected(date)
            setCount(count - 1)
        }
    }

    useEffect(() => {
        if (availableTimes.length === 0) opacity.value = 0
        else opacity.value = 1
    }, [availableTimes])

    const handleDateSelected = async (item: number) => {
        const date = localeDateService.clone(dateSelected)
        date.setDate(item)
        if (date.getTime() !== dateTimeSelected?.getTime()) {
            setDateTimeSelected(date)
            setTimeSelected(undefined)

            const startTime = date
            startTime.setHours(0, 0, 0, 0)
            const response = await getAppointmentAvailabilityWithBookedAppointments({
                doctorId: params?.medicalDoctorId,
                startTime: startTime.toISOString(),
                endTime: addHours(startTime, 23).toISOString()
            })
            if (response.data.length > 0) {
                let arr = times.filter(e =>
                    (response.data[0].availability.includes(getTimeBlocksByTime(localeDateService.parse(e.toString(), _DATE_FROM_ISO_8601)))
                        && (response.data[0].booked && !response.data[0].booked.includes(getTimeBlocksByTime(localeDateService.parse(e.toString(), _DATE_FROM_ISO_8601)))))
                    || (response.data[0].availability.includes(getTimeBlocksByTime(localeDateService.parse(e.toString(), _DATE_FROM_ISO_8601)))
                        && !response.data[0].booked)

                )
                // remover horários anteriores ao horário atual
                if (item == new Date().getDate()) {
                    arr = arr.filter(e => compareAsc(localeDateService.parse(e.toString(), _DATE_FROM_ISO_8601), new Date()) >= 0)
                }
                setAvailableTimes(arr)
            } else {
                setAvailableTimes([])
            }
        }
        else {
            setDateTimeSelected(undefined)
            setTimeSelected(undefined)
            opacity.value = 0
        }
    }

    const handleTimeSelected = (item: Date) => {
        const time = localeDateService.format(item, 'HH:mm')
        if (time === timeSelected) setTimeSelected(undefined)
        else setTimeSelected(time)
    }

    const navigateToDoctorProfile = () => {
        if (visitAddress && params) {
            const doctor: MedicalDoctorDisplay = {
                ...params,
                address1: visitAddress.street ?? params.address1,
                address2: visitAddress.district ?? params.address2,
                city: visitAddress.city ?? params.city,
                state: visitAddress.state ?? params.state,
                addressComplement: visitAddress.complement ?? params.addressComplement,
                postalCode: visitAddress.cep ?? params.postalCode

            }
            navigation.navigate("DoctorProfile", { ...doctor })
        }

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
                const cords = [{
                    id: index,
                    value: item,
                    layout: { ...layout }
                }]
                dataSourceCords[index] = cords[0]
                setDataSourceCords(dataSourceCords)
                if (dateTimeSelected) {
                    if (localeDateService.compareDatesSafe(currentDate, dateTimeSelected) !== 0) {
                        const item = (dataSourceCords || cords).find(v => dateTimeSelected && v.value === localeDateService.format(dateTimeSelected, 'DD') && dateSelected.getMonth() === dateTimeSelected.getMonth())
                        if (item) scrollToRef(scrollViewDaysInMonthRef, item.layout.x, 0)
                        else scrollToRef(scrollViewDaysInMonthRef, (dataSourceCords || cords)[0]?.layout.x, 0)
                    }
                } else {
                    if (index === 0)
                        scrollToRef(scrollViewDaysInMonthRef, layout.x, 0)
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

    const animatedStyle = useAnimatedStyle(() => {
        return {
            opacity: withTiming(opacity.value, {
                duration: 500,
                easing: Easing.bezier(0.25, 0.1, 0.25, 1),
            }),
        }
    })

    return (
        <>
            <Host>
                <HeaderAdmin />
                <SafeAreaLayout level='1' style={styles.safeArea}>
                    {isLoading ? (
                        <LoadingIndicatorComponent />
                    ) : (
                        <ScrollView
                            contentContainerStyle={styles.contentContainerScrollView}
                            showsVerticalScrollIndicator={false}>
                            <View style={styles.viewContent}>
                                <Card
                                    style={{
                                        backgroundColor: theme['background-basic-color-2']
                                    }}
                                    disabled
                                    footer={fullAddress !== '' ? footerCard : undefined}
                                    status='info'>
                                    <View style={styles.viewDoctorProfile}>
                                        <Avatar
                                            style={styles.avatarDoctor as StyleProp<ImageStyle>}
                                            source={require('../../../../assets/commons/doctor.png')}
                                        />
                                        <View style={{ flex: 1 }}>
                                            <Text
                                                category="h5"
                                                status="basic"
                                            >{params?.name}</Text>
                                            <Text
                                                category="c1"
                                                status="basic"
                                                style={styles.textDoctorInfo}
                                            >Especialidade: {params?.specialty ?? ''}</Text>
                                            <Text
                                                category="c1"
                                                status="basic"
                                                style={styles.textDoctorInfo}
                                            >N°: {params?.crm ?? ''}</Text>
                                            {fullAddress !== '' && (
                                                <>
                                                    <Text
                                                        category="c1"
                                                        status="basic"
                                                        style={styles.textDoctorInfo}
                                                    >Local: {fullAddress}</Text>
                                                    <TouchableOpacity style={styles.viewLocation} onPress={() => openMapsWithAddress(fullAddress ?? '')}>
                                                        <Text
                                                            category="c1"
                                                            style={styles.textLocation}
                                                        >Ver no mapa</Text>
                                                        <Icon style={styles.icon} name="location-outline" size={15} pack='ionicons' />
                                                    </TouchableOpacity>
                                                </>
                                            )}
                                        </View>
                                    </View>
                                </Card>
                                <View style={styles.daysInMonth}>
                                    <Text appearance='hint' style={styles.freeAlert}>Inicialmente está disponível somente agendamento de consultas nas quais o atendimento for gratuito. </Text>
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
                                        showsVerticalScrollIndicator={false}
                                        horizontal={true}
                                        ref={scrollViewDaysInMonthRef}>
                                        <List
                                            style={{ backgroundColor: 'transparent' }}
                                            key={numColumns}
                                            data={daysInMonth}
                                            renderItem={renderItem}
                                            numColumns={numColumns}
                                        />
                                    </ScrollView>
                                </View>

                                <View style={{ paddingVertical: 15 }}>
                                    <Text style={styles.text}>Horários disponíveis</Text>
                                    <Animated.View
                                        entering={SlideInRight}
                                        exiting={SlideOutRight}
                                        style={animatedStyle}>
                                        <View style={[styles.timesContainer, {
                                            display: availableTimes.length === 0 ? 'none' : 'flex'
                                        }]}>
                                            {availableTimes.map(item => {
                                                const date = localeDateService.parse(item, _DATE_FROM_ISO_8601)
                                                return (
                                                    <Pressable key={`${item}`}
                                                        onPress={() => handleTimeSelected(date)}>
                                                        <View style={[styles.timesCard, {
                                                            backgroundColor: timeSelected === localeDateService.format(date, 'HH:mm') ? theme['color-primary-500'] : theme['color-basic-400'],
                                                        }]}>
                                                            <Text style={[styles.timesText, {
                                                                color: timeSelected === localeDateService.format(date, 'HH:mm') ? theme['color-control-default'] : theme['text-hint-color']
                                                            }]}>{localeDateService.format(date, 'HH:mm')}</Text>
                                                        </View>
                                                    </Pressable>
                                                )
                                            })}
                                        </View>
                                    </Animated.View>
                                    <Animated.View
                                        entering={SlideInRight}
                                        style={{ display: availableTimes.length > 0 ? 'none' : 'flex' }}>
                                        <View style={styles.timesContainer}>
                                            <Text style={[styles.timesText, styles.textWithoutSelectedDate]}>
                                                {availableTimes.length === 0 && dateTimeSelected ? 'Nenhum horário disponível' : 'Selecione o dia desejado'}
                                            </Text>
                                        </View>
                                    </Animated.View>
                                </View>
                                <View style={styles.viewBtn}>
                                    <Button
                                        style={styles.btnToSchedule}
                                        onPress={onSubmit}
                                        status="success"
                                        disabled={!timeSelected || !dateTimeSelected}
                                    >CONFIRMAR</Button>
                                </View>
                            </View>
                        </ScrollView>
                    )}

                </SafeAreaLayout >
                <Portal>
                    <ModalizeFixed ref={ref} snapPoint={300} adjustToContentHeight={true} >
                        <View>
                            <Text style={styles.textConfirmExit}>Confirmar o agendamento para</Text>
                            <Text style={styles.textConfirmExit}>{localeDateService.format(confirmDate, _DEFAULT_FORMAT_DATETIME)}?</Text>
                        </View>
                        <TouchableOpacity style={[styles.contentButton, {
                            backgroundColor: loading ? theme['color-primary-disabled'] : styles.contentButton.backgroundColor
                        }]} activeOpacity={0.75} onPress={!loading ? toSchedule : undefined}>
                            {loading ? <ActivityIndicator size="small" color={theme['color-basic-500']} /> : <Text style={styles.contentButtonText}>{'Sim'.toUpperCase()}</Text>}
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.contentButton, styles.buttonOutline]}
                            activeOpacity={0.75}
                            onPress={!loading ? handleClose : undefined}>
                            <Text style={[styles.contentButtonText, styles.buttonTextOutline]}>{'Não'.toUpperCase()}</Text>
                        </TouchableOpacity>
                    </ModalizeFixed>
                </Portal>
            </Host>
        </>
    )
}

export default PresentialScheduleScreen
