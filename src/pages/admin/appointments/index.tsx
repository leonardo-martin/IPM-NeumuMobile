import { useIsFocused } from '@react-navigation/native'
import { Text } from '@ui-kitten/components'
import { _DEFAULT_FORMAT_DATE, _FORMAT_DATE_EN_US } from 'constants/date'
import { useDatepickerService } from 'hooks/useDatepickerService'
import React, { FC, ReactElement, useEffect, useState } from 'react'
import { Alert, StyleSheet, View } from 'react-native'
import { Agenda, AgendaEntry, AgendaSchedule, DateData } from 'react-native-calendars'
import { TouchableOpacity } from 'react-native-gesture-handler'
// import AppointmentsRoutes from '@routes/appointment.routes'

const vacation = { key: 'vacation', color: 'red', selectedDotColor: 'blue' }
const massage = { key: 'massage', color: 'blue', selectedDotColor: 'blue' }
const workout = { key: 'workout', color: 'green' }

interface AppointmentsProps {
    items?: AgendaSchedule
}

const AppointmentsScreen: FC<AppointmentsProps> = ({ ...props }): ReactElement => {

    const isFocused = useIsFocused()
    const [items, setItems] = useState<AgendaSchedule | undefined>(props.items)
    const { localeDateService } = useDatepickerService()
    const today = localeDateService.today()
    const currentDate = localeDateService.format(today, _FORMAT_DATE_EN_US)
    const maxDate = localeDateService.format(localeDateService.addDay(today, 60), _FORMAT_DATE_EN_US)

    useEffect(() => {
        if (!isFocused) setItems(undefined)
    }, [isFocused])

    const renderEmptyDate = () => {
        return (
            <View style={styles.emptyDate} />
        )
    }

    const timeToString = (time: number) => {
        const date = new Date(time)
        return date.toISOString().split('T')[0]
    }

    const loadItems = (day: DateData) => {
        const items = props.items || {}
        // setTimeout(() => {
        //     for (let i = -15; i < 85; i++) {
        //         const time = day.timestamp + i * 24 * 60 * 60 * 1000
        //         const strTime = timeToString(time)

        //         if (!items[strTime]) {
        //             items[strTime] = []
        //             items[strTime].push({
        //                 name: 'Adicionar +',
        //                 height: 80,
        //                 day: strTime
        //             })
        //         }
        //     }

        //     const newItems: AgendaSchedule = {}
        //     Object.keys(items).forEach(key => {
        //         newItems[key] = items[key]
        //     })
        //     setItems(newItems)
        // }, 1000)
    }

    const renderItem = (reservation: AgendaEntry, isFirst: boolean) => {
        const fontSize = isFirst ? 16 : 14
        const color = isFirst ? '#000000' : '#43515c'

        return (
            <TouchableOpacity
                testID={reservation.name}
                style={[styles.item, { height: reservation.height }]}
                onPress={() => Alert.alert(reservation.name)}
            >
                <Text style={{ fontSize, color }}>{reservation.name}</Text>
            </TouchableOpacity>
        )
    }

    const rowHasChanged = (r1: AgendaEntry, r2: AgendaEntry) => {
        return r1.name !== r2.name
    }



    return (
        // <AppointmentsRoutes />
        <>
            <Agenda
                items={items}
                // items={{
                //     '2022-04-19': [{ name: 'item 1 ', height: 80, day: '19' }],
                //     '2022-04-20': [{ name: 'item 2 ', height: 80, day: '20' }],
                //     '2022-04-21': [{ name: 'item 3 ', height: 80, day: '21' }],
                //     '2022-04-22': [{ name: 'item 4 ', height: 80, day: '22' }],
                //     '2022-04-23': [],
                // }}
                current={currentDate}
                selected={currentDate}
                maxDate={maxDate}
                loadItemsForMonth={loadItems}
                renderEmptyDate={renderEmptyDate}
                renderItem={renderItem}
                rowHasChanged={rowHasChanged}
                markedDates={{
                    '2022-04-22': { marked: true, dotColor: 'red' },
                }}
                hideExtraDays={true}
                theme={{
                    // todayBackgroundColor: '#000'
                }}
                showClosingKnob={true}
                refreshing={false}
                onRefresh={() => console.log('refreshing...')}
            />
        </>
    )
}

export default AppointmentsScreen

const styles = StyleSheet.create({
    item: {
        backgroundColor: 'white',
        flex: 1,
        borderRadius: 5,
        padding: 10,
        marginRight: 10,
        marginTop: 17
    },
    emptyDate: {
        height: 15,
        flex: 1,
        paddingTop: 30
    }
})