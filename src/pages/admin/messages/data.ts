import { Message, Profile } from "@services/message.service"

export const initialMessages: Message[] = [
  new Message(
    'Olá, tudo bem?',
    '4:30 PM',
    false,
    new Profile(
      'Jack',
      'Sparrow',
      'https://bootdey.com/img/Content/avatar/avatar6.png',
    ),
  ),
  new Message(
    'Sua consulta ficou agendada para o dia',
    '9:30 AM',
    false,
    new Profile(
      'Elizabeth',
      'Swann',
      'https://bootdey.com/img/Content/avatar/avatar6.png',
    ),
  ),
  new Message(
    'Para mais informações',
    '5:30 PM',
    false,
    new Profile(
      'Will',
      'Turner',
      'https://bootdey.com/img/Content/avatar/avatar6.png',
    ),
  ),
]
