import React from 'react'

// Import component files
import JsonEditor from './index'
import docs from './README.md'
import { withKnobs } from '@storybook/addon-knobs'

// Import mock
import { MessageTemplatesMockByKey, WargameMock, messageDataCollaborativeResponding, messageDataCollaborativeEditing, P9Mock } from '@serge/mocks'
import { Story } from '@storybook/react/types-6-0'

import Props from './types/props'

const wrapper: React.FC = (storyFn: any) => <div style={{ height: '600px' }}>{storyFn()}</div>

export default {
  title: 'local/molecules/JsonEditor',
  component: JsonEditor,
  decorators: [withKnobs, wrapper],
  parameters: {
    readme: {
      // Show readme before story
      content: docs
    }
  },
  argTypes: {
    disabled: {
      name: 'disabled',
      defaultValue: false,
      control: { type: 'boolean' }
    }
  }
}
const storeNewValue = (value: { [property: string]: any }): void => {
  console.log('store data', value)
}

const template = MessageTemplatesMockByKey[messageDataCollaborativeEditing[0].details.messageType]
const channel = P9Mock.data.channels.channels[0]
const templateMessageCreator = {
  template: MessageTemplatesMockByKey[messageDataCollaborativeEditing[0].details.messageType] && MessageTemplatesMockByKey[messageDataCollaborativeEditing[0].details.messageType].details,
  _id: channel.uniqid
}

const Template: Story<Props> = ({ messageId, disabled, template, messageContent }) => {
  return (
    <JsonEditor
      storeNewValue={storeNewValue}
      template={template || templateMessageCreator}
      messageId={messageId}
      messageContent={messageContent || null}
      disabled={disabled}
      gameDate={WargameMock.data.overview.gameDate}
    />
  )
}

export const Standard = Template.bind({})
Standard.args = {
  messageContent: messageDataCollaborativeEditing[0].message,
  messageId: 'id_1',
  template: template || templateMessageCreator,
  disabled: false,
  gameDate: WargameMock.data.overview.gameDate
}

export const Response = Template.bind({})
Response.args = {
  template: template || templateMessageCreator,
  messageContent: messageDataCollaborativeResponding[0].message,
  messageId: 'id_2ß',
  disabled: false,
  gameDate: WargameMock.data.overview.gameDate
}
