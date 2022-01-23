import { StyleSheet } from "react-native"

export const doctorProfileStyle = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'background-basic-color-1',
    },
    header: {
        paddingVertical: 10,
        alignItems: 'center'
    },
    image: {
        width: 200,
        height: 200,
        marginVertical: 25,
    },
    profileName: {
        zIndex: 1,
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
        paddingHorizontal: 15
    },
    textAbout: {
        fontSize: 22,
        fontFamily: 'System',
        fontStyle: 'italic',
        fontWeight: '100',
        textAlign: 'center',
        color: 'text-basic-color'
    },
    divider: {
        marginBottom: 20, 
        marginHorizontal: 20, 
        backgroundColor: 'background-alternative-color-1'
    }
})