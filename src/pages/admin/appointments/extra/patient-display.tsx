
import { SafeAreaLayout } from '@components/safeAreaLayout'
import { _DATE_FROM_ISO_8601, _DEFAULT_FORMAT_DATE } from '@constants/date'
import { useDatepickerService } from '@hooks/useDatepickerService'
import { ExamDto } from '@models/Exam'
import { PatientDisplay } from '@models/Patient'
import { useNavigation, useRoute } from '@react-navigation/native'
import { Icon, IconProps, Menu, MenuGroup, MenuItem, Text, useStyleSheet } from '@ui-kitten/components'
import { calcAge } from '@utils/common'
import { formatPhone } from '@utils/mask'
import React, { FC, ReactElement, useEffect, useState } from 'react'
import { Platform } from 'react-native'
import { patientDisplayStyle } from './patient-display.style'

const PatientDisplayAsDoctorScreen: FC = (): ReactElement => {

    const { navigate } = useNavigation<any>()
    const styles = useStyleSheet(patientDisplayStyle)
    const { localeDateService } = useDatepickerService()
    const route = useRoute()
    const [params, setParams] = useState<PatientDisplay>()

    const [exam, setExam] = useState<ExamDto>()

    useEffect(() => {
        setParams(route.params as PatientDisplay)
        setExam(undefined)
    }, [route.params])

    const renderRightIcon = (props: IconProps) => (
        <Icon {...props} name={Platform.OS === 'ios' ? 'chevron-right-outline' : Platform.OS === 'android' ? 'arrow-forward-outline' : 'arrow-forward-outline'} pack='eva' />
    )

    const showExamModal = (exam: ExamDto) => {
        setExam(exam)
    }

    useEffect(() => {
        if (exam && params) {
            navigate('CreatePatientDocuments', {
                ...exam,
                readonly: true,
                owningUserId: params.userDto.id
            })
        }
    }, [exam])


    const calcAgeToString = (date: Date) => {
        const { formatted } = calcAge(localeDateService.format(date, _DEFAULT_FORMAT_DATE))
        return formatted
    }

    return (
        <>
            <SafeAreaLayout style={styles.safeArea}>
                {params && (
                    <>
                        <Menu
                            showsVerticalScrollIndicator={false}
                        >
                            <MenuItem
                                accessoryLeft={(props: IconProps) => <Icon {...props} name='star-outline' pack='eva' />}
                                title={'Paciente: ' + params.userDto.name}
                            />
                            <MenuItem
                                accessoryLeft={(props: IconProps) => <Icon {...props} name='phone-call-outline' pack='eva' />}
                                title={'Contato: ' + ((params.userDto.phone2 ? (formatPhone(params.userDto.phone1) + ' | ' + formatPhone(params.userDto.phone2)) : formatPhone(params.userDto.phone1)))}
                            />
                            <MenuItem
                                accessoryLeft={(props: IconProps) => <Icon {...props} name='person-outline' pack='eva' />}
                                title={'Gênero: ' + ((params.patientDto.sex === 'female' ? 'Feminino' : params.patientDto.sex === 'male' ? 'Masculino' : 'Não informado'))}
                            />
                            <MenuItem
                                accessoryLeft={(props: IconProps) => <Icon {...props} name='gift-outline' pack='eva' />}
                                title={'Idade: ' + (calcAgeToString(localeDateService.parse(params.userDto.dateOfBirth.toString(), _DATE_FROM_ISO_8601)))}
                            />
                            <MenuItem title='Diário do Paciente'
                                accessoryLeft={(props: IconProps) => <Icon {...props} name='calendar' pack='eva' />}
                                onPress={() => navigate('PatientDiaryEntry', {
                                    title: 'Diário do Paciente',
                                    readonly: true,
                                    patientId: params.patientDto.id
                                })}
                                accessoryRight={renderRightIcon}
                            />
                            <MenuGroup title='Documentos do Paciente'
                                accessoryLeft={(props: IconProps) => <Icon {...props} name='thermometer' pack='eva' />}>
                                {params.exams.length > 0 ? (params.exams.map(item =>
                                    <MenuItem key={item.id}
                                        accessoryLeft={(props: IconProps) => <Icon {...props} name='file-text' pack='eva' />}
                                        title={(evaProps) => <>
                                            <Text {...evaProps}>{(item.examType.length > 24 ? `${item.examType.substring(0, 20)}...` : item.examType) + ' | ' + (localeDateService.format(new Date(item.examDate), _DEFAULT_FORMAT_DATE))}</Text>
                                        </>}
                                        accessoryRight={renderRightIcon}
                                        onPress={() => showExamModal(item)}
                                    />
                                )) : (
                                    <MenuItem
                                        title={(evaProps) => <Text {...evaProps} style={[evaProps?.style, {
                                            textAlign: 'center', flex: 1
                                        }]}>Nenhum documento encontrado</Text>}
                                    />
                                )}
                            </MenuGroup>
                        </Menu>
                    </>
                )}
            </SafeAreaLayout>
        </>
    )
}

export default PatientDisplayAsDoctorScreen

