import React from 'react';
import { expect } from 'chai';
import { mount, shallow } from 'enzyme';
import { Provider } from 'react-redux';
import PropTypes from 'prop-types';
import sinon from 'sinon';
import configureStore from 'redux-mock-store';
import billingInfoFormJson from './billingInfoForm.component.json';
import { BillingInfoForm } from './billingInfoForm.component';
import BillingForm from './components/billingForm/billingFormComponent';
import { validateBillingForm } from './validationRules';
import AddressSuggestions from './components/addressSuggestionModal/addressSuggestionsModal';

describe('<BillingInfoForm />', () => {
  const { cms } = billingInfoFormJson.context.data;
  const initialFormState = {
    form: {
      paymentForm: {
        syncErrors: {
          billingFirstName: 'Required',
          billingAddress1: 'Required',
          billingPhoneNumber: 'Required',
          billingZipCode: 'Required',
          billingCity: 'Required',
          billingState: 'Required',
          email: 'Required',
          creditcardField: 'Unrecognized card number, please check the number and try again. We accept Visa, Mastercard, Discover, and American Express.',
          expiryField: 'Unrecognized expiration date',
          cvvField: 'Unrecognized security code. Please enter the 3 or 4 digit security code printed on the front or back of the card.'
        },
        values: {
          changeBillingAddress: true,
          sameAsShippingAddress: true,
          savePaymentInfoCheckbox: false
        },
        initial: {
          changeBillingAddress: true,
          sameAsShippingAddress: true,
          savePaymentInfoCheckbox: false
        }
      }
    }
  };
  const initialState = { id: 1 };
  const store = configureStore();
  const data = {
    billingFirstName: 'John',
    billingLastName: 'Willam12',
    billingCity: 'Boston12',
    billingZipCode: 110011,
    billingState: 'NewYork12',
    billingAddress1: 'MDS Aster $%',
    email: 'abc@@@email.com',
    billingPhoneNumber: '998551234'
  };
  const props = {
    orderDetails: {
      addresses: {
        shippingAddress: {
          firstName: 'Academy',
          lastName: 'Sports',
          phoneNumber: '9786765456',
          address: '7 times square',
          zipCode: '10007',
          city: 'NY',
          state: 'NY',
          companyName: 'Academys'
        },
        billingAddress: {
          firstName: 'John',
          billingAddress2: 'Appleseed',
          phoneNumber: '9786765456',
          billingAddress1: '1, Infinite Loop',
          billingZipCode: '95040',
          billingCity: 'Cupertino',
          billingState: 'CA',
          companyName: 'Nike'
        }
      }
    },
    modalIsOpen: false,
    closeModal: () => {
      this.setState({ modalIsOpen: false });
    },
    onSubmitSuggestHandler: selectedAddress => {
      console.log(selectedAddress, 'Selected Address');
    },
    billingAddress: {
      firstName: 'Laura',
      lastName: 'Pratt',
      phoneNumber: '5781212345',
      address: '7, Shoreline Amphitheatre',
      zipCode: '10007',
      city: 'New York',
      state: 'NY',
      companyName: 'Google'
    },
    isLoggedIn: false,
    shippingAddress: {
      firstName: 'Steve',
      lastName: 'Crew',
      phoneNumber: '5781212345',
      address: '12, Shoreline Amphitheatre',
      zipCode: '10007',
      city: 'New York',
      state: 'NY',
      companyName: 'IBM'
    },
    fetchCityStateFromZipCode: {
      isFetching: false,
      data: {
        city: 'Cupertino',
        state: 'CA'
      }
    },
    validateBillingAddress: {
      data: {
        avsErrors: {
          addressError: 'address.verify',
          altAddresList: [
            {
              sequenceId: '111',
              address: 'address line 1',
              city: 'city name ',
              state: 'state name ',
              country: 'country',
              zipcode: 'zipcode'
            },
            {
              sequenceId: '222',
              address: 'address line 2',
              city: 'city name 2 ',
              state: 'state name 2',
              country: 'country 2',
              zipcode: 'zipcode 2'
            }
          ]
        }
      },
      noAlternateAddressInBillingAddress: {
        data: {
        }
      },
      orderId: '30602531431'
    }
  };

  const {
    orderDetails, modalIsOpen, closeModal, isLoggedIn, fetchCityStateFromZipCode, validateBillingAddress, onSubmitSuggestHandler, billingAddress, shippingAddress
 } = props;

  it('renders <validationRules /> component', () => {
    validateBillingForm(data);
  });

  it('renders <BillingInfoForm /> component', () => {
    const wrapper = mount(<Provider store={store(initialState)}><BillingInfoForm cms={cms} orderDetails={orderDetails} modalIsOpen={modalIsOpen} closeModal={closeModal} validateBillingAddress={validateBillingAddress} onSubmitSuggestHandler={onSubmitSuggestHandler} billingAddress={billingAddress} /></Provider>);
    expect(wrapper.find('section')).to.have.length(1);
    expect(wrapper.find('section div').first().text()).to.equal('BILLING INFORMATION');
  });

  it('Renders AVS Modal', () => {
    const wrapper = shallow(<BillingInfoForm cms={cms} store={store(initialState)}orderDetails={orderDetails} modalIsOpen closeModal={closeModal} validateBillingAddress={validateBillingAddress} onSubmitSuggestHandler={onSubmitSuggestHandler} billingAddress={billingAddress} />);
    expect(wrapper.find(AddressSuggestions)).to.have.length(1);
  });

  it('counts divs in case a billing address is passed.', () => {
    const wrapper = shallow(<BillingInfoForm cms={cms} store={store(initialState)}orderDetails={orderDetails} modalIsOpen closeModal={closeModal} validateBillingAddress={validateBillingAddress} onSubmitSuggestHandler={onSubmitSuggestHandler} billingAddress={billingAddress} />);
    expect(wrapper.find('div')).to.have.length(7);
  });

  it('triggers the change billing address link', () => {
    const wrapper = shallow(<BillingInfoForm cms={cms} store={store(initialState)} orderDetails={orderDetails} modalIsOpen closeModal={closeModal} validateBillingAddress={validateBillingAddress} onSubmitSuggestHandler={onSubmitSuggestHandler} billingAddress={billingAddress} />);
    const changeBillingAddressSpy = sinon.spy(wrapper.instance(), 'changeBillingAddress');
    const ifNoBillingAddressFoundSpy = sinon.spy(wrapper.instance(), 'ifNoBillingAddressFound');
    wrapper.update();
    wrapper.find('a').simulate('click', { preventDefault: () => {} });
    expect(changeBillingAddressSpy.calledOnce).to.equal(true);
    expect(wrapper.state().changeBillingAddress).to.equal(true);
    expect(ifNoBillingAddressFoundSpy.calledOnce).to.equal(true);
    expect(wrapper.find(BillingForm)).to.have.length(1);
    expect(wrapper.find('div')).to.have.length(2);
  });

  it('Renders <BillingForm /> component', () => {
    const wrapper = mount(<Provider store={store(initialFormState)}><BillingForm fetchCityStateFromZipCode={fetchCityStateFromZipCode} cms={cms} shippingAddress={shippingAddress} isLoggedIn={isLoggedIn} changeBillingAddress savePaymentInfoForLater={false} /></Provider>);
    expect(wrapper.find('div')).to.have.length(16);
    expect(wrapper.find('form')).to.have.length(1);
    wrapper.find('input[name="sameAsShippingAddress"]').simulate('change', { target: { checked: false }, preventDefault: () => {} });
    expect(wrapper.find('div')).to.have.length(16);
  });

  it('checks if additional address field presents on link click', () => {
    const wrapper = shallow(<BillingForm store={store(initialState)} fetchCityStateFromZipCode={fetchCityStateFromZipCode} cms={cms} shippingAddress={shippingAddress} isLoggedIn={isLoggedIn} changeBillingAddress savePaymentInfoForLater />).dive().dive().dive().dive();
    expect(wrapper.find('#optionalAddressField').simulate('click', { preventDefault: () => {} }));
    expect(wrapper.state().optionalFieldVisible).to.equal(true);
  });

  it('tests auto detect city state based on zip code entered - feature', () => {
    const wrapper = mount(<Provider store={store(initialState)}><BillingForm fetchCityStateFromZipCode={fetchCityStateFromZipCode} cms={cms} shippingAddress={shippingAddress} isLoggedIn={isLoggedIn} /></Provider>);
    wrapper.find('input[name="sameAsShippingAddress"]').simulate('change', { preventDefault: () => {} });
    wrapper.find('input[name="billingZipCode"]').simulate('change', { target: { value: '95014' }, preventDefault: () => {} });
  });

  it('Testing Proptypes for </BillingInfoForm>', () => {
    expect(BillingInfoForm.propTypes.cms).to.equal(PropTypes.object.isRequired);
    expect(BillingInfoForm.propTypes.orderDetails).to.equal(PropTypes.object);
    expect(BillingInfoForm.propTypes.modalIsOpen).to.equal(PropTypes.bool);
    expect(BillingInfoForm.propTypes.billingAddress).to.equal(PropTypes.object);
  });

  // Tests for address suggestion modal.
  it('renders <AddressSuggestions /> component onClick achor tag for selecting address i.e. handleAddressSelect', () => {
    const wrapper = shallow(<AddressSuggestions modalIsOpen closeModal={closeModal} cms={cms} store={store(initialFormState)} validateBillingAddress={validateBillingAddress} formStates={{ billingAddress1: '7 times' }} />).dive();
    const handleClick = sinon.spy(wrapper.instance(), 'handleAddressSelect');
    wrapper.find('a').at(0).simulate('click', { preventDefault() {} });
    expect(handleClick.calledOnce).to.equal(true);
  });
  it('renders <AddressSuggestions /> component and clicks on use selected address button to call submitSuggestHandler', () => {
    const submitSuggestHandlerSpy = sinon.spy();
    const wrapper = shallow(<AddressSuggestions modalIsOpen closeModal={closeModal} cms={cms} store={store(initialFormState)} validateBillingAddress={validateBillingAddress} onSubmitSuggestHandler={submitSuggestHandlerSpy} formStates={{ billingAddress1: '7 times' }} />).dive();
    wrapper.find('[id="submitSelectedAddressButton"]').simulate('click', { preventDefault() {} });
    expect(submitSuggestHandlerSpy.calledOnce).to.equal(true);
  });
});
