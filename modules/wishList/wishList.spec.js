import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import wishListJson from './wishList.component.json';
import WishList from './wishList.component';

describe('<WishList />', () => {
  const { cms } = wishListJson.context.data;
  it('renders <WishList /> component', () => {
    const wrapper = shallow(<WishList cms={cms} />);
    expect(wrapper.find('div')).to.have.length(1);
    expect(wrapper.find('div h3')).to.have.length(1);
    expect(wrapper.find('div h3').text()).to.equal('Wish List works!');
  });
});
