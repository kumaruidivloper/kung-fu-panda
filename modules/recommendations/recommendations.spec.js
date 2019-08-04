import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import recommendationsJson from './recommendations.component.json';
import Recommendations from './recommendations.component';

describe('<Recommendations />', () => {
  const { cms } = recommendationsJson.context.data;
  it('renders <Recommendations /> component', () => {
    const wrapper = shallow(<Recommendations cms={cms} />);
    expect(wrapper.find('div')).to.have.length(1);
    expect(wrapper.find('div h3')).to.have.length(1);
    expect(wrapper.find('div h3').text()).to.equal('Recommendations works!');
  });
});
