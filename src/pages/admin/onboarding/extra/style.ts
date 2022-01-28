import { StyleSheet } from "react-native"

export const onboardingItemStyles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    image: {
        flex: 0.7,
        justifyContent: 'center'
    },
    title: {
        fontWeight: '800',
        fontSize: 28,
        marginBottom: 10,
        textAlign: 'center',
    },
    description: {
        fontWeight: '300',
        textAlign: 'center',
        paddingHorizontal: 64
    },
    view: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    icon: {
        color: 'text-basic-color',
        textAlign: 'center',
        alignItems: 'center',
    }
})