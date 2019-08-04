import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';

import WishListChoose from './wishListChoose';

import * as util from '../../../../testUtil';

const initialProps = {
  wishLists: util.getWishListsFromJson(),
  onSelect: () => null
};

describe('<WishListChoose />', () => {
  const wrapper = shallow(<WishListChoose {...initialProps} />);

  // util.consoleLogDebug(wrapper);
  // util.consoleLogHtml(wrapper);

  it('renders <WishListChoose /> wrapper', () => {
    expect(wrapper.name()).to.equal('Styled(div)');
  });
});
