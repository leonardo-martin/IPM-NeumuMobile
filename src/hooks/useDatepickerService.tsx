import { I18nConfig } from "@ui-kitten/components"
import { DateFnsService } from "@ui-kitten/date-fns"

const i18n: I18nConfig = {
    dayNames: {
        short: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'],
        long: ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'],
    },
    monthNames: {
        short: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
        long: [
            'Janeiro',
            'Fevereiro',
            'Março',
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

export const useDatepickerService = (format = 'DD/MM/YYYY') => {
    const localeDateService = new DateFnsService('pt-BR', { i18n, startDayOfWeek: 0, format })

    return { localeDateService, format }
}