import Badge from '@components/badge'
import { useTheme } from '@contexts/theme'
import { useAppSelector } from '@hooks/redux'
import { Icons } from '@models/Common'
import { EUserRole } from '@models/UserRole'
import { useFocusEffect, useNavigation } from '@react-navigation/native'
import { Divider, Icon, IconProps, List, ListItem, Text, Toggle, useStyleSheet } from '@ui-kitten/components'
import React, { FC, ReactElement, useCallback, useState } from 'react'
import { ListRenderItemInfo, Platform, TouchableOpacity, View } from 'react-native'
import { patientGetAuthorizationRequests } from 'services/patient.service'
import { RootState } from 'store'
import { baseData, doctorData, patientData } from './data'
import { configurationStyle } from './style'

interface ItemInfo {
    title: string
    description: string
    icon?: Icons
    route?: string
    badge?: boolean
}

const ConfigurationScreen: FC = (): ReactElement => {

    const styles = useStyleSheet(configurationStyle)
    const { theme, toggleTheme } = useTheme()
    const { sessionUser } = useAppSelector((state: RootState) => state.auth)
    const [pendingCounter, setPendingCounter] = useState(0)
    const [data, setData] = useState<any[]>([])
    const navigation = useNavigation<any>()

    const renderLeftIcon = (props: IconProps, icon?: Icons, badge?: boolean, badgeText?: number): ReactElement => (
        <View style={icon?.pack === 'ionicons' ? { paddingRight: 5, paddingStart: 10 } : null}>
            <Icon {...props} name={icon?.name} pack={icon?.pack} />

        </View>
    )

    const renderRightIcon = (props: IconProps) => (
        <Icon {...props} name={Platform.OS === 'ios' ? 'chevron-forward-outline' : Platform.OS === 'android' ? 'arrow-forward-outline' : 'arrow-forward-outline'} pack='ionicons' />
    )

    const renderFooter = () => (
        <>
            <TouchableOpacity
                activeOpacity={1.0}
                style={styles.container}
                onPress={toggleTheme}>
                <Text
                    category='s2'>
                    {theme !== 'light' ? 'Modo Escuro' : 'Modo Claro'}
                </Text>
                <Toggle
                    checked={theme !== 'light'}
                    onChange={toggleTheme}
                />
            </TouchableOpacity>
            <Divider />
        </>
    )

    const loadBadgeCount = async () => {
        if (sessionUser?.userRole.find(e => e.id === EUserRole.patient)) {
            const res = await patientGetAuthorizationRequests({ authorized: false })
            if (res && res.data) {
                setData(res.data)
                setPendingCounter(res.data.length)
            }
        }
    }

    useFocusEffect(
        useCallback(() => {
            loadBadgeCount()
        }, [])
    )


    const renderItem = (info: ListRenderItemInfo<ItemInfo>) => (
        <ListItem
            style={styles.item}
            title={(evaProps) => (
                <View style={{ flexDirection: 'row' }}>
                    <Text {...evaProps}>{info.item.title}</Text>
                    {info.item.badge && pendingCounter > 0 && (<Badge position='relative' count={pendingCounter} />)}
                </View>
            )}
            description={info.item.description}
            accessoryRight={renderRightIcon}
            accessoryLeft={(props) => renderLeftIcon(props, info.item.icon)}
            onPress={() => info.item.route ? navigation.navigate(info.item.route, data) : undefined}
        />
    )


    return (
        <List
            data={sessionUser?.userRole.find(e => e.id === EUserRole.patient) ? patientData :
                sessionUser?.userRole.find(e => e.id === EUserRole.medicalDoctor) ? doctorData : baseData}
            renderItem={renderItem}

        //TODO! - Desabilitado para lançamento da v1
        // ListFooterComponent={renderFooter}
        />
    )
}

export default ConfigurationScreen