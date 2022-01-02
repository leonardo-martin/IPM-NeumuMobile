import React, { FC, ReactElement } from 'react'
import { ListRenderItemInfo, Platform } from 'react-native'
import { List, ListItem, IconProps, Icon } from '@ui-kitten/components'

import { listStyle } from './style'
import { useNavigation } from '@react-navigation/native'

type Icons = {
    name: string
    pack: 'ionicons' | 'eva' | 'feather' | 'font-awesome' | 'fontisto'
}

export interface ItemInfo {
    title: string
    description: string
    icon?: Icons
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
    const renderLeftIcon = (props: IconProps, icon?: Icons): React.ReactElement => (
        <Icon {...props} name={icon?.name} pack={icon?.pack} />
    )

    const renderRightIcon = (props: IconProps) => (
        <Icon {...props} name={Platform.OS === 'ios' ? 'chevron-forward-outline' : Platform.OS === 'android' ? 'arrow-forward-outline' : 'arrow-forward-outline'} pack='ionicons' />
    )

    const renderItem = (info: ListRenderItemInfo<ItemInfo>) => (
        <ListItem
            style={listStyle.item}
            title={info.item.title}
            description={info.item.description}
            accessoryRight={renderRightIcon}
            accessoryLeft={(props) => renderLeftIcon(props, info.item.icon)}
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

ListComponent.defaultProps = {
    data: [
        {
            title: 'Default',
            description: '',
            icon: {
                name: 'question-mark-outline',
                pack: 'eva'
            },
            route: ''
        }
    ]
}