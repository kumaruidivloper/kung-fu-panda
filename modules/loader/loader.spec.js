import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import loaderJson from './loader.component.json';
import Loader from './loader.component';

describe('<Loader />', () => {
  const { cms } = loaderJson.context.data;
  it('renders <Loader /> component', () => {
    const wrapper = shallow(<Loader cms={cms} />);
    expect(wrapper.find('div')).to.have.length(1);
    expect(wrapper.find('div h3')).to.have.length(1);
    expect(wrapper.find('div h3').text()).to.equal('Loader works!');
  });
});
