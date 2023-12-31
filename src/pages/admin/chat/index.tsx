import { API_BASE_URL } from '@constants/uri'
import { useAppDispatch, useAppSelector } from '@hooks/redux'
import { useDatepickerService } from '@hooks/useDatepickerService'
import { ChatListEntryDto, Message } from '@models/ChatMessage'
import { AscendingOrder } from '@models/Common'
import { useFocusEffect, useRoute } from '@react-navigation/native'
import { getMessageHistory } from '@services/chat-message.service'
import { noticeViewed, updateMessageList } from '@store/ducks/chat'
import { Button, Input, useStyleSheet } from '@ui-kitten/components'
import { sortByDate } from '@utils/common'
import React, { FC, ReactElement, useCallback, useEffect, useRef, useState } from 'react'
import { Alert, Keyboard, Platform, RefreshControl } from 'react-native'
import Toast from 'react-native-toast-message'
import io, { Socket } from "socket.io-client"
import { RootState } from 'store'
import { AttachmentsMenu } from './extra/attachments-menu.component'
import ChatMessageLoading from './extra/chat-messages-loading.component'
import { Chat } from './extra/chat.component'
import { CameraIcon, CornerDownRightIcon, FileIcon, PinIcon } from './extra/icons'
import { KeyboardAvoidingView } from './extra/keyboard-avoiding-view.component'
import { chatRoomStyle } from './style'

const attachments: any[] = [
  { accessory: CameraIcon },
  { accessory: FileIcon },
  { accessory: PinIcon },
]

const keyboardOffset = (height: number): number => Platform.select({
  android: 0,
  ios: height,
}) as number

