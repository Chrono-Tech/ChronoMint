import React from 'react'
import injectTapEventPlugin from 'react-tap-event-plugin'
import { mount, shallow } from 'enzyme'
import ModalDialog from 'components/dialogs/ModalDialog'

injectTapEventPlugin()

describe('ModalDialog', () => {
  it('should mount and render content', () => {
    const wrapper = mount(<ModalDialog>
      <div>Foo</div>
      <div>Bar</div>
    </ModalDialog>)

    expect(wrapper.find('.ModalDialog__backdrop').length).toEqual(1)
    expect(wrapper.find('.ModalDialog__backdrop > .ModalDialog__dialog').length).toEqual(1)
    expect(wrapper.find('.ModalDialog__backdrop > .ModalDialog__dialog > .ModalDialog__content').length).toEqual(1)
  })
})

