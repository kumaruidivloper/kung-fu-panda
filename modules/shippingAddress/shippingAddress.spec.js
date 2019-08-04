import React from 'react';
import { expect } from 'chai';
import { mount, shallow } from 'enzyme';
import { Provider } from 'react-redux';
import saga from 'redux-saga';
import configureStore from 'redux-mock-store';
import sinon from 'sinon';
import shippingAddressJson from './shippingAddress.component.json';
import ShippingAddress from './shippingAddress.component';
import AddressSuggestions from './addressSuggestionsModal';
import ShippingAddressForm from './shippingAddressForm';
import { validate } from './validationRules';
import * as shippingAddressActions from '../../apps/checkout/store/actions/savedShippingAddress';
import * as fetchCityStateActions from '../../apps/checkout/store/actions/fetchCityState';
import * as validateShippingActions from '../../apps/checkout/store/actions/validateAddress';
import * as constants from '../../apps/checkout/checkout.constants';

describe('<ShippingAddress />', () => {
  const {
 savedShippingAddress, cms
} = shippingAddressJson;
  const initialState = { id: '1' };
  const middlewares = [saga];
  const store = configureStore(middlewares);
  const data = {
    firstName: 'John12',
    lastName: 'Willam12',
    city: 'Boston12',
    zipCode: '1234',
    phoneNumber: 190389749827932,
    state: 'NewYork12',
    address: 'MDS Aster $%'
  };
    const orderDetails = {
        addresses: {
          shippingAddress: {
            firstName: 'Academy',
            lastName: 'Sports',
            phoneNumber: '1234567890',
            address: '7 times square',
            zipCode: '1234',
            city: 'NY',
            state: 'NY',
            companyName: 'Academys'
          }
        }
      };
    const zipCodeCityStateData = {
      isFetching: false,
error: false,
data: {
        state: 'TX',
        city: 'Hockley'
      }
    };
    const zipCodeCityStateDataElse = {
      isFetching: true,
      error: false,
      data: {}
    };
    const validateShippingAddress = {
      data: {
      avsErrors: {
        addressError: 'address.verify',
        altAddresList: [
          {
            sequenceId: '111',
            address: 'address line 3',
            city: 'city name ',
            state: 'state name ',
            country: 'country',
            zipcode: 'zipcode'
          },
          {
            sequenceId: '222',
            address: 'address line 4',
            city: 'city name 2 ',
            state: 'state name 2',
            country: 'country 2',
            zipcode: 'zipcode 2'
          }
        ]
      },
      orderId: '1234'
    }
    };
    const validateShippingAddressElse = {};
    const validateShippingAddressIfElse = {
      data: {
      address: 'Verified'
    }
    };
  it('renders <AddressSuggestions /> component onClick achor tag for selecting address i.e. handleAddressSelect', () => {
    const wrapper = shallow(<AddressSuggestions cms={cms} store={store(initialState)} formStates={orderDetails.addresses.shippingAddress} validateShippingAddress={validateShippingAddress} />);
    const handleClick = sinon.spy(wrapper.instance(), 'handleAddressSelect');
    wrapper.find('a').at(0).simulate('click', { preventDefault() {} });
    expect(handleClick.calledOnce).to.equal(true);
  });
  it('renders <ShippingAddressForm /> component onClick of AddCompany tag', () => {
    const wrapper = shallow(<ShippingAddressForm cms={cms} store={store(initialState)} orderDetails={orderDetails} isLoggedIn={false} savedShippingAddress={savedShippingAddress} zipCodeCityStateData={zipCodeCityStateDataElse} validateShippingAddress={validateShippingAddress} initialVals={data} dropDownStateIndex={4} />).dive().dive().dive().dive();
    wrapper.setState({ addCompanyFlag: false });
    const handleClick = sinon.spy(wrapper.instance(), 'onShowCompanyAddress');
    wrapper.find('a').simulate('click', { target: { value: '123' }, preventDefault() {} });
    expect(handleClick.calledOnce).to.equal(false);
  });
  it('renders <ShippingAddressForm /> component Redux form onclick loadCityStateInStore funtion', () => {
    const wrapper = shallow(<ShippingAddressForm cms={cms} store={store(initialState)} orderDetails={orderDetails} isLoggedIn={false} savedShippingAddress={savedShippingAddress} zipCodeCityStateData={zipCodeCityStateData} validateShippingAddress={validateShippingAddress} dropDownStateIndex={4} fnvalidateZipCodeshippingAddress={() => {}} />).dive().dive().dive().dive();
    const handleChangeSpy = sinon.spy(wrapper.instance(), 'loadCityStateInStore');
    expect(handleChangeSpy.calledOnce).to.equal(false);
    wrapper.find('Field').at(4).simulate('change', { target: { value: '123' } });
    wrapper.find('Field').at(4).simulate('change', { target: { value: '12345' } });
    expect(handleChangeSpy.calledOnce).to.equal(false);
  });
  it('renders <ShippingAddress /> component count total Anchor tag', () => {
    const wrapper = mount(<Provider store={store(initialState)}><ShippingAddress cms={cms} orderDetails={orderDetails} isLoggedIn={false} savedShippingAddress={savedShippingAddress} zipCodeCityStateData={zipCodeCityStateData} validateShippingAddress={validateShippingAddress} /></Provider>);
    expect(wrapper.find('a')).to.have.length(1);
  });
  it('renders <ShippingAddress /> component componentWillRecieveProps called when validation modal opens', () => {
    const wrapper = shallow(<ShippingAddress store={store(initialState)} cms={cms} orderDetails={orderDetails} isLoggedIn={false} savedShippingAddress={savedShippingAddress} zipCodeCityStateData={zipCodeCityStateData} validateShippingAddress={validateShippingAddressElse} />).dive();
    const spy = sinon.spy(ShippingAddress.prototype, 'componentWillReceiveProps');
    expect(spy.calledOnce).to.equal(false);
    wrapper.setProps({ validateShippingAddress });
    wrapper.setProps({ validateShippingAddress: validateShippingAddressIfElse });
    expect(spy.calledOnce).to.equal(false);
  });
  it('renders <validationRules /> component', () => {
    const values1 = {
      city: null,
      state: null
    };
    expect(validate(values1, shippingAddressJson).city).to.equal('Required');
    expect(validate(values1, shippingAddressJson).state).to.equal('Required');
  });
  it('renders <ShippingAddress /> component count total div with auth user', () => {
    const wrapper = mount(<Provider store={store(initialState)}><ShippingAddress cms={cms} orderDetails={orderDetails} isLoggedIn={false} savedShippingAddress={savedShippingAddress} zipCodeCityStateData={zipCodeCityStateData} validateShippingAddress={validateShippingAddress} /></Provider>);
    wrapper.setState({ addressStateIndex: 1 });
    expect(wrapper.find('div')).to.have.length(31);
  });
  it('renders <ShippingAddress /> component count total div with unauth User', () => {
    const wrapper = mount(<Provider store={store(initialState)}><ShippingAddress cms={cms} orderDetails={orderDetails} isLoggedIn={false} savedShippingAddress={savedShippingAddress} zipCodeCityStateData={zipCodeCityStateData} validateShippingAddress={validateShippingAddress} /></Provider>);
    wrapper.setState({ addressStateIndex: 2 });
    expect(wrapper.find('div')).to.have.length(31);
  });
  it('renders <ShippingAddress /> component count total button', () => {
    const wrapper = mount(<Provider store={store(initialState)}><ShippingAddress cms={cms} orderDetails={orderDetails} isLoggedIn={false} savedShippingAddress={savedShippingAddress} zipCodeCityStateData={zipCodeCityStateData} validateShippingAddress={validateShippingAddress} /></Provider>);
    expect(wrapper.find('button')).to.have.length(2);
  });
  it('renders <ShippingAddress /> component count total input', () => {
    const wrapper = mount(<Provider store={store(initialState)}><ShippingAddress cms={cms} orderDetails={orderDetails} isLoggedIn={false} savedShippingAddress={savedShippingAddress} zipCodeCityStateData={zipCodeCityStateData} validateShippingAddress={validateShippingAddress} /></Provider>);
    expect(wrapper.find('input')).to.have.length(6);
  });
  it('renders <AddressSuggestions /> component count total dropdown', () => {
    const wrapper = mount(<Provider store={store(initialState)}><AddressSuggestions cms={cms} formStates={orderDetails.addresses.shippingAddress} validateShippingAddress={validateShippingAddress} /></Provider>);
    expect(wrapper.find('div')).to.have.length(1);
    wrapper.setProps({ modalIsOpen: false });
    expect(wrapper.find('div')).to.have.length(1);
  });
});


