import { Dimensions, Platform, StyleSheet } from 'react-native'

const { width } = Dimensions.get('screen')

export const extraProfileStyle = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'background-basic-color-2',
  },
  contentContainer: {
    paddingVertical: 24,
  },
  profileAvatar: {
    aspectRatio: 1.0,
    height: 130,
    alignSelf: 'center',
    borderColor: 'border-alternative-color-1',
  },
  editAvatarButton: {
    aspectRatio: 1.0,
    height: 30,
    borderRadius: 24,
    position: 'absolute',
    alignSelf: 'flex-end',
    bottom: 0,
  },
  profileSetting: {
    padding: 16,
    paddingEnd: 5,
  },
  section: {
    marginTop: 24,
  },
  avatar: {
    alignSelf: 'center',
    borderWidth: 2,
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
        shadowRadius: 20,
      },
      android: {
        elevation: 5,
      }
    })
  },
  badge: {
    borderTopRightRadius: 50,
    borderBottomRightRadius: 50,
    padding: 12,
    width: width / 2
  },
  primary: {
    backgroundColor: 'color-primary-600',
  },
  containerBadge: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    paddingTop: 24,
    width: '100%'
  },
  textBadge: {
    textTransform: 'uppercase',
    color: 'text-control-color',
    fontWeight: '600',
    fontSize: 12
  }
})