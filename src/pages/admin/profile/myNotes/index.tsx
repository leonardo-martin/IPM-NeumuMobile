import HeaderMyNotes from '@components/header/admin/myNotes'
import FilterModal from '@components/modal/filterModal'
import NewNoteModal from '@components/modal/notesModal'
import { SafeAreaLayout } from '@components/safeAreaLayout'
import Timeline from '@components/timeline'
import { useModal } from '@hooks/useModal'
import { AscendingOrder } from '@models/Common'
import { TimelineTimeItem } from '@models/Timeline'
import { useFocusEffect } from '@react-navigation/native'
import { getDiaryEntryByRange } from '@services/patient.service'
import { CalendarRange, Icon, Modal, Text, useStyleSheet } from '@ui-kitten/components'
import { groupByDateTime } from '@utils/common'
import React, { FC, ReactElement, useCallback, useState } from 'react'
import { TouchableOpacity, View } from 'react-native'
import { notesStyle } from './style'

const MyNotesScreen: FC = (): ReactElement => {

    const { ref: addRef } = useModal<Modal>()
    const { ref: filterRef } = useModal<Modal>()

    const styles = useStyleSheet(notesStyle)
    const [visibleModal, setVisibleModal] = useState<boolean>(false)
    const [visibleFilterModal, setVisibleFilterModal] = useState<boolean>(false)
    const [isFiltered, setIsFiltered] = useState<boolean>(false)

    const [data, setData] = useState<any>()
    const [originalData, setOriginalData] = useState<any>()
    const [listLength, setListLength] = useState<number>(0)
    const [range, setRange] = useState<CalendarRange<Date>>({})

    const getPatientCalendarList = useCallback(async () => {
        const result = await getDiaryEntryByRange('87', range)
        let array = groupByDateTime(result.data)
        setData(array)
        setOriginalData(array)
    }, [])

    useFocusEffect(
        useCallback(() => {
            setIsFiltered(false)
            setRange({})
            getPatientCalendarList()
        }, [])
    )

    const deleteNote = (item: TimelineTimeItem) => {
        console.log('delete', item)
    }

    const editNote = (item: TimelineTimeItem) => {
        console.log('edit', item)
    }

    const filterData = () => {
        setIsFiltered(true)
        setVisibleFilterModal(false)
    }

    const clearFilter = () => {
        setIsFiltered(!isFiltered)
        setRange({})
        setData(originalData)
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
                    <Icon name='options-outline' style={styles.iconFilter} size={20} pack='ionicons' />
                </TouchableOpacity>
            </View>
        </View>
    )

    return (
        <>
            <HeaderMyNotes onVisible={setVisibleModal} visible={visibleModal} />
            <SafeAreaLayout style={styles.safeArea} level='1' >
                <View style={styles.viewList}>
                    {headerListComponent()}
                    <Timeline
                        onDelete={deleteNote}
                        onChange={editNote}
                        isFiltered={isFiltered}
                        data={data ? data : []}
                        orderBy={AscendingOrder.DESC}
                        range={range}
                        onChangeListSize={setListLength}
                    />
                </View>
            </SafeAreaLayout>
            <FilterModal
                ref={filterRef}
                onVisible={setVisibleFilterModal}
                isVisible={visibleFilterModal}
                handleRange={setRange}
                onFilter={filterData}
                range={range}

            />
            <NewNoteModal
                ref={addRef}
                onVisible={setVisibleModal}
                visible={visibleModal} />
        </>
    )
}

export default MyNotesScreen