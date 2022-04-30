import { Dimensions, StyleSheet } from 'react-native'

const { width, height } = Dimensions.get('screen')

export const confirmationScheduleStyle = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  square: {
    width: height,
    height: height,
    top: -height * .6,
    left: -height * .3,
    backgroundColor: 'color-basic-100',
    borderRadius: 86,
    position: 'absolute',
  },
  indicator: {
    position: 'absolute',
    bottom: 100,
    flexDirection: 'row'
  },
  indicatorItem: {
    height: 10,
    width: 10,
    borderRadius: 5,
    backgroundColor: 'color-basic-100',
    margin: 10,
  },
  contentItem: {
    padding: 20,
    width: width
  },
  item: {
    flex: 0.7,
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemDetails: {
    flex: 0.3,
    justifyContent: 'center',
    alignItems: 'center'
  },
  itemTitle: {
    textAlign: 'center',
    color: 'color-basic-100',
    fontWeight: '500',
    fontSize: 18,
    marginBottom: 10
  },
  itemDescription: {
    color: 'color-basic-100',
    fontWeight: '300',
    textAlign: 'center',
    fontSize: 12
  },
  image: {
    width: width / 2,
    height: width / 2,
    resizeMode: 'contain'
  },
  icon: {
    color: 'color-basic-100',
  },
  viewIcon: {
    padding: 30
  },
  contentContainerFlatList: {
    paddingBottom: 100
  },
  textClick: {
    fontSize: 12,
    color: 'text-control-color',
    textTransform: 'uppercase'
  }
})
