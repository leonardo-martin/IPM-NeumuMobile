import { _FORMAT_DATE_EN_US } from '@constants/date'
import toast from '@helpers/toast'
import { useAppSelector } from '@hooks/redux'
import { useDatepickerService } from '@hooks/useDatepickerService'
import { AppointmentDto } from '@models/Appointment'
import { EUserRole } from '@models/UserRole'
import { useFocusEffect, useNavigation } from '@react-navigation/native'
import { doctorConfirmAppointment, doctorDeleteAppointment, getAppointmentListDoctor, getAppointmentListPatient, patientDeleteAppointment } from '@services/appointment.service'
import { Divider, Text, useStyleSheet, useTheme } from '@ui-kitten/components'
import { SafeAreaLayout } from 'components/safeAreaLayout'
import { addMinutes } from 'date-fns'
import React, { FC, ReactElement, useCallback, useState } from 'react'
import { View } from 'react-native'
import { Agenda, AgendaEntry, AgendaSchedule } from 'react-native-calendars'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { RootState } from 'store'
import { appointmentStyle } from './style'

enum TypeUser {
    PATIENT = 'PACIENTE',
    MEDICAL_DOCTOR = 'PROFISSIONAL'
}

const MAX_PAST_MONTHS = 24
const MIN_FUTURE_MONTHS = 6

