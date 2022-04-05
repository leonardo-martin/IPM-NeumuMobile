import React, { FC, ReactElement } from 'react'
import { Calendar, Layout, useStyleSheet } from '@ui-kitten/components'
import { calendarStyles } from './style'
import { useTheme } from '@contexts/theme'
import { useDatepickerService } from '@hooks/useDatepickerService'

type CalendarProps = {
    date?: Date | undefined
    min?: Date | undefined
    max?: Date | undefined
    boundingMonth?: boolean | undefined
    onSelect?: ((date: Date) => void) | undefined
}

const CalendarComponent: FC<CalendarProps> = ({
    boundingMonth, onSelect, min, max, date
}): ReactElement => {

    const { localeDateService } = useDatepickerService()
    const filterWeekend = (date: Date) => date.getDay() !== 0 && date.getDay() !== 6
    const { theme } = useTheme()
    const styles = useStyleSheet(calendarStyles(theme))

    return (
        <Layout style={styles.container} level='1'>
            <Calendar
                date={date}
                min={min}
                max={max}
                style={styles.calendar}
                dateService={localeDateService}
                boundingMonth={boundingMonth}
                filter={filterWeekend}
                onSelect={onSelect}
            />
        </Layout>
    )
}

CalendarComponent.defaultProps = {
    boundingMonth: false,
    date: new Date(),
    min: new Date(),
    max: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() + 30)
}

export default CalendarComponent