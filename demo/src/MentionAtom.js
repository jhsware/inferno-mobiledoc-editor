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

class Mention extends Component {

  constructor () {
    super(...arguments)

    this.state = {
      text: '',
      options: [
        { name: 'jane', title: 'Jane'},
        { name: 'jane', title: 'Jessica'},
        { name: 'jane', title: 'John'},
        { name: 'jane', title: 'Justine'}
      ]
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

  onTextInput (editor, matches) {
    this.setState({
      text: matches.input,
      options: this.state.options.filter((opt) => opt.title.toLowerCase().startsWith(matches.input.toLowerCase()))
    })
  }

  didSelect (val) {
    const { editor, payload, save } = this.props
    const { name, title } = val
    let { range } = editor
    
    save(title, { ...payload, name })

    editor.run(postEditor => {
      const units = this.state.text.length
      const newRange = new Range(range.tail.move(-units), range.tail, 1);
      postEditor.deleteRange(newRange)
      
      const nextPos = newRange.head
      postEditor.setRange(nextPos)
      
      this.setState({
        text: ''
      })
    })
  }

  render ({ value }) {

    return (
      <i className="Mention">
        @{value}
        {!value &&
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
