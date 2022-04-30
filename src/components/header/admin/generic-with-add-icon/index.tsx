import { BackIcon, PlusIcon } from '@components/header/icons'
import { useNavigation } from '@react-navigation/native'
import { Layout, Text, TopNavigation, TopNavigationAction, useStyleSheet } from '@ui-kitten/components'
import React, { FC, ReactElement } from 'react'
import { headerStyle } from '../style'

interface HeaderGenericWithTitleAndAddIconProps {
    onVisible?: () => void
    title: string
    hideIcon?: boolean
}

const HeaderGenericWithTitleAndAddIcon: FC<HeaderGenericWithTitleAndAddIconProps> = ({ title = 'Title', hideIcon = false, ...props }): ReactElement => {
    const { goBack } = useNavigation<any>()
    const styles = useStyleSheet(headerStyle)

    const renderLeftIcon = () => (
        <TopNavigationAction
            icon={BackIcon}
            onPress={goBack}
        />
    )

    const renderRigthIcon = () => (
        <TopNavigationAction
            icon={PlusIcon}
            onPress={props.onVisible}
        />
    )

    return (
        <Layout level="1" style={styles.layout}>
            <TopNavigation
                alignment="center"
                title={evaProps => <Text {...evaProps}>{title}</Text>}
                accessoryLeft={renderLeftIcon}
                accessoryRight={!hideIcon ? renderRigthIcon : undefined}
            />
        </Layout>
    )
}

export default HeaderGenericWithTitleAndAddIcon
