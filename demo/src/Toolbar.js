import {
  MarkupButton,
  SectionButton,
  LinkButton,
  SectionSelect
} from 'inferno-mobiledoc-editor'
import { ButtonGroup } from 'inferno-bootstrap'

// TODO: Hook up to .cursorDidChange and force update in order to allow SectionSelect etc. to update.

const Toolbar = (props) =>
  <ButtonGroup {...props}>
    <MarkupButton className="btn btn-secondary" tag='strong' />
    <MarkupButton className="btn btn-secondary" tag='em' />
    <LinkButton className="btn btn-secondary" />
    <SectionSelect tags={["h1", "h2", "h3"]} title="Select..." />
    <SectionButton className="btn btn-secondary" tag='blockquote' />
    <SectionButton className="btn btn-secondary" tag='ul'>UL</SectionButton>
    <SectionButton className="btn btn-secondary" tag='ol'>OL</SectionButton>
  </ButtonGroup>

export default Toolbar