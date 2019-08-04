import React from 'react';
import { expect } from 'chai';
import { mount, shallow } from 'enzyme';
import sinon from 'sinon';
import giftCardJson from './giftCard.component.json';
import GiftCard from './giftCard.component';

describe('<GiftCard />', () => {
  const { cms } = giftCardJson.context.data;
  it('renders <GiftCard /> component', () => {
    const shallowWrapper = shallow(<GiftCard cms={cms} />);
    const a = shallowWrapper.instance();
    expect(a.props.cms.ctas.length).to.be.greaterThan(0);
  });

  it('Checks for rendered components', () => {
    const wrapper = mount(<GiftCard cms={cms} />);
    wrapper.instance().onClickGoTo = sinon.spy();
    const { onClickGoTo } = wrapper.instance();
    wrapper.find('.giftCard').childAt(2).find('button').at(0).simulate('click');
    expect(onClickGoTo.calledOnce).to.equal(true);
  });
});
