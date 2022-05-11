import ListEmptyComponent from '@components/list/empty'
import { SafeAreaLayout } from '@components/safeAreaLayout'
import { DrawerContentComponentProps } from '@react-navigation/drawer'
import { Message } from '@services/message.service'
import { Icon, IconProps, Input, List, useStyleSheet } from '@ui-kitten/components'
import React, { FC, ReactElement, useEffect, useState } from 'react'
import { ListRenderItemInfo } from 'react-native'
import { initialMessages } from './data'
import MessageItem from './extra/message-item'
import { messagesStyle } from './style'

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
                <List
                    style={styles.list}
                    ListHeaderComponent={<Input
                        style={styles.input}
                        placeholder='Pesquisar'
                        onChangeText={setSearchQuery}
                        value={searchQuery}
                        autoCorrect={false}
                        autoCapitalize='none'
                        keyboardType='default'
                        accessoryLeft={SearchIcon}
                        accessoryRight={searchQuery !== '' ? CloseIcon : undefined}
                    />}
                    data={messages}
                    renderItem={renderItem}
                    ListEmptyComponent={<ListEmptyComponent />}
                    contentContainerStyle={{ flex: 1 }}
                />
            </SafeAreaLayout>

        </>
    )
}

export default MessagesScreen