import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import productThumbnailJson from './productThumbnail.component.json';
import ProductThumbnail from './productThumbnail.component';

describe('<ProductThumbnail />', () => {
  const { cms } = productThumbnailJson.context.data;
  it('renders <ProductThumbnail /> component', () => {
    const wrapper = shallow(<ProductThumbnail cms={cms} />);
    expect(wrapper.find('div')).to.have.length(1);
    expect(wrapper.find('div h3')).to.have.length(1);
    expect(wrapper.find('div h3').text()).to.equal('Product Thumbnail works!');
  });
});
