import { Component } from 'inferno'
import {
  ButtonDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem
} from 'inferno-bootstrap'

class SectionSelect extends Component {
  constructor(props) {
    super(props)

    this.state = {
      dropdownOpen: false
    }

    this.toggle = this.toggle.bind(this)
    this.didSelect = this.didSelect.bind(this)
  }

  _activeTag ({ tags = [] }, state, { activeSectionTags = []}) {
    return tags.find((t) => Array.isArray(activeSectionTags) ? activeSectionTags.includes(t) : false)
  }

  didSelect (val) {
    const tag = val || this._activeTag()
    this.context.editor.toggleSection(tag)
  }

  toggle() {
    this.setState({
      dropdownOpen: !this.state.dropdownOpen
    })
  }

  render ({ tags = [] }) {
    return (
      <ButtonDropdown isOpen={this.state.dropdownOpen} onChange={this.didSelect} toggle={this.toggle}>
        <DropdownToggle caret>{this._activeTag(...arguments) || 'Select...'}</DropdownToggle>
        <DropdownMenu>
          { tags.map((t) => <DropdownItem onClick={() => this.didSelect(t)}>{t}</DropdownItem>) }
        </DropdownMenu>
      </ButtonDropdown>
    )
  }
}

/*
const SectionSelect =  => {

  const onChange = (event) => {
    const tag = event.target.value || activeTag()
    editor.toggleSection(tag)
  }

  return (
    <select value={activeTag() || ""} onChange={onChange} {...props}>
      <option value=""></option>
      { tags.map((t) => <option value={t} key={t}>{t.toUpperCase()}</option>) }
    </select>
  )
}
*/

/*
SectionSelect.propTypes = {
  tags: PropTypes.arrayOf(PropTypes.oneOf(['p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'blockquote', 'aside'])).isRequired
}

SectionSelect.contextTypes = {
  editor: PropTypes.object,
  activeSectionTags: PropTypes.array
}
*/

export default SectionSelect
