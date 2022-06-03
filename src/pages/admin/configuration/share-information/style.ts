import { StyleSheet } from "react-native"

export const shareStyle = StyleSheet.create({
    safeArea: {
        flex: 1
    },
    container: {
        padding: 15
    },
    title: {
        textAlign: 'center',
        fontSize: 16,
        fontWeight: 'bold',
        paddingBottom: 15,
        textTransform: 'uppercase'
    },
    message: {
        textAlign: 'center',
        color: 'text-hint-color',
        fontStyle: 'italic',
        fontSize: 14,
        lineHeight: 25
    }
})