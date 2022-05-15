import { Icons } from '@models/Common'
import { useNavigation } from '@react-navigation/native'
import { Icon, IconProps, List, ListItem, ListProps, useStyleSheet } from '@ui-kitten/components'
import React, { FC, ReactElement } from 'react'
import { ListRenderItemInfo, Platform, StyleProp, View, ViewStyle } from 'react-native'
import { listStyle } from './style'

export interface ItemInfo {
    title: string
    description: string
    icon?: Icons
    route?: string
    badge?: boolean
}

interface ListComponentProps extends Omit<ListProps, 'renderItem'> {
    data: ItemInfo[]
    itemStyle?: StyleProp<ViewStyle>
}

const ListComponent: FC<ListComponentProps> = ({
    data, itemStyle, ...props
}): ReactElement => {

    const styles = useStyleSheet(listStyle)
    const navigation = useNavigation<any>()
    const renderLeftIcon = (props: IconProps, icon?: Icons): ReactElement => (
        <View style={icon?.pack === 'ionicons' ? { paddingRight: 5, paddingStart: 10 } : null}>
            <Icon {...props} name={icon?.name} pack={icon?.pack} />
        </View>
    )

    const renderRightIcon = (props: IconProps) => (
        <Icon {...props} name={Platform.OS === 'ios' ? 'chevron-forward-outline' : Platform.OS === 'android' ? 'arrow-forward-outline' : 'arrow-forward-outline'} pack='ionicons' />
    )

    const renderItem = (info: ListRenderItemInfo<ItemInfo>) => (
        <ListItem
            style={[styles.item, itemStyle]}
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