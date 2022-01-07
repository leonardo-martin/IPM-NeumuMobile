import React, { FC, ReactElement } from 'react'
import { DrawerContentComponentProps } from '@react-navigation/drawer'
import { Divider, List, ListItem, Toggle, useStyleSheet } from '@ui-kitten/components'
import { ListRenderItemInfo } from 'react-native'
import { data, ItemData } from './data'
import { notificationStyle } from './style'

const NotificationScreen: FC<DrawerContentComponentProps> = ({
    navigation
}): ReactElement => {

    const styles = useStyleSheet(notificationStyle)

    const renderToggle = (props: any) => (
        <Toggle
            checked={props.item.checked}
            onChange={() => console.log('check')}
        />
    )

    const renderItem = (info: ListRenderItemInfo<ItemData>) => (
        <>
            <ListItem
                style={styles.item}
                title={info.item.title}
                accessoryRight={() => renderToggle(info)}
            />
            <Divider />
        </>
    )

    return (
        <List
            data={data}
            renderItem={renderItem}
        />
    )
}

export default NotificationScreen