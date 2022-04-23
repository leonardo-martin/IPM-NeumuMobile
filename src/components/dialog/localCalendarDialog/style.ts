import { StyleSheet } from "react-native"

export const localCalendarModalStyle = StyleSheet.create({
    container: {
        flex: 1,
    },
    modal: {
        width: '90%',
    },
    title: {
        fontWeight: 'bold'
    },
    backdrop: {
        flex: 1,
        padding: '5%',
        justifyContent: 'center',
        backgroundColor: 'rgba(0,0,0,0.7)',
    },
    radio: {
        margin: 2,
        paddingVertical: 5
    },
    radioText: {
        fontSize: 16
    },
    headerModal: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 10
    },
    icon: {
        color: 'text-basic-color'
    },
    text: {
        fontStyle: 'normal',
        fontWeight: 'bold'
    }
})