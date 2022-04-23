import { StyleSheet } from 'react-native'

export const infoAppStyle = StyleSheet.create({
    safeArea: {
        flex: 1,
    },
    text: {
        fontSize: 18,
        paddingVertical: 5
    },
    container: {
        flexDirection: 'column',
        alignItems: 'center',
        paddingVertical: 20,
        justifyContent: 'center'
    },
    about: {
        textAlign: 'center',
        paddingVertical: 15,
        fontSize: 18
    },
    motivationalMessage: {
        textAlign: 'center',
        paddingTop: 15,
        paddingVertical: 5,
        fontStyle: 'italic',
        fontWeight: '300',
        fontSize: 12
    },
    regards: {
        fontWeight: 'bold',
        fontSize: 12
    }
})