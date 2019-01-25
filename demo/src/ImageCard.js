import { Utility } from 'component-registry'
import { Component } from 'inferno'

import { Schema, TextField, TextAreaField } from 'isomorphic-schema'

import {
  Form,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter } from 'inferno-bootstrap'
import { FormRows } from 'inferno-formlib'

import { IMobileDocCardUtil } from './interfaces'



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

const formSchema = new Schema('ImageCardForm', {
  src: new TextField({
    label: 'Image URI',
    required: true
  }),
  caption: new TextAreaField({
    label: 'Caption'
  })
})

class ImageRender extends Component {

  render ({ isInEditor, payload, edit }) {
    const onClick = isInEditor ? edit : null
    return (
      <div style={{position: 'relative'}}>
        <div>
          <img src={payload.src} onClick={onClick} />
        </div>
        <div>
          <small>{payload.caption}</small><br />
        </div>
        {isInEditor && <Button color="link" onClick={onClick} style={{position: 'absolute', right: 0, top: 0, color: 'white'}}>Edit</Button>}
      </div>
    )
  }
}


class ImageEdit extends Component {

  constructor (props) {
    super(...arguments)

    this.didChange = this.didChange.bind(this)
    this.doSubmit = this.doSubmit.bind(this)
    this.doCancel = this.doCancel.bind(this)

    this.state = {
      validationErrors: undefined,
      value: Object.assign({}, props.payload),
      isOpen: true
    }

    // Prevents animations on mounting of form
    this.isMounted = false
  }

  componentDidMount () {
    this.isMounted = true
  }

  didChange (propName, value) {
    const newValue = this.state.value
    newValue[propName] = value
    this.setState({
      value: newValue
    })
  }

  doCancel () {
    // TODO: Check if dirty
    this.setState({ isOpen: false })
    setTimeout(() => this.props.cancel(), 300)
  }

  doSubmit (e) {
    e.preventDefault()
    const validationErrors = formSchema.validate(this.state.value)
    this.setState({
      validationErrors
    })

    if (validationErrors === undefined) {
      // Submit changes
      this.setState({ isOpen: false })
      setTimeout(() => this.props.save(this.state.value), 300)
    } else {
      // TODO: Show error message
    }
  }

  render () {
    return (
      <div>
        {this.props.children}

        <Modal isOpen={this.state.isOpen} toggle={this.doCancel}>
          <Form onSubmit={this.doSubmit}>
            <ModalHeader>
              Edit Image Card
            </ModalHeader>
            <ModalBody>
              <FormRows
                value={this.state.value}
                schema={formSchema}
                validationErrors={this.state.validationErrors}
                isMounted={this.isMounted}

                onChange={this.didChange} />
            </ModalBody>
            <ModalFooter>
              <Button onClick={this.doCancel} color="link">Cancel</Button>
              <Button type="submit" color="success">Save</Button>
            </ModalFooter>
          </Form>
        </Modal>
      </div>
    )
  }
}

new Utility({
  implements: IMobileDocCardUtil,
  name: 'ImageCard',
  type: 'dom',
  RenderComponent: ImageRender,
  EditComponent: ImageEdit
})

