import React, { FC, ReactElement, useEffect, useState } from 'react'
import { ListRenderItemInfo, View } from 'react-native'
import { Icon, IconProps, Input, List, useStyleSheet } from '@ui-kitten/components'
import MessageItem from './extra/message-item'
import { DrawerContentComponentProps } from '@react-navigation/drawer'
import { Message } from '@services/message.service'
import { initialMessages } from './data'
import { messagesStyle } from './style'
import { SafeAreaLayout } from '@components/safeAreaLayout'

const MessagesScreen: FC<DrawerContentComponentProps> = ({
    navigation
}): ReactElement => {
    const styles = useStyleSheet(messagesStyle)
    const [searchQuery, setSearchQuery] = useState<string>('')
    const [messages, setMessages] = useState<Message[]>(initialMessages)

    const onItemPress = (item: Message): void => {
        navigation.navigate('ChatRoom', {
            ...item
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
        <Icon {...props} name='search' pack='ionicons' size={20} />
    )

    const CloseIcon = (props: IconProps) => (
        <Icon {...props} name='close-outline' pack='ionicons' size={20} onPress={() => setSearchQuery('')} />
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
            <SafeAreaLayout style={styles.safeArea} level='1' >
                <Input
                    style={styles.input}
                    placeholder='Pesquisar'
                    onChangeText={setSearchQuery}
                    value={searchQuery}
                    autoCorrect={false}
                    autoCapitalize='none'
                    keyboardType='default'
                    accessoryLeft={SearchIcon}
                    accessoryRight={searchQuery !== '' ? CloseIcon : undefined}
                />
                <List
                    data={messages}
                    renderItem={renderItem}
                />
            </SafeAreaLayout>

        </>
    )
}

export default MessagesScreen