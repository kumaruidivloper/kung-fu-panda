import React from 'react';
import { expect } from 'chai';
import { shallow, mount } from 'enzyme';
import configureMockStore from 'redux-mock-store';
import sinon from 'sinon';
import { Provider } from 'react-redux';
import inStorePickupJson from './inStorePickup.component.json';
import InStorePickup from './inStorePickup.component';

describe('<InStorePickup />', () => {
  const { cms, orderDetails, storeAddress } = inStorePickupJson.context.data;
  console.log('code', storeAddress);
  const initialstore = {};
  const mockStore = configureMockStore();
  const store = mockStore(initialstore);
  it('renders <InStorePickup /> , check dropdown selection', () => {
    const wrapper = shallow(<InStorePickup cms={cms} store={store} orderDetails={orderDetails} storeAddress={storeAddress} />).dive();
    const onSelectionDropdown = sinon.spy(wrapper.instance(), 'handleFormStatus');
    wrapper.find('t').props().onSelectOption();
    expect(onSelectionDropdown.calledOnce).to.equals(true);
  });
  it('renders <InStorePickup /> , check button submit', () => {
    const wrapper = shallow(<InStorePickup cms={cms} store={store} orderDetails={orderDetails} storeAddress={storeAddress} />).dive();
    const onbuttonSubmit = sinon.spy(wrapper.instance(), 'handleSubmitCall');
    wrapper.find('ReduxForm').props().buttonClickAction();
    expect(onbuttonSubmit.calledOnce).to.equals(true);
  });
  it('renders <InStorePickup /> , check pickup instructions', () => {
    const wrapper = shallow(<InStorePickup cms={cms} store={store} orderDetails={orderDetails} storeAddress={storeAddress} />).dive();
    const onPickupInstruction = sinon.spy(wrapper.instance(), 'handlepickupInstructions');
    wrapper.find('span').at(1).props().onClick();
    expect(onPickupInstruction.calledOnce).to.equals(true);
  });
  it('renders <InStorePickup /> , count total div', () => {
    const wrapper = mount(<Provider store={store}><InStorePickup cms={cms} orderDetails={orderDetails} storeAddress={storeAddress} /></Provider>);
    expect(wrapper.find('div')).to.have.length(13);
  });
  it('renders <InStorePickup /> , render alternate pickup person form', () => {
    const wrapper = shallow(<InStorePickup cms={cms} store={store} orderDetails={orderDetails} storeAddress={storeAddress} />).dive();
    console.log('first', wrapper.state());
    wrapper.setState({ formStatus: true });
    console.log('second', wrapper.state());
    console.log(wrapper.find('Connect(ReduxForm)').props());
    expect(wrapper.find('div')).to.have.length(9);
    // const onPickupInstruction = sinon.spy(wrapper.instance(), 'handlepickupInstructions');
    // wrapper.find('span').at(1).props().onClick();
    // expect(onPickupInstruction.calledOnce).to.equals(true);
  });
});
