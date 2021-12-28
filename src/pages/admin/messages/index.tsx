import React, { FC, ReactElement, useEffect, useState } from 'react'
import { ListRenderItemInfo } from 'react-native'
import { Icon, IconProps, Input, Layout, List, useStyleSheet } from '@ui-kitten/components'
import MessageItem from './extra/message-item'
import { DrawerContentComponentProps } from '@react-navigation/drawer'
import { Message } from '@services/message.service'
import { initialMessages } from './data'
import { messagesStyle } from './style'

const MessagesScreen: FC<DrawerContentComponentProps> = ({
    navigation
}): ReactElement => {
    const styles = useStyleSheet(messagesStyle)
    const [searchQuery, setSearchQuery] = useState<string>('')
    const [messages, setMessages] = useState<Message[]>(initialMessages)

    const onItemPress = (item: Message): void => {
        // TODO
        navigation.navigate('ChatRoom', {
            username: item.profile.fullName
        })
    }

    const renderItem = (
        info: ListRenderItemInfo<Message>
    ) => (
        <MessageItem
            style={styles.item}
            message={info.item}
            onPress={() => onItemPress(info.item)}
        />
    )

    const SearchIcon = (props: IconProps) => (
        <Icon {...props} name='search' />
    )

    const CloseIcon = (props: IconProps) => (
        <Icon {...props} name='close-outline' onPress={() => setSearchQuery('')} />
    )

    const onChangeInputSearch = (value: string) => {
        if (value === '') setMessages(initialMessages)
        else setMessages(initialMessages.filter(e => e.text.toLowerCase().includes(value.toLowerCase()) || e.profile.fullName.toLowerCase().includes(value.toLowerCase())))
    }

    useEffect(() => {
        onChangeInputSearch(searchQuery)
    }, [searchQuery])

    return (
        <>
            <Layout style={styles.header} level='1'>
                <Input
                    placeholder='Pesquisar'
                    onChangeText={setSearchQuery}
                    value={searchQuery}
                    autoCorrect={false}
                    autoCapitalize='none'
                    keyboardType='default'
                    accessoryLeft={SearchIcon}
                    accessoryRight={searchQuery !== '' ? CloseIcon : undefined}
                />
            </Layout>
            <List
                style={styles.list}
                data={messages}
                renderItem={renderItem}
            />
        </>
    )
}

export default MessagesScreen