import React from 'react';
import { useState } from 'react';
import { Appbar, Menu } from 'react-native-paper';
import { headerStyle } from './header.style';

interface HeaderComponentParams {
    title: string;
    navigation?: any;
    hasBackButton? : boolean;
}

export const HeaderComponent = (props: HeaderComponentParams) => {

    const [visible, setVisible] = useState(false);

    const goBack = () => props.navigation?.goBack();
    const closeMenu = () => setVisible(false);
    const openMenu = () => setVisible(true);

    const logout = () => {
        props.navigation?.navigate("Login")
        closeMenu();
    }

     
    return (
        <Appbar
        style={headerStyle.menu}>
            {
                props.hasBackButton ?
                <Appbar.BackAction
                    onPress={goBack}/>
                :
                <Menu
                    visible={visible}
                    onDismiss={closeMenu}
                    anchor={
                        <Appbar.Action
                            icon="menu"
                            color={headerStyle.menu.color}
                            onPress={openMenu}/>
                    }>
                    <Menu.Item
                        title="Logout"
                        onPress={logout}/>
                </Menu>
            }
            <Appbar.Content
                title={props.title} />
        </Appbar>
    )
}