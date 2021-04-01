import { CUSTOM_MESSAGE } from '@serge/config';
import { MessageChannel, MessageCustom } from '@serge/custom-types'
/** helper function to handle an array of messages, and
 * only return the newest version of custom messages. Note: it does not inspect
 * the pouchdb _rev field, it just returns the last version
 * of that message encountered in the list
 * @param (MessageChannel[]) array of messages
 * @returns (MessageCustom[]) latest version of specified messages
 */
const mostRecentOnly = (messages: MessageChannel[]): MessageCustom[] => {
  // create dictionary of messages, indexed by _id field
  const matches = new Map<string, MessageCustom>();
  messages.forEach((message: MessageChannel) => {
    if(message.messageType === CUSTOM_MESSAGE) {
      // see if it's a versioned document
      if(message.message.Reference) {
        const ref = message.message.Reference
        // see if we already have it
        if(matches.get(ref) === undefined) {
          // store by reference
          matches.set(message.message.Reference, message as MessageCustom)
        }
      } else if(message._id) {
        // either store this message, or overwrite previous version
        matches.set(message._id, message as MessageCustom)
      } else {
        console.warn('Encountered message without an _id')
      }  
    }
  })
  return Array.from(matches.values())
}
export default mostRecentOnly
