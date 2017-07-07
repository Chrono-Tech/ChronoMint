import React from 'react'
import { mount, shallow } from 'enzyme'

import { ModalDialog } from 'components/dialogs/ModalDialog'

import injectTapEventPlugin from 'react-tap-event-plugin'

injectTapEventPlugin()

describe('ModalDialog', () => {

  it('should mount and render content', () => {

    let wrapper = mount(
      <ModalDialog>
        <div>Foo</div>
        <div>Bar</div>
      </ModalDialog>
    )

    expect(wrapper.find('.ModalDialog__backdrop').length).toEqual(1)
    expect(wrapper.find('.ModalDialog__backdrop > .ModalDialog__dialog').length).toEqual(1)
    expect(wrapper.find('.ModalDialog__backdrop > .ModalDialog__dialog > .ModalDialog__content').length).toEqual(1)
  })

  it('should fire onClose by click on backdrop', () => {

    let onCloseMock = jest.fn()
    let wrapper = shallow(
      <ModalDialog onClose={onCloseMock}>
        <div>Foo</div>
        <div>Bar</div>
      </ModalDialog>
    )

    wrapper.find('.ModalDialog__backdrop').simulate('touchTap', { stopPropagation: ()=> undefined })
    wrapper.find('.ModalDialog__backdrop').simulate('touchTap', { stopPropagation: ()=> undefined })
    wrapper.find('.ModalDialog__backdrop').simulate('touchTap', { stopPropagation: ()=> undefined })
    wrapper.find('.ModalDialog__dialog').simulate('click', { stopPropagation: ()=> undefined })

    expect(onCloseMock.mock.calls.length).toEqual(3)
  })
})
