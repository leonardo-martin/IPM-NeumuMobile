import React, { FC, ReactElement } from 'react'
import { Keyboard, Platform } from 'react-native'
import { Button, Input, useStyleSheet } from '@ui-kitten/components'
import { KeyboardAvoidingView } from './extra/keyboard-avoiding-view.component'
import { Chat } from './extra/chat.component'
import { AttachmentsMenu } from './extra/attachments-menu.component'
import { CameraIcon, FileIcon, CornerDownRightIcon, PinIcon, PlusIcon } from './extra/icons'
import { Message } from './extra/data'
import { chatRoomStyle } from './style'
import { useDatepickerService } from '@hooks/useDatepickerService'

const attachments: any[] = [
  { accessory: CameraIcon },
  { accessory: FileIcon },
  { accessory: PinIcon },
]

const keyboardOffset = (height: number): number => Platform.select({
  android: 0,
  ios: height,
}) as number

const ChatRoomScreen: FC = (): ReactElement => {

  const styles = useStyleSheet(chatRoomStyle)
  const { localeDateService } = useDatepickerService()

  const [messages, setMessages] = React.useState<Message[]>([])
  const [message, setMessage] = React.useState<string | undefined>()
  const [attachmentsMenuVisible, setAttachmentsMenuVisible] = React.useState<boolean>(false)

  const sendButtonEnabled = (): boolean => {
    if (message && message.length > 0)
      return true

    return false
  }

  const toggleAttachmentsMenu = (): void => {
    setAttachmentsMenuVisible(!attachmentsMenuVisible)
  }

  const onSendButtonPress = (): void => {
    setMessages([...messages, new Message(message, localeDateService.format(localeDateService.today(), 'HH:mm b'), true, null)])
    setMessage(undefined)
    Keyboard.dismiss()
    setAttachmentsMenuVisible(false)
  }

  const renderAttachmentsMenu = (): React.ReactElement => (
    <AttachmentsMenu
      attachments={attachments}
      onSelectPhoto={toggleAttachmentsMenu}
      onSelectFile={toggleAttachmentsMenu}
      onSelectLocation={toggleAttachmentsMenu}
      onSelectContact={toggleAttachmentsMenu}
      onAttachmentSelect={toggleAttachmentsMenu}
      onCameraPress={toggleAttachmentsMenu}
      onDismiss={toggleAttachmentsMenu}
    />
  )

  return (
    <React.Fragment>
      <Chat
        style={styles.list}
        contentContainerStyle={styles.listContent}
        followEnd={true}
        data={messages}
      />
      <KeyboardAvoidingView
        style={styles.messageInputContainer}
        offset={keyboardOffset}>
        <Button
          style={[styles.iconButton, styles.attachButton]}
          status='primary'
          accessoryLeft={PlusIcon}
          onPress={toggleAttachmentsMenu}
        />
        <Input
          style={styles.messageInput}
          placeholder='Mensagem'
          value={message}
          onChangeText={setMessage}
          onFocus={toggleAttachmentsMenu}
          returnKeyType='send'
          onSubmitEditing={onSendButtonPress}
        />
        <Button
          appearance='ghost'
          style={[styles.iconButton, styles.sendButton]}
          accessoryLeft={CornerDownRightIcon}
          disabled={!sendButtonEnabled()}
          onPress={onSendButtonPress}
        />
      </KeyboardAvoidingView>
      {attachmentsMenuVisible && renderAttachmentsMenu()}
    </React.Fragment>
  )
}

export default ChatRoomScreen