import { render } from 'inferno'
import { createElement } from 'inferno-create-element'

const cardRenderer = (component, isEditing = false) => ({ env, options, payload }) => {
  const targetNode = document.createElement('div')
  const { didRender, onTeardown } = env

  didRender(() => {
    payload = { ...payload } // deref payload
    const { cardProps } = options
    const element = createElement(component, { ...env, ...cardProps, payload, isEditing })
    render(element, targetNode)
  })

  onTeardown(() => render(null, targetNode))

  return targetNode
}

export const classToDOMCard = (component) => {
  if (!component.displayName) {
    throw new Error("Can't create card from component, no displayName defined: " + component)
  }

  return {
    name: component.displayName,
    // component,
    type: 'dom',
    render: cardRenderer(component),
    edit: cardRenderer(component, true)
  }
}
