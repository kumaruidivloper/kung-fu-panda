import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';

import WishListAdd from './wishListAdd';

// import * as util from '../../../../testUtil';

const initialProps = {
  onClickCreate: () => null,
  onInputChange: () => null,
  inputError: undefined,
  inputValue: 'test input value'
};

// util.consoleLogDebug(wrapper);
// util.consoleLogHtml(wrapper);

describe('<WishListAdd />', () => {
  it('renders <WishListAdd /> wrapper - when no error', () => {
    const props = { ...initialProps };
    const wrapper = shallow(<WishListAdd {...props} />);
    expect(wrapper.name()).to.equal('Styled(div)');
  });

  it('renders <WishListAdd /> wrapper - when error error', () => {
    const props = { ...initialProps, inputError: 'invalid wish list name' };
    const wrapper = shallow(<WishListAdd {...props} />);
    expect(wrapper.name()).to.equal('Styled(div)');
  });
});
