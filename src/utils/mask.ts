import { _REGEX_VALID_EMAIL, _REGEX_VALID_FULLNAME, _REGEX_VALID_NUMBERS } from "./constants"

export const formatCpf = (value: string | undefined) => {
    if (value !== undefined && typeof value === 'string')
        return value
            .replace(/\D/g, '')
            .replace(/(\d{3})(\d)/, "$1.$2")
            .replace(/(\d{3})(\d)/, "$1.$2")
            .replace(/(\d{3})(\d{1,2})$/, "$1-$2")
    else return ''
}

export const formatPhone = (value: string | undefined) => {
    if (value !== undefined && typeof value === 'string') {
        value = value.replace(/\D/g, "")
        value = value.replace(/^(\d{2})(\d)/g, "($1) $2")
        value = value.replace(/(\d)(\d{4})$/, "$1-$2")
        return value
    } else return ''
}

export const formatPostalCode = (value: string | undefined) => {
    if (value !== undefined && typeof value === 'string')
        return value
            .replace(/\D/g, '')
            .replace(/[^0-9]/g, "")
            .replace(/(\d{5})(\d{3})/, '$1-$2')
    else return ''
}

export const cleanNumberMask = (value: string | undefined) => {
    if (value !== undefined && typeof value === 'string')
        return value.replace(_REGEX_VALID_NUMBERS, "")
    else return ''
}

export const onlyNumbers = (value: string) => {
    if (value !== undefined && typeof value === 'string')
        return value.replace(_REGEX_VALID_NUMBERS, "")
    else return ''
}

export const onlyLetters = (value: string) => {
    if (value !== undefined && typeof value === 'string')
        return value.replace(_REGEX_VALID_FULLNAME, "").replace(/\s+/g, ' ')
    else return ''
}

export const formatUsername = (value: string) => {
    if (value !== undefined && typeof value === 'string')
        return value.replace(/[^0-9a-z]/g, "")
    else return ''
}

export const isEmailValid = (value: string) => {
    return _REGEX_VALID_EMAIL.test(value)
}

export const isJustNumber = (value: string) => {
    const reg = new RegExp(/^[0-9]+$/)
    return reg.test(value)
}