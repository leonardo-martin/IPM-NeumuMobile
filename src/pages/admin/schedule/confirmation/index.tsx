import React, { FC, ReactElement, useCallback, useEffect, useRef, useState } from 'react'
import { DrawerContentComponentProps } from '@react-navigation/drawer'
import { SafeAreaLayout } from '@components/safeAreaLayout'
import { Button, Modal, TopNavigation, TopNavigationAction, useStyleSheet } from '@ui-kitten/components'
import { BackIcon } from '@components/header/icons'
import { confirmationScheduleStyle } from './styles'
import { CommonActions, useFocusEffect, useRoute } from '@react-navigation/native'
import { CreateAppointment } from '@models/Appointment'
import { BackHandler, Linking, View } from 'react-native'
import RNCalendarEvents, { Calendar, CalendarEventWritable } from "react-native-calendar-events"
import LocalCalendarModalComponent from '@components/modal/localCalendarModal'
import { addCalendarEvent } from 'services/calendar.service'
import { useModal } from '@hooks/useModal'

const data = {
    title: 'Consulta Presencial - TeleNeumu',
    description: 'Esta é uma marcação de uma consulta presencial com o seu médico',
    location: 'street',
    dtStart: new Date().getTime().toString(),
    dtEnd: new Date().getTime().toString(),
    allDay: false
}

const ConfirmationScheduleScreen: FC<DrawerContentComponentProps> = ({
    navigation
}): ReactElement => {

    const [isVisibleCalendars, setIsVisibleCalendars] = useState(false)
    const [event, setEvent] = useState<CalendarEventWritable>({} as CalendarEventWritable)
    const openLocalCalendarModal = () => setIsVisibleCalendars(true)
    const closeLocalCalendarModal = () => setIsVisibleCalendars(false)


    const styles = useStyleSheet(confirmationScheduleStyle)
    const { params } = useRoute()
    const [appointment, setAppointment] = useState<CreateAppointment | undefined>(undefined)
    const actions = CommonActions.reset({
        index: 0,
        routes: [
            { name: 'Dashboard' },
        ],
    })

    useEffect(() => {
        const schedule = params as CreateAppointment
        setAppointment(schedule)
    }, [params])

    const renderBackAction = (): ReactElement => (
        <TopNavigationAction
            icon={BackIcon}
            onPress={() => navigation.dispatch(actions)}
        />
    )

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

    // const addEvent = async () => {
    //     const result = await RNCalendarEvents.checkPermissions((false));
    //     console.log(result)

    //     switch (result) {
    //         case 'authorized':
    //             const calendars: Calendar[] = await RNCalendarEvents.findCalendars()
    //             console.log(calendars)
    //             const eventId = await RNCalendarEvents.saveEvent('Teste', {
    //                 startDate: new Date().toISOString(),
    //                 endDate: new Date().toISOString(),
    //                 allDay: false,
    //                 description: 'Teste',
    //                 location: 'TeleNeumu',
    //                 notes: 'Evento teste',
    //             } as CalendarEventWritable)
    //             console.log(eventId)
    //             break
    //         case 'restricted':
    //             Linking.openSettings()
    //             break
    //         case 'denied':
    //             Linking.openSettings()
    //             break
    //         default:
    //             await RNCalendarEvents.requestPermissions((false))
    //             break
    //     }


    // }

    const saveEvent = async (calendar: Calendar) => {
        await addCalendarEvent(event, calendar);
        closeLocalCalendarModal();
    }

    const { ref } = useModal<Modal>()
    return (
        <>
            <SafeAreaLayout insets='top' level='1' style={styles.safeArea}>
                <TopNavigation
                    accessoryLeft={renderBackAction}
                />
                <View style={{ justifyContent: 'center', alignItems: 'center', alignContent: 'center', flex: 1, alignSelf: 'center' }}>
                    {/* <Text style={{
                        flexShrink: 1, flexWrap: 'wrap', textAlign: 'center', padding: 25, fontSize: 18
                    }}>{JSON.stringify(appointment)}</Text> */}
                    <Button status='primary' onPress={openLocalCalendarModal}>Adicionar ao calendário</Button>

                    <LocalCalendarModalComponent
                        ref={ref}
                        isVisible={isVisibleCalendars}
                        closeModal={closeLocalCalendarModal}
                        handleCalendarSelected={saveEvent}
                        label={'Select a calendar'}
                    />
                </View>
            </SafeAreaLayout>
        </>
    )
}

export default ConfirmationScheduleScreen
