import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import componentJson from './shopCollection.component.json';
import ShopCollection from './shopCollection.component';

describe('<shopCollection />', () => {
  it('it should contain div', () => {
    const wrapper = shallow(<ShopCollection cms={componentJson.context.data.cms} />);
    expect(wrapper.find('div')).to.have.length(4);
  });
  it('it should contain exactly three product cards', () => {
    const wrapper = shallow(<ShopCollection cms={componentJson.context.data.cms} />);
    expect(wrapper
        .find('div')
        .children()
        .last()).to.have.length(3);
  });
});
