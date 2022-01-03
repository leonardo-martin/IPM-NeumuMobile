import { PermissionsAndroid, Platform } from "react-native"

export class UserPermission {

    static getCameraPermission = async (): Promise<boolean> => {
        if (Platform.OS === 'android') {
            try {
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.CAMERA,
                    {
                        title: "Permissão de acesso a câmera",
                        message: "Para capturar uma imagem é necessário permitir o acesso. Caso não permitido, não será possível efetuar a captura através deste dispositivo.",
                        buttonPositive: "Ok"
                    }
                )

                if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                    return true
                } else {
                    return false
                }
            } catch (err) {
                return false
            }
        } else if (Platform.OS === 'ios') {
            return true
        } else return true

    }

    static getCalendarPermission = async (): Promise<boolean> => {
        if (Platform.OS === 'android') {
            try {
                const readResult = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.READ_CALENDAR,
                    {
                        title: "Permissão de leitura ao calendário",
                        message: "Para salvar o evento no calendário do seu dispositivo é necessário liberar essa permissão. Caso não permitido, não será possível salvar o evento neste dispositivo.",
                        buttonPositive: "Ok"
                    }
                )

                if (readResult === PermissionsAndroid.RESULTS.GRANTED) {

                    const writeResult = await PermissionsAndroid.request(
                        PermissionsAndroid.PERMISSIONS.WRITE_CALENDAR,
                        {
                            title: "Permissão de escrita no calendário",
                            message: "Para salvar o evento no calendário do seu dispositivo é necessário liberar essa permissão. Caso não permitido, não será possível salvar o evento neste dispositivo.",
                            buttonPositive: "Ok"
                        }
                    )

                    if (writeResult === PermissionsAndroid.RESULTS.GRANTED) {
                        return true
                    } else return false

                } else {
                    return false
                }
            } catch (err) {
                return false
            }
        } else if (Platform.OS === 'ios') {
            return true
        } else return true

    }

}
