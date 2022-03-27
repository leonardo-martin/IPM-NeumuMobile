import { Message, Profile } from "@services/message.service"
import { BOOTDEY_URI } from "@constants/uri"

export const initialMessages: Message[] = [
  new Message(
    1,
    'Olá, tudo bem?',
    '4:30 PM',
    true,
    new Profile(
      1,
      'Jack',
      'Sparrow',
      BOOTDEY_URI + '/img/Content/avatar/avatar6.png',
    ),
  ),
  new Message(
    2,
    'Sua consulta ficou agendada para o dia',
    '9:30 AM',
    false,
    new Profile(
      2,
      'Elizabeth',
      'Swann',
      BOOTDEY_URI + '/img/Content/avatar/avatar6.png',
    ),
  ),
  new Message(
    3,
    'Para mais informações',
    '5:30 PM',
    true,
    new Profile(
      3,
      'Will',
      'Turner',
      BOOTDEY_URI + '/img/Content/avatar/avatar6.png',
    ),
  ),
]
