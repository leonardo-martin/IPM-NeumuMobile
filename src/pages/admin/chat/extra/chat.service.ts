import { _DATE_FROM_ISO_8601, _DEFAULT_FORMAT_DATE } from "@constants/date"
import { useDatepickerService } from "@hooks/useDatepickerService"
import { Message } from "@models/ChatMessage"

type MessageGroup = Message[]

export class ChatService {

  private groupedDays(messages: Message[]) {
    const { localeDateService } = useDatepickerService()
    return messages.reduce((acc: { [key: string]: Message[] }, el, i) => {
      const messageDay = localeDateService.format(localeDateService.parse(el.date.toString(), _DATE_FROM_ISO_8601), _DEFAULT_FORMAT_DATE);
      if (acc[messageDay]) {
        return { ...acc, [messageDay]: acc[messageDay].concat([el]) };
      }
      return { ...acc, [messageDay]: [el] };
    }, {});
  }

  public createMessageGroups = (source: Message[]): MessageGroup[] => {
    if (!source.length) {
      return []
    }
    const days = this.groupedDays(source)
    const sortedDays = Object.keys(days).sort(
      (x, y) => (new Date(x).getTime() / 1000) - (new Date(y).getTime() / 1000)
    );
    const items = sortedDays.reduce((acc: any, date) => {
      const sortedMessages = days[date].sort(
        (x, y) => new Date(x.date).getTime() - new Date(y.date).getTime()
      )
      return acc.concat([{ type: 'day', date, id: date }, ...sortedMessages])
    }, [])
    return items
  }
}
