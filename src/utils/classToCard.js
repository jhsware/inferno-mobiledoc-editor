import { render } from 'inferno'
import { createElement } from 'inferno-create-element'

export const cardRenderer = (component, innerComponent) => ({ env, options, payload }) => {
  const targetNode = document.createElement('div')
  const { didRender, onTeardown } = env

  didRender(() => {
    payload = { ...payload } // deref payload
    const { cardProps } = options

    // This is to allow the rendered content to stay visible during editing
    // so we don't break the content when editing by means of a modal
    let children
    if (innerComponent) {
      children = createElement(innerComponent, { ...env, ...cardProps, payload }, )
    }
    const element = createElement(component, { ...env, ...cardProps, payload }, children)
    render(element, targetNode)
  })

  onTeardown(() => render(null, targetNode))

  return targetNode
}

export function utilityToCard (utility) {
  return {
    name: utility._name,
    type: utility.type,
    render: cardRenderer(utility.RenderComponent),
    edit: cardRenderer(utility.EditComponent, utility.RenderComponent)
  }
}