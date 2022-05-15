import { SafeAreaLayout } from '@components/safeAreaLayout'
import { _DEFAULT_FORMAT_DATE } from '@constants/date'
import { useAppSelector } from '@hooks/redux'
import { useDatepickerService } from '@hooks/useDatepickerService'
import { AppointmentDto } from '@models/Appointment'
import { ChatListEntryDto } from '@models/ChatMessage'
import { PatientDisplay } from '@models/Patient'
import { EUserRole } from '@models/UserRole'
import { useNavigation, useRoute } from '@react-navigation/native'
import { requestAuthorizationAsDoctor } from '@services/medical-doctor.service'
import { getPatientDisplayAsDoc } from '@services/patient.service'
import { Button, Card, Divider, Icon, IconElement, IconProps, Spinner, Text, useStyleSheet } from '@ui-kitten/components'
import { addMinutes } from 'date-fns'
import React, { FC, ReactElement, useEffect, useState } from 'react'
import { TouchableOpacity, View } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'
import Toast from 'react-native-toast-message'
import { RootState } from 'store'
import { detailsStyle } from './details-appointment.style'

const DetailsAppointmentsScreen: FC = (): ReactElement => {

    const styles = useStyleSheet(detailsStyle)
    const navigation = useNavigation<any>()

    const route = useRoute()
    const [params, setParams] = useState<AppointmentDto>()
    const [bConfirmed, setBConfirmed] = useState<boolean>(false)
    const { localeDateService } = useDatepickerService()
    const [patientDisplay, setPatientDisplay] = useState<PatientDisplay | undefined>(undefined)
    const [requestAuthorization, setRequestAuthorization] = useState<boolean>(false)
    const [isLoading, setIsLoading] = useState<boolean>(false)

    const { sessionUser } = useAppSelector((state: RootState) => state.auth)
    const { ids } = useAppSelector((state: RootState) => state.user)
    const { profile } = useAppSelector((state: RootState) => state.profile)

    const getAuthorizationAsDoctor = async () => {
        try {
            if (params?.patientDto) {
                const response = await requestAuthorizationAsDoctor(params?.patientDto.patientId)
                if (response.status === 201 || response.status === 200) {
                    Toast.show({
                        type: 'info',
                        text2: 'Solicitação efetuada. Aguarde o aceite do Paciente',
                    })
                } else {
                    Toast.show({
                        type: 'danger',
                        text2: 'Erro ao solicitar o acesso. Tente novamente mais tarde',
                    })
                }
            } else {
                Toast.show({
                    type: 'danger',
                    text2: 'Erro desconhecido. Entre em contato com o administrador',
                })
            }

        } catch (error) {
            const err = error as any
            if (err && err.status === 400) {
                Toast.show({
                    type: 'info',
                    text2: 'Solicitação já efetuada. Aguarde o aceite do Paciente',
                })
            } else {
                Toast.show({
                    type: 'danger',
                    text2: 'Erro desconhecido. Entre em contato com o administrador',
                })
            }
        }
    }

    const checkIfDoctorCanAccessPatientData = async (patientId: number) => {
        if (sessionUser?.userRole.find(e => e.id === EUserRole.medicalDoctor)) {
            setRequestAuthorization(false)
            setIsLoading(true)
            try {
                const response = await getPatientDisplayAsDoc(patientId)
                if (response && response.data && response.status === 200) {
                    setPatientDisplay(response.data)
                } else {
                    if (response.status === 401) {
                        setRequestAuthorization(true)
                    }
                    setPatientDisplay(undefined)
                }
            } catch (error) {
                setPatientDisplay(undefined)
                Toast.show({
                    type: 'danger',
                    text2: 'Erro ao carregar informações. Tente novamente mais tarde',
                })
            } finally {
                setIsLoading(false)
            }
        }

    }

    useEffect(() => {
        setParams(route.params as AppointmentDto)
    }, [route.params])

    useEffect(() => {
        if (params) {
            checkIfDoctorCanAccessPatientData(params.patientDto.patientId)
            setBConfirmed(params.confirmedByMedicalDoctor)
        }
    }, [params])

    const MessageCircleIcon = (props: IconProps): IconElement => (
        <Icon {...props} name='message-circle-outline' pack='eva' />
    )

    const onMessageButtonPress = (): void => {
        if (ids) {
            const bPatient = sessionUser?.userRole.find(e => e.id === EUserRole.patient)
            const item: ChatListEntryDto = {
                senderID: ids.userId,
                id: 0,
                timestamp: '',
                receiverId: (bPatient ? params?.medicalDoctorSummaryDto.id : params?.patientDto.id) || 0,
                payload: '',
                receiverName: (bPatient ? params?.medicalDoctorSummaryDto.name : params?.patientDto.name) || '',
                senderName: profile?.name || '',
                isSenderMedicalDoctor: false,
                isReceiverMedicalDoctor: false,
                senderProfessionalType: '',
                receiverProfessionalType: '',
                isSenderOperator: false,
                isReceiverOperator: false,
                isSenderPatient: false,
                isReceiverPatient: false
            }
            navigation.navigate('ChatRoom', {
                ...item
            })
        }
    }

    return (
        <>
            <SafeAreaLayout style={styles.safeArea}>
                {isLoading ?
                    <>
                        <View style={{
                            flex: 1, justifyContent: 'center', alignItems: 'center'
                        }}>
                            <Spinner size='giant' />
                        </View>
                    </>
                    : (
                        <>
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
                                                {sessionUser && sessionUser?.userRole.find(e => e.id === EUserRole.patient) && (
                                                    <>
                                                        <Text style={styles.text}>Profissional: {params?.medicalDoctorSummaryDto.name}</Text>
                                                        <Text style={styles.text}>N° {params?.medicalDoctorSummaryDto.crm}</Text>
                                                    </>
                                                )}


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
                                                            <Icon name='arrow-redo' style={styles.icon} size={20} pack='ionicons' />
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
                                        {params.confirmedByMedicalDoctor && (
                                            <View style={{
                                                justifyContent: 'center', alignItems: 'center'
                                            }}>
                                                <Button
                                                    style={styles.messageButton}
                                                    status='control'
                                                    accessoryLeft={MessageCircleIcon}
                                                    onPress={onMessageButtonPress}
                                                />
                                            </View>
                                        )}
                                    </ScrollView>
                                </>
                            ) : (
                                <View style={styles.error}>
                                    <Text style={styles.errorText}>Ocorreu um erro ao buscar os dados. Tente novamente mais tarde.</Text>
                                </View>
                            )}
                        </>
                    )}
            </SafeAreaLayout>
        </>
    )
}

export default DetailsAppointmentsScreen

