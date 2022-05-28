import { StyleSheet } from "react-native"

export const pendingApprovalMappingProgramStyle = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 15
    },
    view: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingBottom: 15
    },
    text: {
        textAlign: 'center',
        fontSize: 14
    },
    bold: {
        fontWeight: 'bold'
    },
    contact: {
        fontStyle: 'italic'
    },
    buttonContainer: {
        alignItems: 'center',
        backgroundColor: 'text-info-color',
        borderRadius: 5
    },
    textEdit: {
        fontSize: 12,
        textTransform: 'uppercase',
        textAlign: 'center',
        padding: 10,
        color: 'text-control-color'
    },
})