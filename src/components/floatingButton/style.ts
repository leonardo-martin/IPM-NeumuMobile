import { StyleSheet } from "react-native"

export const floatingButtonStyle = StyleSheet.create({
    container: {
        alignItems: 'center',
        position: 'absolute',
    },
    menu: {
        backgroundColor: 'color-primary-default',
    },
    button: {
        position: 'absolute',
        width: 60,
        height: 60,
        borderRadius: 60 / 2,
        alignItems: 'center',
        justifyContent: 'center',
        shadowRadius: 10,
        shadowColor: 'color-primary-default',
        shadowOpacity: 0.3,
        shadowOffset: {
            height: 10,
            width: 10
        },
        elevation: 10
    },
    secondary: {
        width: 55,
        height: 55,
        borderRadius: 55 / 2,
        backgroundColor: 'text-control-color'
    },
    icon: {
        color: 'text-control-color',
        fontWeight: 'bold',
    },
    iconSecondary: {
        color: 'color-primary-default'
    }
})