import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import ProductMixedMediaCarousel from './productMixedMediaCarousel';

const mockImageObj = {
  imageURL: '../../assets/images/demo/brands/adidas/category_adidas.png',
  sellable: true
};

const getSwatchList = size => {
  const swatchImgList = [];
  for (let i = 0; i < size; i += 1) {
    swatchImgList.push({ itemId: i, ...mockImageObj });
  }
  return swatchImgList;
};

const swatchList = getSwatchList(6);

describe('<ProductMixedMediaCarousel />', () => {
  it('renders <ProductMixedMediaCarousel /> component', () => {
    const wrapper = shallow(<ProductMixedMediaCarousel productList={swatchList} name="Mixed Media Testing" />).dive();
    expect(wrapper).to.have.length(1);
  });
});
