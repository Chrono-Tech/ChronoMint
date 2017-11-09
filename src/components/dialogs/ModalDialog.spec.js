import React from 'react'
import injectTapEventPlugin from 'react-tap-event-plugin'
import Immutable from 'immutable'
import { Provider } from 'react-redux'
import { mockStore } from 'specsInit'
import { mount } from 'enzyme'
import ModalDialog from 'components/dialogs/ModalDialog'

injectTapEventPlugin()

describe('ModalDialog', () => {
  it('should mount and render content', () => {
    const store = mockStore(Immutable.Map({}))
    const wrapper = mount(
      <Provider store={store}>
        <ModalDialog>
          <div>Foo</div>
          <div>Bar</div>
        </ModalDialog>
      </Provider>
    )

    expect(wrapper.find('.ModalDialog__backdrop').length).toEqual(1)
    expect(wrapper.find('.ModalDialog__backdrop > .ModalDialog__dialog').length).toEqual(1)
    expect(wrapper.find('.ModalDialog__backdrop > .ModalDialog__dialog > .ModalDialog__content').length).toEqual(1)
  })
})

