import React, { FC, ReactElement } from 'react'
import {
  Icon,
  IconProps,
  ListItem,
  List,
  Text,
  Divider
} from '@ui-kitten/components'
import { ImageProps, ListRenderItemInfo } from 'react-native'
import { RenderProp } from '@ui-kitten/components/devsupport'

interface Data {
  id?: string | number
  title: string
  description?: string
  accessoryLeft?: RenderProp<Partial<ImageProps>> | undefined
  onPress?: () => void
}

type ListComponentWithAvatarProps = {
  data: Data[]
  leftIconShow?: boolean
  rightIconShow?: boolean
  divider?: boolean
  scrollEnabled?: boolean | undefined
}

const ListComponentWithAvatar: FC<ListComponentWithAvatarProps> = ({
  data,
  leftIconShow,
  rightIconShow,
  divider,
  scrollEnabled
}): ReactElement => {
  const ForwardIcon = (props: IconProps) => (
    <Icon {...props} name="arrow-ios-forward" />
  )

  const renderItem = (info: ListRenderItemInfo<Data>) => (
    <ListItem
      testID={`listItem#${info.index}`}
      title={evaProps => <Text {...evaProps}>{info.item.title}</Text>}
      description={info.item.description ? evaProps => <Text {...evaProps}>{info.item.description}</Text> : undefined}
      accessoryLeft={
        leftIconShow
          ? info.item.accessoryLeft
          : undefined
      }
      accessoryRight={rightIconShow ? ForwardIcon : undefined}
      onPress={info.item.onPress ? info.item.onPress : undefined}
    />
  )


  return (
    <>
      {divider ? <Divider /> : undefined}
      <List data={data} renderItem={renderItem} scrollEnabled={scrollEnabled} ItemSeparatorComponent={divider ? Divider : undefined} />
      {divider ? <Divider /> : undefined}
    </>
  )
}

ListComponentWithAvatar.defaultProps = {
  leftIconShow: true,
  rightIconShow: true,
  divider: false,
  scrollEnabled: true
}

export default ListComponentWithAvatar
