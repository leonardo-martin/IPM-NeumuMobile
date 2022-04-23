import { StyleSheet } from "react-native"

export const notesStyle = StyleSheet.create({
    safeArea: {
        flex: 1
    },
    viewTop: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    icon: {
        color: 'text-basic-color',
    },
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 10,
        paddingVertical: 5,
        alignItems: 'center'
    },
    text: {
        color: 'text-hint-color',
        fontWeight: 'bold',
    },
})