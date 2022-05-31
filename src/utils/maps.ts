import { Linking, Platform } from 'react-native'
import Toast from 'react-native-toast-message'

export const openMapsWithAddress = async (address: string) => {

    if (address !== '') {

        const url = Platform.select({
            ios: `maps:0,0?q=${encodeURIComponent(address)}`,
            android: `geo:0,0?q=${encodeURIComponent(address)}`,
        })
        try {
            await Linking.openURL(url ?? '')
        } catch (error) {
            Toast.show({
                type: 'danger',
                text2: 'Maps app não encontrado ou há um erro na URL..',
            })
        }

    } else {
        Toast.show({
            type: 'info',
            text2: 'Nenhum endereço encontrado',
        })
    }

}