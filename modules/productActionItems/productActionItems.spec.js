import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import productActionItemsJson from './productActionItems.component.json';
import ProductActionItems from './productActionItems.component';

const initialState = {
  productItem: {
    isGiftCard: 'Y',
    seoURL: 'test',
    price: 'test',
    bvRating: 'test',
    manufacturer: 'test',
    name: 'test',
    imageURL: 'test',
    defaultSku: 'test',
    partNumber: 'test',
    adBug: true,
    productPrice: {
      salePrice: '100USD',
      listPrice: '100USD'
    },
    storeInventory: {
      value: 'test'
    },
    inventoryMessage: {
      inventoryStatus: ''
    },
    productMessage: [
      {
        key: 'dropShip',
        value: 'test'
      }, {
        key: 'quantityLimit',
        value: 'test'
      }, {
        key: 'test',
        value: 'test'
      }
    ],
    productType: 'specialorder'
  }
};
const mockStore = configureStore();
let store;

describe('<ProductActionItems />', () => {
  const { cms } = productActionItemsJson.context.data;
  const props = {
    isStoreSelected: false,
    ...initialState
  };

  beforeEach(() => {
    store = mockStore(initialState);
  });

  it('renders <ProductActionItems /> component', () => {
    const wrapper = mount(<Provider store={store}><ProductActionItems cms={cms} {...props} /></Provider>);

    expect(wrapper.length).to.equal(1);
  });
  it('mount <ProductActionItems /> component isStoreSelected', () => {
    props.isStoreSelected = true;
    const wrapper = mount(<Provider store={store}><ProductActionItems cms={cms} {...props} /></Provider>);
    expect(wrapper.length).to.equal(1);
  });
  // it('should check inventory', () => {
  //   props.productItem.inventoryMessage = { inventoryStatus: 'IN_STOCK' };
  //   const wrapper = mount(<ProductActionItems store={store} cms={cms} {...props} />);

  //   expect(wrapper.instance().state.isAddToCartDisabled).to.equal(false);
  //   props.productItem.inventoryMessage = { inventoryStatus: 'OUT_OF_STOCK' };
  //   wrapper.setProps(props);
  //   expect(wrapper.instance().state.isAddToCartDisabled).to.equal(true);
  //   props.productItem.inventoryMessage = { inventoryStatus: 'Available' };
  //   wrapper.setProps(props);
  //   expect(wrapper.instance().state.isAddToCartDisabled).to.equal(true);
  // });
});
