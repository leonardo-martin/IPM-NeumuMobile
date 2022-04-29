import { Platform, StyleSheet } from 'react-native'

const SPACING = 15
const AVATAR_SIZE = 50

export const searchResultStyle = StyleSheet.create({
  safeArea: {
    flex: 1
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
  viewItem: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-evenly'
  },
  inlineText: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  item: {
    flexDirection: 'row',
    padding: SPACING,
    marginBottom: SPACING,
    backgroundColor: 'background-basic-color-1',
    borderRadius: 15
  },
  avatar: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: AVATAR_SIZE,
    marginRight: SPACING / 2
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: '700'
  },
  itemDescription: {
    fontSize: 12,
    opacity: .7
  },
  itemCRM: {
    fontSize: 10,
    color: 'text-hint-color'
  },
  contentContainerList: {
    padding: SPACING,
  },
  list: {
    backgroundColor: 'transparent',
  },
  background1: {
    backgroundColor: 'background-basic-color-1'
  },
  background2: {
    backgroundColor: 'background-basic-color-2'
  },
})
