import { ItemInfo } from "@components/list"

export const baseData: ItemInfo[] = [
    //TODO! - Desabilitado para lançamento da v1
    // {
    //     title: 'Conta',
    //     description: '',
    //     icon: {
    //         name: 'layers-outline',
    //         pack: 'eva'
    //     },
    // },
    // {
    //     title: 'Notificações',
    //     description: '',
    //     route: 'Notification',
    //     icon: {
    //         name: 'bell-outline',
    //         pack: 'eva'
    //     },
    // },
    // {
    //     title: 'Central de Ajuda',
    //     description: 'Dúvidas? Fale conosco',
    //     icon: {
    //         name: 'question-mark-circle-outline',
    //         pack: 'eva'
    //     },
    // },
    {
        title: 'Termos e Condições de Uso',
        description: '',
        route: 'TermsAndConditions',
        icon: {
            name: 'bookmark-outline',
            pack: 'eva'
        },
    },
    {
        title: 'Informações do Aplicativo',
        description: '',
        route: 'InformationApp',
        icon: {
            name: 'info-outline',
            pack: 'eva'
        },
    },
]

export const patientData: ItemInfo[] = [
    ...baseData,
    {
        title: 'Compartilhar Informações',
        description: '',
        route: 'ShareInformationWithMedicalDoctor',
        icon: {
            name: 'share-outline',
            pack: 'eva'
        },
        badge: true
    },
]

export const doctorData: ItemInfo[] = [
    ...baseData
]