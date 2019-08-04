import React from 'react';
import { expect } from 'chai';
import { shallow, mount } from 'enzyme';
import configureMockStore from 'redux-mock-store';
import { QuantityCard } from './quantityCard';
import BaitJson from '../baitVariant.component.json';
import { QuantityHeader } from './quantityCardStyles';
describe('<QuantityCard />', () => {
  const initialState = {
    findAStoreModalRTwo: {
      myStoreDetails: {}
    }
  };
  const mockStore = configureMockStore();
  const store = mockStore(initialState);
  const { data, selectedQty } = BaitJson.context.data;
  it('renders <QuantityCard /> component', () => {
    const wrapper = shallow(<QuantityCard store={store} data={data} selectedQty={selectedQty} />);
    expect(wrapper.find('div')).to.have.length(10);
    expect(wrapper.find(QuantityHeader)).to.have.length(1);
    expect(wrapper.props().selectedQty).to.be.undefined();
  });

  it('should have an initial state', () => {
    const wrapper = mount(<QuantityCard store={store} data={data} selectedQty={selectedQty} />);
    expect(wrapper.state('selectedQty')).to.equal(2);
  });

  it('should update on clicking updateQuantity', () => {
    const wrapper = mount(<QuantityCard store={store} data={data} selectedQty={selectedQty} />);
    wrapper.find('BaitQuantity.ButtonRight').simulate('click');
    expect(wrapper.find('BaitQuantity.ButtonRight')).to.have.length(1);
  });

  it('should update on clicking updateQuantity', () => {
    const wrapper = mount(<QuantityCard store={store} data={data} selectedQty={selectedQty} />);
    wrapper.find('BaitQuantity.ButtonLeft').simulate('click');
    expect(wrapper.state('selectedQty')).to.equal(0);
  });

  it('should update on clicking updateQty', () => {
    const wrapper = shallow(<QuantityCard store={store} data={data} selectedQty={selectedQty} />);
    expect(wrapper.props().updateQty).to.be.defined();
  });
});
