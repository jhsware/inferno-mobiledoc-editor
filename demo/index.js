import { render } from 'inferno'

import * as ReactMobiledoc from '../src'
import ImageCard from './ImageCard'
import ClickCounterAtom from './ClickCounterAtom'

const mobiledoc = {
  version: "0.3.0",
  markups: [],
  atoms: [],
  cards: [],
  sections: [
  ]
}

const willCreateEditor = () => { console.log('creating editor...') }
const didCreateEditor = (e) => { console.log('created editor:', e) }
const onChange = (doc) => { console.log(doc) }

const config = {
  mobiledoc,
  cards: [ImageCard],
  atoms: [ClickCounterAtom],
  placeholder: "Welcome to Mobiledoc!",
  willCreateEditor,
  didCreateEditor,
  onChange
}

const imgPayload = { caption: "Edit this right meow!", src: "http://www.placekitten.com/200/200" }


const ImageButton = (props, context) => {
  const { isEditing } = props
  const { editor } = context

  const onClick = () => editor.insertCard('ImageCard', imgPayload, isEditing)
  return <button onClick={onClick}>Image Card</button>
}

/*
ImageButton.contextTypes = {
  editor: PropTypes.object
}
*/

const ClickCounterButton = (props, context) => {
  const { editor } = context
  const onClick = () => editor.insertAtom('Counter', '', { clicks: 0 })
  return <button onClick={onClick}>Click Counter Atom</button>
}

/*
ClickCounterButton.contextTypes = {
  editor: PropTypes.object
}
*/



render(
  <ReactMobiledoc.Container {...config}>
    <ReactMobiledoc.Toolbar />
    <ImageButton />
    <ClickCounterButton />
    <ReactMobiledoc.Editor />
  </ReactMobiledoc.Container>,
  document.getElementById('root')
)

// require("!style-loader!css-loader!../node_modules/mobiledoc-kit/dist/css/mobiledoc-kit.css")
