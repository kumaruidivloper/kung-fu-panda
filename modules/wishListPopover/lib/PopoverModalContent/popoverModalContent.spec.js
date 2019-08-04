import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';

import PopoverModalContent from './popoverModalContent';

import * as util from '../../testUtil';

const testProductId = '3794314';
const initialProps = {
  viewState: undefined,
  wishLists: util.getWishListsFromJson(),
  onSelectWishList: () => null,
  onClickCreate: () => null,
  onNewWishListNameChange: () => null,
  newWishListNameValue: 'test input value',
  newWishListNameError: undefined,
  selectedWishListName: undefined,
  itemImageUrl: util.getProductItem(testProductId).imageURL
};

describe('<PopoverModalContent />', () => {
  it('null viewState - renders <PopoverModalContent /> wrapper', () => {
    const wrapper = shallow(<PopoverModalContent {...initialProps} />);
    expect(wrapper.name()).to.equal('WishListForm');
  });

  it('WishList-Form viewState - renders <PopoverModalContent /> wrapper', () => {
    const wrapper = shallow(<PopoverModalContent {...initialProps} viewState="WishList-Form" />);
    expect(wrapper.name()).to.equal('WishListForm');
  });

  it('WishList-Success viewState - renders <PopoverModalContent /> wrapper', () => {
    const wrapper = shallow(<PopoverModalContent {...initialProps} viewState="WishList-Success" />);
    expect(wrapper.name()).to.equal('WishListSuccess');
  });
});
