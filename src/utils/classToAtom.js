import { render } from 'inferno'
import { createElement } from 'inferno-create-element'

/*
  _createClass(AtomNode, [{
    key: 'render',
    value: function render() {
      if (!this._rendered) {
        var options = this.atomOptions;
        var env = this.env;
        var _model = this.model;
        var value = _model.value;
        var payload = _model.payload; // cache initial render

        this._rendered = this.atom.render({
          // TODO: Add editor
          options: options,
          env: env,
          value: value,
          payload: payload
        });
      }

      this._validateAndAppendRenderResult(this._rendered);
    }
  }
*/

export const atomRenderer = (component) => ({ editor, env, options, payload, value }) => {
  const { onTeardown } = env

  const element = createElement(component, {
    editor,
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

export const classToDOMAtom = (component, atomRenderer) => {
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

export function utilityToAtom ({ type, RenderComponent }, atomRenderer) {
  return {
    name: RenderComponent.displayName,
    component: RenderComponent,
    type,
    render: atomRenderer(RenderComponent)
  }
}