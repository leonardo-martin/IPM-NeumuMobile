import { useDatepickerService } from '@hooks/useDatepickerService'
import { Message } from '@models/ChatMessage'
import { StyleService, Text, TextElement, useStyleSheet } from '@ui-kitten/components'
import React, { ReactElement } from 'react'
import { View, ViewProps } from 'react-native'
import { ChatMessageIndicator } from './chat-message-indicator.component'

export interface ChatMessageProps extends ViewProps {
  message: Message
  shouldShowIndicator?: boolean
  children?: React.ReactNode
}

export type ChatMessageElement = ReactElement<ChatMessageProps>

export const ChatMessage = (props: ChatMessageProps): ReactElement => {

  const styles = useStyleSheet(themedStyles)

  const { style, message, shouldShowIndicator, children, ...viewProps } = props
  const { localeDateService } = useDatepickerService()

  const renderDateElement = (): TextElement => (
    <Text
      style={styles.date}
      appearance='hint'
      category='c1'>
      {localeDateService.format(new Date(message.date), 'HH:mm')}
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
    marginHorizontal: 10,
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
    backgroundColor: 'color-primary-500',
    transform: [
      { rotate: '90deg' },
      { translateY: 3 },
      { translateX: 12 },
    ],
  },
})
