import { ItemInfo } from "@components/list"

export const data: ItemInfo[] = [
    {
        title: 'Conta',
        description: '',
        icon: {
            name: 'layers-outline',
            pack: 'eva'
        },
    },
    {
        title: 'Notificações',
        description: '',
        route: 'Notification',
        icon: {
            name: 'bell-outline',
            pack: 'eva'
        },
    },
    {
        title: 'Central de Ajuda',
        description: 'Dúvidas? Fale conosco',
        icon: {
            name: 'question-mark-circle-outline',
            pack: 'eva'
        },
    },
    {
        title: 'Informações do Aplicativo',
        description: 'Versão',
        route: 'InformationApp',
        icon: {
            name: 'info-outline',
            pack: 'eva'
        },
    },
]