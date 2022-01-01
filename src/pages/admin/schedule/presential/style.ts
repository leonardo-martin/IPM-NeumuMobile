import { StyleSheet } from 'react-native'

export const doctorScheduleStyle = StyleSheet.create({
    safeArea: {
        flex: 1
    },
    contentContainerScrollView: {
        flexGrow: 1
    },
    container: {
        flex: 1,
        alignItems: 'center',
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
        height: '100%',
        backgroundColor: 'background-basic-color-2',
    },
    viewCloseIcon: {
        alignItems: 'flex-end'
    },
    viewSelect: {
        paddingTop: 30,
    },
    viewBtn: {
        paddingVertical: 30
    },
    btnToSchedule: {
        borderRadius: 50
    },
    textDoctorInfo: {
        flexShrink: 1,
        flexWrap: 'wrap',
        width: '60%'
    },
    viewLocation: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    textLocation: {
        alignItems: 'center',
        color: 'text-info-color'
    },
    footerCard: {
        alignSelf: 'flex-end',
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
        fontSize: 20,
        padding: 5,
        color: 'text-hint-color'
    },
    icon: {
        color: 'text-info-color',
    },
    iconModal: {
        color: 'text-basic-color',
    },
    daysInMonth: {
        flexDirection: 'column',
        alignItems: 'center',
        paddingVertical: 15,
    },
    daysInMonthView: {
        marginTop: 5,
        padding: 10,
        borderRadius: 20,
        backgroundColor: 'color-basic-400'
    },
    daysInMonthText: {
        textAlign: 'center',
        color: 'text-hint-color',
        fontWeight: 'bold',
        fontSize: 16
    },
    daysItem: {
        padding: 5,
        justifyContent: 'center'
    },
    text: {
        fontWeight: 'bold',
        fontSize: 20,
        textAlign: 'center',
        color: 'text-basic-color',
        paddingVertical: 15
    },
    timesContainer: {
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center'
    },
    timesCard: {
        width: 80,
        backgroundColor: 'color-basic-400',
        paddingHorizontal: 15,
        borderRadius: 5,
        marginRight: 5,
        marginVertical: 5
    },
    timesText: {
        fontWeight: 'bold',
        fontSize: 20,
        textAlign: 'center',
        color: 'text-basic-color',
        paddingVertical: 5,
    },
    monthContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: 'background-basic-color-4',
        width: '100%',
        paddingVertical: 5,
        paddingHorizontal: 5,
        borderRadius: 30,
    },
    arrowIcon: {
        color: 'text-primary-color',
    },
    animatedContainer: {
        flexDirection: 'row',
    }
})