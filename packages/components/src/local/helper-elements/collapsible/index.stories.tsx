import React from 'react'
import { styled } from '@material-ui/core/styles'
import CollapsibleHeader from './header'
import CollapsibleContent from './content'

// Import component files
import Collapsible from './index'
import docs from './README.md'
import { withKnobs } from '@storybook/addon-knobs'

const wrapper: React.FC = (storyFn: any) => <div style={{ height: '600px' }}>{storyFn()}</div>

export default {
  title: 'local/helper-elements/Collapsible',
  component: Collapsible,
  decorators: [withKnobs, wrapper],
  parameters: {
    readme: {
      // Show readme before story
      content: docs
    }
  }
}

const onClick = (): void => {
  console.log('clicked')
}

export const Default: React.FC = () => <Collapsible onClick={onClick}>
  <CollapsibleHeader>Header</CollapsibleHeader>
  <CollapsibleContent>Content</CollapsibleContent>
</Collapsible>

const CustomHeader = ({ onCollapse, collapse }: any): React.ReactElement => {
  const CustomHeaderInner = styled('div')({
    cursor: 'pointer',
    backgroundColor: '#f0f0f0',
    padding: '6px'
  })
  return (
    <CustomHeaderInner onClick={(): Function => onCollapse(!collapse)}>
      Custom Header { collapse ? '-' : '+'}
    </CustomHeaderInner>
  )
}
const CustomContent = ({ collapse }: any): React.ReactElement => {
  const CustomContentInner = styled('div')({
    border: '1px solid #f0f0f0',
    padding: '6px'
  })
  return collapse && <CustomContentInner>Custom Content</CustomContentInner>
}
export const CustomStructure: React.FC = () => (
  <Collapsible
    header={<CustomHeader />}
    content={<CustomContent />}
  />
)

// @ts-ignore TS believes the 'story' property doesn't exist but it does.
Default.story = {
  parameters: {
    options: {
      // This story requires addons but other stories in this component do not
      showPanel: true
    }
  }
}
