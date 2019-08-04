import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import sinon from 'sinon';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import * as actions from '../header/actions';
import * as constants from '../header/constants';
import checkoutHeaderJson from './checkoutHeader.component.json';
import CheckoutHeader from './checkoutHeader.component';

const { cms } = checkoutHeaderJson.context.data;
const initialState = {};

const mockStore = configureStore();
let store;

describe('<CheckoutHeader />', () => {
  beforeEach(() => {
    store = mockStore(initialState);
  });
  it('should render <CheckoutHeader /> component', () => {
    const wrapper = mount(
      <Provider store={store}>
        <CheckoutHeader cms={cms} />
      </Provider>
    );
    expect(wrapper.find('MiniCart')).to.have.length(1);
    const divs = wrapper.find('div');
    const wrappingDiv = divs.first('div');
    const contentDiv = wrappingDiv.find('div');
    expect(contentDiv.length).to.be.greaterThan(0);
  });
  it('should validate the component life cycle', () => {
    const componentDidMount = sinon.stub();
    CheckoutHeader.prototype.componentDidMount = componentDidMount;
    const wrapper = mount(
      <Provider store={store}>
        <CheckoutHeader cms={cms} fnFetchMiniCart={() => {}} />
      </Provider>
    );
    expect(wrapper.find('div')).to.have.length(4);
    expect(componentDidMount.calledOnce).to.equal(true);
    expect(wrapper.find('a')).to.have.length(2);
    expect(wrapper.find('img')).to.have.length(1);
    expect(wrapper.find('span')).to.have.length(1);
    expect(wrapper.find('img').prop('alt')).to.equal(cms.checkoutHeaderLogoAltText);
    expect(wrapper.find('img').prop('src')).to.equal(cms.checkoutHeaderLogo);
    const anchors = wrapper.find('a');
    const firsta = anchors.first('a');
    const lasta = anchors.last('a');
    expect(firsta.prop('href')).to.equal(cms.checkoutHeaderLogoTargetURL);
    expect(lasta.prop('href')).to.equal(cms.checkoutCartLink);
  });
  describe('fetch mini cart actions', () => {
    it('should create an action to fetch mini cart data request', () => {
      const data = 'fetch mini cart request action data';
      const expectedAction = {
        type: constants.FETCH_MINI_CART
      };
      expect(actions.fetchMiniCart(data)).to.deep.include(expectedAction);
    });
    it('should create an action to make mini cart data response success', () => {
      const data = 'fetch mini cart success response action data';
      const expectedAction = {
        type: constants.FETCH_MINI_CART_SUCCESS
      };
      expect(actions.fetchMiniCartSuccess(data)).to.deep.include(expectedAction);
    });
    it('should create an action to make mini cart data response failure', () => {
      const error = 'fetch mini cart error action data';
      const expectedAction = {
        type: constants.FETCH_MINI_CART_ERROR
      };
      expect(actions.fetchMiniCartError(error)).to.deep.include(expectedAction);
    });
  });
});
