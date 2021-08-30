import React, { FC, ReactElement } from 'react'
import {
  Layout,
  Icon,
  IconProps,
  ListItem,
  List,
  Avatar,
  Text
} from '@ui-kitten/components'
import { ImageBackground } from 'react-native'

interface Data {
  id?: string | number
  title: string
  description?: string
}

interface ListDataItem {
  index: number
  item: Data
}

type ListPropsComponent = {
  data: Data[]
  onPress?: () => void
  render: 'image' | 'icon'
  leftIconShow: boolean
  rightIconShow: boolean
}

const ListComponent: FC<ListPropsComponent> = ({
  data,
  onPress,
  leftIconShow,
  rightIconShow,
  render
}): ReactElement => {
  const PeopleIcon = (props: IconProps) => <Icon {...props} name="people" />
  const ForwardIcon = (props: IconProps) => (
    <Icon {...props} name="arrow-ios-forward" />
  )

  const renderImage = (props: any) => (
    <Avatar
      {...props}
      style={[props.style, { tintColor: null }]}
      source={require('../../../assets/profile.jpg')}
      ImageComponent={ImageBackground}
    />
  )

  const renderItem = ({ item, index }: ListDataItem) => (
    <ListItem
      testID={`listItem#${index}`}
      title={evaProps => <Text {...evaProps}>{item.title}</Text>}
      description={evaProps => <Text {...evaProps}>{item.description}</Text>}
      accessoryLeft={
        leftIconShow
          ? render === 'image'
            ? renderImage
            : PeopleIcon
          : undefined
      }
      accessoryRight={rightIconShow ? ForwardIcon : undefined}
      onPress={onPress ? onPress : undefined}
    />
  )

  return (
    <>
      <Layout level="1">
        <List data={data} renderItem={renderItem} />
      </Layout>
    </>
  )
}

export default ListComponent
