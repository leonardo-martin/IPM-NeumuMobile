import React, { FC, ReactElement, useState } from 'react'
import { SafeAreaView, ScrollView, View } from 'react-native'
import { DrawerContentComponentProps } from '@react-navigation/drawer'
import { appointmentsStyle } from './style'
import { Card, Layout, Tab, TabView, Text } from '@ui-kitten/components'
import { Appointment } from '../../../models/Appointment'
import { dateFormatToString } from '../../../utils/convertDate'
import { useFetch } from '../../../hooks/useSwr'
import { SWRConfig } from 'swr'
import Icon from 'react-native-vector-icons/Ionicons'

const AppointmentScreen: FC<DrawerContentComponentProps> = ({
    navigation
}): ReactElement => {

    const { data: appointmentsData } = useFetch<Appointment[]>('appointment/get-appointment-list-patient')
    const [selectedIndex, setSelectedIndex] = useState<number>(0)

    return (
        <>
            <SWRConfig value={{
                refreshInterval: 5000
            }}>
                <TabView
                    selectedIndex={selectedIndex}
                    onSelect={(index: number) => setSelectedIndex(index)}>
                    <Tab title={
                        <Text>
                            <Icon name='checkmark-circle-outline' size={15} />
                            Ativos
                        </Text>
                    } >
                        {appointmentsData && appointmentsData.length === 0
                            ?
                            <View style={appointmentsStyle.viewNothingData}>
                                <Text>Nada encontrado</Text>
                            </View>
                            :
                            <ScrollView
                                style={appointmentsStyle.scrollView}
                                contentContainerStyle={appointmentsStyle.contentContainerScrollView}
                                showsVerticalScrollIndicator={false}>
                                <SafeAreaView style={appointmentsStyle.content}>
                                    <View style={appointmentsStyle.view}>
                                        {appointmentsData?.sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())
                                            .map((item, index) => {
                                                return (
                                                    <Layout key={index} style={appointmentsStyle.layoutContainer}>
                                                        <Card style={appointmentsStyle.card}>
                                                            <View style={appointmentsStyle.viewCard}>
                                                                <View style={appointmentsStyle.viewCardInfo}>
                                                                    <Text style={appointmentsStyle.text}>{item.medicalDoctorSummaryDto.name}</Text>
                                                                    <Text style={appointmentsStyle.text}>{item.medicalDoctorSummaryDto.specialty}</Text>
                                                                    <Text style={appointmentsStyle.text}>{dateFormatToString(item.startTime)}</Text>

                                                                </View>
                                                                <View style={[
                                                                    appointmentsStyle.viewCardStatus,
                                                                    {
                                                                        borderColor: '#C4C4C4',
                                                                        borderWidth: 1,
                                                                        backgroundColor: !item.confirmedByMedicalDoctor ? 'yellow' : 'green'
                                                                    }
                                                                ]}>
                                                                    <Text style={[
                                                                        appointmentsStyle.textStatus,
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
                                </SafeAreaView>
                            </ScrollView>
                        }
                    </Tab>
                    <Tab title={
                        <Text>
                            <Icon name='close-circle-outline' size={15} />
                            Encerrados
                        </Text>
                    } >
                        {appointmentsData && appointmentsData.length === 0 || appointmentsData && appointmentsData.filter(e => e.confirmedByMedicalDoctor).length === 0
                            ?
                            <View style={appointmentsStyle.viewNothingData}>
                                <Text>Nada encontrado</Text>
                            </View>
                            :
                            <ScrollView
                                style={appointmentsStyle.scrollView}
                                contentContainerStyle={appointmentsStyle.contentContainerScrollView}
                                showsVerticalScrollIndicator={false}>
                                <SafeAreaView style={appointmentsStyle.content}>

                                </SafeAreaView>
                            </ScrollView>
                        }

                    </Tab>
                </TabView>
            </SWRConfig>
        </>
    )
}

export default AppointmentScreen
