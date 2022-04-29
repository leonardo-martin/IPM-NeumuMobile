import { StyleSheet } from 'react-native'

const SPACING = 20

export const resetPasswordByTokenStyle = StyleSheet.create({
    safeArea: {
        flex: 1,
    },
    container: {
        flex: 1,
        padding: SPACING
    },
    input: {
        paddingVertical: 10
    },
    text: {
        color: 'text-basic-color',
        alignItems: 'flex-start',
        fontSize: 11,
        padding: 4
    },
    viewButton: {
        flexDirection: 'column',
    },
    button: {
        borderRadius: 50,
        marginVertical: 5
    },
    uppercase: {
        textTransform: 'uppercase'
    }
})