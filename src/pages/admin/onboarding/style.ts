import { StyleSheet } from "react-native"

export const onboardingStyles = StyleSheet.create({
    safeArea: {
        flex: 1
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column'
    },
    skipContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        padding: 20
    },
    indicator: {
        position: 'absolute',
        bottom: 80,
        flexDirection: 'row'
    },
    indicatorItem: {
        height: 10,
        width: 10,
        borderRadius: 5,
        backgroundColor: 'color-primary-default',
        margin: 10,
    },
    textTop: {
        fontWeight: '300',
        fontSize: 14,
        textAlign: 'center',
        fontFamily: 'System',
        color: 'text-hint-color'
    }
})