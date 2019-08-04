import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';

import WishListForm from './wishListForm';

import * as util from '../../testUtil';

const initialProps = {
  wishLists: util.getWishListsFromJson(),
  onSelect: () => null,
  onClickCreate: () => null,
  onInputChange: () => null,
  inputValue: 'test input value',
  inputError: undefined
};

describe('<WishListForm />', () => {
  const wrapper = shallow(<WishListForm {...initialProps} />);

  // util.consoleLogDebug(wrapper);
  // util.consoleLogHtml(wrapper);

  it('renders <WishListForm /> wrapper', () => {
    expect(wrapper.name()).to.equal('div');
  });
});
