import { StyleSheet } from "react-native"
import { Theme } from "@models/Theme"

export const calendarStyles = (theme: Theme) => StyleSheet.create({
    container: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    calendar: {
        borderWidth: 0.5,
        width: '100%',
        backgroundColor: theme === 'dark' ? 'background-basic-color-2' : 'background-basic-color-1',
    }
})