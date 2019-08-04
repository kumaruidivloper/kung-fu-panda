import React from 'react';
import { expect } from 'chai';
import { mount, shallow } from 'enzyme';
import configureStore from 'redux-mock-store';
import { Provider } from 'react-redux';
import ProductDetailsBait from './productDetailsBait.component';
import JSONData from '../../../mock_server/routes/productAPI/shirt.json';
import { getProductItem } from '../../utils/productDetailsUtils';
import BaitVariant from '../../modules/baitVariant/baitVariant.component';

const initialState = { gtmDataLayer: [] };
const mockStore = configureStore();
let store;
const productItem = getProductItem(JSONData, {});

describe('<ProductDetailsBait />', () => {
  beforeEach(() => {
    store = mockStore(initialState);
  });
  it('renders <ProductDetailsBait /> component', () => {
    const wrapper = shallow(<ProductDetailsBait isCSR={false} store={store} api={JSONData} />).dive();
    expect(wrapper).to.have.length(1);
  });

  it('test with mock productItem', () => {
    const wrapper = shallow(<ProductDetailsBait isCSR={false} store={store} api={JSONData} productItem={productItem} />).dive();
    expect(wrapper).to.have.length(1);
  });

  it('test with full mount', () => {
    const wrapper = mount(
      <Provider store={store}>
        <ProductDetailsBait isCSR={false} api={JSONData} productItem={productItem} />
      </Provider>
    );
    expect(wrapper).to.have.length(1);
  });

  it('test with client side rendering', () => {
    const wrapper = shallow(<ProductDetailsBait store={store} productItem={productItem} />).dive();
    expect(wrapper).to.have.length(1);
  });

  it('test with getInitialProps method cmsPageInfo', () => {
    ProductDetailsBait.getInitialProps({ cmsPageInfo: { previewId: 3678641 }, env: { API_HOSTNAME: 'http://35.188.171.242/' } }).then(response => {
      console.log('response received..', response);
    });
    const wrapper = shallow(<ProductDetailsBait store={store} productItem={productItem} />).dive();
    expect(wrapper).to.have.length(1);
  });

  it('test with getInitialProps method pageInfo', () => {
    const pageInfo = { previewId: 3678641 };
    ProductDetailsBait.getInitialProps({ pageInfo, env: { API_HOSTNAME: 'http://35.188.171.242/' } }).then(response => {
      console.log('response received..', response);
    });
    const wrapper = shallow(<ProductDetailsBait store={store} pageInfo={pageInfo} productItem={productItem} />).dive();
    expect(wrapper).to.have.length(1);
  });

  it('test with actions', () => {
    const wrapper = shallow(<ProductDetailsBait store={store} isCSR={false} api={JSONData} productItem={productItem} />).dive();
    wrapper
      .find(BaitVariant)
      .props()
      .handleUpdateQuantity({ itemId: 123 });
    wrapper.setState({ itemDetails: [{ itemId: 123 }] });
    wrapper
      .find(BaitVariant)
      .props()
      .handleUpdateQuantity({ itemId: 123 });
    expect(wrapper).to.have.length(1);
  });
});
