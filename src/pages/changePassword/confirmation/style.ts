import { Dimensions, StyleSheet } from 'react-native'

const { width } = Dimensions.get('screen')

export const changePasswdConfirmStyle = StyleSheet.create({
    safeArea: {
        flex: 1,
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        width
    },
    item: {
        flex: 0.5,
        justifyContent: 'center',
        alignItems: 'center',
    },
    image: {
        width: width / 1,
        height: width / 1.4,
        resizeMode: 'contain'
    },
    viewDetails: {
        paddingVertical: 15,
        justifyContent: 'center',
        alignItems: 'center',
        flex: 0.1
    },
    description: {
        fontSize: 18,
        color: 'color-basic-600',
        fontWeight: 'bold',
        textAlign: 'center'
    },
})