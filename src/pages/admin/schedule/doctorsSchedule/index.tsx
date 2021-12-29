import React, { FC, ReactElement, useEffect, useState } from 'react'
import { ImageBackground, ImageStyle, Platform, ScrollView, StyleProp, View } from 'react-native'
import { DrawerContentComponentProps } from '@react-navigation/drawer'
import { useRoute } from '@react-navigation/core'
import { doctorScheduleStyle } from './style'
import CalendarComponent from '@components/calendar'
import { Avatar, Button, Card, Icon, IconProps, IndexPath, Modal, Spinner, Text, useStyleSheet } from '@ui-kitten/components'
import SelectComponent from '@components/select'
import { useAuth } from '@contexts/auth'
import { CreateAppointment } from '@models/Appointment'
import { formatDateToString } from '@utils/convertDate'
import { createAppointment } from '@services/appointment.service'
import { openMapsWithAddress } from '@utils/maps'
import { SafeAreaLayout } from '@components/safeAreaLayout'
import { useTheme } from '@contexts/theme'

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

    const { theme } = useTheme()
    const styles = useStyleSheet(doctorScheduleStyle(theme))
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

    const footerCard = (props: IconProps) => (
        <View style={styles.footerCard}>
            <Icon {...props} style={[props.style, {
                ...styles.icon
            }]} name={Platform.OS === 'ios' ? 'arrow-ios-forward-outline' : Platform.OS === 'android' ? 'arrow-forward-outline' : 'arrow-forward-outline'}
                pack='ionicons' size={20} />
        </View>
    )

    return (
        <SafeAreaLayout insets='top' level='1' style={styles.safeArea}>
            <ScrollView
                contentContainerStyle={styles.contentContainerScrollView}
                showsVerticalScrollIndicator={false}>
                <View style={styles.viewContent}>
                    <Card
                        style={styles.card}
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

                    <View style={styles.viewCalendar} >
                        <CalendarComponent
                            onSelect={onSelectDate}
                            date={date}
                            boundingMonth={true}
                        />
                        <View style={styles.viewBtn}>
                            <Button
                                style={styles.btnToSchedule}
                                onPress={confirmSchedule}
                                status="success"
                                disabled={!isSelected}
                            >CONFIRMAR</Button>
                        </View>
                    </View>
                </View>

                <Modal
                    style={styles.modalContainer}
                    backdropStyle={styles.backdrop}
                    visible={visibleModal}
                    onBackdropPress={closeModal}
                >
                    <Card style={styles.cardContainer} >
                        <View style={styles.viewCloseIcon}>
                            <Icon style={styles.iconModal} size={30} name='close-outline' pack='ionicons' onPress={closeModal} />
                        </View>
                        <Text status="primary" category='h6'>Horários disponíveis</Text>
                        <View style={styles.viewSelect}>
                            <SelectComponent
                                items={options}
                                onSelect={handleAvailableTimes}
                                selectedIndex={selectedIndex}
                            />
                        </View>
                    </Card>
                </Modal>

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
                        <View>
                            <Text
                                style={styles.textConfirmModal}
                                status="basic"
                            >Confirma o agendamento para:</Text>
                            <Text
                                style={styles.textConfirmModal}
                                status="basic"
                            >{formatDateToString(confirmDate as Date)} ?</Text>
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
        </SafeAreaLayout>

    )
}

export default DoctorsScheduleScreen
