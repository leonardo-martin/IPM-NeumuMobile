import { MaterialTopTabBarProps } from '@react-navigation/material-top-tabs'
import { Tab, TabBar } from '@ui-kitten/components'
import React, { FC, ReactElement } from 'react'

const ShareInfoTabBar: FC<MaterialTopTabBarProps> = ({ navigation, state }): ReactElement => {

    const onTabSelect = (index: number): void => {
        navigation.navigate(state.routeNames[index])
    }

    const renderTab = (route: string): ReactElement => (
        <Tab
            key={route}
            title={route.toUpperCase()}
        />
    )

    return (
        <TabBar
            selectedIndex={state.index}
            onSelect={onTabSelect}>
            {state.routeNames.map(renderTab)}
        </TabBar>
    )
}

export default ShareInfoTabBar