import { StyleSheet } from "react-native"

const SPACING = 20
export const visitAddressStyle = StyleSheet.create({
    safeArea: {
        flex: 1
    },
    input: {
        paddingVertical: 5
    },
    box: {
        padding: SPACING
    },
    text: {
        color: 'text-basic-color',
        alignItems: 'flex-start',
        fontSize: 11,
        padding: 4
    },
    containerBtn: {
        alignItems: 'flex-end',
        paddingTop: 10
    },
})