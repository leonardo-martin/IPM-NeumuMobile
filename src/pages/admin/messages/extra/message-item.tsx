import React, { FC } from 'react'
import { ImageProps, StyleProp, View } from 'react-native'
import { Avatar, Icon, IconProps, ListItem, ListItemProps, Text, useStyleSheet } from '@ui-kitten/components'
import { Message } from '@services/message.service'
import { messageItemStyle } from './style'

export type MessageItemProps = ListItemProps & {
  message: Message
}

const MessageItem: FC<MessageItemProps> = ({ message, onPress }): React.ReactElement => {

  const styles = useStyleSheet(messageItemStyle)
  const DoneAllIcon = (props: IconProps) => (
    <Icon {...props} style={styles.icon} name='checkmark-done-outline' pack='ionicons' />
  )

  const renderMessageDate = (): React.ReactElement => (
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


  const renderProfileAvatar = (): React.ReactElement => (
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