import { Platform, StyleSheet } from 'react-native'

const SPACING = 20

export const aboutStyle = StyleSheet.create({
  safeArea: {
    flex: 1
  },
  list: {
    backgroundColor: 'background-basic-color-1'
  },
  item: {
    flexDirection: 'row',
    padding: SPACING,
    marginBottom: SPACING,
    backgroundColor: 'background-basic-color-1',
    borderRadius: 10
  },
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flex: 1,
    alignItems: 'center'
  },
  itemTextMore: {
    fontSize: 10,
    fontWeight: '600',
    textTransform: 'uppercase',
    color: 'color-info-500'
  },
  shadow: {
    ...Platform.select({
      ios: {
        shadowColor: 'background-alternative-color-1',
        shadowOffset: {
          width: 0,
          height: 5
        },
        shadowOpacity: .3,
        shadowRadius: 5,
      },
      android: {
        elevation: 5,
      }
    })
  },
  contentContainerList: {
    paddingHorizontal: SPACING,
    flex: 1
  },
  headerList: {
    paddingVertical: SPACING
  },
  containerEmpty: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textEmpty: {
    fontSize: 14,
    color: 'text-hint-color'
  },
  containerText: {
    flexDirection: 'column',
    flexShrink: 1,
    paddingEnd: 15
  },
  textId: {
    fontSize: 8,
    fontWeight: '500',
    paddingBottom: 2
  }
})