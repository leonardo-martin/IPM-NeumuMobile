import { StyleSheet } from "react-native"

export const mappingStyle = StyleSheet.create({
    safeArea: {
        flex: 1
    },
    container: {
        paddingHorizontal: 25
    },
    subContainer: {
        paddingTop: 15,
    },
    title: {
        fontSize: 14,
        fontWeight: 'bold',
        paddingVertical: 10,
        textTransform: 'uppercase',
        textAlign: 'center'
    },
    radioGroup: {
        flexDirection: 'row',
        justifyContent: 'center',
        paddingVertical: 15
    },
    radio: {
        paddingHorizontal: 20
    },
    question: {
        fontSize: 18,
        fontWeight: '500',
        textAlign: 'center'
    },
    text: {
        paddingVertical: 5,
        textAlign: 'justify'
    },
    textConfirmModalize: {
        textAlign: 'center',
        color: 'text-hint-color',
        fontSize: 20,
        marginVertical: 10
    },
    contentButton: {
        marginVertical: 15,
        paddingVertical: 15,
        width: '100%',
        backgroundColor: 'color-primary-default',
        borderRadius: 6,
    },
    buttonOutline: {
        backgroundColor: 'transparent',
        borderColor: 'color-primary-default',
        borderWidth: 1
    },
    contentButtonText: {
        color: 'text-control-color',
        fontSize: 15,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    buttonTextOutline: {
        color: 'text-primary-color',
    },
    viewLabel: {
        padding: 5
    },
    input: {
        paddingVertical: 10,
        paddingHorizontal: 5
    },
    labelTitle: {
        color: "text-hint-color",
        fontFamily: "System",
        fontSize: 12,
        fontWeight: "800",
        paddingTop: 10,
        textAlign: 'justify',
    },
    containerBtn: {
        paddingVertical: 15,
        alignItems: 'center'
    }
})