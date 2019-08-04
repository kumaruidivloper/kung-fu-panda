import React from 'react';
import { expect } from 'chai';
import { mount, shallow } from 'enzyme';
import ProductMixedMediaSlider from './productMixedMediaSlider';
import Swatches from '../../../swatches/swatches.component';

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

const swatchList = getSwatchList(10);

const swatchProps = {
  swatchList
};

describe('<ProductMixedMediaSlider />', () => {
  it('renders <ProductMixedMediaSlider /> component', () => {
    const wrapper = shallow(<ProductMixedMediaSlider swatchProps={swatchProps} swatchImgList={swatchList} name="Mixed Media Slider Testing" />).dive();
    expect(wrapper).to.have.length(1);
  });

  it('Mixed Media to test click handlers', () => {
    const sliderPosition = selected => {
      if (selected) {
        expect(selected).to.equal(swatchList[1]);
      }
    };
    const wrapper = shallow(<ProductMixedMediaSlider
      sliderPosition={sliderPosition}
      swatchProps={swatchProps}
      swatchImgList={swatchList}
      images={swatchList}
      name="Mixed Media Slider Testing"
    />).dive();
    wrapper
      .find(Swatches)
      .first()
      .props()
      .handleSwatchClick(swatchList[1]);

    wrapper
      .find('div')
      .find('.icon-chevron-up')
      .simulate('click', { target: { classList: ['', 'icon-chevron-up'] } });

    wrapper
      .find('div')
      .find('.icon-chevron-down')
      .simulate('click', { target: { classList: ['', 'icon-chevron-down'] } });

    wrapper
      .find('div')
      .find('.icon-chevron-down')
      .simulate('click', { target: { classList: ['', 'icon-chevron-down'] } });
    // wrapper.find(Swatches)[0].simulate('click');
  });

  it('test next props', () => {
    const wrapper = mount(<ProductMixedMediaSlider absPosition={3} swatchProps={swatchProps} swatchImgList={swatchList} name="Mixed Media Slider Testing" />);
    expect(wrapper).to.have.length(1);

    wrapper.setProps({ absPosition: 0 });
    wrapper.setProps({ absPosition: 2 });
  });
});
