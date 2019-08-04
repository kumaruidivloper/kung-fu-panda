import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import createWishListJson from './createWishList.component.json';
import CreateWishList from './createWishList.component';

describe('<CreateWishList />', () => {
  const { cms } = createWishListJson.context.data;
  it('renders <CreateWishList /> component', () => {
    const wrapper = shallow(<CreateWishList cms={cms} />);
    expect(wrapper.find('div')).to.have.length(1);
    expect(wrapper.find('div h3')).to.have.length(1);
    expect(wrapper.find('div h3').text()).to.equal('Create Wish List works!');
  });
});
