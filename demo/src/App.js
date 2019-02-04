import { Component } from 'inferno'
import { globalRegistry } from 'component-registry'
import { IMobileDocCardUtil, IMobileDocAtomUtil } from './interfaces'
import { utilityToCard, utilityToAtom } from 'inferno-mobiledoc-editor'

import * as ReactMobiledoc from 'inferno-mobiledoc-editor'
import Toolbar from './Toolbar'

import './ClickCounterAtom'
import { MentionInputHandler } from './MentionAtom'
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
          <MentionInputHandler />
          <Toolbar className="Toolbar" />
          <ReactMobiledoc.Editor />
        </ReactMobiledoc.Container>
      </div>
    );
  }
}

export default App;
