import React, { FC, ReactElement } from 'react'
import { ListRenderItemInfo, Platform, StyleProp, ViewStyle } from 'react-native'
import { List, ListItem, IconProps, Icon, ListProps, useStyleSheet } from '@ui-kitten/components'

import { useNavigation } from '@react-navigation/native'
import { listStyle } from './style'

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
    itemStyle?: StyleProp<ViewStyle>
} & ListProps

const ListComponent: FC<ListComponentProps> = ({
    data, ...props
}): ReactElement => {

    const styles = useStyleSheet(listStyle)
    const navigation = useNavigation<any>()
    const renderLeftIcon = (props: IconProps, icon?: Icons): ReactElement => (
        <Icon {...props} name={icon?.name} pack={icon?.pack} />
    )

    const renderRightIcon = (props: IconProps) => (
        <Icon {...props} name={Platform.OS === 'ios' ? 'chevron-forward-outline' : Platform.OS === 'android' ? 'arrow-forward-outline' : 'arrow-forward-outline'} pack='ionicons' />
    )

    const renderItem = (info: ListRenderItemInfo<ItemInfo>) => (
        <ListItem
            style={[styles.item, props.itemStyle]}
            title={info.item.title}
            description={info.item.description}
            accessoryRight={renderRightIcon}
            accessoryLeft={(props) => renderLeftIcon(props, info.item.icon)}
            onPress={() => info.item.route ? navigation.navigate(info.item.route) : undefined}
        />
    )

    return (
        <List
            {...props}
            data={data}
            renderItem={renderItem}
        />
    )
}

export default ListComponent