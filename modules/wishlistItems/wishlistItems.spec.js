import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import wishlistItemsJson from './wishlistItems.component.json';
import WishlistItems from './wishlistItems.component';

describe('<WishlistItems />', () => {
  const { cms } = wishlistItemsJson.context.data;
  it('renders <WishlistItems /> component', () => {
    const wrapper = shallow(<WishlistItems cms={cms} />);
    expect(wrapper.find('div')).to.have.length(1);
    expect(wrapper.find('div h3')).to.have.length(1);
    expect(wrapper.find('div h3').text()).to.equal('Wishlist Items works!');
  });
});
