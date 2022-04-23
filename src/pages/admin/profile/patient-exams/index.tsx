import AddExamDialog from '@components/dialog/addExamDialog'
import FilterByDateDialog from '@components/dialog/filterByDateDialog'
import HeaderGenericWithTitleAndAddIcon from '@components/header/admin/generic-with-add-icon'
import { SafeAreaLayout } from '@components/safeAreaLayout'
import { _DATE_FROM_ISO_8601, _DEFAULT_FORMAT_DATE } from '@constants/date'
import toast from '@helpers/toast'
import { useDatepickerService } from '@hooks/useDatepickerService'
import { useModal } from '@hooks/useModal'
import { AscendingOrder } from '@models/Common'
import { ExamDto, ExamImage } from '@models/Exam'
import { DrawerContentComponentProps } from '@react-navigation/drawer'
import { useFocusEffect } from '@react-navigation/native'
import { deleteExam, getPatientExamList } from '@services/exam.service'
import { CalendarRange, Icon, IconProps, List, ListItem, Modal, Text, useStyleSheet, useTheme } from '@ui-kitten/components'
import { orderByDateRange, sortByDate } from '@utils/common'
import React, { FC, ReactElement, RefObject, useCallback, useState } from 'react'
import { Animated, ListRenderItemInfo, RefreshControl, TouchableOpacity, View } from 'react-native'
import { RectButton } from 'react-native-gesture-handler'
import Swipeable from 'react-native-gesture-handler/Swipeable'
import { myExamsStyle } from './style'

const PatientExamsScreen: FC<DrawerContentComponentProps> = (): ReactElement => {

    const theme = useTheme()
    const styles = useStyleSheet(myExamsStyle)
    const { ref: refFilter } = useModal<Modal>()
    const { ref: refAdd } = useModal<Modal>()

    const [visibleModal, setVisibleModal] = useState<boolean>(false)
    const [visibleAddModal, setVisibleAddModal] = useState<boolean>(false)
    const [refreshing, setRefreshing] = useState<boolean>(false)
    const [data, setData] = useState<Array<ExamDto>>([])
    const [dataModal, setDataModal] = useState<ExamDto>()
    const [originalData, setOriginalData] = useState<Array<ExamDto>>([])

    const [addedItem, setAddedItem] = useState<ExamDto & ExamImage | undefined>(undefined)
    const [range, setRange] = useState<CalendarRange<Date>>({})
    const [isFiltered, setIsFiltered] = useState<boolean>(false)
    const { localeDateService } = useDatepickerService()

    const handleVisibleModal = () => setVisibleModal(true)

    const orderList = (list: ExamDto[]) => {
        list = orderByDateRange(range, list, 'examDate')
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
            if (!addedItem) {
                setIsFiltered(false)
                setRefreshing(false)
                setRange({})
            }
            getExamList()
        }, [addedItem])
    )

    const renderRightIcon = (_props: IconProps, exam: ExamDto) => (
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
        <View style={{paddingHorizontal: 10}}>
            <Icon {...props} color={theme['color-basic-1100']} name='reader-outline' pack='ionicons' />
        </View>
    )

    const onViewItem = async (info: ListRenderItemInfo<ExamDto>) => {
        setDataModal(info.item)
        setVisibleAddModal(true)
    }

    const onDeleteItem = async (info: ListRenderItemInfo<ExamDto>) => {
        try {
            const resp = await deleteExam(info.item.id)
            if (resp.status === 201 || resp.status === 200) {
                const arr = [...data]
                arr.splice(info.index, 1)
                setData(arr)
            }

        } catch (error) {
            toast.danger({ message: 'Não foi possível deletar. Tente novamente mais tarde', duration: 3000 })

        }
    }

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

    const renderRightAction = (info: ListRenderItemInfo<ExamDto>, text: string,
        color: string, _progress: Animated.AnimatedInterpolation,
        dragX: Animated.AnimatedInterpolation, ref: RefObject<Swipeable>) => {

        const opacity = dragX.interpolate({
            inputRange: [-80, -20, 0],
            outputRange: [1, 0.9, 0],
            extrapolate: 'clamp'
        })

        const pressHandler = () => {
            ref.current?.close()

            if (text.toUpperCase() === 'DELETAR') {
                onDeleteItem(info)
            } else if (text.toUpperCase() === 'EDITAR') {
                onViewItem(info)
            }
        }
        return (
            <Animated.View style={[{ flex: 1, transform: [{ translateX: 0 }] }, { opacity: opacity }]}>
                <RectButton
                    style={[styles.rightAction, { backgroundColor: theme[color] }]}
                    onPress={pressHandler}>
                    <Text style={styles.textWhite}>{text}</Text>
                </RectButton>
            </Animated.View>
        )
    }

    const renderItem = (info: ListRenderItemInfo<ExamDto>) => {

        const ref = React.createRef<Swipeable>()
        return (
            <Swipeable
                ref={ref}
                renderRightActions={(progress, dragX) => (
                    <View style={styles.viewActions}>
                        {renderRightAction(info, 'EDITAR', 'color-success-500', progress, dragX, ref)}
                        {renderRightAction(info, 'DELETAR', 'color-danger-500', progress, dragX, ref)}
                    </View>
                )}
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
                <TouchableOpacity disabled={data.length === 0} onPress={handleVisibleModal}>
                    <Icon name='options-outline' style={styles.iconFilter} size={20} pack='ionicons' />
                </TouchableOpacity>
            </View>
        </View>
    )

    return (
        <>
            <HeaderGenericWithTitleAndAddIcon
                title='Meus Exames'
                onVisible={() => {
                    setDataModal(undefined)
                    setVisibleAddModal(!visibleAddModal)
                }}
            />
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
                <FilterByDateDialog
                    ref={refFilter}
                    onVisible={setVisibleModal}
                    isVisible={visibleModal}
                    handleRange={setRange}
                    onFilter={filterData}
                    range={range}
                />
                <AddExamDialog
                    ref={refAdd}
                    exam={dataModal}
                    onRefresh={setAddedItem}
                    onVisible={setVisibleAddModal}
                    visible={visibleAddModal} />
            </SafeAreaLayout>
        </>
    )
}

export default PatientExamsScreen
