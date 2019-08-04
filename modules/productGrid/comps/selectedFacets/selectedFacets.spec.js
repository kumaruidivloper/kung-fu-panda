import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { shallow, mount } from 'enzyme';
import Selectedfacets from './selectedFacets';

describe('Selected facets component', () => {
    const props = {
        cms: {
            title: 'Selectedfacets works!'
        }
    };
    it('always renders the SelectedFacet component', () => {
        const Wrapper = shallow(<Selectedfacets {...props} />);
        // console.log(Wrapper.getDOMNode());
        expect(Wrapper.length).to.eql(1);
    });
    let MountedSelectedFacets;

    const ShallowSelectedFacets = () => {
        if (!MountedSelectedFacets) {
            MountedSelectedFacets = mount(<Selectedfacets {...props} />);
        }
        return MountedSelectedFacets;
    };

    it('Contains everything that is rendered', () => {
        const divs = ShallowSelectedFacets().find('div');
        const wrappingDiv = divs.first();
        expect(divs.length).to.be.equal(wrappingDiv.length);
    });
    it('always renders a GridComponent', () => {
        expect(ShallowSelectedFacets().find('div').length).to.not.equal(0);
    });
    it('should have children with a class named selectedfacet-container', () => {
        expect(ShallowSelectedFacets().children('.selectedfacet-container').length).to.equal(1);
    });
});

describe('Testing component lifecycle', () => {
    it('Tests the component life cycle', () => {
        const props = { cms: { items: 'items' } };
        sinon.spy(Selectedfacets.prototype, 'render');
        const wrapper = mount(<Selectedfacets {...props} />).setState({
            selectedFacets: [{ selectedLabelName: '361', selectedLabelId: 'mfName_ntk_cs%3A%22361%22', selectedLabelParentDrawer: 'Brand' }]
        });
        const wrappingDiv = wrapper.find('div');
        const divCount = wrappingDiv.first('div');
        expect(divCount.find('.selectedfacet-item').length).to.greaterThan(0);
    });
});

describe('Calls onRemoveItem', () => {
    it('Calls onRemoveItem', () => {
      const props = { cms: { items: 'items' } };
      const wrapper = mount(<Selectedfacets {...props} />);
      expect(wrapper.instance().onRemoveItem).to.be.a('function');
    });
  });

  describe('Calls facetChangeListener', () => {
    it('Calls facetChangeListener', () => {
      const props = { cms: { items: 'items' } };
      const wrapper = mount(<Selectedfacets {...props} />);
      expect(wrapper.instance().facetChangeListener).to.be.a('function');
    });
  });

  describe('Calls facetChangeListener', () => {
    it('Calls facetChangeListener', () => {
      const props = { cms: { items: 'items' } };
      const wrapper = mount(<Selectedfacets {...props} />);
      expect(wrapper.instance().facetChangeListener).to.be.a('function');
      expect(wrapper.instance().props).to.be.a('object');
      expect(wrapper.instance().state).to.be.a('object');
    });
  });
