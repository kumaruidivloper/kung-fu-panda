import styled, { css } from 'react-emotion';
const ImageSliderContainer = styled.div(css`
  display: flex;
  flex-flow: column;
  width: 120px;
  height: 301px !important;
  overflow: hidden;
  position: relative;
`);

const BtnScrollUp = css`
  top: 0;
`;

const SwatchesHolder = styled.div(css`
  padding-top: 30px;
  padding-bottom: 30px;
  position: relative;
`);

const BtnScrollDown = css`
  bottom: 0;
`;

const ImageContainer = styled.div(css`
  transform-origin: 50% 0;
  transform: translateY(0px);
  transition: all 0.75s cubic-bezier(0.01, 0.4, 0.55, 1.06) 0s;
  text-align: center;

  > img {
    min-width: 100%;
    background-color: #ccc;
    background-attachment: fixed;
    background-position: center;
    background-repeat: no-repeat;
    border-top: 1px solid #fff;
    border-bottom: 1px solid #fff;
  }
`);

const ImageElement = styled('button')`
  border: none;
  background-color: #fff;
`;

const SliderWrapper = styled.div(css`
  width: 15%;
`);

const BtnScroll = css`
  position: absolute;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s ease-in 0s;
  padding-left: 15px;
`;

export { ImageContainer, ImageSliderContainer, SwatchesHolder, BtnScrollDown, BtnScrollUp, ImageElement, SliderWrapper, BtnScroll };
