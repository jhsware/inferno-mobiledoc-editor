import { Utility } from 'component-registry'
import { Component, Fragment } from 'inferno'
import { Schema, TextAreaField, TextField } from 'isomorphic-schema'
import { ImageField } from './ImageUploadWidget'
import axios from 'axios'

import {
  Form,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Media,
  MediaBody,
  Image } from 'inferno-bootstrap'
import { FormRows } from 'inferno-formlib'

import { IMobileDocCardUtil } from './interfaces'
import './ReviewCard.scss'

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

const formSchema = new Schema('OtherCardForm', {
  productURL: new TextField({
    label: 'Product URL'
  }),
  productImgSrc: new ImageField({
    label: 'Product Image URI',
    uploadUtilName: 'Image.Simple',
    placeholder: 'Click or drag to upload...',
    required: true
  }),
  title: new TextField({
    label: 'Title'
  }),
  description: new TextAreaField({
    label: 'Description'
  }),
  sizeNotes: new TextAreaField({
    label: 'Size Notes'
  })
})

class ReviewRender extends Component {

  render ({ isInEditor, payload, edit }) {
    const onClick = isInEditor ? edit : null
    return (
      <Media vertical className="AdvancedCard">
        <Image src={payload.productImgSrc} onClick={onClick} />
        <MediaBody>
          <h2>{payload.title}</h2>
          <p>{payload.description}</p>
          <p>{payload.sizeNotes}</p>
          <p><a href={payload.productURL} target="_blank">Till butiken...</a></p>
        </MediaBody>
        {isInEditor && <Button color="link" onClick={onClick} style={{position: 'absolute', right: 0, top: 0, color: 'white'}}>Edit</Button>}
      </Media>
    )
  }
}

function ProductImgPreview ({ onSelect, src}) {
  return (
    <div className="ReviewModal-ImageSelectorOption" onClick={(e) => { e.preventDefault(); onSelect(src)}}>
      <img src={src} alt="" />
    </div>
  )
}

class ReviewEdit extends Component {

  constructor (props) {
    super(...arguments)

    this.didSelectImage = this.didSelectImage.bind(this)
    this.didChange = this.didChange.bind(this)
    this.doSubmit = this.doSubmit.bind(this)
    this.doCancel = this.doCancel.bind(this)

    this.state = {
      validationErrors: undefined,
      value: Object.assign({}, props.payload),
      imgLst: [],
      isOpen: true
    }

    // Prevents animations on mounting of form
    this.isMounted = false
  }

  componentDidMount () {
    this.isMounted = true
  }

  async _updateProductImgSelection (URI) {
    try {
      const { data: { htmlBody } } = await axios.get('/scrape?uri=' + URI)
      const frag = document.createDocumentFragment()
      const el = document.createElement('div')
      el.innerHTML = htmlBody
      frag.append(el)
      const tmpImg = frag.querySelectorAll('img')
      const baseURI = URI.split('/').slice(0, 3).join('/')
      const imgLst = []
      tmpImg.forEach((imgNode) => {
        const src = imgNode.attributes['src'].nodeValue
        
        // Only show jpg images
        if (src[0] !== '/' || src.indexOf('.jpg') < 0) return

        imgLst.push(baseURI + src)
      })
      this.setState({
        imgLst
      })
    } catch (e) {
      console.error(e)
    }
  }

  didChange (propName, value) {
    const newValue = this.state.value
    newValue[propName] = value
    
    if (propName === 'productURL' && value) {
      this._updateProductImgSelection(value)
    }
    
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

  didSelectImage (src) {
    const newVal = this.state.value
    newVal.productImgSrc = src
    this.setState({
      value: newVal
    })
  }

  render () {
    const imgLst = this.state.imgLst

    return (
      <div>
        {this.props.children}

        <Modal className="ReviewModal" isOpen={this.state.isOpen} toggle={this.doCancel}>
          <Form onSubmit={this.doSubmit}>
            <ModalHeader>
              Edit Review Card
            </ModalHeader>
            <ModalBody>
              <div className="ReviewModal-ImageSelector">
                {Array.isArray(imgLst) && imgLst.map((imgSrc) => <ProductImgPreview onSelect={this.didSelectImage} src={imgSrc} />)}
              </div>
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
  name: 'ReviewCard',
  type: 'dom',
  RenderComponent: ReviewRender,
  EditComponent: ReviewEdit
})

export class ReviewButton extends Component {
  constructor () {
    super(...arguments)

    this.state = {
      showModal: false
    }

    this.doShowModal = this.doShowModal.bind(this)
    this.doHideModal = this.doHideModal.bind(this)
    this.doSubmit = this.doSubmit.bind(this)
  }

  doShowModal () {
    // Store editor state som we can restore range selection
    const { editor } = this.context
    this.setState({
      showModal: true,
      range: editor.range
    })
  }

  doHideModal () {
    this.setState({
      showModal: false,
      range: undefined
    })
  }

  doSubmit (payload) {
    const { editor } = this.context

    editor.run(postEditor => {
      let position
      if (editor.post.isBlank) {
        const p = postEditor.builder.createMarkupSection('p')
        postEditor.insertSection(p)
        // postEditor.setRange(postEditor.editor.post.sections.head.headPosition())
        position = postEditor.editor.post.headPosition()
      } else {
        let { range } = this.state;
        position = range.tail;
      }
      
      /*
      if (!range.isCollapsed) {
        position = postEditor.deleteRange(range);
      }
      */
     
      let section = position.section;
      if (section.isNested) { section = section.parent; }
     
      let collection = editor.post.sections;
      const card = postEditor.builder.createCardSection('ReviewCard', payload);
      postEditor.insertSectionBefore(collection, card, section);

      // It is important to explicitly set the range to the end of the card.
      // Otherwise it is possible to create an inconsistent state in the
      // browser. For instance, if the user clicked a button that
      // called `editor.insertCard`, the editor surface may retain
      // the selection but lose focus, and the next keystroke by the user
      // will cause an unexpected DOM mutation (which can wipe out the
      // card).
      // See: https://github.com/bustle/mobiledoc-kit/issues/286
      postEditor.setRange(section.tailPosition());
    })

    this.setState({
      showModal: false,
      range: undefined
    })
  }

  render () {
    return (
      <Fragment>
        {this.state.showModal && <ReviewEdit save={this.doSubmit} cancel={this.doHideModal} />}
        <Button onClick={this.doShowModal}>Rev</Button>
      </Fragment>
    )
  }
}
