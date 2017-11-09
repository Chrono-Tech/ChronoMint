import React from 'react'
import injectTapEventPlugin from 'react-tap-event-plugin'
import { mount } from 'enzyme'
import ModalDialog from 'components/dialogs/ModalDialog'
import { ModalStack } from 'components/common/ModalStack/ModalStack'

injectTapEventPlugin()

const modals = {
  foo: {
    key: 'foo',
    component: ModalDialog,
    props: {
      children: (<div>Foo</div>),
    },
  },
  bar: {
    key: 1,
    component: ModalDialog,
    props: {
      children: (<div>Bar</div>),
    },
  },
}

describe('ModalStack', () => {
  it('should mount without children', () => {
    const wrapper = mount(<ModalStack stack={[]} />)

    expect(wrapper.find(ModalStack).children().length).toEqual(0)
  })

  it('should mount with 1 modal', () => {
    const wrapper = mount(<ModalStack stack={[modals.foo]} />)

    expect(wrapper.find(ModalStack).children().length).toEqual(1)
  })

  it('should mount with 2 modals', () => {
    const wrapper = mount(<ModalStack stack={[modals.foo, modals.bar]} />)

    expect(wrapper.find(ModalStack).children().length).toEqual(2)
  })
})

