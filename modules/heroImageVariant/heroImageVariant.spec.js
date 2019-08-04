import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { Provider } from 'react-redux';
import { mount, shallow } from 'enzyme';
import configureStore from 'redux-mock-store';
import heroImageVariantJson from './heroImageVariant.component.json';
import HeroImageVariant from './heroImageVariant.component';

const { cms } = heroImageVariantJson.context.data;
const initialState = {
  gtmDataLayer: []
};
const mockStore = configureStore();
let store;

describe('<HeroImageVariant />', () => {
  beforeEach(() => {
    store = mockStore(initialState);
  });
  it('should render <HeroImageVariant /> with BackgroundImage, ForegroundImage, MiddleImage and BoxWithText component', () => {
    // const wrapper = shallow(<HeroImageVariant cms={cms} />);
    const wrapper = mount(<Provider store={store}><HeroImageVariant cms={cms} /></Provider>);
    expect(wrapper.find('BackgroundImage')).to.have.length(1);
    expect(wrapper.find('ForegroundImage')).to.have.length(1);
    expect(wrapper.find('BoxWithText')).to.have.length(1);
    expect(wrapper.find('MiddleImage')).to.have.length(1);
  });

  it('should use desktop image version', () => {
    const wrapper = mount(<Provider store={store}><HeroImageVariant cms={cms} /></Provider>);
    wrapper.setState({ viewWidth: 900, canUseDOM: true });
    expect(wrapper.find('BackgroundImage').prop('src')).to.equal(cms.desktopBackgroundImage);
  });

  it('should use mobile image version', () => {
    const wrapper = shallow(<HeroImageVariant store={store} cms={cms} />).dive();
    wrapper.setState({ viewWidth: 300, canUseDOM: true });
    wrapper.update();
    expect(wrapper.find('BackgroundImage').prop('src')).to.equal(cms.mobileBackgroundImage);
  });

  it('should validate the component life cycle', () => {
    const onComponentWillMount = sinon.stub();
    HeroImageVariant.prototype.componentWillMount = onComponentWillMount;
    sinon.spy(HeroImageVariant.prototype, 'componentWillUnmount');
    const wrapper = mount(<Provider store={store}><HeroImageVariant cms={cms} /></Provider>);
    wrapper.setState({ viewWidth: 300, canUseDOM: true });
    expect(onComponentWillMount.calledOnce).to.equal(true);
    wrapper.setState({ viewWidth: 300, canUseDOM: true });
    wrapper.unmount();
    expect(HeroImageVariant.prototype.componentWillUnmount.calledOnce).to.equal(true);
  });

  it('should check for handleWindowSizeChange', () => {
    const wrapper = shallow(<HeroImageVariant store={store} cms={cms} />).dive();
    wrapper.instance().handleWindowSizeChange();
  });
});
