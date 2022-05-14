import toast from "@helpers/toast"
import { Linking, Platform } from "react-native"

export const openMapsWithAddress = async (address: string) => {

    const company = Platform.OS === "ios" ? "apple" : "google"

    const url = `http://maps.${company}.com/maps?daddr=${encodeURIComponent(address)}`
    const supported = await Linking.canOpenURL(url)

    if (supported) {
        await Linking.openURL(url)
    } else {
        toast.danger({ message: 'Maps app não encontrado ou há um erro na URL..', duration: 3000 })
    }

}