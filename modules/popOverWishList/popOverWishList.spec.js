import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import popOverWishListJson from './popOverWishList.component.json';
import PopOverWishList from './popOverWishList.component';

describe('<PopOverWishList />', () => {
  const { cms } = popOverWishListJson.context.data;
  it('renders <PopOverWishList /> component', () => {
    const wrapper = shallow(<PopOverWishList cms={cms} />);
    expect(wrapper.find('div')).to.have.length(1);
    expect(wrapper.find('div h3')).to.have.length(1);
    expect(wrapper.find('div h3').text()).to.equal('Pop Over Wish List works!');
  });
});
