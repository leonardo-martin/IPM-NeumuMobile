import AddPatientDiaryEntryDialog from '@components/dialog/addPatientDiaryEntryDialog'
import FilterByDateDialog from '@components/dialog/filterByDateDialog'
import EmptyComponent from '@components/empty'
import HeaderWithAddIcon from '@components/header/admin/generic-with-add-icon'
import { SafeAreaLayout } from '@components/safeAreaLayout'
import Timeline from '@components/timeline'
import { _DATE_FROM_ISO_8601 } from '@constants/date'
import { useAppSelector } from '@hooks/redux'
import { useDatepickerService } from '@hooks/useDatepickerService'
import { useModal } from '@hooks/useModal'
import { AscendingOrder } from '@models/Common'
import { PatientDiaryEntryDto } from '@models/Patient'
import { TimelineItem, TimelineTimeItem } from '@models/Timeline'
import { EUserRole } from '@models/UserRole'
import { useFocusEffect, useRoute } from '@react-navigation/native'
import { deleteDiaryEntry, getDiaryEntryByRange } from '@services/patient.service'
import { CalendarRange, Icon, Modal, Text, useStyleSheet } from '@ui-kitten/components'
import { groupByDateTime } from '@utils/common'
import React, { FC, ReactElement, useCallback, useEffect, useState } from 'react'
import { RefreshControl, TouchableOpacity, View } from 'react-native'
import Toast from 'react-native-toast-message'
import { RootState } from 'store'
import { notesStyle } from './style'

interface PatientDiaryEntryParams {
    title?: string
    readonly?: boolean
    patientId?: number
}

