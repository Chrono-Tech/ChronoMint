import React from 'react'
import { mount } from 'enzyme'

import { ModalStack } from 'components/common/ModalStack/ModalStack'
import { ModalDialog } from 'components/dialogs/ModalDialog'

import injectTapEventPlugin from 'react-tap-event-plugin'

injectTapEventPlugin()

let modals = {
  foo: {
    key: 'foo',
    component: ModalDialog,
    props: {
      children: (<div>Foo</div>)
    }
  },
  bar: {
    key: 1,
    component: ModalDialog,
    props: {
      children: (<div>Bar</div>)
    }
  }
}

describe('ModalStack', () => {

  it('should mount without children', () => {

    let wrapper = mount(
      <ModalStack stack={[]} />
    )

    expect(wrapper.find(ModalStack).children().length).toEqual(0)
  })

  it('should mount with 1 modal', () => {

    let wrapper = mount(
      <ModalStack stack={[ modals.foo ]} />
    )

    expect(wrapper.find(ModalStack).children().length).toEqual(1)
  })

  it('should mount with 2 modals', () => {

    let wrapper = mount(
      <ModalStack stack={[ modals.foo, modals.bar ]} />
    )

    expect(wrapper.find(ModalStack).children().length).toEqual(2)
  })
})
