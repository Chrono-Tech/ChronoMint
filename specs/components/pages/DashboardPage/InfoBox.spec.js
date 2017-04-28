import React from 'react'
import { shallow } from 'enzyme'
import { expect } from 'chai'
import InfoBox from '../../../../src/components/pages/DashboardPage/InfoBox'
import ShoppingCart from 'material-ui/svg-icons/action/shopping-cart'

describe('<InfoBox />', () => {
  it('should have a span with the title and value', () => {
    const wrapper = shallow(<InfoBox Icon={ShoppingCart} color='#161240' title='Title' value='1500'/>)
    const content = wrapper.find('div > span')

    expect(content).to.have.length.of(2)
    expect('Title').to.equal(content.at(0).text())
    expect('1500').to.equal(content.at(1).text())
  })
})
