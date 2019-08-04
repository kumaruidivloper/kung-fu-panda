import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import cardCommonMyAccountJson from './cardCommonMyAccount.component.json';
import CardCommonMyAccount from './cardCommonMyAccount.component';

describe('<CardCommonMyAccount />', () => {
  const { cms } = cardCommonMyAccountJson.context.data;
  it('renders <CardCommonMyAccount /> component', () => {
    const wrapper = shallow(<CardCommonMyAccount cms={cms} />);
    expect(wrapper.find('div')).to.have.length(1);
    expect(wrapper.find('div h3')).to.have.length(1);
    expect(wrapper.find('div h3').text()).to.equal('Card Common My Account works!');
  });
});
