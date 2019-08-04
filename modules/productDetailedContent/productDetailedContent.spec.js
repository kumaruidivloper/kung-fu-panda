import React from 'react';
import Responsive from 'react-responsive';
import { expect } from 'chai';
import { shallow, mount } from 'enzyme';
import configureStore from 'redux-mock-store';
// import { Provider } from 'react-redux';
import ProductDetailedContent from './productDetailedContent.component';
import Details from '../detailsAndSpecs/detailsAndSpecs.component';
import BazaarVoice from '../bazaarVoice/bazaarVoice.component';
import Accordion from './accordion';

const initialState = {
  gtmDataLayer: []
};
const mockStore = configureStore();
let store;

const mockPropObj = {
  productSpecifications: [
    {
      featureBenefits: {
        value: [
          'Omni-Shade™ UPF 50 sun protection blocks UVA and UVB rays with tight-weave construction, UV absorbers and UV reflectors',
          'Made of quick-drying 100% polyester interlock'
        ],
        key: 'Features and Benefits'
      }
    },
    {
      specifications: {
        value: {
          Activity: 'Fishing',
          Type: 'Shirts'
        },
        key: 'Specifications'
      }
    },
    {
      "What's in the Box": {
        value: "Columbia Sportswear™ Men's Terminal Tackle PFG Sleeve™ Long Sleeve Shirt",
        key: "What's in the Box"
      }
    }
  ],
  longDescription: 'Head to your favorite fishing spot in the Columbia',
  itemId: '12345abc245',
  mfItemId: '328610',
  partNumber: '201539784B'
};

describe('<ProductDetailedContent />', () => {
  beforeEach(() => {
    store = mockStore(initialState);
  });

  it('renders <ProductDetailedContent /> component', () => {
    const wrapper = shallow(<ProductDetailedContent store={store} productItem={mockPropObj} />);
    expect(wrapper).to.have.length(1);
  });

  it('renders <Responsive /> component', () => {
    const wrapper = mount(<ProductDetailedContent store={store} productItem={mockPropObj} />);
    expect(wrapper.find(ProductDetailedContent).find(Responsive).length).to.equal(2);
  });

  it('renders <DetailsAndSpec /> component', () => {
    const wrapper = mount(<Details productSpecifications={mockPropObj.productSpecifications} description={mockPropObj.longDescription} />);
    expect(wrapper.find(Details)).to.have.length(1);
  });

  it('renders <BazaarVoice /> component', () => {
    const wrapper = mount(<BazaarVoice type="reviews" ExternalId={mockPropObj.partNumber} />);
    expect(wrapper.find(BazaarVoice)).to.have.length(1);
  });

  it('renders <Accordian /> component', () => {
    const wrapper = mount(<Accordion title="DETAILS_AND_SPECS" isOpen accordianName="details" />);
    expect(wrapper.find(Accordion)).to.have.length(1);
  });

  it('renders <ProductDetailedContent /> state testing component', () => {
    const wrapper = mount(shallow(<ProductDetailedContent store={store} productItem={mockPropObj} />).get(0));
    expect(wrapper.state('selectedTabIndex')).to.equal(0);
  });

  it('renders <ProductDetailedContent /> accordion testing component', () => {
    const wrapper = shallow(<ProductDetailedContent store={store} productItem={mockPropObj} />);
    console.log(wrapper.dive().html());
    expect(wrapper.dive().find('.product-details-content').length).to.equal(2);
  });

  it('renders <Accordion /> inside testing component', () => {
    const wrapper = shallow(<ProductDetailedContent store={store} productItem={mockPropObj} />);
    expect(wrapper.dive().find(Accordion)).to.have.length(3);
  });

  it('should able to click tab', () => {
    const wrapper = shallow(<ProductDetailedContent store={store} productItem={mockPropObj} />);
    let tab = wrapper
      .dive()
      .find('Tab')
      .at(0);
    tab.simulate('click');
    // console.log(initialState);
    tab = wrapper
      .dive()
      .find('Tab')
      .at(1);
    tab.simulate('click');
    tab = wrapper
      .dive()
      .find('Tab')
      .at(2);
    tab.simulate('click');
    // console.log(initialState);
    expect(initialState.gtmDataLayer).to.have.length(3);
  });

  it('should able to click accordian', () => {
    const wrapper = shallow(<ProductDetailedContent store={store} productItem={mockPropObj} />);
    wrapper
      .dive()
      .instance()
      .toggleAccordian('reviews');
    expect(initialState.gtmDataLayer).to.have.length(4);
    wrapper
      .dive()
      .instance()
      .toggleAccordian('details');
    expect(initialState.gtmDataLayer).to.have.length(5);
    wrapper
      .dive()
      .instance()
      .toggleAccordian('qa');
    expect(initialState.gtmDataLayer).to.have.length(6);
  });
});
