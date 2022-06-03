import { Dimensions, Platform, StyleSheet } from 'react-native'

const { width } = Dimensions.get('screen')

export const contactUsStyle = StyleSheet.create({
    safeArea: {
        flex: 1,
    },
    container: {
        flex: 1,
        alignItems: 'center',
        padding: 25,
        justifyContent: 'center',
        flexWrap: 'wrap',
        alignContent: 'center'
    },
    icon: {
        color: 'text-control-color',
    },
    mail: {
        backgroundColor: 'color-basic-900',
    },
    instagram: {
        backgroundColor: 'color-basic-600',
    },
    youtube: {
        backgroundColor: 'color-danger-500',
    },
    linkedin: {
        backgroundColor: 'color-primary-600',
    },
    button: {
        margin: 15,
        borderRadius: 100,
        width: 40,
        borderWidth: 0
    },
    shadow: {
        ...Platform.select({
            ios: {
                shadowColor: 'background-alternative-color-1',
                shadowOffset: {
                    width: 0,
                    height: 5
                },
                shadowOpacity: .3,
                shadowRadius: 5,
            },
            android: {
                elevation: 5,
            }
        })
    },
    text: {
        lineHeight: 50,
        textTransform: 'uppercase',
        fontWeight: 'bold',
        fontSize: 18,
        textAlign: 'center'
    },
    image: {
        width: width / 4,
        height: width / 4,
        resizeMode: 'contain'
    },
    containerSocial: {
        paddingVertical: 15
    }
})