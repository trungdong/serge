import Participant from './participant'
import { MessageChannel } from './message'

/** description of channel, as used in game UI */
export default interface ChannelData {
  readonly uniqid: string,
  observing?: boolean,
  templates?: Array<any>,
  messages?: Array<MessageChannel>,
  name: string,
  participants: Array<Participant>
  unreadMessageCount?: number
  // TODO: dynamically retrieve force icons and colors,
  // don't store them in the database
  forceIcons?: Array<any>
  forceColors?: Array<string>
}