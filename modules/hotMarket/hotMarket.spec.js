import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import hotMarketJson from './hotMarket.component.json';
import HotMarket from './hotMarket.component';

describe('<HotMarket />', () => {
  const { cms } = hotMarketJson.context.data;
  it('renders <HotMarket /> component', () => {
    const wrapper = shallow(<HotMarket cms={cms} />);
    expect(wrapper.find('div')).to.have.length(1);
    expect(wrapper.find('div h3')).to.have.length(1);
    expect(wrapper.find('div h3').text()).to.equal('Hot Market works!');
  });
});
