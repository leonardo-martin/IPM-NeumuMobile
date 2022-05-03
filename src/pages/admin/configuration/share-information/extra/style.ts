import { Platform, StyleSheet } from 'react-native'

const SPACING = 15

export const shareInfoTabItemStyle = StyleSheet.create({
  safeArea: {
    flex: 1
  },
  contentStyle: {
    padding: SPACING
  },
  viewItem: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  item: {
    flexDirection: 'row',
    padding: SPACING,
    marginBottom: SPACING,
    backgroundColor: 'background-basic-color-1',
    borderRadius: 15
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: '700',
    textTransform: 'uppercase'
  },
  description: {
    fontSize: 12,
    color: 'text-hint-color',
  },
  shadow: {
    ...Platform.select({
      ios: {
        shadowColor: 'background-alternative-color-1',
        shadowOffset: {
          width: 0,
          height: 10
        },
        shadowOpacity: .3,
        shadowRadius: 20,
      },
      android: {
        elevation: 10,
      }
    })
  },
  textApproval: {
    color: 'text-control-color',
    fontSize: 14,
    textTransform: 'uppercase',
    fontWeight: '600'
  },
  buttonApproval: {
    backgroundColor: 'color-success-400',
    borderRadius: 50,
    padding: 8
  }
})
