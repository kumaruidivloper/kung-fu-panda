import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import ClickableImagesItem from './clickableImageItem';

describe('ClickableImagesItem', () => {
  let props;
  let MountedClickableImagesItem;
  const clickableImageItem = () => {
    if (!MountedClickableImagesItem) {
      MountedClickableImagesItem = mount(<ClickableImagesItem {...props} />);
    }
    return MountedClickableImagesItem;
  };

  beforeEach(() => {
    props = {
      imageSize: 120,
      desktopImage: undefined,
      ctaLink: undefined,
      ctaCopy: undefined,
      mobileBackgroundColor: undefined,
      imageAltText: undefined
    };
    MountedClickableImagesItem = undefined;
  });

  it('renders <ClickableImagesItem /> component', () => {
    expect(clickableImageItem().find('div')).to.have.length(2);
    expect(clickableImageItem().find('div img')).to.have.length(1);
  });
});
