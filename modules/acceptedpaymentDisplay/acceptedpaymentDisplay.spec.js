import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import acceptedpaymentDisplayJson from './acceptedpaymentDisplay.component.json';
import AcceptedpaymentDisplay from './acceptedpaymentDisplay.component';

describe('<AcceptedpaymentDisplay />', () => {
  const { cms } = acceptedpaymentDisplayJson.context.data;
  it('renders <AcceptedpaymentDisplay /> component', () => {
    const wrapper = shallow(<AcceptedpaymentDisplay cms={cms} />);
    expect(wrapper.find('div')).to.have.length(13);
  });
  it('renders <AcceptedPaymentDisplay /> component', () => {
    const wrapper = shallow(<AcceptedpaymentDisplay cms={cms} />);
    expect(wrapper.find('div').at(5).text()).to.equal('SHOP WITH CONFIDENCE');
  });
  it('renders <AcceptedPaymentDisplay /> component', () => {
    const wrapper = shallow(<AcceptedpaymentDisplay cms={cms} />);
    expect(wrapper.find('div').at(8).text()).to.equal('FREE IN STORE RETURNS');
  });
});
