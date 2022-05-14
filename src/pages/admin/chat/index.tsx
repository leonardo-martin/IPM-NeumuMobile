import { _DATE_FROM_ISO_8601 } from '@constants/date'
import { API_BASE_URL } from '@constants/uri'
import toast from '@helpers/toast'
import { useAppSelector } from '@hooks/redux'
import { useDatepickerService } from '@hooks/useDatepickerService'
import { ChatListEntryDto, Message } from '@models/ChatMessage'
import { AscendingOrder } from '@models/Common'
import { useFocusEffect, useRoute } from '@react-navigation/native'
import { getMessageHistory } from '@services/chat-message.service'
import { Button, Input, useStyleSheet } from '@ui-kitten/components'
import { sortByDate } from '@utils/common'
import React, { FC, ReactElement, useCallback, useEffect, useRef, useState } from 'react'
import { Keyboard, Platform, RefreshControl } from 'react-native'
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

  useEffect(() => {
    setParams(route.params as ChatListEntryDto)
  }, [route.params])

  const [messages, setMessages] = useState<Message[]>([])
  const [message, setMessage] = useState<string | undefined>()
  const [attachmentsMenuVisible, setAttachmentsMenuVisible] = useState<boolean>(false)

  const [refreshing, setRefreshing] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const loadMessages = async () => {
    const response = await getMessageHistory({
      receiverId: params?.senderID === ids?.userId ? params?.receiverId : params?.senderID,
      skip: skip.toString(),
      take: take.toString()
    })

    if (response.status === 200) {
      let items: Message[] = []
      const list = response.data.sort((a, b) => sortByDate(a.timestamp, b.timestamp, AscendingOrder.ASC))
      list.forEach(e => {
        const msg = e.payload.split(' ').slice(2, e.payload.length).join(' ') ?? e.payload
        items.push(new Message(msg ?? '', localeDateService.format(localeDateService.parse(e.timestamp.toString(), _DATE_FROM_ISO_8601), 'HH:mm A'),
          !(e.receiverUserId === ids?.userId)
          , null))
      })
      setSkip(skip + list.length)
      setMessages([...items, ...messages])
    }
  }

  const loadInitialChatMessage = async () => {
    setIsLoading(true)
    try {
      await loadMessages()
    } catch (error) {
      toast.danger({ message: 'Erro ao carregar o chat. Tente novamente mais tarde', duration: 3000 })
    } finally {
      setIsLoading(false)
    }
  }

  useFocusEffect(
    useCallback(() => {
      setMessages([])
      if (params)
        loadInitialChatMessage()
    }, [params])
  )

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
        setMessages([...messages, new Message(message, localeDateService.format(localeDateService.today(), 'HH:mm A'), true, null)])
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
        setMessages([...messages, new Message(message.split(' ').slice(2, message.length).join(' ') ?? message, localeDateService.format(localeDateService.today(), 'HH:mm A'), false, null)])
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
          followEnd={true}
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
          onChangeText={setMessage}
          // onFocus={toggleAttachmentsMenu}
          returnKeyType='send'
          onSubmitEditing={onSendButtonPress}
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