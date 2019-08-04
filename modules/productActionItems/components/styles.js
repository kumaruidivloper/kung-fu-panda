import styled, { css } from 'react-emotion';
import media, { sizesMax, sizes } from '../../../utils/media';
export { addToCartHolder } from '../styles';

export const AdjustWidth = css`
  padding-left: 0;
  padding-right: 0;
  min-width: auto;
  font-size: 14px;

  @media screen and (min-width: ${sizes.md}px) and (max-width: ${sizes.lg}px) {
    font-size: 12px;
  }
`;

const focusedZindex = css`
  position: relative;
  &:focus {
    z-index: 2;
  }
`;

export const StyledModal = css`
  box-sizing: border-box;
  position: absolute;
  top: 10%;
  left: 23%;
  right: 23%;
  width: 54%;
  color: #000000;
  background-color: #fff;
  @media screen and (max-width: ${sizesMax.smMax}px) {
    width: 100%;
    top: 0%;
    left: 0%;
    right: 0%;
    bottom: 0;
  }
`;

const headerStyle = props => css`
  justify-content: ${props.alignment};
`;

export const StyledHeader = styled('h4')`
  text-transform: uppercase;
  display: flex;
  ${media.sm`
    font-size: 2rem;
  `} ${headerStyle};
`;

export const Overlay = {
  backdrop: css`
    width: 100%;
    max-height: 100%;
    position: fixed;
    top: 0;
    left: 0;
    overflow-y: scroll !important;
    background-color: rgba(0, 0, 0, 0.4);
    z-index: 99;
    min-height: 100vh;

    @media screen and (max-width: ${sizesMax.smMax}px) {
      top: 0;
      z-index: 99;
      background-color: #fff;
    }
  `,
  container: css`
    box-sizing: border-box;
    position: absolute;
    left: 15%;
    width: 68.9%;
    color: #000000;
    overflow: none;
    background-color: #fff;
    padding-bottom: 1rem;
    @media only screen and (min-width: ${sizes.md}px) and (max-width: ${sizes.lg}px) {
      left: 50%;
      transform: translateX(-50%);
      width: 75%;
    }
    @media screen and (max-width: ${sizesMax.smMax}px) {
      width: 100% !important;
      max-width: 100% !important;
      top: 0;
      left: 0;
      right: 0;
      margin: 0;
      min-height: 100vh;
      height: 100vh;
      overflow-y: scroll;
      scroll-behaivor: smooth;
      -webkit-overflow-scrolling: touch;
    }
  `,
  CloseModal: styled.button`
    background-color: #ffffff;
    margin: 0.2rem 0.5rem 0 0;
    border: none;
    float: right;
    font-size: 1.8rem;
    cursor: pointer;
    @media (max-width: ${sizesMax.smMax}px) {
      font-size: 1.5rem;
    }
  `
};

const Common = {
  marginTop1: css`
    margin-top: 0.5rem;
  `,
  boldFont: css`
    font-family: MalloryCond-Black;
  `,
  alignCenter: css`
    text-align: center;
  `,
  subText: css`
    vertical-align: top;
    font-size: 1.2rem;
  `
};

