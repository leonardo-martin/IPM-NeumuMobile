import { _DATE_FROM_ISO_8601 } from '@constants/date'
import { useAppSelector } from '@hooks/redux'
import { useDatepickerService } from '@hooks/useDatepickerService'
import { ChatListEntryDto } from '@models/ChatMessage'
import { Avatar, Icon, IconProps, ListItem, ListItemProps, Text, useStyleSheet } from '@ui-kitten/components'
import React, { FC, ReactElement } from 'react'
import { ImageProps, StyleProp, View } from 'react-native'
import { RootState } from 'store'
import { messageItemStyle } from './style'

export type MessageItemProps = ListItemProps & {
  message: ChatListEntryDto
}

const MessageItem: FC<MessageItemProps> = ({ message, onPress }): ReactElement => {

  const styles = useStyleSheet(messageItemStyle)
  const { localeDateService } = useDatepickerService()
  const { ids } = useAppSelector((state: RootState) => state.user)

  const renderMessageDate = (): ReactElement => (
    <View style={styles.dateContainer}>
      <Text
        style={styles.dateText}
        appearance='hint'
        category='c1'>
        {localeDateService.format(localeDateService.parse(message.timestamp.toString(), _DATE_FROM_ISO_8601), 'HH:mm A')}
      </Text>
    </View>
  )


  const renderProfileAvatar = (): ReactElement => (
    <Avatar
      style={styles.avatar as StyleProp<ImageProps>}
    // source={{ uri: message.profile.photo }}
    />
  )

  const generateDescription = (payload: string) => {
    const msg = payload.split(' ').slice(2, payload.length).join(' ') ?? ''
    return (msg.length > 36) ? `${msg.substring(0, 32)}...` : msg
  }

  return (
    <ListItem
      style={styles.listItem}
      onPress={onPress}
      title={(evaProps) => <Text {...evaProps} style={[evaProps?.style, { fontSize: 16 }]}>{message.senderID === ids?.userId ? message.receiverName : message.senderName}</Text>}
      description={(evaProps) => <Text {...evaProps} style={[evaProps?.style, { fontSize: 14 }]}>{generateDescription(message.payload) ?? ''}</Text>}
      // accessoryLeft={renderProfileAvatar}
      accessoryLeft={(props: IconProps) => <Icon {...props} name='person-circle-outline' size={40} pack='ionicons' />}
      accessoryRight={renderMessageDate}
    />
  )
}

export default MessageItem