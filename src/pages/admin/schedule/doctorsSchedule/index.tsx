import React, { FC, ReactElement, useEffect, useState } from 'react'
import { ImageBackground, SafeAreaView, ScrollView, View } from 'react-native'
import { DrawerContentComponentProps } from '@react-navigation/drawer'
import { useRoute } from '@react-navigation/core'
import { doctorScheduleStyle } from './style'
import CalendarComponent from '../../../../components/calendar'
import { Avatar, Button, Card, IndexPath, Modal, Text } from '@ui-kitten/components'
import Icon from 'react-native-vector-icons/Ionicons'
import SelectComponent from '../../../../components/select'

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

    const [date, setDate] = useState<Date>()
    const [isSelected, setIsSelected] = useState<boolean>(false)
    const [visibleModal, setVisibleModal] = useState<boolean>(false)
    const [selectedIndex, setSelectedIndex] = useState<IndexPath | IndexPath[]>(new IndexPath(0))

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
    }

    const handleAvailableTimes = (id: IndexPath | IndexPath[]) => {
        setSelectedIndex(id)
        setVisibleModal(false)
        setIsSelected(true)
    }

    const toSchedule = () => {
        const data = {
            day: date,
            time: options[(Number(selectedIndex) - 1)].title,
            userId: params?.doctorId,
            doctorId: 10
        }
        console.log(data)
    }

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
                                    >Davy Jones</Text>
                                    <Text
                                        category="p1"
                                        status="basic"
                                        style={doctorScheduleStyle.textDoctorInfo}
                                    >Ortopedista</Text>
                                    <Text
                                        category="c1"
                                        status="basic"
                                        style={doctorScheduleStyle.textDoctorInfo}
                                    >CRM: 1235</Text>
                                    <Text
                                        category="c1"
                                        status="basic"
                                        style={doctorScheduleStyle.textDoctorInfo}
                                    >Tel: 43 3333-3333</Text>
                                    <Text
                                        category="c1"
                                        status="basic"
                                        style={doctorScheduleStyle.textDoctorInfo}
                                    >Rua XXXX
                                    </Text>
                                    <View style={doctorScheduleStyle.viewLocation}>
                                        <Text
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
                                    onPress={toSchedule}
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
                </SafeAreaView>
            </ScrollView>
        </>
    )
}

export default DoctorsScheduleScreen
