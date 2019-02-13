import {
  MarkupButton,
  SectionButton,
  LinkButton,
  SectionSelect
} from 'inferno-mobiledoc-editor'
import { ButtonGroup, Button } from 'inferno-bootstrap'
import { ImageButton } from './ImageCard'
import { AdvancedButton } from './AdvancedCard'

// TODO: Hook up to .cursorDidChange and force update in order to allow SectionSelect etc. to update.
const ClickCounterButton = (props, context) => {
  const { editor } = context
  const onClick = () => editor.insertAtom('Counter', '', { clicks: 0 })
  return <Button onClick={onClick}>Click Counter Atom</Button>
}

const Toolbar = (props) =>
  <ButtonGroup {...props}>
    <MarkupButton className="btn btn-secondary" tag='strong' />
    <MarkupButton className="btn btn-secondary" tag='em' />
    <LinkButton className="btn btn-secondary" />
    <SectionSelect tags={["h1", "h2", "h3", "p"]} title="Other..." />
    <SectionButton className="btn btn-secondary" tag='blockquote' />
    <SectionButton className="btn btn-secondary" tag='ul'>UL</SectionButton>
    <SectionButton className="btn btn-secondary" tag='ol'>OL</SectionButton>
    <ImageButton />
    <AdvancedButton />
    <ClickCounterButton />
  </ButtonGroup>

export default Toolbar