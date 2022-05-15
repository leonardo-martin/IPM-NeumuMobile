import { Message } from '@models/ChatMessage'
import React, { ReactElement } from 'react'
import { View, ViewProps } from 'react-native'

export interface ChatMessageGroupProps extends ViewProps {
  data: Message
  renderItem: (message: Message) => ReactElement
}

export const ChatMessageGroup = (props: ChatMessageGroupProps): ReactElement => {

  const { data, renderItem, ...viewProps } = props

  return (
    <View
      {...viewProps}>
      {renderItem(data)}
    </View>
  )
}
