import { Platform, StyleSheet } from "react-native";

const SPACING = 15

export const detailsStyle = StyleSheet.create({
    safeArea: {
        flex: 1
    },
    badge: {
        borderRadius: 50,
        padding: 8
    },
    success: {
        backgroundColor: 'color-success-400',
    },
    danger: {
        backgroundColor: 'color-danger-500',
    },
    textBadge: {
        color: 'text-control-color',
        fontSize: 16,
        textTransform: 'uppercase',
        fontWeight: '600',
        textAlign: 'center'
    },
    id: {
        textAlign: 'center',
        paddingVertical: 10,
        fontSize: 24,
        fontWeight: 'bold',
        textTransform: 'lowercase'
    },
    card: {
        margin: 2,
        marginBottom: SPACING
    },
    cardContainer: {
        padding: SPACING,
    },
    divider: {
        marginVertical: SPACING
    },
    statusContainer: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    text: {
        fontSize: 14,
        fontWeight: '600',
        color: 'text-hint-color'
    },
    error: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: SPACING,
    },
    errorText: {
        fontSize: 16,
        fontWeight: '400',
        color: 'text-hint-color',
        textAlign: 'center'
    },
    label: {
        fontWeight: '700',
        textTransform: 'uppercase',
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
})