import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme'; // mount, shallow
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import ProductCard from '@academysports/fusion-components/dist/ProductCard';
import productResponse from './productGrid.component.json';
import ProductGrid from './productGrid.component';

const PRODUCT_API_PROP = 'productinfo';
const mock = new MockAdapter(axios);
const baseUrl = 'http://wkwin9764674.global.publicisgroupe.net:11009/'; // need to cheange
const prodUrl = 'api/category/15685/products';

const API_RESPONSE = productResponse.context.data.api;
describe('<ProductGrid />', () => {
  beforeEach(() => {
    mock.onGet(`${baseUrl}${prodUrl}`).reply(200, {
      API_RESPONSE
    });
  });
  const props = { cms: { items: 'items' }, api: API_RESPONSE };
  let MountedProductGrid;

  const ShallowProductGrid = () => {
    if (!MountedProductGrid) {
      MountedProductGrid = mount(<ProductGrid {...props} />);
    }
    return MountedProductGrid;
  };

  it('Renders <ProductGrid /> component', () => {
    expect(ShallowProductGrid().length).to.eql(1);
  });

  it('always renders a `ProductCard` ', () => {
    expect(ShallowProductGrid().find(ProductCard)).to.have.length(props.api[PRODUCT_API_PROP].length);
  });
  // it('Contains everything that is rendered', () => {
  //   const wrapper = shallow(<ProductGrid {...props} />);
  //   const divs = wrapper.find('div');
  //   const wrappingDiv = divs.first();
  //   expect(wrappingDiv.children().length).to.equal(divs.length);
  // });
});
