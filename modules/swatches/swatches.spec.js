import React from 'react';
import { expect } from 'chai';
import { mount, shallow } from 'enzyme';
import Swatches from './swatches.component';

const mockImageObj = {
  imageURL: '../../assets/images/demo/brands/adidas/category_adidas.png',
  thumbnail: '../../assets/images/demo/brands/adidas/category_adidas.png',
  sellable: true
};

const getSwatchImgList = size => {
  const swatchImgList = [];
  for (let i = 0; i < size; i += 1) {
    swatchImgList.push({ itemId: i, ...mockImageObj });
  }
  return swatchImgList;
};

const sizes = ['Small', 'Large', 'Medium'];

const getSwatchTextList = () => {
  const swatchImgList = [];
  for (let i = 0; i < sizes.length; i += 1) {
    swatchImgList.push({ itemId: i, text: sizes[i] });
  }
  return swatchImgList;
};

const swatchImgList = getSwatchImgList(7);
const defaultImgSwatch = swatchImgList[1];
const swatchProps = {
  swatchList: swatchImgList
};

describe('<Swatches />', () => {
  it('renders <Swatches /> component', () => {
    const wrapper = shallow(<Swatches cms={swatchProps} default={defaultImgSwatch} />);
    expect(wrapper).to.have.length(1);
  });

  it('Test for state set to default', () => {
    const wrapper = shallow(<Swatches cms={swatchProps} default={defaultImgSwatch} />);
    expect(wrapper.state('selectedItem')).to.equal(defaultImgSwatch);
  });

  it('Test for inline swatches and boxSize', () => {
    const wrapper = shallow(<Swatches cms={swatchProps} boxSize={100} inline default={defaultImgSwatch} />);
    expect(wrapper).to.have.length(1);
  });

  it('Test for text swatches', () => {
    const swatchTextList = getSwatchTextList();
    const swatchPropsText = {
      swatchList: swatchTextList
    };
    const wrapper = shallow(<Swatches cms={swatchPropsText} default={swatchTextList[1]} />);
    expect(wrapper).to.have.length(1);
  });

  it('Test for next props', () => {
    const wrapper = mount(<Swatches cms={swatchProps} default={defaultImgSwatch} />);
    expect(wrapper.state('selectedItem')).to.equal(defaultImgSwatch);

    wrapper.setProps({ default: swatchImgList[3] });
    expect(wrapper.state('selectedItem')).to.equal(swatchImgList[3]);
  });

  it('Test for click action', () => {
    const handleSwatchClick = value => {
      expect(value).to.equal(swatchImgList[6]);
    };
    const wrapper = shallow(<Swatches cms={swatchProps} handleSwatchClick={handleSwatchClick} default={defaultImgSwatch} />);
    wrapper
      .find('div')
      .last()
      .simulate('click');
    expect(wrapper.state('selectedItem').itemId).to.equal(6);

    wrapper
      .find('div')
      .last()
      .simulate('keyPress');
    expect(wrapper.state('selectedItem').itemId).to.equal(6);
  });
});
