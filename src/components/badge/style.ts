import { StyleSheet } from "react-native"

export const badgeStyle = StyleSheet.create({
    container: {
        backgroundColor: 'color-danger-500',
        borderRadius: 8,
        width: 16,
        height: 16,
        justifyContent: 'center',
        alignItems: 'center',
    },
    containerAbsolute: {
        position: 'absolute',
        right: -10,
        top: -6,
    },
    badgeText: {
        fontSize: 8,
        color: 'text-control-color',
        fontWeight: 'bold'
    }
})