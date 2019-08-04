import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import Price from '../price';

describe('<Price />', () => {
  const props = {
    price: '100.00',
    color: '#000',
    strikethrough: false,
    bigger: false
  };
  it('renders <Price /> component', () => {
    const wrapper = shallow(<Price {...props} />);
    expect(wrapper).to.have.length(1);
  });
});
