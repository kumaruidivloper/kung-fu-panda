import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import benefitSectionJson from './benefitSection.component.json';
import BenefitSection from './benefitSection.component';

describe('<BenefitSection />', () => {
  const { cms } = benefitSectionJson.context.data;
  it('renders <BenefitSection /> component', () => {
    const wrapper = shallow(<BenefitSection cms={cms} />);
    expect(wrapper.find('div')).to.have.length(1);
    expect(wrapper.find('div h3')).to.have.length(1);
    expect(wrapper.find('div h3').text()).to.equal('Benefit Section works!');
  });
});