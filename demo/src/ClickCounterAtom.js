import { Component } from 'inferno'
import { Utility } from 'component-registry'
import { IMobileDocAtomUtil } from './interfaces'

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

function Counter ({ payload, save, value }) {
  let { clicks = 0 } = payload
  return (
    <button onClick={() => { clicks++; save(value, { ...payload, clicks }) }}>
      Clicks: {clicks}
    </button>
  )
}

Counter.displayName = 'Counter'

new Utility({
  implements: IMobileDocAtomUtil,
  name: Counter.displayName,
  type: 'dom',
  RenderComponent: Counter,
})
