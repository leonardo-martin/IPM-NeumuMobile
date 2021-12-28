import { _REGEX_VALID_EMAIL, _REGEX_VALID_FULLNAME, _REGEX_VALID_NUMBERS } from "./constants"

export const formatCpf = (cpf: string) => {
    if (cpf !== undefined)
        return cpf
            .replace(/\D/g, '')
            .replace(/(\d{3})(\d)/, "$1.$2")
            .replace(/(\d{3})(\d)/, "$1.$2")
            .replace(/(\d{3})(\d{1,2})$/, "$1-$2")
    else return ''
}

export const formatPhone = (phoneNumber: string) => {
    if (phoneNumber !== undefined)
        return phoneNumber
            .replace(/\D/g, '')
            .replace(/^(\d{2})\B/, '($1) ')
            .replace(/(\d{1})?(\d{4})(\d{4})/, '$1$2-$3')
    else return ''
}

export const cleanNumberMask = (value: string) => {
    if (value !== undefined)
        return value.replace(_REGEX_VALID_NUMBERS, "")
    else return ''
}

export const onlyNumbers = (value: string) => {
    if (value !== undefined)
        return value.replace(_REGEX_VALID_NUMBERS, "")
    else return ''
}

export const onlyLetters = (value: string) => {
    if (value !== undefined)
        return value.replace(_REGEX_VALID_FULLNAME, "").replace(/\s+/g, ' ')
    else return ''
}

export const formatUsername = (value: string) => {
    if (value !== undefined)
        return value.replace(/[^0-9a-z]/g, "")
    else return ''
}

export const isEmailValid = (value: string) => {
    return _REGEX_VALID_EMAIL.test(value)
}
