import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import creditApplicationModalJson from './creditApplicationModal.component.json';
import CreditApplicationModal from './creditApplicationModal.component';

describe('<CreditApplicationModal />', () => {
  const { cms } = creditApplicationModalJson.context.data;
  it('renders <CreditApplicationModal /> component', () => {
    const wrapper = shallow(<CreditApplicationModal cms={cms} />);
    expect(wrapper.find('div')).to.have.length(1);
    expect(wrapper.find('div h3')).to.have.length(1);
    expect(wrapper.find('div h3').text()).to.equal('Credit Application Modal works!');
  });
});