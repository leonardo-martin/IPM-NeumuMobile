import { StyleSheet } from "react-native"

export const managementStyle = StyleSheet.create({
    safeArea: {
        flex: 1,
    },
    text: {
        color: 'text-basic-color',
        alignItems: 'flex-start',
        fontSize: 11,
        padding: 4
    },
    content: {
        flex: 1,
        paddingHorizontal: 15
    },
    box: {
        padding: 15,
        paddingHorizontal: 30
    },
    input: {
        paddingVertical: 10
    },
    labelBasic: {
        color: "text-hint-color",
        fontFamily: "System",
        fontSize: 12,
        fontWeight: "800",
        paddingTop: 10,
        textAlign: "left"
    },
    backdropSpinner: {
        position: 'absolute',
        flex: 1,
        zIndex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'center',
        height: '100%',
        width: '100%',
        backgroundColor: 'background-basic-color-2',
        opacity: 0.6
    },
    backdropDatepicker: {
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    contactLink: {
        color: 'color-primary-default',
        fontWeight: '600'
    }
})