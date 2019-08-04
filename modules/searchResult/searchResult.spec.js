import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import searchResultJson from './searchResult.component.json';
import SearchResult from './searchResult.component';

describe('<SearchResult />', () => {
  const { cms } = searchResultJson.context.data;
  it('renders <SearchResult /> component', () => {
    const wrapper = shallow(<SearchResult cms={cms} />);
    expect(wrapper.find('div')).to.have.length(1);
    expect(wrapper.find('div h3')).to.have.length(1);
    expect(wrapper.find('div h3').text()).to.equal('Search Result works!');
  });
});
