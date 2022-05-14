import { ImageRequireSource } from 'react-native'

export class Message {

  constructor(readonly text: string | undefined,
              readonly date: string | null,
              readonly reply: boolean,
              readonly attachment: MessageAttachment | null) {
  }

}

export class MessageAttachment {

  constructor(readonly source: ImageRequireSource) {
  }

  static petPhoto1(): MessageAttachment {
    return new MessageAttachment(require('../assets/image-attachment-1.png'))
  }

  static petPhoto2(): MessageAttachment {
    return new MessageAttachment(require('../assets/image-attachment-2.jpg'))
  }
}

