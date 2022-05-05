import { SafeAreaLayout } from '@components/safeAreaLayout'
import { _DEFAULT_FORMAT_DATE } from '@constants/date'
import { useDatepickerService } from '@hooks/useDatepickerService'
import { AppointmentDto } from '@models/Appointment'
import { useRoute } from '@react-navigation/native'
import { Card, Divider, Text, useStyleSheet } from '@ui-kitten/components'
import { addMinutes } from 'date-fns'
import React, { FC, ReactElement, useEffect, useState } from 'react'
import { View } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'
import { detailsStyle } from './details-appointment.style'

const DetailsAppointmentsScreen: FC = (): ReactElement => {

    const styles = useStyleSheet(detailsStyle)
    const route = useRoute()
    const [params, setParams] = useState<AppointmentDto>()
    const [bConfirmed, setBConfirmed] = useState<boolean>(false)
    const { localeDateService } = useDatepickerService()

    useEffect(() => {
        setParams(route.params as AppointmentDto)
    }, [route.params])

    useEffect(() => {
        if (params) setBConfirmed(params?.confirmedByMedicalDoctor)
    }, [params])

    return (
        <>
            <SafeAreaLayout style={styles.safeArea}>
                {params ? (
                    <>
                        <ScrollView
                            contentContainerStyle={{ flex: 1 }}
                            showsVerticalScrollIndicator={false}>
                            <View style={styles.statusContainer}>
                                <View style={{ flexDirection: 'column', paddingVertical: 15 }}>
                                    <Text style={styles.id}>#{params.id}</Text>
                                    <View style={[styles.badge, styles.shadow,
                                    bConfirmed ? styles.success : styles.danger]}>
                                        <Text style={styles.textBadge}>{params.confirmedByMedicalDoctor ? 'Aprovado' : 'Pendente'}</Text>
                                    </View>
                                </View>
                            </View>
                            <View style={[styles.cardContainer, styles.shadow]}>
                                <Card disabled style={styles.card} status='info'>
                                    <Text style={styles.label}>Dados Básicos</Text>
                                    <Divider style={styles.divider} />
                                    <Text style={styles.text}>Profissional: {params?.medicalDoctorSummaryDto.name}</Text>
                                    <Text style={styles.text}>N° {params?.medicalDoctorSummaryDto.crm}</Text>

                                    <Text style={styles.text}>Paciente: {params?.patientDto.name}</Text>
                                    <Text style={styles.text}>Data: {localeDateService.format(new Date(params.startTime), _DEFAULT_FORMAT_DATE)}</Text>
                                    <Text style={styles.text}>Horário: {localeDateService.format(new Date(params.startTime), 'HH:mm') + ' às ' + localeDateService.format(addMinutes(new Date(params.endTime), 1), 'HH:mm')}</Text>
                                </Card>
                                <Card disabled style={styles.card} status='info'>
                                    <Text style={styles.label}>Endereço</Text>
                                    <Divider style={styles.divider} />
                                    <Text style={styles.text}>{params.visitAddressDto.street + ' - ' +
                                        params.visitAddressDto.district + ', ' + params.visitAddressDto.cep
                                        + ' - ' + params.visitAddressDto.city + ', ' + params.visitAddressDto.state}</Text>
                                    <Text>{params.visitAddressDto.complement}</Text>
                                </Card>
                            </View>
                        </ScrollView>
                    </>
                ) : (
                    <View style={styles.error}>
                        <Text style={styles.errorText}>Ocorreu um erro ao buscar os dados. Tente novamente mais tarde.</Text>
                    </View>
                )}
            </SafeAreaLayout>
        </>
    )
}

export default DetailsAppointmentsScreen

