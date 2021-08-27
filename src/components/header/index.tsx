import React, { FC, ReactElement } from 'react'
import { useState } from 'react'
import { Appbar, Menu } from 'react-native-paper'
import { useAuth } from '../../contexts/auth'
import { headerStyle } from './style'

interface HeaderComponentProps {
    title: string
    navigation?: any
    hasBackButton?: boolean
}

const HeaderComponent: FC<HeaderComponentProps> = ({ title, navigation, hasBackButton }): ReactElement => {

    const [visible, setVisible] = useState(false)
    const { signOut } = useAuth()

    const handleSignOut = () => {
        signOut()
        closeMenu()
    }

    const goBack = () => navigation?.goBack()
    const closeMenu = () => setVisible(false)
    const openMenu = () => setVisible(true)


    return (
        <Appbar
            style={headerStyle.menu}>
            {
                hasBackButton ?
                    <Appbar.BackAction
                        onPress={goBack} />
                    :
                    <Menu
                        visible={visible}
                        onDismiss={closeMenu}
                        anchor={
                            <Appbar.Action
                                icon='menu'
                                color={headerStyle.menu.color}
                                onPress={openMenu} />
                        }>
                        <Menu.Item
                            title='Logout'
                            onPress={handleSignOut} />
                    </Menu>
            }
            <Appbar.Content
                title={title} />
        </Appbar>
    )
}

export default HeaderComponent