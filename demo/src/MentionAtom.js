import { Component } from 'inferno'
import { Utility } from 'component-registry'
import { IMobileDocAtomUtil } from './interfaces'
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
  return <div className="DropdownListItem" onClick={() => context.onSelect(props.children)}>{props.children}</div>
}

function Mention ({ payload, save, value }) {

  return (
    <i className="Mention">
      @{value}
      {!value &&
        <DropdownList onSelect={(name) => {
            save(name, { ...payload, name })
            /*
            const { range } = editor
            editor.run(postEditor => {
              range.extend(name.length)
              const nextPos = range.tail
              postEditor.setRange(nextPos)
            })
            */
          }}>
          <DropdownListItem>Jane</DropdownListItem>
          <DropdownListItem>Jesper</DropdownListItem>
          <DropdownListItem>Jossan</DropdownListItem>
        </DropdownList>
      }</i>
  )
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
    match: /\s?@$/,
    run(editor) {
      replaceWithMention(editor)
    }
  })
  return null
}
