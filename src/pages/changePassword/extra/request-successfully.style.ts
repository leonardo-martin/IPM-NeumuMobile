import { Dimensions, StyleSheet } from 'react-native'

const { width } = Dimensions.get('screen')

export const passwordRequestSuccessStyle = StyleSheet.create({
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
        justifyContent: 'center',
        alignItems: 'center',
    },
    image: {
        width: width / 1,
        height: width / 1.4,
        resizeMode: 'contain'
    },
    title: {
        paddingVertical: 15,
    },
    viewDetails: {
        paddingVertical: 15,
    },
    description: {
        color: 'text-hint-color',
        fontWeight: '600',
        textAlign: 'center'
    },
    message: {
        color: 'text-hint-color',
        textAlign: 'center'
    },
    boldText: {
        color: 'color-primary-default',
        fontWeight: '600',
        textAlign: 'center'
    }
})