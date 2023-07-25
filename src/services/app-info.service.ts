import DeviceInfo from 'react-native-device-info'

export class AppInfoService {

  static getVersion = (): string => {
    return DeviceInfo.getVersion()
  }

  static getBuildNumber = (): string => {
    return DeviceInfo.getBuildNumber()
  }

  static getModel = (): string => {
    return DeviceInfo.getModel()
  }

  static getAppName = (): string => {
    return DeviceInfo.getApplicationName()
  }

  static isEmulator = async (): Promise<boolean> => {
    return await DeviceInfo.isEmulator()
  }

  static getSystemVersion = (): string => {
    return DeviceInfo.getSystemVersion()
  }
}
