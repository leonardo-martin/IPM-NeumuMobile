import React, { FC, ReactElement } from 'react'
import { View } from 'react-native'
import { Calendar, Layout, NativeDateService } from '@ui-kitten/components'
import { calendarStyles } from './style'

const i18n: any = {
    dayNames: {
        short: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'],
        long: ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'],
    },
    monthNames: {
        short: ['Jan', 'Fev', 'Маr', 'Аbr', 'Маi', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
        long: [
            'Janeiro',
            'Fevereiro',
            'Маrço',
            'Abril',
            'Maio',
            'Junho',
            'Julho',
            'Agosto',
            'Setembro',
            'Outubro',
            'Novembro',
            'Dezembro',
        ],
    },
}

const localeDateService = new NativeDateService('pt-BR', { i18n, startDayOfWeek: 0 })

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

    const filterWeekend = (date: Date) => date.getDay() !== 0 && date.getDay() !== 6

    return (
        <Layout style={calendarStyles.container} level='1'>
            <Calendar
                date={date}
                min={min}
                max={max}
                style={calendarStyles.calendar}
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