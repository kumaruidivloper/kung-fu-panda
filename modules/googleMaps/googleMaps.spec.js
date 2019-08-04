import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import googleMapsJson from './googleMaps.component.json';
import GoogleMaps from './googleMaps.component';

const { cms } = googleMapsJson.context.data;
const props = {
  centerPoint: {
    lat: 10001,
    lang: 122001
  }
};

describe('<GoogleMaps />', () => {
  it('render component correctly', () => {
    const wrapper = shallow(<GoogleMaps cms={cms} {...props} />);
    expect(wrapper.find('div')).to.have.length(1);
  });
});
