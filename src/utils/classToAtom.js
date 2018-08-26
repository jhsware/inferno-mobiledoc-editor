import { render } from 'inferno'
import { createElement } from 'inferno-create-element'

const atomRenderer = (component) => ({ env, options, payload, value }) => {
  const { onTeardown } = env

  const element = createElement(component, {
    ...env,
    ...options,
    value,
    payload: { ...payload }
  })

  const targetNode = document.createElement('span')
  render(element, targetNode)

  onTeardown(() => render(null, targetNode))

  return targetNode
}

export const classToDOMAtom = (component) => {
  if (!component.displayName) {
    throw new Error(
      `Can't create atom from component, no displayName defined: ${component}`
    )
  }

  return {
    name: component.displayName,
    component,
    type: 'dom',
    render: atomRenderer(component)
  }
}
