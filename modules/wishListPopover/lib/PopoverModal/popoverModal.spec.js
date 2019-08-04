import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';

import PopoverModal from './popoverModal';

// import * as util from '../../testUtil';

const initialProps = {
  children: 'test',
  onClickClose: () => null
};

describe('<PopoverModal />', () => {
  const wrapper = shallow(<PopoverModal {...initialProps} />);

  // util.consoleLogDebug(wrapper);
  // util.consoleLogHtml(wrapper);

  it('renders <PopoverModal /> wrapper', () => {
    expect(wrapper.name()).to.equal('Styled(div)');
  });
});
