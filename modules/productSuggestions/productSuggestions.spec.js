import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import productSuggestionsJson from './productSuggestions.component.json';
import ProductSuggestions from './productSuggestions.component';

describe('<ProductSuggestions />', () => {
  const { cms } = productSuggestionsJson.context.data;
  it('renders <ProductSuggestions /> component', () => {
    const wrapper = shallow(<ProductSuggestions cms={cms} />);
    expect(wrapper.find('div')).to.have.length(1);
    expect(wrapper.find('div h3')).to.have.length(1);
    expect(wrapper.find('div h3').text()).to.equal('Product Suggestions works!');
  });
});
