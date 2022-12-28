import CookieManager, { Cookie } from '@react-native-cookies/cookies'

export class HttpService {

    static setCookie = async (url: string, cookie: Cookie, useWebKit?: boolean | undefined): Promise<void> => {
        await CookieManager.set(url, cookie, useWebKit)
    }

    static getAllCookies = async (useWebKit?: boolean | undefined): Promise<void> => {
        await CookieManager.getAll(useWebKit)
    }

    static getCookieByUrl = async (url: string, useWebKit?: boolean | undefined): Promise<void> => {
        await CookieManager.get(url, useWebKit)
    }

    static removeCookie = async (url: string, cookieName: string, useWebKit?: boolean | undefined): Promise<void> => {
        await CookieManager.clearByName(url, cookieName, useWebKit)
    }

    static removeAllCookies = async (useWebKit?: boolean | undefined): Promise<void> => {
        await CookieManager.clearAll(useWebKit)
    }

}
