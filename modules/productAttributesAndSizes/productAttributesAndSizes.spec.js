import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import configureStore from 'redux-mock-store';
import ProductAttributesAndSizes from './productAttributesAndSizes.component';
import Swatches from '../swatches/swatches.component';
import JSONData from './productAttributesAndSizes.component.json';

const initialState = {
  gtmDataLayer: []
};
const mockStore = configureStore();
let store;

const {
  context: {
    data: { cms }
  }
} = JSONData;

const { productItem } = cms;

describe('<ProductAttributesAndSizes />', () => {
  beforeEach(() => {
    store = mockStore(initialState);
  });
  it('renders <ProductAttributesAndSizes /> component', () => {
    const wrapper = shallow(<ProductAttributesAndSizes store={store} productItem={productItem} />).dive();
    expect(wrapper).to.have.length(1);
  });

  it('test attribute click', () => {
    const updateProductItem = value => {
      console.log(value.selectedIdentifier);
    };
    const wrapper = shallow(<ProductAttributesAndSizes updateProductItem={updateProductItem} store={store} productItem={productItem} />).dive();
    console.log(
      wrapper
        .find(Swatches)
        .first()
        .props()
    );
    // Sku exist
    wrapper
      .find(Swatches)
      .first()
      .props()
      .handleSwatchClick({
        itemId: '4285',
        sellable: true,
        text: 'Charcoal',
        sequence: '.00000',
        identifier: {
          key: 'Color',
          value: '4285'
        },
        imageURL: '//assets.academy.com/mgen/90/10420990.jpg',
        thumbnail: '//assets.academy.com/mgen/90/10420990.jpg',
        isClearance: false
      });

    // SKU not exist
    wrapper
      .find(Swatches)
      .first()
      .props()
      .handleSwatchClick({
        itemId: '4285',
        sellable: true,
        text: 'Charcoal',
        sequence: '.00000',
        identifier: {
          key: 'Color',
          value: '9999'
        },
        imageURL: '//assets.academy.com/mgen/90/10420990.jpg',
        thumbnail: '//assets.academy.com/mgen/90/10420990.jpg',
        isClearance: false
      });
    expect(wrapper).to.have.length(1);
  });

  it('test giftcard', () => {
    const updateProductItem = value => {
      console.log(value.selectedIdentifier);
    };
    const giftCardProps = {
      ...productItem,
      isGiftCard: 'Y',
      gcAmounts: [10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120, 130],
      productAttributeGroups: [...productItem.productAttributeGroups, 'Amount']
    };
    const wrapper = shallow(<ProductAttributesAndSizes updateProductItem={updateProductItem} store={store} productItem={giftCardProps} />).dive();
    expect(wrapper).to.have.length(1);
  });

  it('test quick view', () => {
    const updateProductItem = value => {
      console.log(value.selectedIdentifier);
    };
    const wrapper = shallow(
      <ProductAttributesAndSizes updateProductItem={updateProductItem} store={store} productItem={productItem} quickView />
    ).dive();

    expect(wrapper).to.have.length(1);
  });

  it('render nothing if productItem not found', () => {
    const wrapper = shallow(<ProductAttributesAndSizes store={store} />).dive();

    expect(wrapper).to.have.length(0);
  });
});
