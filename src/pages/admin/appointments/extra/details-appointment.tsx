import { SafeAreaLayout } from '@components/safeAreaLayout'
import { _DEFAULT_FORMAT_DATE } from '@constants/date'
import toast from '@helpers/toast'
import { useAppSelector } from '@hooks/redux'
import { useDatepickerService } from '@hooks/useDatepickerService'
import { AppointmentDto } from '@models/Appointment'
import { PatientDisplay } from '@models/Patient'
import { EUserRole } from '@models/UserRole'
import { useNavigation, useRoute } from '@react-navigation/native'
import { requestAuthorizationAsDoctor } from '@services/medical-doctor.service'
import { getPatientDisplayAsDoc } from '@services/patient.service'
import { Card, Divider, Text, useStyleSheet } from '@ui-kitten/components'
import { addMinutes } from 'date-fns'
import React, { FC, ReactElement, useEffect, useState } from 'react'
import { TouchableOpacity, View } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'
import { RootState } from 'store'
import { detailsStyle } from './details-appointment.style'

const DetailsAppointmentsScreen: FC = (): ReactElement => {

    const styles = useStyleSheet(detailsStyle)
    const navigation = useNavigation<any>()
    const { sessionUser } = useAppSelector((state: RootState) => state.auth)
    const route = useRoute()
    const [params, setParams] = useState<AppointmentDto>()
    const [bConfirmed, setBConfirmed] = useState<boolean>(false)
    const { localeDateService } = useDatepickerService()
    const [patientDisplay, setPatientDisplay] = useState<PatientDisplay | undefined>(undefined)
    const [requestAuthorization, setRequestAuthorization] = useState<boolean>(false)

    const getAuthorizationAsDoctor = async () => {
        try {
            if (params?.patientDto) {
                const response = await requestAuthorizationAsDoctor(params?.patientDto.patientId)
                if (response.status === 201 || response.status === 200) {
                    toast.success({ message: 'Solicitação efetuada com sucesso. Aguarde o aceite do Paciente', duration: 3000 })
                } else {
                    toast.danger({ message: 'Erro ao solicitar o acesso. Tente novamente mais tarde', duration: 3000 })
                }
            } else {
                toast.danger({ message: 'Erro desconhecido. Entre em contato com o administrador', duration: 3000 })
            }

        } catch (error) {
            const err = error as any
            if (err && err.status === 400) {
                toast.info({ message: 'Solicitação já efetuada. Aguarde o aceite do Paciente', duration: 3000 })
            } else {
                toast.danger({ message: 'Solicitação já efetuada. Aguarde o aceite do Paciente', duration: 3000 })

            }
        }
    }

    const checkIfDoctorCanAccessPatientData = async (patientId: number) => {
        setRequestAuthorization(false)
        const response = await getPatientDisplayAsDoc(patientId)
        if (response && response.data && response.status === 200) {
            setPatientDisplay(response.data)
        } else {
            if (response.status === 401) {
                setRequestAuthorization(true)
            }
            setPatientDisplay(undefined)
        }
    }

    useEffect(() => {
        setParams(route.params as AppointmentDto)
    }, [route.params])

    useEffect(() => {
        if (params) {
            checkIfDoctorCanAccessPatientData(params.patientDto.patientId)
            setBConfirmed(params?.confirmedByMedicalDoctor)
        }
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
                            {sessionUser && sessionUser?.userRole.find(e => e.id === EUserRole.medicalDoctor) && (
                                patientDisplay ?
                                    <>
                                        <View style={styles.viewInfosContainer}>
                                            <TouchableOpacity style={styles.viewInfosBtn} onPress={() => navigation.navigate('PatientDisplayAsDoctor', {
                                                ...patientDisplay
                                            })}>
                                                <Text status='control'>Informações Compartilhadas</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </>
                                    :
                                    requestAuthorization ?
                                        <View style={styles.viewInfosContainer}>
                                            <TouchableOpacity style={styles.viewInfosBtn} onPress={() => getAuthorizationAsDoctor()}>
                                                <Text status='control'>Solicitar compartilhamento de informações</Text>
                                            </TouchableOpacity>
                                        </View> : null
                            )}
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

