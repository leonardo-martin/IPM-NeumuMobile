import { StyleService } from "@ui-kitten/components";

export const doctorProfileStyle = StyleService.create({
    container: {
        flex: 1,
        backgroundColor: 'background-basic-color-2',
    },
    header: {
        paddingVertical: 24,
        alignItems: 'center',
    },
    profileAvatar: {
        width: 124,
        height: 124,
        borderRadius: 62,
        marginVertical: 16,
    },
    profileName: {
        zIndex: 1,
    },
    locationContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    location: {
        marginVertical: 8,
    },
    profileButtonsContainer: {        
        flexDirection: 'row',
        marginVertical: 32,
        marginHorizontal: 20,
    },
    profileButton: {
        flex: 1,
        marginHorizontal: 4,
    },
    socialsContainer: {
        flexDirection: 'row',
        width: '75%',
        marginVertical: 8,
    },
    profileSocial: {
        flex: 1,
    },
    sectionLabel: {
        marginTop: 24,
        marginBottom: 8,
        marginHorizontal: 16,
    },
    profileDescription: {
        marginHorizontal: 16,
    },
    friendsList: {
        marginHorizontal: 8,
    },
    friendItem: {
        alignItems: 'center',
        marginHorizontal: 8,
    },
    friendName: {
        marginTop: 8,
    },
    postItem: {
        flex: 1,
        aspectRatio: 1.0,
    },
})