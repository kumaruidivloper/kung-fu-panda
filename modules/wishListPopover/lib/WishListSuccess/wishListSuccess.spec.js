import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';

import * as util from '../../testUtil';

import WishListSuccess from './wishListSuccess';

const testProductId = '3794314';
const initialProps = {
  wishListName: 'Test Wish List',
  itemImageUrl: util.getProductItem(testProductId).imageURL
};

describe('<WishListSuccess />', () => {
  const wrapper = mount(<WishListSuccess {...initialProps} />);

  // util.consoleLogDebug(wrapper);
  // util.consoleLogHtml(wrapper);

  it('renders <WishListSuccess /> wrapper', () => {
    expect(wrapper.name()).to.equal('div');
  });
});
