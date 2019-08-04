import React from 'react';
import { expect } from 'chai';
import { mount, shallow } from 'enzyme';
import configureStore from 'redux-mock-store';
import ProductMixedMedia from './productMixedMedia.component';
import { PlayButton, ImageContainerDiv, BackIcon } from './style';
import Swatches from '../swatches/swatches.component';
import { CloseIcon } from './components/videoOverlayViewer/styles';

const initialState = {
  gtmDataLayer: []
};
const mockStore = configureStore();
let store;

const mockImageObj = {
  imageURL: '../../assets/images/demo/brands/adidas/category_adidas.png',
  sellable: true
};

const getSwatchList = size => {
  const swatchImgList = [];
  for (let i = 0; i < size; i += 1) {
    swatchImgList.push({ itemId: i, ...mockImageObj });
  }
  return swatchImgList;
};

const swatchList = getSwatchList(4);

const swatchImgListSlider = getSwatchList(8);

describe('<ProductMixedMedia />', () => {
  beforeEach(() => {
    store = mockStore(initialState);
  });
  it('renders <ProductMixedMedia /> component', () => {
    const wrapper = shallow(<ProductMixedMedia store={store} swatchImgList={swatchList} name="Mixed Media Testing" />).dive();
    expect(wrapper).to.have.length(1);
  });

  it('Mixed Media with Video Assets', () => {
    const wrapper = mount(<ProductMixedMedia store={store} swatchImgList={swatchList} videoAssetName="Mixed Media Video Asset Name Testing" />);
    wrapper.find(PlayButton).simulate('click');
    expect(wrapper.find(PlayButton)).to.have.length(1);
    wrapper.find(CloseIcon).simulate('click');
  });

  it('Mixed Media more than 6 images to turn slider', () => {
    const wrapper = mount(<ProductMixedMedia store={store} swatchImgList={swatchImgListSlider} name="Slider Testing" />);
    wrapper.setProps({ swatchImgList: swatchList });
    expect(wrapper).to.have.length(1);
  });

  it('Mixed Media to test click handlers', () => {
    const wrapper = shallow(<ProductMixedMedia store={store} swatchImgList={swatchImgListSlider} name="Click Testing" />).dive();
    wrapper
      .find(Swatches)
      .first()
      .props()
      .handleSwatchClick(swatchList[1]);
    // wrapper.find(Swatches)[0].simulate('click');
    expect(wrapper.state('selectedItem')).to.equal(swatchList[1]);

    wrapper.find(ImageContainerDiv).simulate('click');
    expect(wrapper.state('isClicked')).to.equal(true);

    wrapper.find(BackIcon).simulate('click');
    expect(wrapper.state('isClicked')).to.equal(false);
  });

  it('Mixed Media null render and re-render', () => {
    const wrapper = mount(<ProductMixedMedia store={store} name="Null render Testing" />);

    // set again props to render again
    wrapper.setProps({ swatchImgList: swatchList });
    expect(wrapper).to.have.length(1);
  });
});
