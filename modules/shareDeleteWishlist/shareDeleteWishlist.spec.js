import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import shareDeleteWishlistJson from './shareDeleteWishlist.component.json';
import ShareDeleteWishlist from './shareDeleteWishlist.component';

describe('<ShareDeleteWishlist />', () => {
  const { cms } = shareDeleteWishlistJson.context.data;
  it('renders <ShareDeleteWishlist /> component', () => {
    const wrapper = shallow(<ShareDeleteWishlist cms={cms} />);
    expect(wrapper.find('div')).to.have.length(1);
    expect(wrapper.find('div h3')).to.have.length(1);
    expect(wrapper.find('div h3').text()).to.equal('Share Delete Wishlist works!');
  });
});
