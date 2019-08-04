import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import showInStorePickupJson from './showInStorePickup.component.json';
import ShowInStorePickup from './showInStorePickup.component';

describe('<ShowInStorePickup />', () => {
  const { cms } = showInStorePickupJson.context.data;
  it('renders <ShowInStorePickup /> component', () => {
    const wrapper = shallow(<ShowInStorePickup cms={cms} />);
    expect(wrapper.find('div')).to.have.length(1);
    expect(wrapper.find('div h3')).to.have.length(1);
    expect(wrapper.find('div h3').text()).to.equal('Show In Store Pickup works!');
  });
});
