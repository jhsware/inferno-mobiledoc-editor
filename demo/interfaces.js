import { createInterface } from 'component-registry'

export const IMobileDocCardUtil = createInterface({
  name: 'IMobileDocCardUtil',
  members: {
    type: 'String',
    render: 'Component',
    edit: 'Component'
  }
})

export const IMobileDocAtomUtil = createInterface({
  name: 'IMobileDocAtomUtil',
  members: {
    type: 'String',
    render: 'Component'
  }
})

