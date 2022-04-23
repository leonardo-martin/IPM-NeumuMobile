import { _DATE_FROM_ISO_8601 } from '@constants/date'
import { useDatepickerService } from '@hooks/useDatepickerService'
import { AscendingOrder } from '@models/Common'
import { TimelineItem, TimelineTimeItem } from '@models/Timeline'
import { CalendarRange, Divider, Icon, List, Text, useStyleSheet } from '@ui-kitten/components'
import { orderByDateRange, sortByDate } from '@utils/common'
import React, { Dispatch, FC, ReactElement, useEffect, useState } from 'react'
import { ListRenderItemInfo, View } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { timelineStyle } from './style'

interface TimelineProps {
    data: TimelineItem
    isFiltered?: boolean
    range?: CalendarRange<Date>
    orderBy?: AscendingOrder
    onChangeListSize: Dispatch<React.SetStateAction<number>>
    onDelete: (item: TimelineTimeItem) => void
    onChange: (item: TimelineTimeItem) => void
}

const Timeline: FC<TimelineProps> = ({
    data, orderBy = AscendingOrder.ASC, range = {}, isFiltered, onChangeListSize, onDelete, onChange
}): ReactElement => {

    const styles = useStyleSheet(timelineStyle)
    const { localeDateService } = useDatepickerService()
    const [listData, setListData] = useState<string[]>()

    const orderList = (list: any[]) => {
        list = orderByDateRange(range, list)
        list = list.sort((a, b) => sortByDate(a, b, orderBy))
        setListData([...list])

        if (list) {
            var length = 0
            list.map(item => {
                length += data[item].length
            })
            onChangeListSize(length)
        }
    }

    useEffect(() => {
        if (data || (data && isFiltered))
            orderList(Object.keys(data))
    }, [data, isFiltered])

    const renderItem = (info: ListRenderItemInfo<string>) => {
        const date = localeDateService.format(localeDateService.parse(info.item, _DATE_FROM_ISO_8601), 'ddd/DD/MM/YY')
        const item = date.split('/')

        return (
            <>
                <View key={`${info.index}-${info.item}`} style={styles.containerItem}>
                    <View style={styles.containerItemColumnDate}>
                        <Text category='label'>{item[0].toUpperCase()}</Text>
                        <Text category='p1' style={{ fontSize: 11 }}>{item[1]}/{item[2]}/{item[3]}</Text>
                    </View>
                    <Divider style={styles.verticleLine} />
                    <View style={styles.containerItemColumnInfo}>
                        {data[info.item] && data[info.item].map((item: any, index: number) => {
                            return (
                                <View key={`${index}-${item.description}`} style={styles.viewTimeline}>
                                    <View style={styles.viewTimelineItem}>
                                        <Text category='label' style={styles.text}>{item.title} </Text>
                                        <Text appearance='hint' style={styles.text}>{item.description}</Text>
                                    </View>
                                    <TouchableOpacity style={styles.button} onPress={() => onChange(item)}>
                                        <Icon name='create-outline' pack='ionicons' size={20} />
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => onDelete(item)}>
                                        <Icon name='trash-outline' pack='ionicons' size={20} />
                                    </TouchableOpacity>
                                </View>
                            )
                        })}
                    </View>
                </View>
            </>
        )
    }

    return (
        <View style={styles.container}>
            <List
                showsVerticalScrollIndicator={false}
                style={styles.list}
                data={listData}
                renderItem={renderItem} />
        </View>
    )
}

export default Timeline