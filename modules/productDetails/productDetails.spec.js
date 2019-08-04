import React from 'react';
import { expect } from 'chai';
// import sinon from 'sinon';
import { mount, shallow } from 'enzyme';
import configureStore from 'redux-mock-store';
import productDetails from './productDetails.component.json';
import ProductDetails from './productDetails.component';
import { KEY_WAS_NOW_PRICE, KEY_PRICE_IN_CART, KEY_CALL_FOR_PRICING } from '../productPrice/constants.message.keys';
const { cms } = productDetails.context.data;
const initialState = {
  gtmDataLayer: []
};
const mockStore = configureStore();
let store;
const props = {
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
    }
  },
  isBundle: false,
  auid: '1',
  didScrollToReviewsOnPageLoad: false,
  urlQueryParams: {}
};

describe('<ProductDetails />', () => {
  beforeEach(() => {
    store = mockStore(initialState);
  });
  it('should render <ProductDetails />', () => {
    const wrapper = mount(<ProductDetails store={store} cms={cms} {...props} />);
    expect(wrapper).to.have.length(1);
  });
  it('should render <ProductDetails />', () => {
    const wrapper = shallow(<ProductDetails store={store} cms={cms} {...props} />);
    expect(wrapper.find('ProductDetailsWrapper')).to.have.length(1);
  });
  it('should cover scroll to reviews', () => {
    const wrapper = shallow(<ProductDetails store={store} cms={cms} {...props} />);
    wrapper.instance().scrollToReviews();
    // expect('scrollToReviews').to.be.a('function');
  });
  it('should render product price', () => {
    const isNoDiffBundle = true;
    const wrapper = shallow(<ProductDetails store={store} cms={cms} {...props} isNoDiffBundle={isNoDiffBundle} />);
    expect(wrapper).to.have.length(1);
  });
  it('should render null no productPrice', () => {
    props.productItem.productPrice = null;
    const isNoDiffBundle = true;
    const wrapper = shallow(<ProductDetails store={store} cms={cms} {...props} isNoDiffBundle={isNoDiffBundle} />);
    expect(wrapper).to.have.length(1);
  });
  it('should render with price and message', () => {
    props.productItem.price = null;
    const price = {
      salePrice: '100USD',
      listPrice: '100USD',
      regularPrice: '100USD',
      offerPrice: '100USD'
    };
    props.isBundle = true;
    const wrapper = shallow(<ProductDetails store={store} cms={cms} {...props} />);
    wrapper.setProps({ productItem: { ...props.productItem, price: { ...price, priceMessage: KEY_WAS_NOW_PRICE } } });
    wrapper.setProps({ productItem: { ...props.productItem, price: { ...price, priceMessage: KEY_PRICE_IN_CART } } });
    wrapper.setProps({ productItem: { ...props.productItem, price: { ...price, priceMessage: KEY_CALL_FOR_PRICING } } });
    expect(wrapper).to.have.length(1);
  });
  it('should return null when productItem is not present', () => {
    props.productItem = null;
    const wrapper = shallow(<ProductDetails store={store} cms={cms} {...props} />);
    expect(wrapper.html()).to.equal(null);
  });
  it('should able to click BazaarVoice', () => {
    const wrapper = shallow(<ProductDetails store={store} cms={cms} {...props} />);
    wrapper.instance().onRatingClick();
    expect(wrapper).to.have.length(1);
  });
  it('should scroll to reviews', () => {
    const wrapper = shallow(<ProductDetails store={store} cms={cms} {...props} />);
    wrapper.instance().scrollToReviewsOnPageLoad();
    expect(wrapper).to.have.length(1);
  });
});
