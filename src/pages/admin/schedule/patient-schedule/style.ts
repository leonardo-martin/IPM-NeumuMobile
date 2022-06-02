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
        width: '100%'
    },
    viewContent: {
        width: '90%',
        alignSelf: 'center'
    },
    backdrop: {
        backgroundColor: 'rgba(0, 0, 0, 0.5)'
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
    icon: {
        color: 'text-info-color',
    },
    daysInMonth: {
        flexDirection: 'column',
        alignItems: 'center',
        paddingVertical: 15,
    },
    daysInMonthView: {
        marginTop: 5,
        paddingVertical: 10,
        width: 40,
        borderRadius: 50,
        backgroundColor: 'color-basic-400'
    },
    daysInMonthText: {
        textAlign: 'center',
        color: 'text-hint-color',
        fontWeight: 'bold',
        fontSize: 16
    },
    daysItem: {
        paddingHorizontal: 5,
        justifyContent: 'center'
    },
    text: {
        fontWeight: 'bold',
        fontSize: 16,
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
        backgroundColor: 'color-basic-400',
        paddingHorizontal: 15,
        borderRadius: 5,
        marginRight: 5,
        marginVertical: 5
    },
    timesText: {
        fontWeight: 'bold',
        fontSize: 16,
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
        textAlign: 'center'
    },
    arrowIcon: {
        color: 'text-primary-color',
    },
    animatedContainer: {
        flexDirection: 'row',
    },
    textWithoutSelectedDate: {
        fontWeight: '100',
        fontSize: 16
    },
    textMonth: {
        fontSize: 16,
        alignSelf: 'center'
    },
    textConfirmExit: {
        textAlign: 'center',
        color: 'text-hint-color',
        fontSize: 16
    },
    contentButton: {
        marginVertical: 15,
        paddingVertical: 15,
        width: '100%',
        backgroundColor: 'color-primary-default',
        borderRadius: 6,
    },
    buttonOutline: {
        backgroundColor: 'transparent',
        borderColor: 'color-primary-default',
        borderWidth: 1
    },
    contentButtonText: {
        color: 'text-control-color',
        fontSize: 15,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    buttonTextOutline: {
        color: 'text-primary-color',
    },
    freeAlert: {
        padding: 10,
        fontSize: 14,
        paddingHorizontal: 0,
        textAlign: 'center'
    }
})