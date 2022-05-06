import { StyleSheet } from "react-native"

const SPACING = 20

export const patientDisplayStyle = StyleSheet.create({
    safeArea: {
        flex: 1
    },
    container: {
        padding: SPACING
    },
    contentContainer: {
        flex: 1
    },
    label: {
        paddingEnd: 5,
        fontWeight: 'bold'
    },
    description: {
    },
    textArea: {
        flexDirection: 'row',
        paddingVertical: 2
    },
    containerExams: {
        padding: SPACING
    },
    title: {
        flexDirection: 'row',
        justifyContent: 'center',
        paddingBottom: SPACING
    },
    card: {
        borderRadius: 15,
    },
    cardContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    }
})