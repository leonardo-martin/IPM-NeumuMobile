import React, { FC, ReactElement, useCallback, useEffect, useState } from 'react'
import { RefreshControl, ScrollView, View } from 'react-native'
import { DrawerContentComponentProps } from '@react-navigation/drawer'
import { appointmentItemStyle } from './style'
import { Card, Layout, Text } from '@ui-kitten/components'
import { Appointment } from '@models/Appointment'
import { formatDateToString } from '@utils/convertDate'
import { useFetch } from '@hooks/useSwr'
import { SafeAreaLayout } from '@components/safeAreaLayout'
import { SWRConfig } from 'swr'

const AppointmentTabItemScreen: FC<DrawerContentComponentProps> = ({ navigation }): ReactElement => {

    const [refreshing, setRefreshing] = useState<boolean>(true)
    const [appointmentsData, setAppointmentsData] = useState<Appointment[]>([])

    const { data, error } = useFetch<Appointment[]>(refreshing ? 'appointment/get-appointment-list-patient' : null)

    const onRefresh = useCallback(() => {
        setRefreshing(true)
    }, [])

    useEffect(() => {
        if (data !== undefined) setAppointmentsData(data)
        setRefreshing(false)
    }, [data])

    return (
        <SWRConfig
            value={{
                refreshInterval: 1000

            }}>
            <SafeAreaLayout style={appointmentItemStyle.safeArea}>
                <ScrollView
                    contentContainerStyle={appointmentItemStyle.contentContainerScrollView}
                    showsVerticalScrollIndicator={false}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                        />
                    }
                >
                    {(appointmentsData && appointmentsData?.length === 0) || error
                        ?
                        <View style={appointmentItemStyle.viewNothingData}>
                            <Text status='basic'>Nada encontrado</Text>
                        </View>
                        :
                        <View style={appointmentItemStyle.view}>
                            {appointmentsData?.sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())
                                .map((item, index) => {
                                    return (
                                        <Layout key={index} style={appointmentItemStyle.layoutContainer}>
                                            <Card style={appointmentItemStyle.card}>
                                                <View style={appointmentItemStyle.viewCard}>
                                                    <View style={appointmentItemStyle.viewCardInfo}>
                                                        <Text style={appointmentItemStyle.text}>{item.medicalDoctorSummaryDto.name}</Text>
                                                        <Text style={appointmentItemStyle.text}>{item.medicalDoctorSummaryDto.specialty}</Text>
                                                        <Text style={appointmentItemStyle.text}>{formatDateToString(item.startTime)}</Text>

                                                    </View>
                                                    <View style={[
                                                        appointmentItemStyle.viewCardStatus,
                                                        {
                                                            borderColor: '#C4C4C4',
                                                            borderWidth: 1,
                                                            backgroundColor: !item.confirmedByMedicalDoctor ? 'yellow' : 'green'
                                                        }
                                                    ]}>
                                                        <Text style={[
                                                            appointmentItemStyle.textStatus,
                                                            {
                                                                color: item.confirmedByMedicalDoctor ? '#FFF' : '#474747'
                                                            }
                                                        ]}
                                                        >{item.confirmedByMedicalDoctor ? "Aprovado" : "Pendente aprovação"}</Text>
                                                    </View>
                                                </View>
                                            </Card>
                                        </Layout>
                                    )
                                })}
                        </View>
                    }
                </ScrollView>
            </SafeAreaLayout>
        </SWRConfig>
    )
}

export default AppointmentTabItemScreen
