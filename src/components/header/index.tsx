import React, { FC, ReactElement } from 'react'
import { TopNavigation, TopNavigationAction, Icon } from '@ui-kitten/components'
import TitleNeumu from '../titleNeumu'
import { headerStyle } from './style'
import { useNavigation } from '@react-navigation/native'

interface HeaderComponentProps {
    hasBackButton?: boolean
}

const HeaderComponent: FC<HeaderComponentProps> = ({ hasBackButton }): ReactElement => {

    const { goBack } = useNavigation()

    const BackIcon = (props: any) => (
        <Icon onPress={goBack} {...props} name='arrow-back' />
    )

    const renderBackAction = () => (
        <TopNavigationAction icon={BackIcon} />
    )

    return (
        <>
            {hasBackButton ?
                <TopNavigation
                    style={headerStyle.container}
                    alignment='center'
                    title={() => (
                        <TitleNeumu />
                    )}
                    accessoryLeft={renderBackAction}
                />
                :
                null}
        </>
    )
}

export default HeaderComponent