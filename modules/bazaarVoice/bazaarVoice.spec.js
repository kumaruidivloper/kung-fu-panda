import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import bazaarVoiceJson from './bazaarVoice.component.json';
import BazaarVoice from './bazaarVoice.component';

describe('<BazaarVoice />', () => {
  const { cms } = bazaarVoiceJson.context.data;
  it('renders <BazaarVoice /> component', () => {
    const wrapper = shallow(<BazaarVoice cms={cms} ExternalId="test" />);
    expect(wrapper.find('div')).to.have.length(1);
    expect(wrapper.find('div').props()).to.haveOwnProperty('role');
    expect(wrapper.find('div').props().role).to.equal('button');
  });
});
