import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import globalErrorJson from './globalError.component.json';
import GlobalError from './globalError.component';

describe('<GlobalError />', () => {
  const { cms } = globalErrorJson.context.data;
  it('renders <GlobalError /> component', () => {
    const wrapper = shallow(<GlobalError cms={cms} />);
    expect(wrapper.find('div')).to.have.length(1);
    expect(wrapper.find('div h3')).to.have.length(1);
    expect(wrapper.find('div h3').text()).to.equal('Global Error works!');
  });
});
