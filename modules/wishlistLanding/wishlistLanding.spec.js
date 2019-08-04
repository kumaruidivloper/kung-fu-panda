import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import wishlistLandingJson from './wishlistLanding.component.json';
import WishlistLanding from './wishlistLanding.component';

describe('<WishlistLanding />', () => {
  const { cms } = wishlistLandingJson.context.data;
  it('renders <WishlistLanding /> component', () => {
    const wrapper = shallow(<WishlistLanding cms={cms} />);
    expect(wrapper.find('div')).to.have.length(1);
    expect(wrapper.find('div h3')).to.have.length(1);
    expect(wrapper.find('div h3').text()).to.equal('Wishlist Landing works!');
  });
});
