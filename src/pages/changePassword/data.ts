import { EChoicesChangePassword } from "@models/User"
import { InputProps } from "@ui-kitten/components"
import { isEmailValid } from "@utils/mask"
import { validate as validateCPF } from 'gerador-validador-cpf'
import { FieldPath, FieldValues, RegisterOptions } from "react-hook-form"

export const choices = [
    EChoicesChangePassword.CPF,
    EChoicesChangePassword.RNM,
    EChoicesChangePassword.EMAIL,
]

export interface ChangePasswordRequestParams {
    choice: EChoicesChangePassword
}

export const getChangePasswordChoices = (index: number): string => {
    return choices[index] ?? ''
}

interface Config {
    [key: string]: {
        input?: InputProps
        rules?: Omit<RegisterOptions<FieldValues, FieldPath<FieldValues>>, 'valueAsNumber' | 'valueAsDate' | 'setValueAs' | 'disabled'>
    }
}

export const config: Config = {
    [`${choices[0]}`]: {
        input: {
            autoCapitalize: 'none',
            label: choices[0],
            keyboardType: 'number-pad',
            maxLength: 14,
            placeholder: '000.000.000-00'
        },
        rules: {
            required: {
                value: true,
                message: 'Campo obrigatório'
            },
            minLength: {
                value: 14,
                message: 'Mín. 14 caracteres'
            },
            maxLength: {
                value: 14,
                message: `Max. 14 caracteres`
            },
            validate: (e) => e ? validateCPF(e) : undefined
        }
    },
    [`${choices[1]}`]: {
        input: {
            autoCapitalize: 'characters',
            label: choices[1],
            maxLength: 30,
            placeholder: 'X123456-Y'
        },
        rules: {
            required: {
                value: true,
                message: 'Campo obrigatório'
            },
            minLength: {
                value: 9,
                message: 'Mín. 9 caracteres'
            },
            maxLength: {
                value: 30,
                message: `Max. 30 caracteres`
            },
        }
    },
    [`${choices[2]}`]: {
        input: {
            autoCapitalize: 'none',
            label: choices[2],
            keyboardType: 'email-address',
            maxLength: 60,
            placeholder: 'usuario@teleneumu.com'
        },
        rules: {
            required: {
                value: true,
                message: 'Campo obrigatório'
            },
            minLength: {
                value: 5,
                message: 'Mín. 5 caracteres'
            },
            maxLength: {
                value: 60,
                message: `Max. 60 caracteres`
            },
            validate: (e) => e ? isEmailValid(e) : undefined
        }
    }
}