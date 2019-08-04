import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { Provider } from 'react-redux';
import { mount } from 'enzyme';
import configureStore from 'redux-mock-store';
import shopByCategoryJson from './shopByCategory.component.json';
import ShopByCategory from './shopByCategory.component';

const { cms, api } = shopByCategoryJson.context.data;
const initialState = {
    gtmDataLayer: []
};

const mockStore = configureStore();
let store;

describe('<ShopByCategory />', () => {
    beforeEach(() => {
        store = mockStore(initialState);
    });
    it('should render <ShopByCategory /> component', () => {
        const wrapper = mount(<Provider store={store}><ShopByCategory cms={cms} api={api} /></Provider>);
        expect(wrapper.find('CategoryGridComponent')).to.have.length(api.categories[0].subCategories.length);
        const divs = wrapper.find('div');
        const wrappingDiv = divs.first('div');
        const contentDiv = wrappingDiv.find('div');
        expect(contentDiv.length).to.be.greaterThan(0);
    });
    it('should validate the component life cycle', () => {
        const oncomponentDidMount = sinon.stub();
        const ongridList = sinon.spy();
        ShopByCategory.prototype.gridList = ongridList;
        ShopByCategory.prototype.componentDidMount = oncomponentDidMount;
        sinon.spy(ShopByCategory.prototype, 'componentWillUnmount');
        const wrapper = mount(<Provider store={store}><ShopByCategory cms={cms} api={api} /></Provider>);
        wrapper.setState({ viewWidth: 300, canUseDOM: true });
        expect(oncomponentDidMount.calledOnce).to.equal(true);
    });
    it('should render header component', () => {
        const wrapper = mount(<Provider store={store}><ShopByCategory cms={cms} api={api} /></Provider>);
        expect(wrapper.find('.container').find('.row').first().childAt(0).find('span').length).to.equal(2);
    });
});

describe('Testing analyticsData', () => {
    it('Tests the analyticsData', () => {
        const wrapper = mount(<Provider store={store}><ShopByCategory cms={cms} api={api} onClick={analyticsData} /></Provider>);
        wrapper.instance().analyticsData = sinon.spy();
        const { analyticsData } = wrapper.instance();
        wrapper.find('.container').find('.row').at(1).find('div').at(2).simulate('click');
        expect(analyticsData.calledOnce).to.equal(true);
        expect(wrapper.find('.container').find('.px-quarter').first().find('img').length).to.equal(1);
    });
});

