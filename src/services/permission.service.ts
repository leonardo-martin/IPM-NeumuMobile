import { PermissionsAndroid } from "react-native";
import { AppInfoService } from "./app-info.service";

export const requestCameraPermission = async (): Promise<boolean> => {
    try {
        const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.CAMERA,
            {
                title: "Permissão de acesso",
                message: AppInfoService.getAppName() + " gostaria de ter acesso a câmera do dispositivo ",
                buttonNeutral: "Perguntar Depois",
                buttonNegative: "Cancelar",
                buttonPositive: "OK"
            }
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            return true
        } else {
            return false
        }
    } catch (err) {
        throw err
    }
};