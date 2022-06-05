import { Dimensions, Platform, StyleSheet } from 'react-native'

const { width } = Dimensions.get('screen')

export const contactUsStyle = StyleSheet.create({
    safeArea: {
        flex: 1,
    },
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        flexWrap: 'wrap',
        alignContent: 'center'
    },
    icon: {
        color: 'text-control-color',
    },
    mail: {
        backgroundColor: 'color-basic-900',
    },
    instagram: {
        backgroundColor: 'color-basic-600',
    },
    youtube: {
        backgroundColor: 'color-danger-500',
    },
    linkedin: {
        backgroundColor: 'color-primary-500',
    },
    button: {
        margin: 10,
        borderRadius: 50,
        width: 15,
        borderWidth: 0
    },
    text: {
        lineHeight: 50,
        textTransform: 'uppercase',
        fontWeight: 'bold',
        fontSize: 18,
        textAlign: 'center'
    },
    image: {
        width: 50,
        height: 50,
        resizeMode: 'contain',
    },
})