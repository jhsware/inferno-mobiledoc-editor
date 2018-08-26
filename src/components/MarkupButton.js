import classNames from 'classnames'
import titleCase from '../utils/titleCase'

const MarkupButton = ({ tag = '', type = 'button', children = titleCase(tag), className, ...props }, { editor, activeMarkupTags = []}) => {
  const onClick = () => editor.toggleMarkup(tag)
  className = classNames(className, {
    active: activeMarkupTags.indexOf(tag.toLowerCase()) > -1
  })
  props = { type, ...props, onClick, className }
  return <button { ...props }>{children}</button>
}

/*
MarkupButton.propTypes = {
  tag: PropTypes.string.isRequired,
  children: PropTypes.node
}

MarkupButton.contextTypes = {
  editor: PropTypes.object,
  activeMarkupTags: PropTypes.array
}
*/

export default MarkupButton
