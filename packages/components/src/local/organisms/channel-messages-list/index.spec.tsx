/* global it expect */
import React from 'react'
import renderer from 'react-test-renderer'
import ChannelMessagesList from './index'
import { CUSTOM_MESSAGE } from '@serge/config'
import { MessageCustom } from '@serge/custom-types'

describe('ChannelMessagesList component: ', () => {
  it('renders component correctly', () => {
    const icons = [
      './images/default_img/forceDefault.png'
    ]
    const colors = [
      '#F00'
    ]
    const markAllAsRead = (): void => window.alert('Callback on mark all as read')
    const messages: MessageCustom[] = [    {
      messageType: CUSTOM_MESSAGE,
      details: {
        channel: "channel-k63pjit0",
        from: {
          force: "Red",
          forceColor: "#F00",
          icon: "default_img/umpireDefault.png",
          role: "CO"
        },
        messageType: "Chat",
        timestamp: "2020-10-13T08:52:04.394Z"
      },
      message: {
        content: "message from Red"
      },
      _id: "2020-03-25T15:08:47.520Z",
      _rev: "1",
      hasBeenRead: false,
      isOpen: false
    }]

    const tree = renderer
      .create(<ChannelMessagesList messages={messages} onRead={undefined} onChange={undefined} isUmpire={true} role={'Comms'} isRFIManager={true} playerForceId={'Blue'} colors={colors} icons={icons} onMarkAllAsRead={markAllAsRead} />)
      .toJSON()
    expect(tree).toMatchSnapshot()
  })
})

