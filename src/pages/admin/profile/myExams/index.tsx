import React, { createRef, FC, ReactElement, useCallback, useState } from 'react'
import { Animated, ListRenderItemInfo, Platform, RefreshControl, TouchableOpacity, View } from 'react-native'
import { DrawerContentComponentProps } from '@react-navigation/drawer'
import Swipeable from 'react-native-gesture-handler/Swipeable'
import { CalendarRange, Icon, IconProps, List, ListItem, Modal, Text, useStyleSheet, useTheme } from '@ui-kitten/components'
import { AscendingOrder } from '@models/Common'
import HeaderMyExams from '@components/header/admin/myExams'

import { getPatientExamList } from '@services/exam.service'
import { SafeAreaLayout } from '@components/safeAreaLayout'
import { Exam, ExamImage } from '@models/Exam'
import { useFocusEffect } from '@react-navigation/native'
import { sortByDate } from '@utils/common'
import { myExamsStyle } from './style'
import FilterModal from './extra/filterModal'

const MyExamsScreen: FC<DrawerContentComponentProps> = ({
    navigation
}): ReactElement => {

    const theme = useTheme()
    const styles = useStyleSheet(myExamsStyle)
    const ref = createRef<Modal>()

    const [visibleModal, setVisibleModal] = useState<boolean>(false)
    const [refreshing, setRefreshing] = useState<boolean>(false)
    const [data, setData] = useState<Array<Exam>>([])
    const [originalData, setOriginalData] = useState<Array<Exam>>([])

    const [addedItem, setAddedItem] = useState<Exam & ExamImage | undefined>(undefined)
    const [range, setRange] = useState<CalendarRange<Date>>({})
    const [isFiltered, setIsFiltered] = useState<boolean>(false)

    const handleVisibleModal = () => setVisibleModal(true)

    const orderList = (list: Exam[]) => {
        if (range.startDate && !range.endDate)
            list = list.filter((e) => e.examDate >= (range.startDate as Date))
        else if (range.startDate && range.endDate)
            list = list.filter((e) => e.examDate >= (range.startDate as Date) && e.examDate <= (range.endDate as Date))

        list = list.sort((a, b) => sortByDate(a.examDate, b.examDate, AscendingOrder.DESC))
        setData([...list])
    }

    const getExamList = useCallback(async () => {
        const result = await getPatientExamList()
        setOriginalData(result.data)
        orderList(result.data)
    }, [])

    useFocusEffect(
        useCallback(() => {
            setRefreshing(false)
            getExamList()
        }, [addedItem])
    )

    const leftSwipe = (_progress: Animated.AnimatedInterpolation, dragX: Animated.AnimatedInterpolation, item: Exam) => {
        const scale = dragX.interpolate({
            inputRange: [-80, 0],
            outputRange: [1, 0],
            extrapolate: 'clamp'
        })
        return (
            <TouchableOpacity onPress={() => onDeleteItem(item)} activeOpacity={0.5}>
                <View style={styles.deleteBox}>
                    <Animated.View style={[{ transform: [{ scale: scale }] }]}>
                        <Icon name='trash-bin-outline' style={styles.icon} size={20} pack='ionicons' />
                    </Animated.View>
                </View>
            </TouchableOpacity>
        )
    }

    const renderRightIcon = (props: IconProps, exam: Exam) => (
        <View style={styles.viewDate}>
            <Text
                style={styles.textDate}
                appearance='hint'
                category='c1'>
                {exam.dateToString}
            </Text>
            <Icon {...props} name={Platform.OS === 'ios' ? 'chevron-forward-outline' : Platform.OS === 'android' ? 'arrow-forward-outline' : 'arrow-forward-outline'} pack='ionicons' />
        </View>
    )

    const renderLeftIcon = (props: IconProps) => (
        <Icon {...props} color={theme['color-basic-1100']} name='reader-outline' pack='ionicons' />
    )

    const onDeleteItem = (item: Exam) => {
        var lista = data
        const index = lista.indexOf(item)
        if (index > -1) lista.splice(index, 1)
        setData([...lista])
    }

    const renderItem = (info: ListRenderItemInfo<Exam>) => (
        <Swipeable
            renderRightActions={(progress, drag) => leftSwipe(progress, drag, info.item)}
            overshootLeft={false}>
            <ListItem
                style={styles.containerItem}
                title={info.item.examType}
                description={info.item.shortenedDescription}
                accessoryRight={(e) => renderRightIcon(e, info.item)}
                accessoryLeft={renderLeftIcon}
            />
        </Swipeable>
    )

    const onRefresh = useCallback(() => {
        setRefreshing(true)
        setTimeout(() => {
            setRefreshing(false)
        }, 1000)
    }, [])

    const filterData = () => {
        orderList(originalData)
        setIsFiltered(true)
        setVisibleModal(false)
    }

    const clearFilter = () => {
        setIsFiltered(!isFiltered)
        setRange({})
        getExamList()
    }

    return (
        <>
            <HeaderMyExams onRefresh={setAddedItem} />
            <SafeAreaLayout level='2' style={styles.safeArea}>
                <View style={styles.container}>
                    <View style={styles.viewTop}>
                        <Text style={[styles.text, { paddingHorizontal: 5 }]}>TOTAL:</Text>
                        <Text status='primary' style={styles.text}>{data.length}</Text>
                    </View>
                    <View style={styles.viewTop}>
                        {isFiltered && (
                            <TouchableOpacity onPress={clearFilter}>
                                <Text status='danger' category='c1' style={{ paddingHorizontal: 5, fontWeight: 'bold' }}>LIMPAR</Text>
                            </TouchableOpacity>
                        )}
                        <TouchableOpacity disabled={originalData.length === 0} onPress={handleVisibleModal}>
                            <Icon name='options-outline' style={styles.iconFilter} size={20} pack='ionicons' />
                        </TouchableOpacity>
                    </View>
                </View>
                <List
                    data={data}
                    renderItem={renderItem}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                        />
                    }
                />
                <FilterModal
                    ref={ref}
                    onVisible={setVisibleModal}
                    visible={visibleModal}
                    handleRange={setRange}
                    onFilter={filterData}
                    range={range}

                />
            </SafeAreaLayout>
        </>
    )
}

export default MyExamsScreen
