import { Component } from 'inferno'
import { globalRegistry } from 'component-registry'
import { IMobileDocCardUtil, IMobileDocAtomUtil } from './interfaces'
import { utilityToCard, utilityToAtom } from 'inferno-mobiledoc-editor'

import { Button, ButtonGroup } from 'inferno-bootstrap'

import * as ReactMobiledoc from 'inferno-mobiledoc-editor'
import Toolbar from './Toolbar'
import './ImageCard'
import './ClickCounterAtom'
import './App.css';

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

const cardUtils = globalRegistry.getUtilities(IMobileDocCardUtil)
const atomUtils = globalRegistry.getUtilities(IMobileDocAtomUtil)

const config = {
  mobiledoc,
  cards: cardUtils.map(utilityToCard),
  atoms: atomUtils.map(utilityToAtom), // [ClickCounterAtom], // atomUtils.map(utilityToAtom),
  placeholder: "Welcome to Mobiledoc!",
  willCreateEditor,
  didCreateEditor,
  onChange
}

const imgPayload = { caption: "Edit this right meow!", src: "http://www.placekitten.com/300/200" }


const ImageButton = (props, context) => {
  const { isEditing } = props
  const { editor } = context

  const onClick = () => editor.insertCard('ImageCard', imgPayload, isEditing)
  return <Button onClick={onClick}>Image Card</Button>
}

/*
ImageButton.contextTypes = {
  editor: PropTypes.object
}
*/

const ClickCounterButton = (props, context) => {
  const { editor } = context
  const onClick = () => editor.insertAtom('Counter', '', { clicks: 0 })
  return <Button onClick={onClick}>Click Counter Atom</Button>
}

/*
ClickCounterButton.contextTypes = {
  editor: PropTypes.object
}
*/

class App extends Component {
  render() {
    return (
      <div className="App">
        <ReactMobiledoc.Container {...config}>
          <Toolbar className="Toolbar" />
          <ButtonGroup className="Toolbar">
            <ImageButton />
            <ClickCounterButton />
          </ButtonGroup>
          <ReactMobiledoc.Editor />
        </ReactMobiledoc.Container>
      </div>
    );
  }
}

export default App;
