import ShareInfoTabBar from '@pages/admin/configuration/share-information/extra/share-info-tabBar'
import ShareInfoTabItemScreen from '@pages/admin/configuration/share-information/extra/share-info-tabItem'
import { createMaterialTopTabNavigator, MaterialTopTabBarProps } from '@react-navigation/material-top-tabs'
import React, { FC, ReactElement } from 'react'

const TopTab = createMaterialTopTabNavigator()


const ShareInfoRoutes: FC = (): ReactElement => {

    const authorized: boolean = false

    return (
        <TopTab.Navigator initialRouteName='Pendente' tabBar={(props: MaterialTopTabBarProps) =>
            <ShareInfoTabBar {...props} />} >
            <TopTab.Screen name='Pendente' initialParams={{
                authorized: authorized
            }} component={ShareInfoTabItemScreen} />
            <TopTab.Screen name='Autorizado' initialParams={{
                authorized: !authorized
            }} component={ShareInfoTabItemScreen} />
        </TopTab.Navigator>
    )
}

export default ShareInfoRoutes
