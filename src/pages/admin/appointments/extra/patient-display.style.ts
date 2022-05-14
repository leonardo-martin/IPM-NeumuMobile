import { Platform, StyleSheet } from "react-native"

const SPACING = 20

export const patientDisplayStyle = StyleSheet.create({
    safeArea: {
        flex: 1
    },
    container: {
        padding: SPACING
    },
    contentContainer: {
        flex: 1
    },
    label: {
        paddingEnd: 5,
        fontWeight: 'bold',
        fontSize: 18
    },
    description: {
        
    },
    textArea: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    containerDetails: {
        flexDirection: 'column',
        alignItems: 'center',
        padding: SPACING
    },
    title: {
        flexDirection: 'row',
        justifyContent: 'center',
        paddingBottom: SPACING
    },
    card: {
        borderRadius: 15,
    },
    cardContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    menuItemLabel: {
        fontSize: 12,
        textTransform: 'uppercase',
        fontWeight: 'bold',
        color: 'color-primary-default'
    },
    shadow: {
        ...Platform.select({
          ios: {
            shadowColor: 'background-alternative-color-1',
            shadowOffset: {
              width: 0,
              height: 3
            },
            shadowOpacity: .3,
            shadowRadius: 3,
          },
          android: {
            elevation: 3,
          },
        }),
      },
})