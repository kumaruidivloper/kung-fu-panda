import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import showShipToStoreJson from './showShipToStore.component.json';
import ShowShipToStore from './showShipToStore.component';

describe('<ShowShipToStore />', () => {
  const { cms } = showShipToStoreJson.context.data;
  it('renders <ShowShipToStore /> component', () => {
    const wrapper = shallow(<ShowShipToStore cms={cms} />);
    expect(wrapper.find('div')).to.have.length(1);
    expect(wrapper.find('div h3')).to.have.length(1);
    expect(wrapper.find('div h3').text()).to.equal('Show Ship To Store works!');
  });
});
