import OneSignal, { DeviceState } from "react-native-onesignal";
import { AppInfoService } from "./app-info.service";
import { LogService } from "./log.service";

export class NotificationService {

    static logService: LogService = new LogService()

    static enablePushNotification = async (fallbackToSettingsOrHandler?: boolean | ((response: boolean) => void)) => {
        OneSignal.promptForPushNotificationsWithUserResponse(fallbackToSettingsOrHandler)
    }

    static getDeviceState = async (): Promise<DeviceState | null> => {
        if (!(await AppInfoService.isEmulator())) {
            const response = await OneSignal.getDeviceState()
            this.logService.loga(response, 'info')
            return response
        }
        else return null
    }

    static disablePushNotification = (disable: boolean = true) => {
        OneSignal.disablePush(disable)
    }

}