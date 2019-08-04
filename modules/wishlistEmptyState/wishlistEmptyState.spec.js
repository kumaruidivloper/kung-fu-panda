import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import wishlistEmptyStateJson from './wishlistEmptyState.component.json';
import WishlistEmptyState from './wishlistEmptyState.component';

describe('<WishlistEmptyState />', () => {
  const { cms } = wishlistEmptyStateJson.context.data;
  it('renders <WishlistEmptyState /> component', () => {
    const wrapper = shallow(<WishlistEmptyState cms={cms} />);
    expect(wrapper.find('div')).to.have.length(1);
    expect(wrapper.find('div h3')).to.have.length(1);
    expect(wrapper.find('div h3').text()).to.equal('Wishlist Empty State works!');
  });
});
