import { Message } from '@services/message.service'
import { Avatar, Icon, IconProps, ListItem, ListItemProps, Text, useStyleSheet } from '@ui-kitten/components'
import React, { FC, ReactElement } from 'react'
import { ImageProps, StyleProp, View } from 'react-native'
import { messageItemStyle } from './style'

export type MessageItemProps = ListItemProps & {
  message: Message
}

const MessageItem: FC<MessageItemProps> = ({ message, onPress }): ReactElement => {

  const styles = useStyleSheet(messageItemStyle)
  const DoneAllIcon = (props: IconProps) => (
    <Icon {...props} style={styles.icon} name='checkmark-done-outline' pack='ionicons' />
  )

  const renderMessageDate = (): ReactElement => (
    <View style={styles.dateContainer}>
      {message.isRead && <DoneAllIcon />}
      <Text
        style={styles.dateText}
        appearance='hint'
        category='c1'>
        {message.date}
      </Text>
    </View>
  )


  const renderProfileAvatar = (): ReactElement => (
    <Avatar
      style={styles.avatar as StyleProp<ImageProps>}
      source={{ uri: message.profile.photo }}
    />
  )

  return (
    <ListItem
      onPress={onPress}
      title={message.profile.fullName}
      description={message.formattedText}
      accessoryLeft={renderProfileAvatar}
      accessoryRight={renderMessageDate}
    />
  )
}

export default MessageItem