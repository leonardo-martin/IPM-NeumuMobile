import { StyleSheet } from 'react-native'

export const webViewStyle = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: 'background-basic-color-1'
    },
    spinnerView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
    }
})
