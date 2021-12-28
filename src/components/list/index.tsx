import React, { FC, ReactElement } from 'react'
import { ListRenderItemInfo } from 'react-native'
import { List, ListItem, IconProps, Icon } from '@ui-kitten/components'

import { listStyle } from './style'
import { useNavigation } from '@react-navigation/native'

export interface ItemInfo {
    title: string
    description: string
    iconName?: string
    route?: string
}

type ListComponentProps = {
    data: ItemInfo[]
    ListHeaderComponent?: () => JSX.Element
    ListFooterComponent?: () => JSX.Element
}

const ListComponent: FC<ListComponentProps> = ({
    data, ListFooterComponent: renderFooter, ListHeaderComponent: renderHeader
}): ReactElement => {

    const navigation = useNavigation<any>()
    const renderLeftIcon = (props: IconProps, name: string): React.ReactElement => (
        <Icon {...props} name={name} color={'#000'} />
    )

    const renderRightIcon = (props: IconProps) => (
        <Icon {...props} name="arrow-ios-forward" color={'#000'} />
    )

    const renderItem = (info: ListRenderItemInfo<ItemInfo>) => (
        <ListItem
            style={listStyle.item}
            title={info.item.title}
            description={info.item.description}
            accessoryRight={renderRightIcon}
            accessoryLeft={(props) => renderLeftIcon(props, info.item.iconName ? info.item.iconName : '')}
            onPress={() => info.item.route ? navigation.navigate(info.item.route) : undefined}
        />
    )

    return (
        <List
            data={data}
            renderItem={renderItem}
            ListFooterComponent={renderFooter ? renderFooter : undefined}
            ListHeaderComponent={renderHeader ? renderHeader : undefined}
        />
    )
}

export default ListComponent