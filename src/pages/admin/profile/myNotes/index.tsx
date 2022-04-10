import React, { createRef, FC, ReactElement, useCallback, useState } from 'react'
import { DrawerContentComponentProps } from '@react-navigation/drawer'
import { CalendarRange, Icon, Modal, Text, useStyleSheet } from '@ui-kitten/components'
import { SafeAreaLayout } from '@components/safeAreaLayout'
import { notesStyle } from './style'
import { TouchableOpacity, View } from 'react-native'
import { _DATE_FROM_ISO_8601 } from '@constants/date'
import Timeline from '@components/timeline'
import HeaderMyNotes from '@components/header/admin/myNotes'
import NewNoteModal from '@components/floatingButton/notesModal'
import { AscendingOrder } from '@models/Common'

import { useFocusEffect } from '@react-navigation/native'
import { getPatientCalendar } from '@services/calendar.service'
import { useAuth } from '@contexts/auth'
import FilterModal from '@components/filterModal'
import { TimelineTimeItem } from '@models/Timeline'

const MyNotesScreen: FC<DrawerContentComponentProps> = ({
    navigation
}): ReactElement => {

    const { currentUser } = useAuth()
    const addRef = createRef<Modal>()
    const filterRef = createRef<Modal>()
    const styles = useStyleSheet(notesStyle)
    const [visibleModal, setVisibleModal] = useState<boolean>(false)
    const [visibleFilterModal, setVisibleFilterModal] = useState<boolean>(false)
    const [isFiltered, setIsFiltered] = useState<boolean>(false)

    const [data, setData] = useState<any>()
    const [listLength, setListLength] = useState<number>(0)
    const [range, setRange] = useState<CalendarRange<Date>>({})

    const getPatientCalendarList = useCallback(async () => {
        if (currentUser) {
            const result = await getPatientCalendar(range.startDate?.toISOString(), range.startDate?.toISOString(), currentUser.userId.toString())
            setData(result.data)
        }
    }, [range, isFiltered])

    useFocusEffect(
        useCallback(() => {
            getPatientCalendarList()
        }, [range])
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
        getPatientCalendarList()
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
                visible={visibleFilterModal}
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