const PatientDiaryEntryScreen: FC = (): ReactElement => {

    const { ref: addRef } = useModal<Modal>()
    const { ref: filterRef } = useModal<Modal>()

    const route = useRoute()
    const [params, setParams] = useState<PatientDiaryEntryParams>()

    useEffect(() => {
        setParams(route.params as PatientDiaryEntryParams)
    }, [route.params])

    const { ids } = useAppSelector((state: RootState) => state.user)
    const styles = useStyleSheet(notesStyle)
    const [addedItem, setAddedItem] = useState<PatientDiaryEntryDto | undefined>(undefined)
    const [visibleAddModal, setVisibleAddModal] = useState<boolean>(false)
    const [visibleFilterModal, setVisibleFilterModal] = useState<boolean>(false)
    const [isFiltered, setIsFiltered] = useState<boolean>(false)
    const [refreshing, setRefreshing] = useState<boolean>(false)
    const { localeDateService } = useDatepickerService()

    const { sessionUser } = useAppSelector((state: RootState) => state.auth)
    const [data, setData] = useState<TimelineItem | undefined>(undefined)
    const [dataModal, setDataModal] = useState<PatientDiaryEntryDto>()
    const [originalData, setOriginalData] = useState<PatientDiaryEntryDto[]>([])
    const [listLength, setListLength] = useState<number>(0)
    const [range, setRange] = useState<CalendarRange<Date>>({})

    const getPatientCalendarList = useCallback(async () => {
        var arr: PatientDiaryEntryDto[] = []
        if (sessionUser?.userRole.find(e => e.id === EUserRole.patient)) {
            const result = await getDiaryEntryByRange((ids?.patientId as number), range)
            arr = result.data
        } else {
            if (params?.patientId) {
                const result = await getDiaryEntryByRange((params.patientId), range, true)
                arr = result.data
            }
        }
        setOriginalData(arr)
        convertList(arr)
    }, [params])

    const onRefresh = async () => {
        await getPatientCalendarList()
        Toast.show({
            type: 'success',
            text2: 'Atualizado',
        })
        setRefreshing(false)
    }

    useEffect(() => {
        if (refreshing) onRefresh()
    }, [refreshing])

    const convertList = (list: PatientDiaryEntryDto[]) => {
        let array = groupByDateTime(list)
        setData(array)
    }

    useFocusEffect(
        useCallback(() => {
            setIsFiltered(false)
            setRefreshing(false)
            setRange({})
            getPatientCalendarList()
        }, [addedItem, params])
    )

    const onDeleteItem = async (date: string, item: TimelineTimeItem) => {

        try {
            const obj: PatientDiaryEntryDto = {
                patientId: ids?.patientId as number,
                date: date ? localeDateService.parse(date, _DATE_FROM_ISO_8601) : localeDateService.today(),
                data: {
                    ...item
                },
            }
            setDataModal(obj)

            const resp = await deleteDiaryEntry(date ? localeDateService.parse(date, _DATE_FROM_ISO_8601) : localeDateService.today())
            if (resp.status === 201 || resp.status === 200) {
                const arr = [...originalData]
                const diary = originalData.find(item => item.date.toString() === obj.date.toString())
                var index = -1
                if (diary) {
                    index = arr.indexOf(diary)
                    index !== -1 ? arr.splice(index, 1) : null
                    setOriginalData(arr)
                    convertList(arr)
                }
                Toast.show({
                    type: 'success',
                    text2: 'Nota deletada',
                })
            }
        } catch (error) {
            Toast.show({
                type: 'danger',
                text2: 'Não foi possível deletar. Tente novamente mais tarde',
            })

        }
    }

    const onViewItem = (date: string, item: TimelineTimeItem) => {
        const obj: PatientDiaryEntryDto = {
            patientId: ids?.patientId as number,
            date: date ? localeDateService.parse(date, _DATE_FROM_ISO_8601) : localeDateService.today(),
            data: {
                ...item
            }
        }
        setDataModal(obj)
        setVisibleAddModal(true)
    }

    const filterData = () => {
        setIsFiltered(true)
        setVisibleFilterModal(false)
    }

    const clearFilter = () => {
        setIsFiltered(!isFiltered)
        setRange({})
        convertList(originalData)
    }
    const handleVisibleModal = () => setVisibleFilterModal(true)

    const headerListComponent = () => (
        <View style={styles.container}>
            {originalData.length > 0 ? (
                <View style={styles.viewTop}>
                    <Text style={[styles.text, { paddingHorizontal: 5 }]}>TOTAL:</Text>
                    <Text status='primary' style={styles.text}>{data ? listLength : 0}</Text>
                </View>
            ) : (
                <View />
            )}
            <View style={styles.viewTop}>
                {isFiltered && (
                    <TouchableOpacity onPress={clearFilter}>
                        <Text status='danger' category='c1' style={{ paddingHorizontal: 5, fontWeight: 'bold' }}>LIMPAR</Text>
                    </TouchableOpacity>
                )}
                <TouchableOpacity disabled={originalData.length === 0} onPress={handleVisibleModal}>
                    <Icon name='options-outline' style={styles.icon} size={20} pack='ionicons' />
                </TouchableOpacity>
            </View>
        </View>
    )

    return (
        <>
            <HeaderWithAddIcon
                title={params?.title ?? 'Meu Diário'}
                hideIcon={params?.readonly}
                onClick={() => {
                    setDataModal(undefined)
                    setVisibleAddModal(!visibleAddModal)
                }} />
            <SafeAreaLayout style={styles.safeArea} level='1' >
                <Timeline
                    data={data}
                    ListHeaderComponent={headerListComponent}
                    onDelete={onDeleteItem}
                    onChange={onViewItem}
                    isFiltered={isFiltered}
                    orderBy={AscendingOrder.DESC}
                    range={range}
                    onChangeListSize={setListLength}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={() => setRefreshing(true)}
                        />
                    }
                    readonly={params?.readonly}
                    ListEmptyComponent={<EmptyComponent message='Nenhuma nota encontrada' />}
                />
            </SafeAreaLayout>
            <FilterByDateDialog
                ref={filterRef}
                onVisible={setVisibleFilterModal}
                isVisible={visibleFilterModal}
                handleRange={setRange}
                onFilter={filterData}
                range={range}

            />
            <AddPatientDiaryEntryDialog
                ref={addRef}
                patientDiaryEntry={dataModal}
                onRefresh={setAddedItem}
                onVisible={setVisibleAddModal}
                visible={visibleAddModal}
                readonly={params?.readonly} />
        </>
    )
}

export default PatientDiaryEntryScreen