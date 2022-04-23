import { _DATE_FROM_ISO_8601 } from '@constants/date'
import { useDatepickerService } from '@hooks/useDatepickerService'
import { AscendingOrder } from '@models/Common'
import { TimelineItem, TimelineTimeItem } from '@models/Timeline'
import { CalendarRange, Divider, Icon, List, ListProps, Text, useStyleSheet } from '@ui-kitten/components'
import { orderByDateRange, sortByDate } from '@utils/common'
import React, { Dispatch, FC, ReactElement, useEffect, useState } from 'react'
import { ListRenderItemInfo, View } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { timelineStyle } from './style'

type TimelineProps = {
    customData: TimelineItem | undefined
    isFiltered?: boolean
    range?: CalendarRange<Date>
    orderBy?: AscendingOrder
    onChangeListSize: Dispatch<React.SetStateAction<number>>
    onDelete: (date: string, item: TimelineTimeItem) => void
    onChange: (date: string, item: TimelineTimeItem) => void
} & ListProps

const Timeline: FC<TimelineProps> = ({
    customData, orderBy = AscendingOrder.ASC, range = {}, isFiltered, onChangeListSize, onDelete, onChange, ...props
}): ReactElement => {

    const styles = useStyleSheet(timelineStyle)
    const { localeDateService } = useDatepickerService()
    const [listData, setListData] = useState<TimelineItem[]>()

    const orderList = (list: any[]) => {
        list = orderByDateRange(range, list)
        list = list.sort((a, b) => sortByDate(a, b, orderBy))
        setListData([...list])

        if (list && customData) {
            var length = 0
            list.map(item => {
                length += customData[item].length
            })
            onChangeListSize(length)
        }
    }

    useEffect(() => {
        if (customData || (customData && isFiltered))
            orderList(Object.keys(customData))
    }, [customData, isFiltered])

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
                        {customData && customData[info.item] && customData[info.item].map((item: any, index: number) => {
                            return (
                                <View key={`${index}-${item.description}`} style={styles.viewTimeline}>
                                    <View style={styles.viewTimelineItem}>
                                        <Text category='label' style={styles.text}>{item.title} </Text>
                                        <Text appearance='hint' style={styles.text}>{item.description}</Text>
                                    </View>
                                    <TouchableOpacity style={styles.button} onPress={() => onChange(info.item, item)}>
                                        <Icon name='create-outline' pack='ionicons' size={20} />
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => onDelete(info.item, item)}>
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
                {...props}
                showsVerticalScrollIndicator={false}
                style={styles.list}
                data={listData}
                renderItem={renderItem} />
        </View>
    )
}

export default Timeline