const ChatRoomScreen: FC = (): ReactElement => {

  const socketRef = useRef<Socket>()
  const take = 10
  const [skip, setSkip] = useState<number>(0)
  const { ids } = useAppSelector((state: RootState) => state.user)
  const { payload } = useAppSelector((state: RootState) => state.auth)
  const styles = useStyleSheet(chatRoomStyle)
  const { localeDateService } = useDatepickerService()

  const [params, setParams] = useState<ChatListEntryDto>()
  const route = useRoute()
  const dispatch = useAppDispatch()
  const { showNotice } = useAppSelector((state: RootState) => state.chat)

  useEffect(() => {
    setParams(route.params as ChatListEntryDto)
  }, [route.params])

  const [messages, setMessages] = useState<Message[]>([])
  const [message, setMessage] = useState<string | undefined>()
  const [attachmentsMenuVisible, setAttachmentsMenuVisible] = useState<boolean>(false)

  const [refreshing, setRefreshing] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const loadMessages = useCallback(async () => {
    const response = await getMessageHistory({
      receiverId: params?.senderID === ids?.userId ? params?.receiverId : params?.senderID,
      skip: skip.toString(),
      take: take.toString()
    })

    if (response.status === 200) {
      let items: Message[] = []
      const list = response.data.sort((a, b) => sortByDate(localeDateService, a.timestamp, b.timestamp, AscendingOrder.ASC))
      list.forEach(e => {
        const msg = e.payload.split(' ').slice(2, e.payload.length).join(' ') ?? e.payload
        items.push(new Message(msg ?? '', e.timestamp.toString(),
          !(e.receiverUserId === ids?.userId)
          , null))
      })
      setSkip(skip + list.length)
      const arr = [...items, ...messages]
      setMessages([...new Set(arr.filter((v, i, a) => a.findIndex((v2: Message) => v2['date'] === v['date'] && v2['text'] === v['text']) === i))])
    }
  }, [localeDateService])

  const loadInitialChatMessage = async () => {
    setIsLoading(true)
    try {
      await loadMessages()
    } catch (error) {
      Toast.show({
        type: 'danger',
        text2: 'Erro ao carregar o chat. Tente novamente mais tarde',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const sendButtonEnabled = (): boolean => {
    if (message && message.length > 0 && !(new RegExp(/^\s+$/).test(message)))
      return true
    return false
  }

  const toggleAttachmentsMenu = (): void => {
    setAttachmentsMenuVisible(!attachmentsMenuVisible)
  }

  const onSendButtonPress = (): void => {
    if (sendButtonEnabled()) {
      Keyboard.dismiss()
      // setAttachmentsMenuVisible(false)
      if (socketRef.current) {
        let receiverId = params?.senderID === ids?.userId ? params?.receiverId : params?.senderID
        const payload = receiverId + ' ' + ids?.userId + ' ' + message
        socketRef.current.emit('msgToServer', payload)
        const timestamp = localeDateService.today()
        setMessages([...messages, new Message(message, timestamp, true, null)])
        dispatch(updateMessageList({
          message: message ?? '',
          senderID: params?.senderID ?? 0,
          receiverId: params?.receiverId ?? 0,
          timestamp: timestamp.toISOString()
        }))
        setMessage(undefined)

      }
    }

  }

  useEffect(() => {
    socketRef.current = io(API_BASE_URL ?? 'http://localhost:3000', {
      transportOptions: {
        polling: {
          extraHeaders: {
            Authorization: 'Bearer ' + payload?.accessToken
          }
        }
      }
    })

    socketRef.current.on('msgToClient', (message: string) => {
      if (message)
        setMessages([...messages, new Message(message.split(' ').slice(2, message.length).join(' ') ?? message, localeDateService.today(), false, null)])
    })

    return () => {
      socketRef.current?.disconnect()

    }
  }, [messages])

  const renderAttachmentsMenu = (): ReactElement => (
    <AttachmentsMenu
      attachments={attachments}
      onSelectPhoto={toggleAttachmentsMenu}
      onSelectFile={toggleAttachmentsMenu}
      onSelectLocation={toggleAttachmentsMenu}
      onSelectContact={toggleAttachmentsMenu}
      onAttachmentSelect={toggleAttachmentsMenu}
      onCameraPress={toggleAttachmentsMenu}
      onDismiss={toggleAttachmentsMenu}
    />
  )

  const onRefresh = async () => {
    setRefreshing(true)
    await loadMessages()
    setRefreshing(false)
  }

  useFocusEffect(
    useCallback(() => {
      if (showNotice)
        Alert.alert(
          'IMPORTANTE',
          'A interação com o chat é somente a nível de dúvidas, para facilitar a interação Paciente X Profissional de Saúde. Se precisar de qualquer atendimento de urgência, por favor entre em contato com a emergência local.',
          [
            {
              text: 'OK',
              style: 'default',
              onPress: () => {
                dispatch(noticeViewed({
                  showNotice: false
                }))
              }
            },
          ]
        )
      if (params) {
        loadInitialChatMessage()
      }
    }, [params, showNotice])
  )

  return (
    <React.Fragment>
      {isLoading ? (
        <ChatMessageLoading />
      ) : (
        <Chat
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
            />
          }
          style={styles.list}
          contentContainerStyle={styles.listContent}
          followEnd
          data={messages}
        />)}
      <KeyboardAvoidingView
        style={styles.messageInputContainer}
        offset={keyboardOffset}>
        {/* 
         //! Botao para envio de midia (habilitar somente se for requisitado )
        <Button
          style={[styles.iconButton, styles.attachButton]}
          status='primary'
          accessoryLeft={PlusIcon}
          onPress={toggleAttachmentsMenu}
        /> */}
        <Input
          style={styles.messageInput}
          placeholder='Mensagem'
          value={message}
          multiline
          textStyle={{
            maxHeight: 100
          }}
          onChangeText={setMessage}
          // onFocus={toggleAttachmentsMenu}
          returnKeyType='send'
        />
        <Button
          appearance='ghost'
          style={[styles.iconButton, styles.sendButton]}
          accessoryLeft={CornerDownRightIcon}
          disabled={!sendButtonEnabled()}
          onPress={onSendButtonPress}
        />
      </KeyboardAvoidingView>
      {attachmentsMenuVisible && renderAttachmentsMenu()}
    </React.Fragment>
  )
}

export default ChatRoomScreen