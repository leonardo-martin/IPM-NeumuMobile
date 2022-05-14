import { Message } from '@models/ChatMessage'
import { StyleType } from '@ui-kitten/components'
import React, { ReactElement } from 'react'
import { View, ViewProps } from 'react-native'
import { ChatMessageElement } from './chat-message.component'

export interface ChatMessageGroupProps extends ViewProps {
  data: Message[]
  renderItem: (message: Message, style: StyleType) => ReactElement
}

export const ChatMessageGroup = (props: ChatMessageGroupProps): ReactElement => {

  const { data, renderItem, ...viewProps } = props

  const renderMessage = (item: Message, key: number): ChatMessageElement => {
    // @ts-ignore
    return React.cloneElement(renderItem(item), { key })
  }

  return (
    <View
      {...viewProps}>
      {data.map(renderMessage)}
    </View>
  )
}
