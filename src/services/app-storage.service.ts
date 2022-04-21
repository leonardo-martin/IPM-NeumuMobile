import { THEME_KEY } from '@constants/storage'
import { Theme } from '@models/Theme'
import AsyncStorage from '@react-native-async-storage/async-storage'

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

}