describe('Checkout savedShippingAddress actions', () => {
  it('should create an action to fetch saved shippingAddress details saga call', () => {
    const expectedAction = {
      type: constants.FETCH_SHIPPING_ADDRESS_REQUEST
    };
    expect(shippingAddressActions.fetchSavedShippingAddress()).to.deep.include(expectedAction);
  });
  it('should create an action to fetch saved shippingAddress details success', () => {
    const expectedAction = {
      type: constants.FETCH_SHIPPING_ADDRESS_SUCCESS
    };
    expect(shippingAddressActions.fetchSavedShippingAddressSuccess()).to.deep.include(expectedAction);
  });
  it('should create an action to fetch saved shippingAddress details failure', () => {
    const expectedAction = {
      type: constants.FETCH_SHIPPING_ADDRESS_FAILURE
    };
    expect(shippingAddressActions.fetchSavedShippingAddressError()).to.deep.include(expectedAction);
  });
  it('should create an action to add new shippingAddress request', () => {
    const expectedAction = {
      type: constants.ADD_SHIPPING_ADDRESS_REQUEST
    };
    expect(shippingAddressActions.addshippingAddress()).to.deep.include(expectedAction);
  });
  it('should create an action to add new shippingAddress success', () => {
    const expectedAction = {
      type: constants.ADD_SHIPPING_ADDRESS_SUCCESS
    };
    expect(shippingAddressActions.addshippingAddressSuccess()).to.deep.include(expectedAction);
  });
  it('should create an action to add new shippingAddress failure', () => {
    const expectedAction = {
      type: constants.ADD_SHIPPING_ADDRESS_FAILURE
    };
    expect(shippingAddressActions.addshippingAddressError()).to.deep.include(expectedAction);
  });
});

