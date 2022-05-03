import { SafeAreaLayout } from '@components/safeAreaLayout'
import { _DATE_FROM_ISO_8601, _DEFAULT_FORMAT_DATE } from '@constants/date'
import toast from '@helpers/toast'
import { useDatepickerService } from '@hooks/useDatepickerService'
import { MedicalDataAuthorizationDTO } from '@models/Medical'
import { useRoute } from '@react-navigation/native'
import { patientGetAuthorizationRequests, patientGrantAuthorization } from '@services/patient.service'
import { List, Text, useStyleSheet } from '@ui-kitten/components'
import React, { FC, ReactElement, useCallback, useEffect, useState } from 'react'
import { ListRenderItemInfo, RefreshControl, View } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { shareInfoTabItemStyle } from './style'

const ShareInfoTabItemScreen: FC = (): ReactElement => {

    const styles = useStyleSheet(shareInfoTabItemStyle)
    const [refreshing, setRefreshing] = useState<boolean>(false)
    const [data, setData] = useState<MedicalDataAuthorizationDTO[]>([])
    const [params, setParams] = useState<{ authorized: boolean }>()
    const { localeDateService } = useDatepickerService()

    const onRefresh = useCallback(() => {
        setRefreshing(true)
        loadBadgeCount()
        setRefreshing(false)
    }, [])

    const loadBadgeCount = async () => {
        const res = await patientGetAuthorizationRequests({ authorized: params?.authorized ?? false })
        if (res && res.data) {
            setData(res.data)
        }
    }

    const route = useRoute()

    useEffect(() => {
        loadBadgeCount()
    }, [params])

    useEffect(() => {
        setParams(route.params as { authorized: boolean })
    }, [route.params])

    const changeAuthorization = async (medicalDoctorId: string, authorization: boolean = false) => {
        try {
            const res = await patientGrantAuthorization({ medicalDoctorId, authorization })
            if (res.status === 201)
                loadBadgeCount()

        } catch (error) {
            toast.danger({ message: 'Erro ao permitir o compartilhamento', duration: 3000 })
        }
    }

    const renderItem = (info: ListRenderItemInfo<MedicalDataAuthorizationDTO>) => {

        return (
            <View
                style={[styles.item, styles.shadow]}>
                <View style={styles.viewItem}>
                    <View>
                        <Text style={styles.itemTitle}>{info.item.doctorName}</Text>
                        <Text style={styles.description}>{'N° ' + info.item.doctorCRM}</Text>
                        <Text style={styles.description}>{(!params?.authorized ? 'Solicitado em: ' : 'Autorizado em: ') + localeDateService.format(localeDateService.parse(info.item.grantDate as string, _DATE_FROM_ISO_8601), _DEFAULT_FORMAT_DATE)}</Text>
                    </View>
                    {!params?.authorized ? (
                        <View>
                            <TouchableOpacity onPress={() => changeAuthorization(info.item.doctorId.toString(), true)} style={[styles.button, styles.approval]}>
                                <Text style={styles.textButton}>Aceitar</Text>
                            </TouchableOpacity>
                        </View>
                    ) : (
                        <View>
                            <TouchableOpacity onPress={() => changeAuthorization(info.item.doctorId.toString())} style={[styles.button, styles.cancel]}>
                                <Text style={styles.textButton}>Cancelar</Text>
                            </TouchableOpacity>
                        </View>
                    )}

                </View>
            </View>
        )
    }

    return (
        <SafeAreaLayout level='2' style={styles.safeArea}>
            <List
                contentContainerStyle={data.length > 5 ? styles.contentStyle : undefined}
                style={styles.containerStyle}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                    />
                }
                data={data}
                renderItem={renderItem}
            />
        </SafeAreaLayout>
    )
}

export default ShareInfoTabItemScreen
