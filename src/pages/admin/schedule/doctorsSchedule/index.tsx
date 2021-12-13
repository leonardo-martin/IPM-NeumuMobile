import React, { FC, ReactElement, useEffect, useState } from 'react'
import { ImageBackground, SafeAreaView, ScrollView, View } from 'react-native'
import { DrawerContentComponentProps } from '@react-navigation/drawer'
import { useRoute } from '@react-navigation/core'
import { doctorScheduleStyle } from './style'
import CalendarComponent from '@components/calendar'
import { Avatar, Button, Card, IndexPath, Modal, Spinner, Text } from '@ui-kitten/components'
import Icon from 'react-native-vector-icons/Ionicons'
import SelectComponent from '@components/select'
import { useAuth } from '@contexts/auth'
import { CreateAppointment } from '@models/Appointment'
import { formatDateToString } from '@utils/convertDate'
import { createAppointment } from '@services/appointment'
import { openMapsWithAddress } from '@utils/maps'

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
    }
]

const DoctorsScheduleScreen: FC<DrawerContentComponentProps> = ({
    navigation
}): ReactElement => {

    const { currentUser } = useAuth()
    const [date, setDate] = useState(new Date())
    const [isSelected, setIsSelected] = useState<boolean>(false)
    const [visibleModal, setVisibleModal] = useState<boolean>(false)
    const [visibleErrorModal, setVisibleErrorModal] = useState<boolean>(false)
    const [selectedIndex, setSelectedIndex] = useState<IndexPath | IndexPath[]>(new IndexPath(0))

    const [confirmDate, setConfirmDate] = useState<Date | string | undefined>('')
    const [visibleConfirmModal, setVisibleConfirmModal] = useState<boolean>(false)
    const [scheduleData, setScheduleData] = useState<CreateAppointment | undefined>()
    const [loading, setLoading] = useState<boolean>()

    const route = useRoute()
    const { params }: any = route

    useEffect(() => {
        const id = options.findIndex(op => !op.disabled)
        setSelectedIndex(new IndexPath(id))
    }, [])

    const onSelectDate = (date: Date) => {
        setDate(date)
        setVisibleModal(true)
    }

    const closeModal = () => {
        setVisibleModal(false)
        setVisibleErrorModal(false)
        setVisibleConfirmModal(false)
    }

    const handleAvailableTimes = (id: IndexPath | IndexPath[]) => {
        setSelectedIndex(id)
        setVisibleModal(false)
        setIsSelected(true)
    }

    const confirmSchedule = () => {
        setLoading(false)
        const startTime = new Date(date?.getFullYear(), date?.getMonth(), date?.getDate())

        const time = options[(Number(selectedIndex) - 1)].title.split(':')
        startTime.setHours(Number(time[0]))
        startTime.setMinutes(Number(time[1]))

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

    const footerCard = () => (
        <View style={doctorScheduleStyle.footerCard}>
            <Icon name="arrow-forward-outline" size={20} color="#626262" />
        </View>
    )

    return (
        <>
            <ScrollView
                style={doctorScheduleStyle.scrollView}
                contentContainerStyle={doctorScheduleStyle.contentContainerScrollView}
                showsVerticalScrollIndicator={false}>
                <SafeAreaView style={doctorScheduleStyle.container}>
                    <View style={doctorScheduleStyle.viewContent}>
                        <Card
                            footer={footerCard}
                            status='success'>
                            <View style={doctorScheduleStyle.viewDoctorProfile}>
                                <Avatar
                                    style={doctorScheduleStyle.avatarDoctor}
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
                                        style={doctorScheduleStyle.textDoctorInfo}
                                    >{params?.specialty}</Text>
                                    <Text
                                        category="c1"
                                        status="basic"
                                        style={doctorScheduleStyle.textDoctorInfo}
                                    >CRM: {params?.crm}</Text>
                                    <Text
                                        category="c1"
                                        status="basic"
                                        style={doctorScheduleStyle.textDoctorInfo}
                                    >Tel: {params?.tel}</Text>
                                    <Text
                                        category="c1"
                                        status="basic"
                                        style={doctorScheduleStyle.textDoctorInfo}
                                    >{params?.visitAddress.street}
                                    </Text>
                                    <View style={doctorScheduleStyle.viewLocation}>
                                        <Text
                                            onPress={() => openMapsWithAddress(params?.visitAddress.street)}
                                            category="c1"
                                            status="info"
                                            style={doctorScheduleStyle.textLocation}
                                        >Ver no mapa
                                            <Icon name="location-outline" size={15} />
                                        </Text>
                                    </View>
                                </View>
                            </View>
                        </Card>

                        <View style={doctorScheduleStyle.viewCalendar} >
                            <CalendarComponent
                                onSelect={onSelectDate}
                                date={date}
                                boundingMonth={true}
                            />
                            <View style={doctorScheduleStyle.viewBtn}>
                                <Button
                                    style={doctorScheduleStyle.btnToSchedule}
                                    onPress={confirmSchedule}
                                    status="success"
                                    disabled={!isSelected}
                                >CONFIRMAR</Button>
                            </View>
                        </View>
                    </View>
                    <Modal
                        style={doctorScheduleStyle.modalContainer}
                        backdropStyle={doctorScheduleStyle.backdrop}
                        visible={visibleModal}
                        onBackdropPress={closeModal}
                    >
                        <Card style={doctorScheduleStyle.cardContainer}>
                            <View style={doctorScheduleStyle.viewCloseIcon}>
                                <Icon name={'close-outline'} size={30} onPress={closeModal} />
                            </View>
                            <Text status="primary" category='h6'>Horários disponíveis</Text>
                            <View style={doctorScheduleStyle.viewSelect}>
                                <SelectComponent
                                    items={options}
                                    onSelect={handleAvailableTimes}
                                    selectedIndex={selectedIndex}
                                />
                            </View>
                        </Card>
                    </Modal>

                    <Modal
                        style={doctorScheduleStyle.modalContainerError}
                        backdropStyle={doctorScheduleStyle.backdrop}
                        visible={visibleConfirmModal}
                        onBackdropPress={closeModal}
                    >
                        <Card style={doctorScheduleStyle.cardContainer}>
                            <View style={doctorScheduleStyle.viewCloseIcon}>
                                <Icon name={'close-outline'} size={30} onPress={closeModal} />
                            </View>
                            <View>
                                <Text
                                    style={doctorScheduleStyle.textConfirmModal}
                                    status="basic"
                                >Confirma o agendamento para:</Text>
                                <Text
                                    style={doctorScheduleStyle.textConfirmModal}
                                    status="basic"
                                >{formatDateToString(confirmDate as Date)} ?</Text>
                            </View>
                            <View style={doctorScheduleStyle.viewConfirmButtonModal}>
                                <Button
                                    size="giant"
                                    appearance='ghost'
                                    onPress={toSchedule}
                                    accessoryRight={loading ? LoadingIndicator : undefined}>{!loading ? "SIM" : ""}</Button>
                            </View>
                        </Card>
                    </Modal>
                    <Modal
                        style={doctorScheduleStyle.modalContainerError}
                        backdropStyle={doctorScheduleStyle.backdrop}
                        visible={visibleErrorModal}
                        onBackdropPress={closeModal}
                    >
                        <Card style={doctorScheduleStyle.cardContainer}>
                            <View style={doctorScheduleStyle.viewCloseIcon}>
                                <Icon name={'close-outline'} size={30} onPress={closeModal} />
                            </View>
                            <Text
                                style={doctorScheduleStyle.textError}
                                status="danger" category='h6'
                            >Erro ao agendar a consulta. Tente novamente mais tarde.</Text>

                        </Card>
                    </Modal>
                </SafeAreaView>
            </ScrollView>
        </>
    )
}

export default DoctorsScheduleScreen
