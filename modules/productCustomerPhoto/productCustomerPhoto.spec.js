import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';

import configureStore from 'redux-mock-store';
import productCustomerPhotoJson from './productCustomerPhoto.component.json';
import ProductCustomerPhoto from './productCustomerPhoto.component';

const mockStore = configureStore();
let store;
const initialState = {};
const props = {
  productCustomerPhoto: {
    'product-info': {
      productinfo: {
        partNumber: '123'
      }
    }
  }
};

describe('<ProductCustomerPhoto />', () => {
  beforeEach(() => {
    store = mockStore(initialState);
  });
  const { cms } = productCustomerPhotoJson.context.data;
  it('renders <ProductCustomerPhoto /> component', () => {
    const wrapper = mount(<Provider store={store}><ProductCustomerPhoto cms={cms} {...props} /></Provider>);
    expect(wrapper.find('div')).to.have.length(3);
  });
});
