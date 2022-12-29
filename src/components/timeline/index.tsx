import { _DATE_FROM_ISO_8601 } from '@constants/date'
import { useDatepickerService } from '@hooks/useDatepickerService'
import { AscendingOrder } from '@models/Common'
import { TimelineItem, TimelineTimeItem } from '@models/Timeline'
import { CalendarRange, Divider, Icon, List, ListProps, Text, useStyleSheet } from '@ui-kitten/components'
import { orderByDateRange, sortByDate } from '@utils/common'
import React, { Dispatch, FC, ReactElement, useCallback, useEffect, useState } from 'react'
import { ListRenderItemInfo, View } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'
import Animated, { Layout, LightSpeedInLeft, LightSpeedOutRight } from 'react-native-reanimated'
import { timelineStyle } from './style'

interface TimelineProps extends Omit<ListProps, 'renderItem'> {
    data: TimelineItem | undefined | any
    isFiltered?: boolean
    range?: CalendarRange<Date>
    orderBy?: AscendingOrder
    onChangeListSize: Dispatch<React.SetStateAction<number>>
    onDelete: (date: string, item: TimelineTimeItem) => void
    onChange: (date: string, item: TimelineTimeItem) => void
    readonly?: boolean
}

const Timeline: FC<TimelineProps> = ({
    data, orderBy = AscendingOrder.ASC, range = {}, isFiltered, onChangeListSize, onDelete, onChange,
    readonly = false, ...props
}): ReactElement => {

    const styles = useStyleSheet(timelineStyle)
    const { localeDateService } = useDatepickerService()
    const [listData, setListData] = useState<TimelineItem[]>()

    const orderList = useCallback((list: any[]) => {
        list = orderByDateRange(localeDateService, range, list)
        list = list.sort((a, b) => sortByDate(localeDateService, a, b, orderBy))
        setListData([...list])

        if (list && data) {
            let length = 0
            list.map(item => {
                length += data[item].length
            })
            onChangeListSize(length)
        }
    }, [localeDateService])

    useEffect(() => {
        if (data || (data && isFiltered))
            orderList(Object.keys(data))
    }, [data, isFiltered])

    const renderItem = (info: ListRenderItemInfo<string>) => {
        const date = localeDateService.format(localeDateService.parse(info.item, _DATE_FROM_ISO_8601), 'ddd/DD/MM/YY')
        const item = date.split('/')

        return (
            <>
                <Animated.View
                    layout={Layout.springify()}
                    entering={LightSpeedInLeft}
                    exiting={LightSpeedOutRight}>
                    <View style={styles.containerItem}>
                        <View style={styles.containerItemColumnDate}>
                            <Text category='label'>{item[0].toUpperCase()}</Text>
                            <Text category='p1' style={{ fontSize: 11 }}>{item[1]}/{item[2]}/{item[3]}</Text>
                        </View>
                        <Divider style={styles.verticleLine} />
                        <View style={styles.containerItemColumnInfo}>
                            {data && data[info.item] && data[info.item].map((item: { title: string, description: string }, index: number) => {
                                return (
                                    <View key={`${index}-${item.title}`} style={styles.viewTimeline}>
                                        <View style={styles.viewTimelineItem}>
                                            <Text category='label' style={styles.text}>{item.title} </Text>
                                            <Text appearance='hint' style={styles.text}>{(item.description.length > 48) ? `${item.description.substring(0, 44)}...` : item.description}</Text>
                                        </View>
                                        {readonly ? (
                                            <>
                                                <TouchableOpacity style={styles.button} onPress={() => onChange(info.item, item)}>
                                                    <Icon name='information-circle-outline' pack='ionicons' size={20} />
                                                </TouchableOpacity>
                                            </>
                                        ) : (
                                            <>
                                                <TouchableOpacity style={styles.button} onPress={() => onChange(info.item, item)}>
                                                    <Icon name='create-outline' pack='ionicons' size={20} />
                                                </TouchableOpacity>
                                                <TouchableOpacity onPress={() => onDelete(info.item, item)}>
                                                    <Icon name='trash-outline' pack='ionicons' size={20} />
                                                </TouchableOpacity>
                                            </>
                                        )}
                                    </View>
                                )
                            })}
                        </View>
                    </View>

                </Animated.View>
            </>
        )
    }

    return (
        <View style={styles.container}>
            <List
                {...props}
                contentContainerStyle={{
                    flex: 1
                }}
                showsVerticalScrollIndicator={false}
                style={[props.style, styles.list]}
                data={listData}
                keyExtractor={item => item.toString()}
                renderItem={renderItem}
            />
        </View>
    )
}

export default Timeline