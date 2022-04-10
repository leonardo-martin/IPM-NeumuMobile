import React, { Dispatch, FC, ReactElement, useEffect, useState } from 'react'
import { ListRenderItemInfo, View } from 'react-native'
import { CalendarRange, Divider, Icon, List, Text, useStyleSheet } from '@ui-kitten/components'
import { useDatepickerService } from '@hooks/useDatepickerService'
import { _DATE_FROM_ISO_8601 } from '@constants/date'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { TimelineItem, TimelineTimeItem } from '@models/Timeline'
import { AscendingOrder } from '@models/Common'
import { sortByDate } from '@utils/common'
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
    data, orderBy, range, isFiltered, onChangeListSize, onDelete, onChange
}): ReactElement => {

    const [listData, setListData] = useState<string[]>()

    const orderList = (list: any[]) => {
        if (range?.startDate && !range?.endDate && isFiltered)
            list = list.filter((e) => localeDateService.parse(e, _DATE_FROM_ISO_8601) >= (range.startDate as Date))
        else if (range?.startDate && range?.endDate && isFiltered)
            list = list.filter((e) => localeDateService.parse(e, _DATE_FROM_ISO_8601) >= (range.startDate as Date) && localeDateService.parse(e, _DATE_FROM_ISO_8601) <= (range.endDate as Date))
        list = list.sort((a, b) => sortByDate(localeDateService.parse(a, _DATE_FROM_ISO_8601), localeDateService.parse(b, _DATE_FROM_ISO_8601), orderBy))
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
        if (data)
            orderList(Object.keys(data))
    }, [data, orderBy, isFiltered])

    const styles = useStyleSheet(timelineStyle)
    const { localeDateService } = useDatepickerService()

    var currentDate = localeDateService.today()
    var year = currentDate.getFullYear().toString()
    var month = localeDateService.getMonthName(currentDate)
    var count = 0

    const renderItem = (info: ListRenderItemInfo<string>) => {
        const date = localeDateService.format(localeDateService.parse(info.item, _DATE_FROM_ISO_8601), 'ddd/DD/MMM/YYYY')
        const itemMonth = date.split('/')[2]
        const itemYear = date.split('/')[3]

        if (month === itemMonth && year === itemYear) count++
        else {
            month = itemMonth
            year = itemYear
            count = 1
        }

        return (
            <>
                {count === 1 && (
                    <View style={styles.titleItem}>
                        <View style={styles.containerTitleItem}>
                            <Text status='control' category='s2'>{itemMonth.toUpperCase()}/{itemYear}</Text>
                        </View>
                    </View>
                )}
                <View key={`${info.index}-${info.item}`} style={styles.containerItem}>
                    <View style={styles.containerItemColumnDate}>
                        <Text category='label'>{date.split('/')[0].toUpperCase()}</Text>
                        <Text category='p1'>{date.split('/')[1]}</Text>
                    </View>
                    <Divider style={styles.verticleLine} />
                    <View style={styles.containerItemColumnInfo}>
                        {data[info.item].map((item: any, index: number) => {
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
                style={styles.list}
                data={listData}
                renderItem={renderItem}
            />
        </View>
    )
}

Timeline.defaultProps = {
    orderBy: AscendingOrder.ASC
}

export default Timeline