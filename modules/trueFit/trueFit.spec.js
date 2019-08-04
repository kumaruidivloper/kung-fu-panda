import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import trueFitJson from './trueFit.component.json';
import TrueFit from './trueFit.component';

describe('<TrueFit />', () => {
  const { cms } = trueFitJson.context.data;
  it('renders <TrueFit /> component', () => {
    const wrapper = shallow(<TrueFit cms={cms} partNumber="test" />);
    expect(wrapper.find('.tfc-fitrec-product')).to.have.length(1);
  });
});
