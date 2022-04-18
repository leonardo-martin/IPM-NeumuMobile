import React, { ReactElement } from 'react'
import {
  ListRenderItemInfo,
  StyleSheet,
} from 'react-native'
import { Button, Divider, Layout, List } from '@ui-kitten/components'

export interface AttachmentsMenuProps {
  attachments: any[]
  onSelectPhoto: () => void
  onSelectFile: () => void
  onSelectLocation: () => void
  onSelectContact: () => void
  onCameraPress: () => void
  onAttachmentSelect: (index: number) => void
  onDismiss: () => void
}

export type AttachmentsMenuElement = ReactElement<AttachmentsMenuProps>

export const AttachmentsMenu = (props: AttachmentsMenuProps): ReactElement => {

  const renderAttachment = (info: ListRenderItemInfo<any>): ReactElement => (
    <Button
      style={styles.attachmentsAction}
      appearance='outline'
      accessoryLeft={info.item.accessory}
      onPress={props.onSelectFile}
    />
  )

  return (
    <Layout level='1'>
      <Divider style={styles.divider} />
      <List
        style={styles.attachmentsContainer}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        data={props.attachments}
        renderItem={renderAttachment}
      />
      <Button
        appearance='ghost'
        size='giant'
        onPress={props.onDismiss}>
        CANCELAR
      </Button>
    </Layout>
  )
}

const styles = StyleSheet.create({
  divider: {
    marginBottom: 24,
  },
  attachmentsContainer: {
    flexDirection: 'row',
    marginHorizontal: 8,
    marginBottom: 8,
    maxHeight: 72,
    backgroundColor: 'transparent',
  },
  attachmentsAction: {
    aspectRatio: 1.0,
    height: '100%',
    marginHorizontal: 8,
  },
  attachmentItem: {
    width: 72,
    height: 72,
    marginHorizontal: 8,
    borderRadius: 4,
  },
})
