import { Linking, Platform } from "react-native"

export const openMapsWithAddress = (address: string) => {

    const company = Platform.OS === "ios" ? "apple" : "google"
    Linking.openURL(`http://maps.${company}.com/maps?daddr=${encodeURIComponent(address)}`)

}