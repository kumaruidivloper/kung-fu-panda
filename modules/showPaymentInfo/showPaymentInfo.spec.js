import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import showPaymentInfoJson from './showPaymentInfo.component.json';
import ShowPaymentInfo from './showPaymentInfo.component';

describe('<ShowPaymentInfo />', () => {
  const { cms } = showPaymentInfoJson.context.data;
  it('renders <ShowPaymentInfo /> component', () => {
    const wrapper = shallow(<ShowPaymentInfo cms={cms} />);
    expect(wrapper.find('div')).to.have.length(1);
    expect(wrapper.find('div h3')).to.have.length(1);
    expect(wrapper.find('div h3').text()).to.equal('Show Payment Info works!');
  });
});
