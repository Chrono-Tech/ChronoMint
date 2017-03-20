import React from 'react';
import {shallow} from 'enzyme';
import {expect} from 'chai';
import {LOCForm} from '../../../src/components/forms/LOCForm/LOCForm';
import Immutable from 'immutable';

describe('<LOCForm />', () => {
    it('renders without crashing', () => {
        const initial = new Immutable.Map({publishedHash:''});
        const div = document.createElement('div');
        const wrapper = shallow(<LOCForm initialValues={initial} />);
        expect(wrapper.find('form')).to.not.be.empty
    });
});