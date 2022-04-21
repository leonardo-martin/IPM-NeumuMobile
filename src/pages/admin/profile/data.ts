import { ItemInfo } from "@components/list"

export const data: ItemInfo[] = [
    {
        title: 'Editar Perfil',
        description: 'Informações sobre minha conta',
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
    },
    {
        title: 'Programa de Mapeamento Genético',
        description: 'O que é? Como funciona? Participar',
        icon: {
            name: 'activity-outline',
            pack: 'eva'
        },
        route: 'GeneticMappingProgram'
    },
]