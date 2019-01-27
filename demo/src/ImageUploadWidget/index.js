import { Adapter } from 'component-registry'
import { IImageField, ImageField } from './ImageField'
import ImageFieldWidget from './ImageFieldWidget'
import { interfaces } from 'inferno-formlib'
import './FileUploadUtil'

const { IInputFieldWidget } = interfaces

new Adapter({
  implements: IInputFieldWidget,
  adapts: IImageField,
  Component: ImageFieldWidget
})

export {
  IImageField, 
  ImageField,
  ImageFieldWidget
}