
import { SafeAreaLayout } from '@components/safeAreaLayout'
import { _DEFAULT_FORMAT_DATE } from '@constants/date'
import { useDatepickerService } from '@hooks/useDatepickerService'
import { PatientDisplay } from '@models/Patient'
import { useRoute } from '@react-navigation/native'
import { Button, Card, Text, useStyleSheet } from '@ui-kitten/components'
import React, { FC, ReactElement, useEffect, useState } from 'react'
import { ScrollView, View } from 'react-native'
import { patientDisplayStyle } from './patient-display.style'

const PatientDisplayAsDoctorScreen: FC = (): ReactElement => {

    const styles = useStyleSheet(patientDisplayStyle)
    const { localeDateService } = useDatepickerService()
    const route = useRoute()
    const [params, setParams] = useState<PatientDisplay>()

    useEffect(() => {
        setParams(route.params as PatientDisplay)
    }, [route.params])

    return (
        <>
            <SafeAreaLayout style={styles.safeArea}>
                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.contentContainer}>
                    <View style={styles.container}>
                        <View style={styles.title}>
                            <Text category='label'>Dados do Paciente</Text>
                        </View>
                        <View style={styles.textArea}>
                            <Text style={styles.label}>Paciente:</Text>
                            <Text style={styles.description}>{params?.userDto.name}</Text>
                        </View>
                        <View style={styles.textArea}>
                            <Text style={styles.label}>Telefone:</Text>
                            <Text style={styles.description}>{params?.userDto.phone2 ? (params?.userDto.phone1 + ' | ' + params?.userDto.phone2) : params?.userDto.phone1}</Text>
                        </View>
                        <View style={styles.textArea}>
                            <Text style={styles.label}>Gênero:</Text>
                            <Text style={styles.description}>{params?.patientDto.sex === 'female' ? 'Feminino' : params?.patientDto.sex === 'male' ? 'Masculino' : 'Prefiro não responder'}</Text>
                        </View>
                    </View>
                    <View style={styles.containerExams}>
                        <View style={styles.title}>
                            <Text category='label'>Exames</Text>
                        </View>
                        {params?.exams.map(item => (
                            <Card disabled style={styles.card} key={item.id}>
                                <View style={styles.cardContainer}>
                                    <View>
                                        <View style={styles.textArea}>
                                            <Text style={styles.label}>Tipo do Exame:</Text>
                                            <Text style={styles.description}>{item.examType}</Text>
                                        </View>
                                        <View style={styles.textArea}>
                                            <Text style={styles.label}>Data do Exame:</Text>
                                            <Text style={styles.description}>{localeDateService.format(new Date(item.examDate), _DEFAULT_FORMAT_DATE)}</Text>
                                        </View>
                                        <View style={styles.textArea}>
                                            <Text style={styles.label}>Descrição:</Text>
                                            <Text style={styles.description}>{item.data.examDescription ?? ''}</Text>
                                        </View>
                                    </View>
                                    <Button disabled size='tiny'>Baixar Exame</Button>
                                </View>
                            </Card>
                        ))}

                    </View>
                </ScrollView>
            </SafeAreaLayout>
        </>
    )
}

export default PatientDisplayAsDoctorScreen

