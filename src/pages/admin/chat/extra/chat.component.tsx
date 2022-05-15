import { Message } from '@models/ChatMessage'
import { List, ListProps, Text, useStyleSheet } from '@ui-kitten/components'
import React, { ReactElement, useRef } from 'react'
import { ListRenderItemInfo, StyleSheet, View } from 'react-native'
import { ChatMessageContent } from './chat-message-content.component'
import { ChatMessageGroup } from './chat-message-group.component'
import { ChatMessage } from './chat-message.component'
import { ChatService } from './chat.service'

export interface ChatProps extends Omit<ListProps, 'renderItem'> {
  data: Message[]
  followEnd: boolean
}

const chatService: ChatService = new ChatService()

export const Chat = (props: ChatProps): ReactElement => {

  const styles = useStyleSheet(chatStyles)
  const listRef: React.RefObject<any> = useRef()
  let contentHeight: number = 0

  const { followEnd, contentContainerStyle, data, ...listProps } = props

  const shouldShowMessageIndicator = (message: Message): boolean => {
    if (message.text && message.text.length > 0)
      return true

    return false
  }

  const scrollToEnd = (params?: any): void => {
    scrollToOffset({ offset: contentHeight, ...params })
  }

  const scrollToOffset = (params: any): void => {
    listRef.current.scrollToOffset(params)
  }

  const onContentSizeChange = (width: number, height: number): void => {
    contentHeight = height

    props.followEnd && setTimeout(scrollToEnd, 0)

    listProps.onContentSizeChange && listProps.onContentSizeChange(width, height)
  }

  const renderMessage = (message: Message): ReactElement => (
    <ChatMessage
      style={styles.message}
      message={message}
      shouldShowIndicator={shouldShowMessageIndicator(message)}
    >
      <ChatMessageContent
        style={
          [message.reply ? styles.contentOut : styles.contentIn]
        }
        message={message} />
    </ChatMessage>
  )

  const renderMessageGroup = (info: ListRenderItemInfo<Message & { type: string, date: string, id: string }>): ReactElement => {

    if (info.item.type && info.item.type === 'day') {
      return (
        <View style={{
          alignItems: 'center'
        }}  >
          <View style={styles.day}>
            <Text
              category='c1'
            >{info.item.date}</Text>
          </View>
        </View>
      )
    }
    return (
      <ChatMessageGroup
        style={styles.group}
        data={info.item}
        renderItem={renderMessage}
      />
    )
  }

  return (
    <List
      ref={listRef}
      {...listProps}
      data={chatService.createMessageGroups(data)}
      contentContainerStyle={[styles.contentContainer, contentContainerStyle]}
      onContentSizeChange={onContentSizeChange}
      renderItem={renderMessageGroup}
    />
  )
}

const chatStyles = StyleSheet.create({
  contentContainer: {
    justifyContent: 'flex-end',
  },
  group: {
    marginVertical: 8,
  },
  message: {
    marginVertical: 5,
  },
  contentIn: {
    backgroundColor: 'color-basic-600',
  },
  contentOut: {
    backgroundColor: 'color-primary-500',
  },
  day: {
    backgroundColor: 'background-basic-color-4',
    padding: 5,
    paddingHorizontal: 15,
    borderRadius: 5,
    opacity: .5
  }
})
