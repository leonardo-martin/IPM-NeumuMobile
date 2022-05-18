import { AppInfoService } from "@services/app-info.service"
import { Platform, StatusBar, StyleSheet } from "react-native"

const model = AppInfoService.getModel()

export const detailsAboutStyle = StyleSheet.create({
    layout: {
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight :
          Platform.OS === 'ios' && (Number(model.split(' ')[1] ? model.split(' ')[1].toString() : 0) >= 11 || model.includes('iPhone X')) ? 30 : 10,
      },
    safeArea: {
        flex: 1
    },
    container: {
        paddingHorizontal: 25
    },
    heading: {
        paddingBottom: 15
    },
    blockquote: {
        flexDirection: 'row',
        borderLeftWidth: 5,
        borderStyle: 'solid',
        borderLeftColor: 'color-basic-400',
        padding: 10,
        marginTop: 6,
        marginLeft: 6
    }
})