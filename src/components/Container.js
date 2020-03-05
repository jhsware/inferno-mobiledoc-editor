import { Component } from 'inferno'
import Mobiledoc from 'mobiledoc-kit'

if (typeof requestAnimationFrame === 'undefined') {

}

export const EMPTY_MOBILEDOC = {
  version: "0.3.0",
  markups: [],
  atoms: [],
  cards: [],
  sections: []
}

const defaultProps = {
  atoms: [],
  autofocus: true,
  cardProps: {},
  cards: [],
  placeholder: "",
  serializeVersion: "0.3.0",
  spellcheck: true
}

class Container extends Component {
  
  constructor (props) {
    super(...arguments)

    this.state = {
      activeMarkupTags: [],
      activeSectionTags: []
    }

    this.setActiveTags = this.setActiveTags.bind(this)
  }

  /*
  propTypes: {
    atoms: PropTypes.array,
    autofocus: PropTypes.bool,
    cards: PropTypes.array,
    didCreateEditor: PropTypes.func,
    html: PropTypes.string,
    mobiledoc: PropTypes.object,
    onChange: PropTypes.func,
    options: PropTypes.object,
    placeholder: PropTypes.string,
    serializeVersion: PropTypes.string,
    spellcheck: PropTypes.bool,
    willCreateEditor: PropTypes.func
  },

  childContextTypes: {
    editor: PropTypes.object,
    activeMarkupTags: PropTypes.array,
    activeSectionTags: PropTypes.array
  },
  */

  getChildContext() {
    return {
      editor: this.editor,
      activeMarkupTags: this.state.activeMarkupTags,
      activeSectionTags: this.state.activeSectionTags
    }
  }

  _onAnimationFrame () {
    this.props.onAnimFrame(this.editor)
    this._animFrameTick = requestAnimationFrame(() => this._onAnimationFrame())
  }

  componentWillMount() {
    if (typeof this.props.willCreateEditor === 'function') {
      this.props.willCreateEditor()
    }

    const mobiledoc = this.props.mobiledoc || EMPTY_MOBILEDOC
    const { atoms, autofocus, cardProps, cards, html, placeholder, serializeVersion, spellcheck } = this.props
    const editorOptions = { ...this.props.options, atoms, autofocus, cardOptions: { cardProps }, cards, html, mobiledoc, placeholder, serializeVersion, spellcheck }
    this.editor = new Mobiledoc.Editor(editorOptions)

    this.editor.inputModeDidChange(this.setActiveTags)

    const {
      onChange,
      didCreateEditor,
      onCursorDidChange,
      onAnimFrame
    } = this.props

    if (typeof onChange === 'function') {
      this.editor.postDidChange(() => {
        const mobiledoc = this.editor.serialize(this.props.serializeVersion)
        onChange(mobiledoc)
      })
    }

    if (typeof didCreateEditor === 'function') {
      didCreateEditor(this.editor)
    }

    if (typeof onCursorDidChange === 'function') {
      this.editor.cursorDidChange(() => onCursorDidChange(this.editor))
    }

    if (typeof this.props.onAnimFrame === 'function') {
      // Do nothing if we are doing SSR
      if (typeof requestAnimationFrame !== 'undefined') {
        this._onAnimationFrame()
      }
    }
  }

  componentWillUnmount() {
    this._animFrameTick && cancelAnimationFrame(this._checkCursorPosAnimFrame)
    this.editor.destroy()
  }

  
  setActiveTags() {
    this.setState({
      activeMarkupTags: this.editor.activeMarkups.map(m => m.tagName),
      // editor.activeSections are leaf sections.
      // Map parent section tag names (e.g. 'p', 'ul', 'ol') so that list buttons
      // are updated.
      activeSectionTags: this.editor.activeSections.map(s => {
        return s.isNested ? s.parent.tagName : s.tagName
      })
    })
  }

  render() {
    /* eslint-disable no-unused-vars */
    /* deconstruct out non-React props before passing to children */
    const { atoms, autofocus, cardProps, cards, children, didCreateEditor, html, mobiledoc, options,placeholder, serializeVersion, spellcheck, willCreateEditor, ...componentProps } = this.props
    /* eslint-enable no-unused-vars */
    return <div {...componentProps}>{children}</div>
  }
}

Container.defaultProps = defaultProps

export default Container
