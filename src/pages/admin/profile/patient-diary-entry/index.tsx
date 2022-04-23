import AddPatientDiaryEntryDialog from '@components/dialog/addPatientDiaryEntryDialog'
import FilterByDateDialog from '@components/dialog/filterByDateDialog'
import HeaderGenericWithTitleAndAddIcon from '@components/header/admin/generic-with-add-icon'
import { SafeAreaLayout } from '@components/safeAreaLayout'
import Timeline from '@components/timeline'
import toast from '@helpers/toast'
import { useDatepickerService } from '@hooks/useDatepickerService'
import { useModal } from '@hooks/useModal'
import { AscendingOrder } from '@models/Common'
import { PatientDiaryEntryDto } from '@models/Patient'
import { TimelineItem, TimelineTimeItem } from '@models/Timeline'
import { useFocusEffect } from '@react-navigation/native'
import { deleteDiaryEntry, getDiaryEntryByRange } from '@services/patient.service'
import { CalendarRange, Icon, Modal, Text, useStyleSheet } from '@ui-kitten/components'
import { groupByDateTime } from '@utils/common'
import { _DATE_FROM_ISO_8601 } from 'constants/date'
import React, { FC, ReactElement, useCallback, useState } from 'react'
import { RefreshControl, TouchableOpacity, View } from 'react-native'
import { notesStyle } from './style'

const PatientDiaryEntryScreen: FC = (): ReactElement => {

    const { ref: addRef } = useModal<Modal>()
    const { ref: filterRef } = useModal<Modal>()

    const styles = useStyleSheet(notesStyle)
    const [addedItem, setAddedItem] = useState<PatientDiaryEntryDto | undefined>(undefined)
    const [visibleAddModal, setVisibleAddModal] = useState<boolean>(false)
    const [visibleFilterModal, setVisibleFilterModal] = useState<boolean>(false)
    const [isFiltered, setIsFiltered] = useState<boolean>(false)
    const [refreshing, setRefreshing] = useState<boolean>(false)
    const { localeDateService } = useDatepickerService()

    const [data, setData] = useState<TimelineItem | undefined>(undefined)
    const [dataModal, setDataModal] = useState<PatientDiaryEntryDto>()
    const [originalData, setOriginalData] = useState<PatientDiaryEntryDto[]>([])
    const [listLength, setListLength] = useState<number>(0)
    const [range, setRange] = useState<CalendarRange<Date>>({})

    const getPatientCalendarList = useCallback(async () => {
        const result = await getDiaryEntryByRange('87', range)
        setOriginalData(result.data)
        convertList(result.data)
    }, [])

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
        }, [addedItem])
    )

    const onDeleteItem = async (date: string, item: TimelineTimeItem) => {

        try {
            const obj: PatientDiaryEntryDto = {
                patientId: 87,
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
            }
        } catch (error) {
            toast.danger({ message: 'Não foi possível deletar. Tente novamente mais tarde', duration: 3000 })

        }
    }

    const onViewItem = (date: string, item: TimelineTimeItem) => {
        const obj: PatientDiaryEntryDto = {
            patientId: 87,
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
            <View style={styles.viewTop}>
                <Text style={[styles.text, { paddingHorizontal: 5 }]}>TOTAL:</Text>
                <Text status='primary' style={styles.text}>{data ? listLength : 0}</Text>
            </View>
            <View style={styles.viewTop}>
                {isFiltered && (
                    <TouchableOpacity onPress={clearFilter}>
                        <Text status='danger' category='c1' style={{ paddingHorizontal: 5, fontWeight: 'bold' }}>LIMPAR</Text>
                    </TouchableOpacity>
                )}
                <TouchableOpacity onPress={handleVisibleModal}>
                    <Icon name='options-outline' style={styles.icon} size={20} pack='ionicons' />
                </TouchableOpacity>
            </View>
        </View>
    )

    return (
        <>
            <HeaderGenericWithTitleAndAddIcon
                title='Meu Diário'
                onVisible={() => {
                    setDataModal(undefined)
                    setVisibleAddModal(!visibleAddModal)
                }} />
            <SafeAreaLayout style={styles.safeArea} level='1' >
                <Timeline
                    data={[]}
                    renderItem={undefined}
                    ListHeaderComponent={headerListComponent}
                    onDelete={onDeleteItem}
                    onChange={onViewItem}
                    isFiltered={isFiltered}
                    customData={data}
                    orderBy={AscendingOrder.DESC}
                    range={range}
                    onChangeListSize={setListLength}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={getPatientCalendarList}
                        />
                    }
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
                visible={visibleAddModal} />
        </>
    )
}

export default PatientDiaryEntryScreen