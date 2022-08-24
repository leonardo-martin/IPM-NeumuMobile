import FilterByDateDialog from '@components/dialog/filterByDateDialog'
import EmptyComponent from '@components/empty'
import HeaderWithAddIcon from '@components/header/admin/generic-with-add-icon'
import { SafeAreaLayout } from '@components/safeAreaLayout'
import { _DATE_FROM_ISO_8601, _DEFAULT_FORMAT_DATE } from '@constants/date'
import { useDatepickerService } from '@hooks/useDatepickerService'
import { useModal } from '@hooks/useModal'
import { AscendingOrder } from '@models/Common'
import { ExamDto } from '@models/Exam'
import { DrawerContentComponentProps } from '@react-navigation/drawer'
import { useFocusEffect, useNavigation } from '@react-navigation/native'
import { deleteExam, getPatientExamList } from '@services/exam.service'
import { CalendarRange, Icon, IconProps, List, ListItem, Modal, Text, useStyleSheet, useTheme } from '@ui-kitten/components'
import { orderByDateRange, sortByDate } from '@utils/common'
import React, { FC, ReactElement, RefObject, useCallback, useEffect, useState } from 'react'
import { Alert, Animated as RNAnimated, ListRenderItemInfo, RefreshControl, TouchableOpacity, View } from 'react-native'
import { RectButton } from 'react-native-gesture-handler'
import Swipeable from 'react-native-gesture-handler/Swipeable'
import Animated, { Layout, LightSpeedInLeft, LightSpeedOutRight } from 'react-native-reanimated'
import Toast from 'react-native-toast-message'
import { myExamsStyle } from './style'

const PatientDocumentsScreen: FC<DrawerContentComponentProps> = (): ReactElement => {

    const theme = useTheme()
    const styles = useStyleSheet(myExamsStyle)
    const navigation = useNavigation<any>()
    const { ref } = useModal<Modal>()

    const [visibleModal, setVisibleModal] = useState<boolean>(false)
    const [refreshing, setRefreshing] = useState<boolean>(false)
    const [data, setData] = useState<Array<ExamDto>>([])
    const [originalData, setOriginalData] = useState<Array<ExamDto>>([])

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

    const onRefresh = async () => {
        await getExamList()
        Toast.show({
            type: 'success',
            text2: 'Atualizado',
        })
        setRefreshing(false)
    }

    useEffect(() => {
        if (refreshing) onRefresh()
    }, [refreshing])

    useFocusEffect(
        useCallback(() => {
            setIsFiltered(false)
            setRefreshing(false)
            setRange({})
            getExamList()
        }, [])
    )

    const renderRightIcon = (_props: IconProps, exam: ExamDto) => (
        <View style={styles.viewDate}>
            <Text
                style={styles.textDate}
                appearance='hint'
                category='c1'>
                Última atualização
            </Text>
            <Text
                style={styles.textDate}
                appearance='hint'
                category='c1'>
                {localeDateService.format(localeDateService.parse(exam.examResultDate as string, _DATE_FROM_ISO_8601), _DEFAULT_FORMAT_DATE)}
            </Text>
        </View>
    )

    const renderLeftIcon = (props: IconProps) => (
        <View style={{ paddingHorizontal: 10 }}>
            <Icon {...props} color={theme['color-basic-1100']} name='reader-outline' pack='ionicons' />
        </View>
    )

    const onDeleteItem = async (info: ListRenderItemInfo<ExamDto>) => {
        try {
            const resp = await deleteExam(info.item.id)
            if (resp.status === 201 || resp.status === 200) {
                const arr = [...data]
                arr.splice(info.index, 1)
                if (arr.length === 0)
                    getExamList()
                else
                    setData(arr)

                Toast.show({
                    type: 'success',
                    text2: 'Documento deletado',
                })
            }
        } catch (error) {
            Toast.show({
                type: 'danger',
                text2: 'Não foi possível deletar. Tente novamente mais tarde',
            })
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
        color: string, _progress: RNAnimated.AnimatedInterpolation,
        dragX: RNAnimated.AnimatedInterpolation, ref: RefObject<Swipeable>) => {

        const opacity = dragX.interpolate({
            inputRange: [-80, -20, 0],
            outputRange: [1, 0.9, 0],
            extrapolate: 'clamp'
        })

        const pressHandler = () => {
            ref.current?.close()

            if (text.toUpperCase() === 'DELETAR') {
                Alert.alert(
                    `Deletar "${info.item.examType}"`,
                    `Tem certeza que deseja remover o documento "${info.item.examType}"?`,
                    [
                        { text: "Não", style: 'cancel', onPress: () => { } },
                        {
                            text: 'Sim',
                            style: 'destructive',
                            onPress: () => onDeleteItem(info)
                        },
                    ]
                )
            } else if (text.toUpperCase() === 'EDITAR') {
                goToDocument(info.item)
            }
        }
        return (
            <RNAnimated.View style={[{ flex: 1, transform: [{ translateX: 0 }] }, { opacity: opacity }]}>
                <RectButton
                    style={[styles.rightAction, { backgroundColor: theme[color] }]}
                    onPress={pressHandler}>
                    <Text style={styles.textWhite}>{text}</Text>
                </RectButton>
            </RNAnimated.View>
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
                <Animated.View
                    layout={Layout.springify()}
                    entering={LightSpeedInLeft}
                    exiting={LightSpeedOutRight}>
                    <ListItem
                        style={styles.containerItem}
                        title={info.item.examType}
                        description={(evaProps) => (
                            <>
                                <Text {...evaProps}>Data: {localeDateService.format(localeDateService.parse(info.item.examDate as string, _DATE_FROM_ISO_8601), _DEFAULT_FORMAT_DATE)}</Text>
                            </>
                        )}
                        accessoryRight={(e) => renderRightIcon(e, info.item)}
                        accessoryLeft={renderLeftIcon}
                    />
                </Animated.View>
            </Swipeable>
        )
    }

    const headerListComponent = () => (
        <View style={styles.container}>
            {originalData.length > 0 ? (
                <View style={styles.viewTop}>
                    <Text style={[styles.text, { paddingHorizontal: 5 }]}>TOTAL:</Text>
                    <Text status='primary' style={styles.text}>{data.length}</Text>
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
                <TouchableOpacity disabled={data.length === 0} onPress={handleVisibleModal}>
                    <Icon name='options-outline' style={styles.iconFilter} size={20} pack='ionicons' />
                </TouchableOpacity>
            </View>
        </View>
    )

    const goToDocument = (data?: ExamDto) => {
        if (data) {
            navigation.navigate('CreatePatientDocuments', {
                exam: data,
                props: {
                    editable: true
                }
            })
        }
        else navigation.navigate('CreatePatientDocuments', {
            exam: undefined,
            props: {
                editable: true
            }
        })
    }

    return (
        <>
            <HeaderWithAddIcon
                title='Meus Documentos'
                onClick={() => goToDocument()}
            />
            <SafeAreaLayout level='1' style={styles.safeArea}>
                <List
                    contentContainerStyle={{
                        flex: 1
                    }}
                    style={{ backgroundColor: 'transparent' }}
                    ListHeaderComponent={headerListComponent}
                    data={data}
                    renderItem={renderItem}
                    keyExtractor={item => item.id.toString()}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={() => setRefreshing(true)}
                        />
                    }
                    ListEmptyComponent={<EmptyComponent message='Nenhum documento encontrado' />}
                />
                <FilterByDateDialog
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

export default PatientDocumentsScreen