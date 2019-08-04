import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import productDetailsMultiSkuPackageJson from './productDetailsMultiSkuPackage.component.json';
import ProductDetailsMultiSkuPackage from './productDetailsMultiSkuPackage.component';

describe('<ProductDetailsMultiSkuPackage />', () => {
  const { cms } = productDetailsMultiSkuPackageJson.context.data;
  it('renders <ProductDetailsMultiSkuPackage /> component', () => {
    const wrapper = shallow(<ProductDetailsMultiSkuPackage cms={cms} />);
    expect(wrapper.find('div')).to.have.length(1);
    expect(wrapper.find('div h3')).to.have.length(1);
    expect(wrapper.find('div h3').text()).to.equal('Product Details Multi Sku Package works!');
  });
});
