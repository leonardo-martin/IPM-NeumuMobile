export const validateCNS = (text: string | undefined) => {
    if (text !== undefined) {
        let cns = text.replace(/\D/g, '')

        if (cns.length < 15) {
            return false
        }

        if (['1', '2'].includes(cns[0])) {
            const pis = cns.substr(0, 11)
            const sum = pis.split('').reduce((total: any, value: any, index: number) => total + (value * (15 - index)), 0)
            const rest = sum % 11
            const digit = rest === 0 ? 0 : 11 - rest
            const result = digit === 10 ? `${pis}001${(11 - ((sum + 2) % 11))}` : `${pis}000${digit}`
            if (result === cns) {
                return true
            }
        }

        if (['7', '8', '9'].includes(cns[0])) {
            const sum = cns.split('').reduce((total: any, value: any, index: number) => total + (value * (15 - index)), 0)
            const result = sum % 11 === 0
            if (result) {
                return true
            }
        }
    }
    return false
}

export const validatePasswd = (value: string) => {
    const regExp = new RegExp(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[$*&@#])[0-9a-zA-Z$*&@#]{8,}$/)
    return regExp.test(value)
}