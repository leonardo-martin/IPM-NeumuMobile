import HeaderMyExams from '@components/header/admin/myExams'
import FilterModal from '@components/modal/filterModal'
import { SafeAreaLayout } from '@components/safeAreaLayout'
import { _DATE_FROM_ISO_8601, _DEFAULT_FORMAT_DATE } from '@constants/date'
import toast from '@helpers/toast'
import { useDatepickerService } from '@hooks/useDatepickerService'
import { useModal } from '@hooks/useModal'
import { AscendingOrder } from '@models/Common'
import { Exam, ExamDto, ExamImage } from '@models/Exam'
import { DrawerContentComponentProps } from '@react-navigation/drawer'
import { useFocusEffect } from '@react-navigation/native'
import { deleteExam, getPatientExamList } from '@services/exam.service'
import { CalendarRange, Icon, IconProps, List, ListItem, Modal, Text, useStyleSheet, useTheme } from '@ui-kitten/components'
import { sortByDate } from '@utils/common'
import React, { FC, ReactElement, useCallback, useState } from 'react'
import { Animated, ListRenderItemInfo, RefreshControl, TouchableOpacity, View } from 'react-native'
import Swipeable from 'react-native-gesture-handler/Swipeable'
import { myExamsStyle } from './style'

const MyExamsScreen: FC<DrawerContentComponentProps> = (): ReactElement => {

    const theme = useTheme()
    const styles = useStyleSheet(myExamsStyle)
    const { ref } = useModal<Modal>()

    const [visibleModal, setVisibleModal] = useState<boolean>(false)
    const [refreshing, setRefreshing] = useState<boolean>(false)
    const [data, setData] = useState<Array<Exam>>([])
    const [originalData, setOriginalData] = useState<Array<Exam>>([])

    const [addedItem, setAddedItem] = useState<ExamDto & ExamImage | undefined>(undefined)
    const [range, setRange] = useState<CalendarRange<Date>>({})
    const [isFiltered, setIsFiltered] = useState<boolean>(false)
    const { localeDateService } = useDatepickerService()

    const handleVisibleModal = () => setVisibleModal(true)

    const orderList = (list: Exam[]) => {
        if (range.startDate && !range.endDate)
            list = list.filter((e) => localeDateService.parse(e.examDate as string, _DATE_FROM_ISO_8601) >= (range.startDate as Date))
        else if (range.startDate && range.endDate)
            list = list.filter((e) => localeDateService.parse(e.examDate as string, _DATE_FROM_ISO_8601) >= (range.startDate as Date)
                && localeDateService.parse(e.examDate as string, _DATE_FROM_ISO_8601) <= localeDateService.addDay((range.endDate as Date), 1))

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

    const leftSwipe = (_progress: Animated.AnimatedInterpolation, dragX: Animated.AnimatedInterpolation, info: ListRenderItemInfo<Exam>
    ) => {
        const scale = dragX.interpolate({
            inputRange: [-80, 0],
            outputRange: [1, 0.9],
            extrapolate: 'clamp'
        })

        const opacity = dragX.interpolate({
            inputRange: [-80, -20, 0],
            outputRange: [1, 0.9, 0],
            extrapolate: 'clamp'
        })

        return (
            <TouchableOpacity onPress={() => onDeleteItem(info)} activeOpacity={0.5}>
                <Animated.View style={[styles.deleteBox, { opacity: opacity }]}>
                    <Animated.Text style={[{ transform: [{ scale: scale }] }]}>
                        <Icon name='trash-bin-outline' style={styles.icon} size={20} pack='ionicons' />
                    </Animated.Text>
                </Animated.View>
            </TouchableOpacity>
        )
    }

    const renderRightIcon = (_props: IconProps, exam: Exam) => (
        <View style={styles.viewDate}>
            <Text
                style={styles.textDate}
                appearance='hint'
                category='c1'>
                {localeDateService.format(localeDateService.parse(exam.examDate as string, _DATE_FROM_ISO_8601), _DEFAULT_FORMAT_DATE)}
            </Text>
        </View>
    )

    const renderLeftIcon = (props: IconProps) => (
        <Icon {...props} color={theme['color-basic-1100']} name='reader-outline' pack='ionicons' />
    )

    const onDeleteItem = async (info: ListRenderItemInfo<Exam>) => {
        try {
            const resp = await deleteExam(info.item.id)
            if (resp.status === 201 || resp.status === 200) {
                const arr = [...data]
                arr.splice(info.index, 1)
                setData(arr)
            }

        } catch (error) {
            toast.danger({ message: 'Não é possível deletar. Tente novamente mais tarde', duration: 3000 })

        }
    }

    const renderItem = (info: ListRenderItemInfo<Exam>) => (
        <Swipeable
            renderRightActions={(progress, drag) => leftSwipe(progress, drag, info)}
            overshootLeft={false}>
            <ListItem
                style={styles.containerItem}
                title={info.item.examType}
                description={(evaProps) => (
                    info.item.data.examDescription?.length > 36 ?
                        <Text {...evaProps}>
                            {info.item.data.examDescription.substring(0, 32)}...
                        </Text>
                        :
                        <Text {...evaProps}>{info.item.data.examDescription}</Text>
                )}
                accessoryRight={(e) => renderRightIcon(e, info.item)}
                accessoryLeft={renderLeftIcon}
            />
        </Swipeable>
    )

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

    const headerListComponent = () => (
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
    )

    return (
        <>
            <HeaderMyExams onRefresh={setAddedItem} />
            <SafeAreaLayout level='1' style={styles.safeArea}>
                <List
                    style={{ backgroundColor: 'transparent' }}
                    ListHeaderComponent={headerListComponent}
                    data={data}
                    renderItem={renderItem}
                    keyExtractor={item => item.id.toString()}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={getExamList}
                        />
                    }
                />
                <FilterModal
                    ref={ref}
                    onVisible={setVisibleModal}
                    isVisible={visibleModal}
                    handleRange={setRange}
                    onFilter={filterData}
                    range={range}

                />
            </SafeAreaLayout>
        </>
    )
}

export default MyExamsScreen
