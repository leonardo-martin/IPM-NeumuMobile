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

}
