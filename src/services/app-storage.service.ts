import AsyncStorage from '@react-native-async-storage/async-storage'
import { Theme } from '@models/Theme'
import { THEME_KEY, TOKEN_KEY, USER_KEY } from '@constants/storage'
import { TokenModel } from '@models/TokenModel'

export class AppStorage {

    static clear = async (): Promise<void> => {
        await AsyncStorage.clear()
    }

    static setItem = async (key: string, value: string): Promise<void> => {
        await AsyncStorage.setItem(key, value)
    }

    static getItem = async (key: string): Promise<string | null> => {
        return await AsyncStorage.getItem(key)
    }

    static removeItem = async (key: string): Promise<void> => {
        await AsyncStorage.removeItem(key)
    }

    static getTheme = async (): Promise<Theme> => {
        return (await AsyncStorage.getItem(THEME_KEY)) as Theme
    }

    static setTheme = async (theme: Theme): Promise<void> => {
        await AsyncStorage.setItem(THEME_KEY, theme)
    }

    static getUserContext = async (): Promise<string | null> => {
        return await AsyncStorage.getItem(USER_KEY)
    }

    static setUserContext = async (object: TokenModel): Promise<void> => {
        await AsyncStorage.setItem(USER_KEY, JSON.stringify(object))
    }

    static getUserToken = async (): Promise<string | null> => {
        return await AsyncStorage.getItem(TOKEN_KEY)
    }

    static setUserToken = async (token: string): Promise<void> => {
        await AsyncStorage.setItem(TOKEN_KEY, token)
    }
}
