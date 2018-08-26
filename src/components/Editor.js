import { Component } from 'inferno'

class Editor extends Component {

  /*
  contextTypes: {
    editor: PropTypes.object
  },
  */

  componentDidMount() {
    const { editor } = this.context
    if (editor) {
      editor.render(this.editorEl)
    }
  }

  render() {
    return <div ref={(el) => this.editorEl = el} {...this.props} />
  }
}

export default Editor
