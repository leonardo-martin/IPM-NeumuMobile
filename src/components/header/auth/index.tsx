import React, { FC, ReactElement } from 'react'
import { TopNavigation, TopNavigationAction, Icon, IconProps } from '@ui-kitten/components'
import TitleNeumu from '../../titleNeumu'
import { headerStyle } from './style'
import { useNavigation } from '@react-navigation/native'

interface HeaderAuthProps {
    hasBackButton?: boolean
}

const HeaderAuth: FC<HeaderAuthProps> = ({ hasBackButton }): ReactElement => {

    const { goBack } = useNavigation()

    const BackIcon = (props: IconProps) => (
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
                        <TitleNeumu category='h5'/>
                    )}
                    accessoryLeft={renderBackAction}
                />
                :
                null}
        </>
    )
}

export default HeaderAuth