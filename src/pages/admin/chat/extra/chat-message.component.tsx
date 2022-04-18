import { StyleService, Text, TextElement, useStyleSheet } from '@ui-kitten/components'
import React, { ReactElement } from 'react'
import { View, ViewProps } from 'react-native'
import { ChatMessageIndicator } from './chat-message-indicator.component'
import { Message } from './data'

export interface ChatMessageProps extends ViewProps {
  message: Message
  shouldShowIndicator?: boolean
  children?: React.ReactNode
}

export type ChatMessageElement = ReactElement<ChatMessageProps>

export const ChatMessage = (props: ChatMessageProps): ReactElement => {

  const styles = useStyleSheet(themedStyles)

  const { style, message, shouldShowIndicator, children, ...viewProps } = props

  const renderDateElement = (): TextElement => (
    <Text
      style={styles.date}
      appearance='hint'
      category='c2'>
      {message.date?.toString()}      
    </Text>
  )

  const renderIndicator = (): ReactElement => (
    <ChatMessageIndicator
      style={[message.reply ? styles.indicatorOut : styles.indicatorIn, styles.indicator]}
      reverse={message.reply}
    />
  )

  return (
    <View
      {...viewProps}
      style={[message.reply ? styles.containerOut : styles.containerIn, styles.container, style]}>
      {shouldShowIndicator && renderIndicator()}
      {children}
      {renderDateElement()} 
    </View>
  )
}

const themedStyles = StyleService.create({
  container: {
    alignItems: 'center',
  },
  containerIn: {
    flexDirection: 'row',
  },
  containerOut: {
    flexDirection: 'row-reverse',
  },
  
  date: {
    marginHorizontal: 18,
  },
  indicator: {
    width: 6,
    height: 8,
  },
  indicatorIn: {
    backgroundColor: 'color-basic-600',
    transform: [
      { rotate: '-90deg' },
      { translateY: 3 },
      { translateX: -12 },
    ],
  },
  indicatorOut: {
    backgroundColor: 'color-primary-default',
    transform: [
      { rotate: '90deg' },
      { translateY: 3 },
      { translateX: 12 },
    ],
  },
})
