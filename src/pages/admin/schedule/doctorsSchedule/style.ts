import { StyleSheet } from 'react-native'
import { Theme } from '@models/Theme'

export const doctorScheduleStyle = (theme: Theme) => StyleSheet.create({
    safeArea: {
        flex: 1
    },
    contentContainerScrollView: {
        flexGrow: 1
    },
    card: {
        backgroundColor: theme === 'dark' ? 'background-basic-color-2' : 'background-basic-color-1',
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
        backgroundColor: theme === 'dark' ? 'background-basic-color-2' : 'background-basic-color-1',
    },
    viewCloseIcon: {
        alignItems: 'flex-end'
    },
    viewSelect: {
        paddingTop: 30,
    },
    viewBtn: {
        paddingTop: 20
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
        lineHeight: 20,
        color: 'text-hint-color'
    },
    icon: {
        color: 'text-info-color',
    },
    iconModal: {
        color: 'text-basic-color',
    }
})