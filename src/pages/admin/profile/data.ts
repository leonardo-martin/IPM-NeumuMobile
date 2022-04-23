import { ItemInfo } from "@components/list"

const commonData: ItemInfo[] = [
    {
        title: 'Editar Perfil',
        description: 'Editar as informações da minha conta',
        icon: {
            name: 'person-outline',
            pack: 'eva'
        },
        route: 'EditProfile'
    },
    {
        title: 'Redefinir Senha',
        description: 'Solicitar a troca de senha',
        icon: {
            name: 'unlock-outline',
            pack: 'eva'
        },
        route: 'ChangePasswordChoice'
    }
]

export const patientBaseData: ItemInfo[] = [
    ...commonData,
    {
        title: 'Programa de Mapeamento Genético',
        description: '',
        icon: {
            name: 'activity-outline',
            pack: 'eva'
        },
        route: 'GeneticMappingProgram'
    },
]

export const specialistBaseData: ItemInfo[] = [
    ...commonData,
]