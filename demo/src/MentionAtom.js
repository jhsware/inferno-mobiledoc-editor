import { Component } from 'inferno'
import { Utility } from 'component-registry'
import { IMobileDocAtomUtil } from './interfaces'
import { Range } from 'mobiledoc-kit'
import './MentionAtom.scss'

/**
 * Component-based atoms are rendered with these props:
 *
 * - `value`: The textual representation to for this atom.
 * - `payload`: The payload for this atom. Please note the payload object is
 *    disconnected from the atom's representation in the serialized mobiledoc to
 *    update the payload as it exists in the mobiledoc, use the `save` callback.
 * - `save`: A callback which accepts a new payload for the card, then saves that
 *    value and payload to the underlying mobiledoc.
 * - `name`: The name of this card.
 * - `onTeardown`: A callback that can be called when the rendered content is torn down.
 */

class DropdownList extends Component {
  getChildContext () {
    return {
      onSelect: this.props.onSelect
    }
  }
  render () {
    return <div className="DropdownList">{this.props.children}</div>
  }
}

function DropdownListItem (props, context) {
  return <div className="DropdownListItem" onClick={() => context.onSelect(props.value)}>{props.children}</div>
}

const lst = [
  { name: 'jane', title: 'Jane'},
  { name: 'jane', title: 'Jessica'},
  { name: 'jane', title: 'John'},
  { name: 'jane', title: 'Justine'}
]

class Mention extends Component {

  constructor ({ value }) {
    super(...arguments)

    this.state = {
      options: lst.filter((opt) => opt.title.toLowerCase().startsWith(value.toLowerCase()))
    }

    this.didSelect = this.didSelect.bind(this)
    this.onTextInput = this.onTextInput.bind(this)
  }

  componentDidMount () {
    this._onTextInput = this.props.editor.addEventListener('onTextInput', this.onTextInput)
  }

  componentWillUnmount () {
    this.props.editor.removeEventListener('onTextInput', this._onTextInput)
  }

  onTextInput (editor, char) {
    // Don't capture if payload is set
    const { payload: { name } } = this.props
    if (name) return

    // Enter triggers selection
    if (char === '\n') {
      const { save } = this.props
      return save(this.state.options[0].title, this.state.options[0])
      
      // TODO: Delete the newline
      /*
      const { range } = editor
      return editor.run(postEditor => {
        const newRange = new Range(range.tail.move(1), range.tail, -1);
        postEditor.deleteRange(newRange)
      })
      */
    }

    // Otherwise go ahead
    const { save, value } = this.props
    save(value + char)

    const { range } = editor

    editor.run(postEditor => {
      const newRange = new Range(range.tail.move(-1), range.tail, 1);
      postEditor.deleteRange(newRange)
      
      const nextPos = newRange.head
      postEditor.setRange(nextPos)
    })
  }

  didSelect (val) {
    const { editor, save } = this.props
    const { title } = val
    const { range } = editor
    
    save(title, val)

    editor.run(postEditor => {
      postEditor.setRange(range.tail)
    })
  }

  render ({ value, payload: { name } }) {

    return (
      <i className="Mention">
        @{value}
        {!name &&
          <DropdownList onSelect={this.didSelect}>
              {this.state.options.map((item) => <DropdownListItem value={item}>{item.title}</DropdownListItem>)}
          </DropdownList>
        }</i>
    )
  }
}

Mention.displayName = 'Mention'

new Utility({
  implements: IMobileDocAtomUtil,
  name: Mention.displayName,
  type: 'dom',
  RenderComponent: Mention,
})

function replaceWithMention (editor) {
  const { range } = editor
  
  editor.run(postEditor => {
    const position = range.head
    const atom = postEditor.builder.createAtom('Mention', undefined, { name: '' })
    const insertPos = postEditor.deleteFrom(position)
    const nextPos = postEditor.insertMarkers(insertPos, [atom])
    postEditor.setRange(nextPos)
  });
}

export const MentionInputHandler = (props, context) => {
  context.editor.onTextInput({
    name: 'mention',
    match: /^(@\S*)|\s(@\S*)/,
    run(editor, matches) {
      replaceWithMention(editor)
    }
  })
  return null
}
