import { Platform, StyleSheet } from "react-native";

const SPACING = 15

export const appointmentStyle = StyleSheet.create({
    item: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'space-between',
        backgroundColor: 'background-basic-color-1',
        borderRadius: SPACING,
        padding: SPACING,
        marginVertical: SPACING,
        marginRight: SPACING
    },
    itemTitle: {
        fontSize: 12,
        fontWeight: 'bold'
    },
    containerItem: {
        flexDirection: 'row',
        padding: 5,
        paddingStart: 0
    },
    username: {
        textTransform: 'capitalize',
        fontWeight: '400',
        fontSize: 16,
        flexShrink: 1
    },
    emptyDate: {
        height: SPACING,
        flex: 1,
        paddingTop: 30
    },
    text: {
        paddingHorizontal: 1,
        color: 'text-hint-color',
        fontSize: 14
    },
    shadow: {
        ...Platform.select({
            ios: {
                shadowColor: 'background-alternative-color-1',
                shadowOffset: {
                    width: 0,
                    height: 10
                },
                shadowOpacity: .3,
                shadowRadius: 20,
            },
            android: {
                elevation: 10,
            }
        })
    },
    button: {
        borderRadius: 50,
        padding: 8
    },
    approval: {
        backgroundColor: 'color-success-400',
    },
    cancel: {
        backgroundColor: 'color-danger-500',
    },
    textButton: {
        color: 'text-control-color',
        fontSize: 12,
        textTransform: 'uppercase',
        fontWeight: '600',
        textAlign: 'center'
    },
    title: {
        textAlign: 'center',
        fontSize: 12,
        fontWeight: '400',
        textTransform: 'uppercase',
        color: 'text-hint-color'
    }
})