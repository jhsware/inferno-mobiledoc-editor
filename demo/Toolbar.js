import MarkupButton from '../src/components/MarkupButton'
import SectionButton from '../src/components/SectionButton'
import LinkButton from '../src/components/LinkButton'
import SectionSelect from '../src/components/SectionSelect'
import { Button, ButtonGroup } from 'inferno-bootstrap'

const Toolbar = (props) =>
  <ButtonGroup {...props}>
    <MarkupButton className="btn btn-secondary" tag='strong' />
    <MarkupButton className="btn btn-secondary" tag='em' />
    <LinkButton className="btn btn-secondary" />
    Style: <SectionSelect tags={["h1", "h2", "h3"]} />
    <SectionButton className="btn btn-secondary" tag='blockquote' />
    <SectionButton className="btn btn-secondary" tag='ul'>UL</SectionButton>
    <SectionButton className="btn btn-secondary" tag='ol'>OL</SectionButton>
  </ButtonGroup>

export default Toolbar