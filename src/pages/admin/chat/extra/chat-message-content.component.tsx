import { Message } from '@models/ChatMessage'
import { Text } from '@ui-kitten/components'
import React, { FC, ReactElement } from 'react'
import { Image, StyleSheet, View, ViewProps } from 'react-native'

export interface ChatMessageContentProps extends ViewProps {
  message: Message
}

export const ChatMessageContent: FC<ChatMessageContentProps> = (props): ReactElement => {

  const { style, message, ...viewProps } = props

  const renderAttachment = (): ReactElement => (
    // <Image
    //   style={styles.attachmentImage}
    //   source={require('../assets/image-attachment-1.png')}
    // />
    <></>
  )

  const renderText = (): ReactElement => (
    <Text
      style={styles.text}
      category='label'
      status='control'>
      {message.text}
    </Text>
  )

  return (
    <View
      {...viewProps}
      style={[styles.container, style]}>
      {message.text && renderText()}
      {/* {message.attachment && renderAttachment()} */}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    overflow: 'hidden',
    minHeight: 48,
    minWidth: 48,
    maxWidth: 276,
    borderRadius: 4,
  },
  text: {
    marginVertical: 12,
    marginHorizontal: 15,
  },
  attachmentImage: {
    width: 100,
    height: 100,
  },
})
