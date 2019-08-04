import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import inStorePickupInstrcJson from './inStorePickupInstrc.component.json';
import InStorePickupInstrc from './inStorePickupInstrc.component';

describe('<InStorePickupInstrc />', () => {
  const { cms } = inStorePickupInstrcJson.context.data;
  it('renders <InStorePickupInstrc /> component', () => {
    const wrapper = shallow(<InStorePickupInstrc cms={cms} />);
    expect(wrapper.find('div')).to.have.length(1);
    expect(wrapper.find('div h3')).to.have.length(1);
    expect(wrapper.find('div h3').text()).to.equal('In Store Pickup Instrc works!');
  });
});
