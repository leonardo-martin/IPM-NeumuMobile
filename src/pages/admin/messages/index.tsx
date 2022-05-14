import ListEmptyComponent from '@components/list/empty'
import { SafeAreaLayout } from '@components/safeAreaLayout'
import toast from "@helpers/toast"
import { ChatListEntryDto } from '@models/ChatMessage'
import { DrawerContentComponentProps } from '@react-navigation/drawer'
import { useFocusEffect } from '@react-navigation/native'
import { getChatList } from '@services/chat-message.service'
import { Icon, IconProps, Input, List, Spinner, useStyleSheet } from '@ui-kitten/components'
import React, { FC, ReactElement, useCallback, useEffect, useState } from 'react'
import { ListRenderItemInfo, RefreshControl, View } from 'react-native'
import MessageItem from './extra/message-item'
import { messagesStyle } from './style'

const MessagesScreen: FC<DrawerContentComponentProps> = ({
    navigation
}): ReactElement => {
    const styles = useStyleSheet(messagesStyle)
    const [searchQuery, setSearchQuery] = useState<string>('')
    const [messages, setMessages] = useState<ChatListEntryDto[]>([])
    const [messagesTmp, setMessagesTmp] = useState<ChatListEntryDto[]>([])
    const [refreshing, setRefreshing] = useState<boolean>(false)
    const [isLoading, setIsLoading] = useState<boolean>(false)

    const onItemPress = (item: ChatListEntryDto): void => {
        navigation.navigate('ChatRoom', {
            ...item
        })
    }

    const renderItem = (
        info: ListRenderItemInfo<ChatListEntryDto>
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
        if (value === '') setMessages(messagesTmp)
        else setMessages(messagesTmp.filter(e => (e.payload.split(' ').slice(2, e.payload.length).join(' ') ?? '').toLowerCase().includes(value.toLowerCase()) || e.receiverName.toLowerCase().includes(value.toLowerCase())))
    }

    useEffect(() => {
        onChangeInputSearch(searchQuery)
    }, [searchQuery])

    const loadChat = useCallback(async () => {
        try {
            const response = await getChatList()
            if (response.status === 200) {
                setMessages(response.data)
                setMessagesTmp(response.data)
                if (refreshing) {
                    toast.success({ message: 'Atualizado com sucesso!', duration: 3000 })
                }
            } else {
                toast.warning({ message: 'Erro ao carregar as mensagens.', duration: 3000 })
            }
        } catch (error) {
            toast.danger({ message: 'Erro ao carregar as mensagens.', duration: 3000 })
        } finally {
            setRefreshing(false)
            setIsLoading(false)
        }
    }, [refreshing])

    useEffect(() => {
        if (refreshing) loadChat()
    }, [refreshing])

    useFocusEffect(
        useCallback(() => {
            setIsLoading(true)
            loadChat()
        }, [])
    )


    return (
        <>
            <SafeAreaLayout style={styles.safeArea} level='1'>
                {!isLoading ?
                    <List
                        showsVerticalScrollIndicator={false}
                        style={styles.list}
                        ListHeaderComponent={
                            <Input
                                disabled={messages.length === 0}
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
                        ListEmptyComponent={<ListEmptyComponent message='Nenhuma mensagem encontrada' />}
                        contentContainerStyle={{ flex: 1 }}
                        refreshControl={
                            <RefreshControl
                                refreshing={refreshing}
                                onRefresh={() => setRefreshing(true)}
                            />
                        }
                    /> : (
                        <>
                            <View style={{
                                flex: 1, justifyContent: 'center', alignItems: 'center'
                            }}>
                                <Spinner size='giant' />
                            </View>
                        </>

                    )}
            </SafeAreaLayout>

        </>
    )
}

export default MessagesScreen