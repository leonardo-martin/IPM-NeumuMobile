import { Spinner, useStyleSheet } from '@ui-kitten/components'
import EmptyComponent from '@components/empty'
import React, { FC, ReactElement } from 'react'
import { View } from 'react-native'
import { AgendaSchedule } from 'react-native-calendars'
import { emptyDataAgendaStyle } from './empty-data.style'

interface AppointmentsEmptyDataProps {
    loading: boolean
    items: AgendaSchedule
}

const AppointmentsEmptyData: FC<AppointmentsEmptyDataProps> = ({ loading, items }): ReactElement => {

    const styles = useStyleSheet(emptyDataAgendaStyle)
    return (
        loading ?
            <View style={styles.container}>
                <Spinner size='giant' />
            </View>
            : (Object.keys(items).length === 0) ? <EmptyComponent message='Nenhuma marcação encontrada' />
                : <EmptyComponent message='Nenhuma marcação para este dia' />

    )
}

export default AppointmentsEmptyData

