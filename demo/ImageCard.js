import { Component } from 'inferno'
import { classToDOMCard } from '../src'

/**
 * Component-based cards are rendered with these props:
 *
 * - `payload` The payload for this card. Note: the payload object is
 *    disconnected from the card's payload in the serialized mobiledoc.
 *    To update the mobiledoc payload, use the `save` callback.
 * - `edit` A callback for toggling this card into edit mode (no-op
 *    if the card is already in edit mode).
 * - `remove` A callback for removing this card.
 * - `save` A callback accepting new payload for the card, then
 *    saving that payload and toggling this card into display mode.
 *    Can optionally be passed an extra `false` argument to avoid
 *    toggling to display mode.
 * - `cancel` A callback for toggling this card to display mode
 *    without saving (a no-op if the card is already in display mode).
 * - `name` The name of this card.
 * - `postModel` A reference to this card's model in the editor's
 *    abstract tree. This may be necessary to do programmatic editing.
 * - `isEditing` A bool indicating if the card is in Edit mode or not.
 * - `isInEditor` A bool indicating if the card is displayed inside an
 *    editor interface or not.
 */
class Image extends Component {

  render() {
    const { isInEditor, payload, save, edit, isEditing } = this.props
    if (isEditing) {
      return (
        <div>
          <input type="text" ref="src" defaultValue={payload.src} /><br />
          <input type="text" ref="caption" defaultValue={payload.caption} /><br />
          <button onClick={() => save({ src: this.refs.src.value, caption: this.refs.caption.value })}>Save</button>
        </div>
      )
    } else {
      const onClick = isInEditor ? edit : null
      return (
        <div>
          <img src={payload.src} onClick={onClick} /><br />
          <small>{payload.caption}</small><br />
          {isInEditor && <button onClick={onClick}>Edit</button>}
        </div>
      )
    }
  }
}

Image.displayName = 'ImageCard'

const ImageCard = classToDOMCard(Image)

export default ImageCard
