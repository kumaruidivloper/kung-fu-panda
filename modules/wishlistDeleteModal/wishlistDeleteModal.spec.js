import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import wishlistDeleteModalJson from './wishlistDeleteModal.component.json';
import WishlistDeleteModal from './wishlistDeleteModal.component';

describe('<WishlistDeleteModal />', () => {
  const { cms } = wishlistDeleteModalJson.context.data;
  it('renders <WishlistDeleteModal /> component', () => {
    const wrapper = shallow(<WishlistDeleteModal cms={cms} />);
    expect(wrapper.find('div')).to.have.length(1);
    expect(wrapper.find('div h3')).to.have.length(1);
    expect(wrapper.find('div h3').text()).to.equal('Wishlist Delete Modal works!');
  });
});
