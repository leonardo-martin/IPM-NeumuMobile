import { StyleSheet } from "react-native"

export const doctorProfileStyle = StyleSheet.create({
    safeArea: {
        flex: 1,
    },
    content: {
        paddingVertical: 10,
        alignItems: 'center'
    },
    image: {
        width: 200,
        height: 200,
        marginVertical: 25,
    },
    profileName: {
        fontSize: 24,
        fontWeight: '600',
        color: 'text-primary-color',
    },
    locationContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        width: '90%'
    },
    location: {
        flexShrink: 1,
        marginVertical: 8,
        textAlign: 'center',
    },
    profileButtonsContainer: {
        flexDirection: 'row',
        marginVertical: 10,
        marginHorizontal: 20,
    },
    profileButton: {
        margin: 5,
        borderRadius: 100,
        width: 45,
        borderWidth: 1,
        borderColor: 'border-alternative-color-1'
    },
    socialsContainer: {
        flexDirection: 'row',
        width: '75%',
        marginVertical: 8,
    },
    viewAbout: {
        paddingBottom: 20,
        paddingHorizontal: 15,
        alignItems: 'center'
    },
    textAbout: {
        fontSize: 22,
        fontFamily: 'System',
        fontStyle: 'italic',
        fontWeight: '300',
        textAlign: 'center',
        color: 'text-basic-color'
    },
    divider: {
        marginBottom: 20,
        marginHorizontal: 20,
        backgroundColor: 'background-alternative-color-1'
    },
    text: {
        color: 'text-hint-color',
        fontSize: 14,
        paddingVertical: 5
    },
    checkbox: {
        margin: 2,
      },
      controlContainer: {
        borderRadius: 4,
        margin: 2,
        padding: 6,
        backgroundColor: 'color-primary-500',
      },
})