export const C = {
  Alert: styled.section`
    width: 100%;
    font-family: 'Mallory-Book', 'Helvetica Neue', sans-serif;
    font-size: 14px;
    color: #d0021b;
    background: rgba(224, 0, 0, 0.03);
    border: solid 1px #e30300;
    position: relative;
    padding: 0.75rem 1.25rem;
    border-radius: 0.25rem;
    ${Common.alignCenter};
  `,
  displayControl: css`
    @media (max-width: ${sizesMax.smMax}px) {
      display: block;
    }
  `,
  Headline: css`
    text-align: left;
    margin-bottom: 1.5rem;
    text-transform: uppercase;
    @media (max-width: ${sizesMax.smMax}px) {
      text-align: center;
      margin-bottom: 0.5rem;
    }
  `,
  ImgResponsive: css`
    text-align: center;
    margin-top: 1rem;
    @media (max-width: ${sizesMax.smMax}px) {
      ${Common.alignCenter};
    }
  `,
  Img: styled.img`
    @media (max-width: ${sizesMax.smMax}px) {
      margin-bottom: 0.875rem;
    }
  `,
  NoError: css`
    margin-top: 1rem;
  `,
  FontSize: css`
    margin-bottom: 1rem;
    @media (max-width: ${sizesMax.smMax}px) {
      text-align: center;
      margin-bottom: 1rem;
    }
  `,
  Ul: styled.ul`
    padding-left: 0px;
    list-style-type: none;
    @media (max-width: ${sizesMax.smMax}px) {
      width: 100%;
      text-align: center;
      line-height: 1.5rem;
      margin-bottom: 0 !important;
    }
  `,
  Li: styled.li`
    display: inline-block;
    margin-right: 1rem;
    text-transform: capitalize;
    @media (max-width: ${sizesMax.smMax}px) {
      display: block;
    }
  `,
  Price: styled.div`
    font-family: Mallory-Condensed-Black;
    font-size: 2.25rem;
    line-height: 0.67;
    letter-spacing: 0.6px;
    color: #333333;
    margin-bottom: 1rem;
    &:before {
      content: '$';
      ${Common.subText};
    }
    small {
      ${Common.subText};
    }
    @media (max-width: ${sizesMax.smMax}px) {
      margin-bottom: 1rem;
    }
  `,
  responsiveButtons: css`
    margin-bottom: 0.5rem;
    > button {
      min-height: auto;
      font-size: 0.875rem;
    }
    > a {
      min-width: 180px;
    }
    @media (max-width: 905px) {
      > button {
        // font-size: 0.75rem;
      }
    }
    @media (max-width: ${sizesMax.smMax}px) {
      a,
      button {
        width: 85%;
        margin: 1rem auto;
      }
    }
  `,
  viewCartStyle: css`
    @media (min-width: ${sizes.md}px) {
      min-width: 100px !important;
      font-size: 12px;
    }
    @media (min-width: ${sizes.lg}px) {
      font-size: 14px;
      min-width: 180px !important;
    }
  `,
  checkoutStyle: css`
    @media (min-width: ${sizes.md}px) {
      min-width: 100px !important;
      font-size: 12px;
    }
    @media (min-width: ${sizes.lg}px) {
      font-size: 14px;
      min-width: 180px !important;
    }
  `,
  Row: styled.div`
    margin-bottom: 1.5rem;
    @media (max-width: ${sizesMax.smMax}px) {
      ${Common.alignCenter};
      font-size: 1.2rem;
      margin-right: 0;
      margin-bottom: 0;
    }
    > a::after {
      color: 0055a6;
    }
  `,
  PriceStyle: styled.div`
    font-size: 2.25rem;
    font-weight: 900;
    font-style: normal;
    font-stretch: condensed;
    line-height: 0.93;
    letter-spacing: 0.7px;
  `,
  linkSpan: styled.span`
    cursor: pointer;
    color: #0055a6;
    text-decoration: underline;
  `,
  linkRow: styled.div`
    @media (max-width: ${sizesMax.smMax}px) {
      margin-bottom: 1.5rem;
      margin-right: 0;
    }
    > a::after {
      color: #0055a6;
    }
  `,
  AnchorColor: css`
    cursor: pointer;
  `,
  ContinueShoppingIconStyle: css`
    color: #0055a6;
    margin-left: 4px;
    font-size: 0.7rem;
  `,
  ContinueShopping: styled.button`
    background: none;
    border: none;
    outline: none;
  `,
  spanAsLink: css`
    color: #333333;
    :hover {
      color: #0055a6;
      text-decoration: underline;
    }
  `
};

export const Quantity = {
  Boundary: styled('div')`
    height: 3.75em;
    border-radius: 4px;
    border: solid 1px #cccccc;
    padding: 0;
    margin: 0;
    box-sizing: border-box;
    &:hover,
    &:focus {
      cursor: pointer;
    }

    @media (max-width: ${sizes.md}px) {
      width: 100%;
    }
  `,

  ButtonsLeft: styled('button')`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 25%;
    height: 58px;
    background-color: #f6f6f6;
    overflow: hidden;
    text-align: center;
    float: left;
    line-height: 3.75rem;
    border-radius: 4px 0 0 4px;
    border: hidden;
    border-right: 1px solid #cccccc;
    @media (min-width: ${sizes.md}px) and (max-width: ${sizes.lg}px) {
      width: 33%;
    }
    &:hover,
    &:focus {
      cursor: pointer;
    }

    ${focusedZindex};
  `,
  ButtonsRight: styled('button')`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 25%;
    height: 58px;
    background-color: #f6f6f6;
    overflow: hidden;
    text-align: center;
    float: right;
    line-height: 3.75rem;
    border-radius: 0 4px 4px 0;
    border: hidden;
    border-left: 1px solid #cccccc;
    @media (min-width: ${sizes.md}px) and (max-width: ${sizes.lg}px) {
      width: 33%;
    }
    &:hover,
    &:focus {
      cursor: pointer;
    }

    ${focusedZindex};
  `,
  Heading: styled('h3')`
    font-weight: bold;
    font-size: 14px;
    color: #333333;
    line-height: 1.43;
    letter-spacing: 0.4px;
  `,
  Number: styled('span')`
    display: inline-block;
    font-size: 1.1rem;
    width: 50%;
    height: 14px;
    font-size: 16px;
    font-weight: normal;
    font-style: normal;
    font-stretch: normal;
    line-height: 1.25;
    letter-spacing: 0.5px;
    text-align: center;
    color: #333333;
    float: left;
    line-heiht: 3.75rem;
    height: 3.75rem;

    @media (min-width: ${sizes.md}px) and (max-width: ${sizes.lg}px) {
      width: 33%;
    }
  `,
  NumberContainer: styled('div')`
    height: 3.75rem;
  `,
  NumberInput: styled('input')`
    display: inline-block;
    width: 100%;
    border: 0;
    height: 3.625rem;
    text-align: center;

    &:hover,
    &:focus {
      cursor: pointer;
    }
    &::-webkit-inner-spin-button {
      -webkit-appearance: none;
      -moz-appearance: none;
      appearance: none;
      margin: 0;
    }

    ${focusedZindex};
  `
};

export const spinnerOverride = css`
  margin: 0 auto;
  height: 2rem;
`;