const AppointmentsScreen: FC = (): ReactElement => {

    const [futureMonthsLimit, setFutureMonthsLimit] = useState<number>(MIN_FUTURE_MONTHS)
    const { sessionUser } = useAppSelector((state: RootState) => state.auth)
    const [items, setItems] = useState<AgendaSchedule>({})
    const { localeDateService } = useDatepickerService()
    const today = localeDateService.today()
    const currentDate = localeDateService.format(today, _FORMAT_DATE_EN_US)
    const [type, setType] = useState<TypeUser>()
    const navigation = useNavigation<any>()

    const styles = useStyleSheet(appointmentStyle)
    const theme = useTheme()

    const renderEmptyDate = () => {
        return (
            <View style={styles.emptyDate} />
        )
    }

    const loadData = async () => {

        let res
        const bPatient = sessionUser?.userRole.find(e => e.id === EUserRole.patient)
        const bDoctor = sessionUser?.userRole.find(e => e.id === EUserRole.medicalDoctor)
        if (bPatient) {
            res = await getAppointmentListPatient()
            setType(TypeUser.PATIENT)
        } else if (bDoctor) {
            res = await getAppointmentListDoctor()
            setType(TypeUser.MEDICAL_DOCTOR)
            setFutureMonthsLimit(12)
        }

        if (res) {
            const arr = res.data
            const newItems: AgendaSchedule = {}
            arr.forEach(item => {
                const dateFormat = new Date(item.startTime)
                const dateUS = localeDateService.format(dateFormat, _FORMAT_DATE_EN_US)
                if (!newItems[dateUS]) {
                    newItems[dateUS] = []
                }

                newItems[dateUS].push({
                    name: '#' + item.id.toString(),
                    height: 120, // minHeight
                    day: localeDateService.format(dateFormat, 'DD'),
                    ...item
                })
            })
            setItems(newItems)
        }

    }

    useFocusEffect(
        useCallback(() => {
            if (sessionUser) {
                loadData()
            }
        }, [])
    )

    const approve = async (appointmentId: number) => {
        try {
            const res = await doctorConfirmAppointment(appointmentId)
            if (res.status === 200) {
                toast.success({ message: 'Apontamento aprovado com sucesso!', duration: 3000 })
                loadData()
            }
        } catch (error) {
            toast.danger({ message: 'Erro ao aprovar o apontamento.', duration: 3000 })
        }
    }

    const reject = async (appointmentId: number) => {
        try {
            if (TypeUser.MEDICAL_DOCTOR === type) {
                const res = await doctorDeleteAppointment(appointmentId)
                if (res.status === 200) {
                    toast.info({ message: 'Apontamento cancelado com sucesso!', duration: 3000 })
                    loadData()
                }
            } else if (TypeUser.PATIENT === type) {

                const res = await patientDeleteAppointment(appointmentId)
                if (res.status === 200) {
                    toast.info({ message: 'Apontamento cancelado com sucesso!', duration: 3000 })
                    loadData()
                }
            }
        } catch (error) {
            toast.danger({ message: 'Erro ao cancelar o apontamento.', duration: 3000 })
        }
    }

    const renderItem = (reservation: AgendaEntry, _isFirst: boolean) => {
        const item = reservation as AgendaEntry & AppointmentDto

        const startDate = new Date(item.startTime)
        const startTime = localeDateService.format(startDate, 'HH:mm')

        const endDate = new Date(item.endTime)
        const endTime = localeDateService.format(addMinutes(endDate, 1), 'HH:mm')

        return (
            <TouchableOpacity
                testID={item.name}
                style={[styles.item, styles.shadow, { minHeight: item.height }]}
                onPress={() => navigation.navigate('DetailsAppointments', {
                    ...item as AppointmentDto
                })}
            >
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', flex: 1 }}>
                    <View style={{
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        flexShrink: 1

                    }}>
                        <View>
                            <Text style={styles.itemTitle}>{item.name}</Text>
                            <View style={styles.containerItem}>
                                <Text style={styles.username}>{type === TypeUser.PATIENT ? item.medicalDoctorSummaryDto.name : item.patientDto.name}</Text>
                            </View>
                        </View>
                        <View style={styles.containerItem}>
                            <Text style={styles.text}>{startTime}</Text>
                            <Text style={styles.text}>às</Text>
                            <Text style={styles.text}>{endTime}</Text>
                        </View>
                    </View>
                    <View style={{
                        flexDirection: 'column',
                        justifyContent: 'space-around',

                    }}>
                        {type === TypeUser.MEDICAL_DOCTOR ? (
                            <>
                                {!item.confirmedByMedicalDoctor ? (
                                    <>
                                        <TouchableOpacity
                                            onPress={() => approve(item.id)}
                                            style={[styles.button, styles.approval]}>
                                            <Text style={styles.textButton}>Aprovar</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            onPress={() => reject(item.id)}
                                            style={[styles.button, styles.cancel]}>
                                            <Text style={styles.textButton}>Cancelar</Text>
                                        </TouchableOpacity>
                                    </>
                                ) : (
                                    <TouchableOpacity
                                        onPress={() => reject(item.id)}
                                        style={[styles.button, styles.cancel]}>
                                        <Text style={styles.textButton}>Cancelar</Text>
                                    </TouchableOpacity>
                                )}

                            </>
                        ) : type === TypeUser.PATIENT ?
                            <>
                                {item.confirmedByMedicalDoctor ? (
                                    <View
                                        style={styles.button}>
                                        <Text status='success' category='label'>Aprovado</Text>
                                    </View>
                                ) :
                                    <View
                                        style={styles.button}>
                                        <Text status='danger' category='label'>Pendente</Text>
                                    </View>
                                }
                                <TouchableOpacity
                                    onPress={() => reject(item.id)}
                                    style={[styles.button, styles.cancel]}>
                                    <Text style={styles.textButton}>Cancelar</Text>
                                </TouchableOpacity>
                            </> : null}
                    </View>
                </View>
            </TouchableOpacity>
        )
    }

    const rowHasChanged = (r1: AgendaEntry, r2: AgendaEntry) => {
        return r1 !== r2
    }

    return (
        <>
            <SafeAreaLayout style={{ flex: 1 }}>
                <Text style={styles.title}>Agenda</Text>
                <Agenda
                    firstDay={0}
                    keyExtractor={item => item}
                    items={items}
                    current={currentDate}
                    selected={currentDate}
                    renderEmptyDate={renderEmptyDate}
                    renderItem={renderItem}
                    rowHasChanged={rowHasChanged}
                    hideExtraDays={true}
                    theme={{
                        todayBackgroundColor: theme['color-success-default'],
                        todayTextColor: theme['color-control-default'],
                        selectedDayBackgroundColor: theme['color-primary-default'],
                        selectedDayTextColor: theme['color-control-default'],
                        calendarBackground: theme['background-basic-color-1']
                    }}
                    refreshing={false}
                    onRefresh={loadData}
                    scrollEventThrottle={16}
                    renderEmptyData={() => {
                        return <View />
                    }}
                    pastScrollRange={MAX_PAST_MONTHS}
                    futureScrollRange={futureMonthsLimit}
                    showClosingKnob
                    renderKnob={() =>
                        <Divider style={{ height: 10, width: 50, borderRadius: 50 }} />
                    }
                />
            </SafeAreaLayout>
        </>
    )
}

export default AppointmentsScreen