describe('Checkout fetchCityStateActions actions', () => {
  it('should create an action to fetch city state using zipcode', () => {
    const expectedAction = {
      type: constants.LOAD_CITY_STATE_DATA
    };
    expect(fetchCityStateActions.loadCityStateFromZipCode()).to.deep.include(expectedAction);
  });
  it('should create an action to get city state using zipcode success', () => {
    const expectedAction = {
      type: constants.CITY_STATE_DATA_LOADED
    };
    expect(fetchCityStateActions.fetchCityStateFromZipCodeSuccess()).to.deep.include(expectedAction);
  });
  it('should create an action to get city state using zipcode failure', () => {
    const expectedAction = {
      type: constants.LOAD_CITY_STATE_FAILURE
    };
    expect(fetchCityStateActions.fetchCityStateFromZipCodeError()).to.deep.include(expectedAction);
  });
  it('should create an action to erase the city state data from reducer', () => {
    const expectedAction = {
      type: constants.ERASE_CITY_STATE_DATA
    };
    expect(fetchCityStateActions.eraseCityStateData()).to.deep.include(expectedAction);
  });
});

describe('Checkout validateShippingActions actions', () => {
  it('should create an action to fetch city state using zipcode', () => {
    const expectedAction = {
      type: constants.VALIDATE_ADDRESS_REQUEST
    };
    expect(validateShippingActions.validateAddress()).to.deep.include(expectedAction);
  });
  it('should create an action to get city state using zipcode success', () => {
    const expectedAction = {
      type: constants.VALIDATE_ADDRESS_SUCCESS
    };
    expect(validateShippingActions.validateAddressSuccess()).to.deep.include(expectedAction);
  });
  it('should create an action to get city state using zipcode failure', () => {
    const expectedAction = {
      type: constants.VALIDATE_ADDRESS_FAILURE
    };
    expect(validateShippingActions.validateAddressError()).to.deep.include(expectedAction);
  });
  it('should create an action to erase the city state data from reducer', () => {
    const expectedAction = {
      type: constants.INVALIDATE_ADDRESS_VALIDATION
    };
    expect(validateShippingActions.inValidateAddressVerification()).to.deep.include(expectedAction);
  });
});

