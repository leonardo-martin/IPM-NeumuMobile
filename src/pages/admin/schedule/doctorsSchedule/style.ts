import { StyleSheet } from 'react-native'

export const doctorScheduleStyle = StyleSheet.create({
    scrollView: {
        backgroundColor: '#FAFAFA'
    },
    contentContainerScrollView: {
        flexGrow: 1
    },
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: '#FAFAFA',
        paddingBottom: 10,
        width: '100%'
    },
    viewContent: {
        width: '90%',
        alignSelf: 'center'
    },
    backdrop: {
        backgroundColor: 'rgba(0, 0, 0, 0.5)'
    },
    modalContainer: {
        width: '90%',
        height: '30%'
    },
    modalContainerError: {
        width: '90%',
    },
    viewDoctorProfile: {
        justifyContent: 'flex-start',
        alignContent: 'flex-start',
        flexDirection: 'row',
        alignItems: 'center'
    },
    viewCalendar: {
        paddingTop: 30,
        justifyContent: 'center'
    },
    avatarDoctor: {
        padding: 60,
        borderRadius: 60,
        marginRight: 10
    },
    cardContainer: {
        height: '100%'
    },
    viewCloseIcon: {
        alignItems: 'flex-end'
    },
    viewSelect: {
        paddingTop: 30
    },
    viewBtn: {
        paddingTop: 20
    },
    btnToSchedule: {
        borderRadius: 50
    },
    textDoctorInfo: {
        color: '#626262',
        flexShrink: 1,
        flexWrap: 'wrap',
        width: '60%'     
    },
    viewLocation: {
        flexDirection: 'row'
    },
    textLocation: {
        alignItems: 'center'
    },
    footerCard: {
        alignSelf: 'flex-end',
        paddingRight: 5
    },
    textError: {
        paddingVertical: 20,
        textAlign: 'center',
        flexWrap: 'wrap'
    },
    viewConfirmButtonModal: {
        paddingVertical: 5
    },
    textConfirmModal: {
        flexShrink: 1,
        flexWrap: 'wrap',
        textAlign: 'center',
        lineHeight: 20,
        color: '#626262'
    }
})