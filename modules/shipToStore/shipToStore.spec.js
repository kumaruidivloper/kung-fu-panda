import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import shipToStoreJson from './shipToStore.component.json';
import ShipToStore from './shipToStore.component';

describe('<ShipToStore />', () => {
  const { cms } = shipToStoreJson.context.data;
  it('renders <ShipToStore /> component', () => {
    const wrapper = shallow(<ShipToStore cms={cms} />);
    expect(wrapper.find('div')).to.have.length(1);
    expect(wrapper.find('div h3')).to.have.length(1);
    expect(wrapper.find('div h3').text()).to.equal('Ship To Store works!');
  });
});
