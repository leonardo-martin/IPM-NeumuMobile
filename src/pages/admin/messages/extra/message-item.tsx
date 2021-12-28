import React, { FC } from 'react'
import { View } from 'react-native'
import { Avatar, Icon, IconProps, ListItem, ListItemProps, Text } from '@ui-kitten/components'
import { Message } from '@services/message.service'
import { messageItemStyle } from './style'

export type MessageItemProps = ListItemProps & {
  message: Message
}

const MessageItem: FC<MessageItemProps> = ({ message, onPress }): React.ReactElement => {

  const DoneAllIcon = (props: IconProps) => (
    <Icon {...props} width={16} height={16} name='done-all-outline' />
  )

  const renderMessageDate = (): React.ReactElement => (
    <View style={messageItemStyle.dateContainer}>
      {message.isRead && <DoneAllIcon />}
      <Text
        style={messageItemStyle.dateText}
        appearance='hint'
        category='c1'>
        {message.date}
      </Text>
    </View>
  )


  const renderProfileAvatar = (): React.ReactElement => (
    <Avatar
      style={messageItemStyle.avatar}
      width={40}
      height={40}
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