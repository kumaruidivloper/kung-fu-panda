import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import specialOrderProceedModalJson from './specialOrderProceedModal.component.json';
import SpecialOrderProceedModal from './specialOrderProceedModal.component';

describe('<SpecialOrderProceedModal />', () => {
  const { cms } = specialOrderProceedModalJson.context.data;
  it('renders <SpecialOrderProceedModal /> component', () => {
    const wrapper = shallow(<SpecialOrderProceedModal cms={cms} />);
    expect(wrapper.find('div')).to.have.length(1);
    expect(wrapper.find('div h3')).to.have.length(1);
    expect(wrapper.find('div h3').text()).to.equal('Special Order Proceed Modal works!');
  });
});
