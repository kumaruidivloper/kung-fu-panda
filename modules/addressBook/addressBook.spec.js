import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { shallow, mount } from 'enzyme';
// import configureMockStore from 'redux-mock-store';
import addressBookJson from './addressBook.component.json';
import AddressBook from './addressBook.component';
import EmptyCondition from './emptyCondition';
// import MyAccountAddressSuggestions from './addressSuggestionsModal';

describe('<AddressBook />', () => {
  const {
    cms,
    showAlertBox,
    deleteID,
    showEditAddressForm,
    showAddressForm,
    zipCodeCityStateData,
    validatedAddress,
    addressList
  } = addressBookJson.context.data;
  it('renders <AddressBook /> component aaa', () => {
    const wrapper = shallow(
      <AddressBook
        toggleAddressForm={() => 'test'}
        cms={cms}
        showAlertBox={showAlertBox}
        deleteID={deleteID}
        showEditAddressForm={showEditAddressForm}
        showAddressForm={showAddressForm}
        zipCodeCityStateData={zipCodeCityStateData}
        validatedAddress={validatedAddress}
        addressList={addressList}
        fnFetchAddress={() => 'test'}
        breadCrumbAction={() => {}}
      />
    );
    expect(wrapper.find('div')).to.have.length(3);
    const mockfunc = sinon.spy(wrapper.instance(), 'toggleAddressForm');
    wrapper
      .find('button')
      .props()
      .onClick();
    expect(mockfunc.calledOnce).equals(true);
    mockfunc.restore();
  });
  it('renders <AddressBook /> component when showAddressForm is true', () => {
    const wrapper = shallow(
      <AddressBook
        showAddressForm
        toggleAddressForm={() => 'test'}
        cms={cms}
        showAlertBox={showAlertBox}
        deleteID={deleteID}
        showEditAddressForm={showEditAddressForm}
        zipCodeCityStateData={zipCodeCityStateData}
        validatedAddress={validatedAddress}
        addressList={addressList}
        fnFetchAddress={() => 'test'}
        breadCrumbAction={() => {}}
      />
    );
    expect(wrapper.find('div')).to.have.length(8);
    const mockfunc = sinon.spy(wrapper.instance(), 'toggleAddressForm');
    wrapper
      .find('button')
      .at(1)
      .props()
      .onClick();
    expect(mockfunc.calledOnce).equals(true);
    mockfunc.restore();
  });
  it('renders <AddressBook /> component when addressList has length=0 and showaddressform as false', () => {
    const wrapper = shallow(
      <AddressBook
        showAddressForm={false}
        toggleAddressForm={() => 'test'}
        cms={cms}
        showAlertBox={showAlertBox}
        deleteID={deleteID}
        showEditAddressForm={showEditAddressForm}
        zipCodeCityStateData={zipCodeCityStateData}
        validatedAddress={validatedAddress}
        addressList={[]}
        fnFetchAddress={() => 'test'}
        breadCrumbAction={() => {}}
      />
    );
    expect(wrapper.find('div')).to.have.length(3);
    expect(wrapper.find('button')).to.have.length(0);
  });
  it('renders <AddressBook /> component when addressList has length>0 and showaddressform as false', () => {
    const wrapper = shallow(
      <AddressBook
        showAddressForm={false}
        toggleAddressForm={() => 'test'}
        cms={cms}
        showAlertBox={showAlertBox}
        deleteID={deleteID}
        showEditAddressForm={showEditAddressForm}
        zipCodeCityStateData={zipCodeCityStateData}
        validatedAddress={validatedAddress}
        addressList={[1, 2]}
        fnFetchAddress={() => 'test'}
        breadCrumbAction={() => {}}
        inValidateAddressVerification={() => {}}
      />
    );
    expect(wrapper.find('div')).to.have.length(3);
    expect(wrapper.find('button')).to.have.length(1);
  });
  it('renders <AddressBook /> component when addressList has length>0 and showaddressform as false', () => {
    const wrapper = shallow(
      <AddressBook
        showAddressForm={false}
        toggleAddressForm={() => 'test'}
        cms={cms}
        showAlertBox={showAlertBox}
        deleteID={deleteID}
        showEditAddressForm={showEditAddressForm}
        zipCodeCityStateData={zipCodeCityStateData}
        validatedAddress={validatedAddress}
        addressList={[1, 2]}
        fnFetchAddress={() => 'test'}
        breadCrumbAction={() => {}}
        inValidateAddressVerification={() => {}}
      />
    );
    expect(wrapper.state().modalIsOpen).equals(false);
    wrapper.setState({ modalIsOpen: true });
    const mockfunc = sinon.spy(wrapper.instance(), 'closeModal');
    mockfunc();
    expect(wrapper.state().modalIsOpen).equals(false);
    mockfunc.restore();
  });
  it('renders <AddressBook /> component when addressStateIndex is 0 and onsubmithandler is clicked', () => {
    const wrapper = shallow(
      <AddressBook
        fnValidateAddress={data => data}
        addressStateIndex={0}
        showAddressForm={false}
        toggleAddressForm={() => 'test'}
        cms={cms}
        showAlertBox={showAlertBox}
        deleteID={deleteID}
        showEditAddressForm={showEditAddressForm}
        zipCodeCityStateData={zipCodeCityStateData}
        validatedAddress={validatedAddress}
        addressList={[1, 2]}
        fnFetchAddress={() => 'test'}
        breadCrumbAction={() => {}}
        inValidateAddressVerification={() => {}}
      />
    );
    expect(wrapper.state().modalIsOpen).equals(false);
    const mockfunc = sinon.spy(wrapper.instance(), 'onSubmitHandler');
    mockfunc('testing', false, null);
    expect(wrapper.state().modalIsOpen).equals(true);
    mockfunc.restore();
  });
  it('renders <AddressBook /> component when addressList has length>0 and showaddressform as false and opening Address suggestion component modal', () => {
    const mock = { data: { avsErrors: true } };
    const wrapper = shallow(
      <AddressBook
        fnAddAddress={() => () => 'test'}
        showAddressForm={false}
        toggleAddressForm={() => 'test'}
        cms={cms}
        showAlertBox={showAlertBox}
        deleteID={deleteID}
        showEditAddressForm={showEditAddressForm}
        zipCodeCityStateData={zipCodeCityStateData}
        validatedAddress={mock}
        addressList={[1, 2]}
        fnFetchAddress={() => 'test'}
        breadCrumbAction={() => {}}
        inValidateAddressVerification={() => {}}
      />
    );
    expect(wrapper.state().modalIsOpen).equals(false);
    wrapper.setState({ modalIsOpen: true });
    expect(wrapper.find('Connect(MyAccountAddressSuggestions)')).to.have.length(1);
  });
  it('renders <AddressBook /> component fully with address card and all other mini components', () => {
    const wrapper = mount(
      <AddressBook
        deleteAddress={() => 'test'}
        cms={cms}
        showAlertBox={showAlertBox}
        deleteID={deleteID}
        showEditAddressForm={showEditAddressForm}
        showAddressForm={showAddressForm}
        zipCodeCityStateData={zipCodeCityStateData}
        validatedAddress={validatedAddress}
        addressList={addressList}
        fnFetchAddress={() => 'test'}
        breadCrumbAction={() => {}}
      />
    );
    expect(wrapper.find('div')).to.have.length(61);
  });
});
describe('<EmptyCondition />', () => {
  it('renders <EmptyCondition /> component', () => {
    const mockfunc = sinon.spy(EmptyCondition.prototype, 'renderAddressEmpty');
    const wrapper = shallow(<EmptyCondition heading="just checking" button="test" onClickHandler={() => 'test'} />);
    expect(wrapper.find('div')).to.have.length(3);
    expect(mockfunc.calledOnce).equals(true);
    mockfunc.restore();
  });
});
// describe('<MyAccountAddressSuggestions />', () => {
//   const { cms } = addressBookJson.context.data;
//   const mockStore = configureMockStore();
//   // const validatedAddress = { addressLine1: 'test' };
//   it('renders <MyAccountAddressSuggestions /> component', () => {
//     // const mockfunc = sinon.spy(MyAccountAddressSuggestions.prototype, 'renderAddressEmpty');
//     const mockformStates = {
//       addressLine1: 'addressLine1',
//       city: 'testcity',
//       state: 'teststate',
//       zipCode: 'testcode',
//       data: { avsErrors: true },
//       avsErrors: true
//     };
//     const validatedAddress = {
//       data: {
//         avsErrors: {
//           addressLine1: 'addressLine1',
//           addressError: 'address.verify',
//           altAddresList: [
//             { sequenceId: '111', addressLine: 'address line 1', city: 'city name ', state: 'state name ', country: 'country', zipcode: 'zipcode' },
//             {
//               sequenceId: '222',
//               addressLine: 'address line 2',
//               city: 'city name 2 ',
//               state: 'state name 2',
//               country: 'country 2',
//               zipcode: 'zipcode 2'
//             }
//           ]
//         },
//         orderId: '30602531431'
//       }
//     };
//     const store = mockStore(mockformStates);
//     const wrapper = shallow(
//       // <Provider store={store}>
//       <MyAccountAddressSuggestions
//         store={store}
//         cms={cms}
//         formStates={mockformStates}
//         validatedAddress={validatedAddress}
//         modalIsOpen
//         closeModal={() => 'test'}
//         onSubmitSuggestHandler={data => data}
//       />
//       // </Provider>
//     ).dive();
//     expect(wrapper.find('div')).to.have.length(3);
//     // expect(mockfunc.calledOnce).equals(true);
//     // mockfunc.restore();
//   });
// });
