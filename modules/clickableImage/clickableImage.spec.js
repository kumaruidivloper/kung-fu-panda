import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import Json from './clickableImage.component.json';
import ClickableImage from './clickableImage.component';

describe('ClickableImage', () => {
  const { cms } = Json.context.data;
  const props = { cms };
  let MountedClickableImage;
  const clickableImage = () => {
    if (!MountedClickableImage) {
      MountedClickableImage = shallow(<ClickableImage {...props} />);
    }
    return MountedClickableImage;
  };

  it('renders <ClickableImage /> component', () => {
    expect(clickableImage().find('div')).to.have.length(3);
    expect(clickableImage().find('div div h3')).to.have.length(1);
  });
});
