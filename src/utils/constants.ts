export const  _REGEX_VALID_EMAIL = new RegExp(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-z\-0-9]+\.)+[a-z]{2,}))$/)

export const _REGEX_VALID_FULLNAME = new RegExp(/[^A-Za-záàâãéèêíïóôõöúçñÁÀÂÃÉÈÍÏÓÔÕÖÚÇÑ'\s]+$/g)

export const _REGEX_VALID_NUMBERS = new RegExp(/[^0-9]/g)

export const TYPES_DOCUMENTS: string[] = [
    'EXAME DE IMAGEM',
    'EXAME LABORATORIAL',
    'GUIA',
    'LAUDO',
    'OUTROS',
]

export const typeOfPersonalDocuments = [
    {
        value: 0,
        label: 'CPF'
    },
    // {
    //     value: 1,
    //     label: 'RG'
    // },
    {
        value: 2,
        label: 'RNM'
    }
]