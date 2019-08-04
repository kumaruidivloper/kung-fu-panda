import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import productDetailsMultiSkuJson from './productDetailsMultiSku.component.json';
import ProductDetailsMultiSku from './productDetailsMultiSku.component';

describe('<ProductDetailsMultiSku />', () => {
  const { cms } = productDetailsMultiSkuJson.context.data;
  it('renders <ProductDetailsMultiSku /> component', () => {
    const wrapper = shallow(<ProductDetailsMultiSku cms={cms} />);
    expect(wrapper.find('div')).to.have.length(1);
    expect(wrapper.find('div h3')).to.have.length(1);
    expect(wrapper.find('div h3').text()).to.equal('Product Details Multi Sku works!');
  });
});
