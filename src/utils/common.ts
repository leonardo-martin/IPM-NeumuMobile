export const matchMessage = (message: any) => {

    if (message != null || message != '')
        if (JSON.stringify(message).match('Cpf Already Registered') || JSON.stringify(message).match('Unauthorized')) {
            return 1
        } else if (JSON.stringify(message).match('Email Already Registered')) {
            return 2
        } else if (JSON.stringify(message).match('The provided CPF number is not a valid CPF number')) {
            return 3
        } else if (JSON.stringify(message).match('User email has not been verified')) {
            return 2
        }
    return 0
}

export const capitalizeFirstLetter = (text: string) => {

    var splitStr = text.toLowerCase().split(' ')
    for (var i = 0; i < splitStr.length; i++) {
        splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1)
    }
    return splitStr.join(' ')
}