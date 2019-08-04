import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import wishListModalJson from './wishListModal.component.json';
import WishListModal from './wishListModal.component';

describe('<WishListModal />', () => {
  const { cms } = wishListModalJson.context.data;
  it('renders <WishListModal /> component', () => {
    const wrapper = shallow(<WishListModal cms={cms} />);
    expect(wrapper.find('div')).to.have.length(1);
    expect(wrapper.find('div h3')).to.have.length(1);
    expect(wrapper.find('div h3').text()).to.equal('Wish List Modal works!');
  });
});
