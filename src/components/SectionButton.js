import classNames from 'classnames'
import titleCase from '../utils/titleCase'

const SectionButton = ({ tag = '', type = 'button', children = titleCase(tag), className, ...props }, { editor, activeSectionTags = []}) => {
  const onClick = () => editor.toggleSection(tag)
  className = classNames(className, {
    active: activeSectionTags.indexOf(tag.toLowerCase()) > -1
  })
  props = { type, ...props, onClick, className }
  return <button { ...props }>{children}</button>
}

/*
SectionButton.propTypes = {
  tag: PropTypes.string.isRequired,
  children: PropTypes.node
}

SectionButton.contextTypes = {
  editor: PropTypes.object,
  activeSectionTags: PropTypes.array
}
*/

export default SectionButton
