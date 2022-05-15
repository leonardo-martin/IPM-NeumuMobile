import { Linking, Platform } from 'react-native'
import Toast from 'react-native-toast-message'

export const openMapsWithAddress = async (address: string) => {

    const company = Platform.OS === "ios" ? "apple" : "google"

    const url = `http://maps.${company}.com/maps?daddr=${encodeURIComponent(address)}`
    const supported = await Linking.canOpenURL(url)

    if (supported) {
        await Linking.openURL(url)
    } else {
        Toast.show({
            type: 'danger',
            text2: 'Maps app não encontrado ou há um erro na URL..',
        })
    }

}