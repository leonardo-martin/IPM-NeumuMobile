import { I18nConfig } from "@ui-kitten/components"
import { DateFnsService } from "@ui-kitten/date-fns"

const i18nConfig: I18nConfig = {
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

export const localeDateService = new DateFnsService('pt-BR', { i18n: { ...i18nConfig }, startDayOfWeek: 0 })
