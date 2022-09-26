import EmptyComponent from '@components/empty'
import HeaderWithAddIcon from '@components/header/admin/generic-with-add-icon'
import { SafeAreaLayout } from '@components/safeAreaLayout'
import { useAppDispatch, useAppSelector } from '@hooks/redux'
import { ChatListEntryDto } from '@models/ChatMessage'
import { useFocusEffect, useNavigation } from '@react-navigation/native'
import { getChatList } from '@services/chat-message.service'
import { setChatList } from '@store/ducks/chat'
import { Divider, Icon, IconProps, Input, List, Spinner, useStyleSheet } from '@ui-kitten/components'
import React, { FC, ReactElement, useCallback, useEffect, useState } from 'react'
import { ListRenderItemInfo, RefreshControl, View } from 'react-native'
import Toast from 'react-native-toast-message'
import { RootState } from 'store'
import MessageItem from './extra/message-item'
import { messagesStyle } from './style'

const MessagesScreen: FC = (): ReactElement => {
    const navigation = useNavigation<any>()
    const styles = useStyleSheet(messagesStyle)
    const [searchQuery, setSearchQuery] = useState<string>('')
    const [messagesList, setMessagesList] = useState<ChatListEntryDto[]>([])
    const [refreshing, setRefreshing] = useState<boolean>(false)
    const [isLoading, setIsLoading] = useState<boolean>(false)

    const dispatch = useAppDispatch()
    const { messages } = useAppSelector((state: RootState) => state.chat)

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
        if (value === '') setMessagesList(messages)
        else setMessagesList(messages.filter(e => e.senderName.toLowerCase().includes(value.toLowerCase())))
    }

    useEffect(() => {
        onChangeInputSearch(searchQuery)
    }, [searchQuery])

    const loadChat = useCallback(async () => {
        try {
            const response = await getChatList()
            if (response.status === 200) {
                setMessagesList(response.data)
                dispatch(setChatList(response.data))
                if (refreshing) {
                    Toast.show({
                        type: 'success',
                        text2: 'Mensagens atualizadas',
                    })
                }
            } else {
                Toast.show({
                    type: 'danger',
                    text2: 'Erro ao carregar as mensagens',
                })
            }
        } catch (error) {
            Toast.show({
                type: 'danger',
                text2: 'Erro ao carregar as mensagens',
            })
        } finally {
            setRefreshing(false)
            setIsLoading(false)
        }
    }, [refreshing])

    useEffect(() => {
        if (refreshing) loadChat()
    }, [refreshing])

    useEffect(() => {
        setIsLoading(true)
        loadChat()
    }, [])

    useFocusEffect(
        useCallback(() => {
            setMessagesList(messages)
        }, [messages])
    )


    return (
        <>
            <HeaderWithAddIcon
                title='Mensagens'
                hideIcon />
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
                        data={messagesList}
                        renderItem={renderItem}
                        ListEmptyComponent={<EmptyComponent message='Nenhuma mensagem encontrada' />}
                        contentContainerStyle={{ flex: 1 }}
                        refreshControl={
                            <RefreshControl
                                refreshing={refreshing}
                                onRefresh={() => setRefreshing(true)}
                            />
                        }
                        ItemSeparatorComponent={() => <Divider />}
                    /> : (
                        <>
                            <View style={{
                                flex: 1, justifyContent: 'center', alignItems: 'center'
                            }}>
                                <Spinner status='primary' size='giant' />
                            </View>
                        </>

                    )}
            </SafeAreaLayout>

        </>
    )
}

export default MessagesScreen