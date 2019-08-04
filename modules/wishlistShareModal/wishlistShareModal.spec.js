import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import wishlistShareModalJson from './wishlistShareModal.component.json';
import WishlistShareModal from './wishlistShareModal.component';

describe('<WishlistShareModal />', () => {
  const { cms } = wishlistShareModalJson.context.data;
  it('renders <WishlistShareModal /> component', () => {
    const wrapper = shallow(<WishlistShareModal cms={cms} />);
    expect(wrapper.find('div')).to.have.length(1);
    expect(wrapper.find('div h3')).to.have.length(1);
    expect(wrapper.find('div h3').text()).to.equal('Wishlist Share Modal works!');
  });
});
