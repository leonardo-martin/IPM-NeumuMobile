import React, { FC, ReactElement } from 'react'
import {
  Layout,
  Icon,
  IconProps,
  ListItem,
  List,
  Text,
  Divider
} from '@ui-kitten/components'
import { ImageProps, StyleProp, TextStyle } from 'react-native'
import { RenderProp } from '@ui-kitten/components/devsupport'

interface Data {
  id?: string | number
  title: string
  description?: string
  accessoryLeft?: RenderProp<Partial<ImageProps>> | undefined
  onPress?: () => void
}

interface ListDataItem {
  index: number
  item: Data
}

type ListPropsComponent = {
  data: Data[]
  leftIconShow?: boolean
  rightIconShow?: boolean
  listItemStyle?: StyleProp<TextStyle>
  divider?: boolean
  multiColoredCell?: boolean | undefined
  colorCell?: string
  scrollEnabled?: boolean | undefined
}

const ListComponent: FC<ListPropsComponent> = ({
  data,
  leftIconShow,
  rightIconShow,
  listItemStyle,
  divider,
  multiColoredCell,
  colorCell,
  scrollEnabled
}): ReactElement => {
  const ForwardIcon = (props: IconProps) => (
    <Icon {...props} name="arrow-ios-forward" />
  )

  const renderItem = ({ item, index }: ListDataItem) => (
    <ListItem

      style={multiColoredCell ? [listItemStyle ? listItemStyle : undefined, {
        backgroundColor: (index % 2) !== 0 ? `${colorCell}` : '#FFFFFF'

      }] : listItemStyle ? listItemStyle : undefined}
      testID={`listItem#${index}`}
      title={evaProps => <Text {...evaProps}>{item.title}</Text>}
      description={item.description ? evaProps => <Text {...evaProps}>{item.description}</Text> : undefined}
      accessoryLeft={
        leftIconShow
          ? item.accessoryLeft
          : undefined
      }
      accessoryRight={rightIconShow ? ForwardIcon : undefined}
      onPress={item.onPress ? item.onPress : undefined}
    />
  )


  return (
    <>
      <Layout level="1">
        {divider ? <Divider /> : undefined}
        <List data={data} renderItem={renderItem} scrollEnabled={scrollEnabled} ItemSeparatorComponent={divider ? Divider : undefined} />
        {divider ? <Divider /> : undefined}
      </Layout>
    </>
  )
}

ListComponent.defaultProps = {
  leftIconShow: true,
  rightIconShow: true,
  divider: false,
  multiColoredCell: false,
  colorCell: '#F4F4F4',
  scrollEnabled: true
}

export default ListComponent
