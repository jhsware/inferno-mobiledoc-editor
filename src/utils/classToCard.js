import { render } from 'inferno'
import { createElement } from 'inferno-create-element'

export function cardRenderer(component, innerComponent, deserializeUtil) {
  return ({ env, options, payload }) => {
    const targetNode = document.createElement('div')
    const { didRender, onTeardown } = env
    didRender(() => {
      const { context } = this

      payload = { ...payload } // deref payload

      // The deserializeUtil allows you to set types properly on content that has been pasted
      if (deserializeUtil) {
        payload = deserializeUtil.deserialize(payload)
      }

      const { cardProps } = options

      // This is to allow the rendered content to stay visible during editing
      // so we don't break the content when editing by means of a modal
      let children
      if (innerComponent) {
        children = createElement(innerComponent, { ...env, ...cardProps, payload, context }, )
      }
      const element = createElement(component, { ...env, ...cardProps, payload, context }, children)
      render(element, targetNode)
    })

    onTeardown(() => render(null, targetNode))

    return targetNode
  }
}

export function utilityToCard (utility, cardRenderer, deserializeUtil) {
  return {
    name: utility._name,
    type: utility.type,
    render: cardRenderer(utility.RenderComponent, undefined, deserializeUtil),
    edit: cardRenderer(utility.EditComponent, utility.RenderComponent, deserializeUtil)
  }
}