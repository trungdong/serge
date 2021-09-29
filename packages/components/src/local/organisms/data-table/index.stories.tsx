import React from 'react'

// Import component files
import DataTable, { ROW_DATA_TYPE, ROW_WITH_COLLAPSIBLE_TYPE } from './index'
import DataTableProps, { RowWithCollapsibleType } from './types/props'
import docs from './README.md'
import { Story } from '@storybook/react/types-6-0'
import Badge from '../../atoms/badge'
import RfiForm from '../../molecules/rfi-form'
import { MessageCustom } from '@serge/custom-types/message'
import { GameMessagesMockRFI } from '@serge/mocks'
import { mostRecentOnly } from '@serge/helpers'
import { CollaborativeMessageStates } from '@serge/config'

export default {
  title: 'local/organisms/DataTable',
  component: DataTable,
  decorators: [],
  parameters: {
    readme: {
      // Show readme before story
      content: docs
    }
  }
}

const Template: Story<DataTableProps> = args => {
  return (
    <DataTable {...args} />
  )
}

// // deepscan-disable-next-line USELESS_ARROW_FUNC_BIND
// export const Default = Template.bind({})
// Default.args = {
//   columns: ['First column', 'Second column', 'Third column'],
//   data: [
//     ['Row 1 Cell 1', 'Row 1 Cell 2', 'Row 1 Cell 3'],
//     ['Row 2 Cell 1', 'Row 2 Cell 2', 'Row 2 Cell 3']
//   ]
// }

// // deepscan-disable-next-line USELESS_ARROW_FUNC_BIND
// export const WithFilter = Template.bind({})
// WithFilter.args = {
//   columns: [
//     'First column',
//     {
//       filters: [
//         'Completed',
//         'In Progress'
//       ],
//       label: 'Status'
//     },
//     'Third column'
//   ],
//   data: [
//     {
//       ty
//       rowKey: '0',
//       cells: ['Row 1 Cell 1', 'Completed', 'Row 1 Cell 3']
//     },
//     ['Row 2 Cell 1', 'Not Completed', 'Row 2 Cell 3'],
//     ['Row 2 Cell 1', 'Not Completed', 'Row 2 Cell 3'],
//     ['Row 2 Cell 1', 'Completed', 'Row 2 Cell 3'],
//     ['Row 2 Cell 1', 'In Progress', 'Row 2 Cell 3'],
//     ['Row 2 Cell 1', 'Not Completed', 'Row 2 Cell 3']
//   ]
// }

// deepscan-disable-next-line USELESS_ARROW_FUNC_BIND
const rfiMessages = (GameMessagesMockRFI as MessageCustom[])
  .filter((message: MessageCustom) => message.details.messageType === 'RFI')
  // sample data includes multiple versions of RFI messages, ensure we're only
// looking at newest
const newest = mostRecentOnly(rfiMessages) as MessageCustom[]
const longStr = 'asdf akjdsh lajdh alhf aljdskfh alkdj haljkdfh aldksj hasdf akjdsh lajdh alhf aljdskfh alkdj haljkdfh aldksj hasdf akjdsh lajdh alhf aljdskfh alkdj haljkdfh aldksj hasdf akjdsh lajdh alhf aljdskfh alkdj haljkdfh aldksj hasdf akjdsh lajdh alhf aljdskfh alkdj haljkdfh aldksj hasdf akjdsh lajdh alhf aljdskfh alkdj haljkdfh aldksj h'

newest[0].message.Request = longStr
newest[0].details.privateMessage = longStr
newest[0].details.collaboration = {
  status: CollaborativeMessageStates.Released,
  lastUpdated: '2020-03-25T15:08:47.540Z',
  response: longStr + longStr
}

const rfiData: any[][] = []

const data: RowWithCollapsibleType[] = newest.map((message, rowIndex) => {
  const messageItem = (message as MessageCustom)
  const row = [
    messageItem._id,
    messageItem.details.channel,
    messageItem.details.from.roleName,
    messageItem.details.from.forceColor,
    messageItem.message.Title,
      messageItem.details.collaboration?.status,
      messageItem.details.collaboration?.owner
  ]

  console.log(message)

  rfiData.push(row)

  const statusColors = {
    Unallocated: '#B10303',
    'In progress': '#E7740A',
    'Pending review': '#434343',
    Released: '#007219'
  }
  return {
    type: ROW_WITH_COLLAPSIBLE_TYPE,
    rowKey: 'rowKey' + rowIndex,
    collapsible: (): React.ReactElement => (
      <RfiForm onSubmit={console.log} onReject={console.log} message={(newest[rowIndex] as MessageCustom)} />
    ),
    cells: [
      {
        rowkey: 'id',
        type: ROW_DATA_TYPE,
        component: null,
        label: messageItem._id
      },
      {
        rowkey: 'channel',
        type: ROW_DATA_TYPE,
        component: null,
        label: messageItem.details.channel
      },
      {
        rowkey: 'roleName',
        type: ROW_DATA_TYPE,
        component: <Badge customBackgroundColor={messageItem.details.from.forceColor} label={messageItem.details.from.roleName}/>,
        label: messageItem.details.from.roleName
      },
      {
        rowkey: 'Title',
        type: ROW_DATA_TYPE,
        component: null,
        label: messageItem.message.Title
      },
      {
        rowkey: 'status',
        type: ROW_DATA_TYPE,
        component: <Badge customBackgroundColor={messageItem.details.collaboration?.status ? statusColors[messageItem.details.collaboration?.status] : '#434343'} customSize="large" label={messageItem.details.collaboration?.status}/>,
        label: `${messageItem.details.collaboration?.status}`
      },
      {
        rowkey: 'owner',
        type: ROW_DATA_TYPE,
        component: messageItem.details.collaboration?.owner ? <Badge customBackgroundColor="#434343" label={messageItem.details.collaboration?.owner.roleName} /> : null,
        label: ''
      }
    ]
  }
})

const uniqueFieldValues = (messages: any[], col: number): any => {
  // find items with unique items in set column
  const uniqueValues = messages.filter((elem, index) => rfiData.findIndex(obj => obj[col] === elem[col]) === index)
  // produce array with just field of interest
  const values = uniqueValues.map((item: any) => item && item[col])
  // swap undefined for string
  return values.map((item: any) => item === undefined ? '[Undefined]' : item)
}

export const Implementation = Template.bind({})
Implementation.args = {
  columns: [
    'ID',
    {
      filters: uniqueFieldValues(rfiData, 1),
      label: 'Channel'
    },
    {
      filters: uniqueFieldValues(rfiData, 2),
      label: 'From'
    },
    'Title',
    {
      filters: [
        'Unallocated',
        'In Progress',
        'Pending Review',
        'Released'
      ],
      label: 'Status'
    },
    {
      filters: uniqueFieldValues(rfiData, 6),
      label: 'Owner'
    }
  ],
  data
}
