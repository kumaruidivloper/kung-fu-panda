import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import noOrderJson from './noOrder.component.json';
import NoOrder from './noOrder.component';

describe('<NoOrder />', () => {
  const { cms } = noOrderJson.context.data;
  it('renders <NoOrder /> component', () => {
    const wrapper = shallow(<NoOrder cms={cms} />);
    expect(wrapper.find('div')).to.have.length(1);
    expect(wrapper.find('div h3')).to.have.length(1);
    expect(wrapper.find('div h3').text()).to.equal('No Order works!');
  });
});
