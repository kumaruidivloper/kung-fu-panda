import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import productMixedMediaLoaderBoxJson from './productMixedMediaLoaderBox.component.json';
import ProductMixedMediaLoaderBox from './productMixedMediaLoaderBox.component';

describe('<ProductMixedMediaLoaderBox />', () => {
  const { cms } = productMixedMediaLoaderBoxJson.context.data;
  it('renders <ProductMixedMediaLoaderBox /> component', () => {
    const wrapper = shallow(<ProductMixedMediaLoaderBox cms={cms} />);
    expect(wrapper.find('div')).to.have.length(1);
    expect(wrapper.find('div h3')).to.have.length(1);
    expect(wrapper.find('div h3').text()).to.equal('Product Mixed Media Loader Box works!');
  });
});
