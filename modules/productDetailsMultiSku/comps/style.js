import styled, { css } from 'react-emotion';
// import media from '../../../utils/media';

const Common = {
  marginTop1: css`
    margin-top: 1rem;
  `,
  boldFont: css`
    font-family: MalloryCond-Black, 'Mallory-Book', 'Helvetica Neue', sans-serif;
  `,
  alignCenter: css`
    text-align: center;
  `,
  subText: css`
    vertical-align: top;
    font-size: 1.125rem;
  `
};

export const swatch = {
  oos: css`
    &::after {
      content: '';
      position: absolute;
      right: 0px;
      width: 100%;
      height: 100%;
      top: 0px;
      background: rgba(230, 230, 230, 0.67);
    }
  `,
  row: css`
    display: flex;
    flex-direction: row;
  `,
  btn: css`
    padding: 0.5rem 1rem;
    box-shadow: 1px 0 0 0 #ccc, 0 1px 0 0 #ccc, 1px 1px 0 0 #ccc, 1px 0 0 0 #ccc inset, 0 1px 0 0 #ccc inset;
    cursor: pointer;
    transition: border-color 0.2s ease;
    height: 3.75rem;
    text-align: center;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    background: none;
    border: none;

    img {
      max-height: 2.3rem !important;
    }

    :hover {
      border: 1px solid #9b9b9b;
      outline: none;
    }

    :focus {
      box-shadow: 1px dotted #ccc;
    }

    &.selected {
      border: 3px solid #0055a6 !important;
      outline: none;
      box-shadow: none;
    }
  `
};

export const product = {
  atcBtn: css`
    position: relative;
    border-radius: 2.1875rem;
    font-family: 'Mallory-Bold';
    font-weight: bold;
    text-transform: uppercase;
    outline: none;
    cursor: pointer;
    min-width: 180px;
    font-size: 1rem;
    -webkit-letter-spacing: 0.5px;
    -moz-letter-spacing: 0.5px;
    -ms-letter-spacing: 0.5px;
    letter-spacing: 0.5px;
    line-height: 1.375rem;
    min-height: 4.375rem;
    padding: 1rem 2rem;
    border: none;
    color: #fff;
    width: 100%;
    min-height: 3.5rem;
    background-color: #0055a6;
    &.disabled {
      background-color: #b2cce4 !important;
      opacity: 0.5;
    }
  `,
  button: css`
    width: 100%;
    min-height: 3.5rem;
  `,
  showDesktop: css`
    @media (max-width: 900px) {
      display: none;
    }
  `,
  showMobile: css`
    display: none;
    @media (max-width: 900px) {
      display: block;
    }
  `,
  inVisible: css`
    visibility: hidden;
  `,
  detailsSpecs: css`
    margin: 2rem 1rem;
    border-bottom: 3px solid #0556a4;
    border-radius: 1.5px;
    font-family: 'Mallory-Book', 'Helvetica Neue', sans-serif;
    font-size: 1rem;
    line-height: 1.25;
    color: #333333;
  `,
  featureType: css`
    font-family: Mallory-Book;
    font-size: 0.9rem;
    font-weight: bold;
    color: #333333;
  `,
  headline: css`
    h3 {
      font-family: 'Mallory-Condensed-Black', 'Mallory Condensed Black';

      font-size: 2.625rem;
      line-height: 2.625rem;
      color: #333333;
      width: 100%;
    }
    & .small {
      font-size: 1.25rem;
    }
  `,
  btn: css`
    width: 100%;
    text-transform: uppercase;
    color: rgb(255, 255, 255);
    background-color: rgb(0, 85, 153);
    border-radius: 30px;
    border-width: 3px;
    border-style: solid;
    border-color: rgb(0, 85, 153);
    padding: 1rem;
    cursor: pointer;
  `,
  productImage: css``,
  thumbnails: css`
    flex-direction: row;
    display: flex;
    margin-top: 1rem;
    align-items: flex-start;

    .product-thumbnail {
      height: 3rem;
      width: 3rem;
      overflow: hidden;
      background-color: #fff;
      padding: 1px;
      border: solid 1px #ccc;
      outline: none !important;
      cursor: pointer;
      &.selected {
        border: solid 3px #0055a6;
      }
    }
    .product-thumb-img {
      max-height: 2.3rem !important;
    }

    @media (max-width: 900px) {
      display: none;
    }
  `,
  attrName: css`
    font-family: 'Mallory-bold';
    font-weight: normal;
    font-size: 0.9rem;
  `,
  attrValue: css`
    font-family: 'Mallory-Book', 'Helvetica Neue', sans-serif;
    font-weight: normal;
    font-size: 0.9rem;
  `,
  summaryImg: css`
    overflow: hidden;
    img {
      width: 80%;
      max-height: 72px;
    }
  `,
  editButton: css`
    border: none;
    background-color: #ffffff;
    font-size: 14px;
    cursor: pointer;
    &:hover {
      text-decoration: underline;
    }
  `,
  editIcon: css`
    display: inline-block;
    width: 16px;
    height: 16px;
    color: #0055a6;
  `,
  edit: css`
    flex-grow: 1;
    text-align: right;
  `,
  flex: css`
    display: flex;
  `,
  accordionText: css`
    color: #4c4c4c;
    cursor: pointer;
  `,
  customStyles: {
    type_default: css``,
    type_bundle: css`
      @media (max-width: 900px) {
        display: none;
      }
    `,
    type_kit: css`
      display: none;
      @media (max-width: 900px) {
        display: block;
      }
      order: 5;
    `
  }
};

export const prodAttr = {
  sizeChart: css`
    a {
      color: #333;
    }
    i {
      color: #0055a6 !important;
      font-size: 1rem;
      vertical-align: text-top;
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

    @media (max-width: 768px) {
      width: 100%;
    }
  `,

  ButtonsLeft: styled('span')`
    position: relative;
    display: inline-block;
    width: 25%;
    height: 58px;
    border-radius: 4px 0 0 4px;
    background-color: #f6f6f6;
    text-align: center;
    float: left;
    line-height: 60px;
    border-right: 1px solid #cccccc;
    @media (min-width: 768px) and (max-width: 992px) {
      width: 33%;
    }

    &:hover,
    &:focus {
      cursor: pointer;
    }
  `,
  ButtonsRight: styled('span')`
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 25%;
    height: 58px;
    overflow: hidden;
    border-radius: 0 4px 4px 0;
    background-color: #f6f6f6;
    text-align: center;
    float: left;
    line-height: 60px;
    border-left: 1px solid #cccccc;

    @media (min-width: 768px) and (max-width: 992px) {
      width: 33%;
    }

    &:hover,
    &:focus {
      cursor: pointer;
    }
  `,
  Heading: styled('h3')`
    font-family: Mallory-Bold;
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
    font-family: 'Mallory-Book', 'Helvetica Neue', sans-serif;
    font-size: 16px;
    font-weight: normal;
    font-style: normal;
    font-stretch: normal;
    line-height: 1.25;
    letter-spacing: 0.5px;
    text-align: center;
    color: #333333;
    float: left;
    line-heiht: 60px;
    height: 60px;

    @media (min-width: 768px) and (max-width: 992px) {
      width: 33%;
    }
  `,
  NumberContainer: styled('div')`
    height: 60px;
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
  `
};

export const atc = {
  Alert: styled('section')`
    width: 85.574%;
    margin: 3rem auto 2rem;
    font-family: 'Mallory-Book', 'Helvetica Neue', sans-serif;
    font-size: 16px;
    color: #d0021b;
    border: solid 1px #e30300;
    position: relative;
    padding: 0.75rem 1.25rem;
    border-radius: 0.25rem;
    text-align: center;
  `,
  NoError: css`
    margin-top: 3rem;
  `,
  hr: css`
    width: 100%;
    height: 0.0625rem;
    background-color: #d8d8d8;
  `,
  backdrop: css`
    width: 100%;
    max-height: 100%;
    overflow: auto;
    position: fixed;
    top: 0;
    left: 0;
    background-color: rgba(0, 0, 0, 0.4);
    min-height: 100vh;
    z-index: 99;

    @media screen and (max-width: 767px) {
      top: 0;
      z-index: 99;
    }
  `,
  container: css`
    box-sizing: border-box;
    position: absolute;
    left: 15%;
    width: 68.9%;
    color: #333;
    overflow: hidden;
    background-color: #fff;
    padding-bottom: 1rem;
    @media screen and (max-width: 767px) {
      top: 0;
      left: 0;
      right: 0;
      width: 100% !important;
      max-width: 100% important;
      margin: 0;
      min-height: 100vh;
      height: 100vh;
      overflow-y: scroll;
      scroll-behavior: smooth;
      -webkit-overflow-scrolling: touch;
    }

    @media (max-width: 900px) {
      .container {
        max-width: 100% !important;
      }
    }
  `,
  CloseModal: styled('button')`
    background-color: #ffffff;
    margin: 0.2rem 0.5rem 0 0;
    border: none;
    float: right;
    font-size: 1.8rem;
    cursor: pointer;
    @media (max-width: 767px) {
      font-size: 1.5rem;
    }
  `,
  setSvg: css`
    margin: 19% 0 0 calc(50% - 57px);

    @media screen and (max-width: 767px) {
      width: 21.33%;
      margin: 34% 0 0 calc(50% - 40px);
    }
  `,
  set: css`
    margin-top: 4.3%;
    height: 15%;
    font-size: 3.5rem;
    font-family: 'MalloryCond-Black';
    font-weight: 900;
    font-stretch: condensed;
    line-height: 1;
    letter-spacing: 1.3px;
    text-align: center;
    color: #333333;

    @media screen and (max-width: 767px) {
      margin-top: 0%;
      font-size: 2rem;
      line-height: 1.75;
      letter-spacing: 0.5px;
    }
  `,
  promise: css`
    height: 8.5%;
    margin: 2% 0 25%;
    text-align: center;
    font-family: 'Mallory-Book', 'Helvetica Neue', sans-serif;
    font-size: 1em;
    font-weight: normal;
    font-style: normal;
    font-stretch: normal;
    line-height: 1.25;
    letter-spacing: 0.8px;
    color: #555555;

    @media screen and (max-width: 767px) {
      margin-top: 0%;
      font-size: 0.875rem;
      line-height: 1.43;
      letter-spacing: 0.7px;
      color: #333333;
    }
  `
};

export const C = {
  width25: css`
    width: 25%;
    @media (max-width: 900px) {
      width: 100%;
      margin-top: 1rem;
    }
  `,
  displayControl: css`
    @media (max-width: 767px) {
      display: block;
    }
  `,
  Headline: css`
    text-align: center;
    text-transform: uppercase;
    @media (max-width: 767px) {
      font-size: 2rem;
    }
  `,
  ImgResponsive: css`
    @media (max-width: 767px) {
      padding-top: 2rem;
    }
  `,
  Img: styled('img')`
    max-width: 100%;
    height: auto;
  `,
  NoError: css`
    margin-top: 3rem;
    @media (max-width: 767px) {
      margin-top: 2rem;
    }
  `,
  Div: styled('div')`
    font-size: 0.875rem;
    strong {
      text-transform: capitalize;
    }
  `,
  Price: styled('div')`
    font-size: 2.5rem;
    line-height: 0.67;
    letter-spacing: 0.7px;
    color: #333333;
    font-family: 'Mallory-Condensed-Black', 'Mallory Condensed Black';
    &:before {
      content: '$';
      ${Common.subText};
    }
    small {
      ${Common.subText};
    }
  `,
  containerWidth: css`
    width: 85%;
  `,
  ruleWidth: css`
    width: 100%;
    color: #ccc;
  `,
  nameStyle: css`
    font-size: 1.5rem;
    @media (max-width: 767px) {
      font-size: 1.25rem;
    }
  `,
  overrideArrow: css`
    > a {
      font-size: 0.875rem;
      cursor: pointer;
      :hover {
        text-decoration: none;
      }
      .academyicon {
        color: #0055a6;
        font-size: 0.75rem;
        padding-right: 0.6rem;
      }
      ::after {
        content: '';
      }
    }
    @media (max-width: 900px) {
      margin: 0.4rem 0;
    }
  `,
  responsiveButtons: css`
    display: flex;
    margin-left: 0.75rem;
    margin-right: 0.75rem;

    button {
      width: auto;
      margin: 0 0.5rem 0 0.5rem;
      span {
        width: 9rem;
      }
    }

    @media (max-width: 900px) {
      flex-wrap: wrap;
      width: 100%;
      margin: 0 0;
      button {
        width: 95%;
        margin 0.5rem 0;
        &.cart-btn {
          order: 2;
        }
      }
    }
  `,
  Row: styled('div')`
    button {
      margin-right: 1rem;
    }
    ${Common.marginTop1};
    @media (max-width: 767px) {
      font-size: 1.2rem;
    }
  `
};

export const Price = styled('div')`
  font-size: 3rem;
  font-family: 'Mallory-Condensed-Black', 'Mallory Condensed Black';
  line-height: 0.67;
  margin-top: 2rem;
  letter-spacing: 0.6px;
  color: #333333;
  &:before {
    content: '$';
    ${Common.subText};
  }
  small {
    ${Common.subText};
  }
  @media (max-width: 767px) {
    height: 2.5rem;
  }
`;

export const header = {
  main: css`
    background-color: #eeeeee;
  `,
  h2: css`
    font-family: 'Mallory-light';
    font-weight: normal;
    font-size: 1.75rem;
    line-height: normal;
  `,
  img: css`
    max-width: 325px;
    max-height: 325px;
    width: 100%;
  `,
  promo: css`
    color: #ee0000;
    margin-top: 0.25rem;
  `,
  PlayButton: styled('div')`
    cursor: pointer;
    padding-top: 2rem;
    display: flex;
    align-items: center;

    :focus {
      outline: none;
    }

    span {
      padding-left: 0.5rem;
      font-size: 0.875rem;
    }
  `,
  PlayIcon: styled('div')`
    svg {
      width: 1.5rem;
      height: 1.5rem;
    }
  `,
  Ad: styled('div')`
    padding: 0.25rem 0.5rem;
    background-color: #0055a6;
    color: #fff;
    margin: 1rem 0 -1rem 0;
    display: inline-block;

    @media (max-width: 900px) {
      margin: -1rem 0 1rem 0;
    }
  `
};

export const mobileStyles = css`
  @media (max-width: 900px) {
    margin: 0 -4px;
    .c-0055a6 {
      color: #0055a6;
    }
    .row {
      margin: 0;
      & .col-xs-*,
      & .col-lg-*,
      & .col-md-* {
        padding: 0;
        margin: 0;
      }
    }
    .pdx-16 {
      padding: 0 1rem !important;
    }
    .pdy-31 {
      padding-top: 31px !important;
      padding-bottom: 31px !important;
    }
    .container {
      max-width: 100%;
      padding: 0;
    }
    .full-width {
      width: 100%;
      max-width: 100%;
      margin: 0;
      flex: 0 0 100%;
      padding: 0;
    }
    .breadCrumbComponent > div {
      margin-bottom: 1rem;
      padding: 0 1rem;
      a {
        font-size: 14px;
      }
    }
    .product-specifications {
      order: 1;
      & h2 {
        margin-top: 0 !important;
        font-size: 24px;
        line-height: 1.17;
        color: #333;
      }
      & div {
        margin-top: 1rem !important;
        font-size: 14px;
        line-height: 1.29;
        height: auto;
        &:nth-child(3) {
          display: none;
        }
      }
    }
    .video-link {
      order: 3;
      padding-top: 6px;
      display: flex;
      justify-content: center;
      & .play-button {
        padding: 0;
      }
    }
    .product-img-thumbnail {
      order: 2;
      text-align: center;
      margin-top: 1rem;
      & img {
        max-width: 326px;
        max-height: 326px;
      }
    }
    .product-container {
      margin: 0 !important;
      position: relative;
      box-shadow: 1px 0 0 0 #ccc, 0 1px 0 0 #ccc, 1px 1px 0 0 #ccc, 1px 0 0 0 #ccc inset, 0 1px 0 0 #ccc inset;
      h3 {
        margin: 30px 0;
        padding: 0 16px;
        font-size: 24px;
        text-transform: uppercase;
        font-family: 'Mallory-Condensed-Black';
        &.small {
          margin: 13px 0;
          font-size: 16px;
        }
      }
      & .add-to-cart-btn {
        & .m-no-offset {
          margin: 0 !important;
        }
      }
    }
    & .product-image {
      text-align: center;
      margin-bottom: 30px;
      & img {
        max-width: 150px;
        max-height: 150px;
      }
    }
    & .product-description {
      margin: 0;
    }
    & .quantity-lbl {
      margin: 0;
    }
    & .add-to-cart-btn-container {
      margin-top: 1rem;
    }
    & .product-summary-img {
      max-width: 78px;
      max-height: 78px;
      margin: 0;
      padding-left: 1rem;
      text-align: center;
    }
    & .product-summary-desc {
      width: calc(100% - 90px);
      position: static;
      & .product-edit-icon button {
        position: absolute;
        top: 29px;
        right: 13px;
      }
    }
    & .product-summary-swatches {
      display: flex;
      flex-wrap: wrap;
      margin: 28px 0;
    }
  }
`;

export const videoStyles = {
  backdrop: css`
    width: 100%;
    max-height: 100%;
    overflow: auto;
    position: fixed;
    top: 0;
    left: 0;
    background-color: rgba(0, 0, 0, 0.4);
    min-height: 100vh;
    z-index: 99;

    @media screen and (max-width: 767px) {
      top: 0;
      z-index: 99;
    }
  `,
  container: css`
    box-sizing: border-box;
    margin: 4rem auto;
    width: 780px;
    color: #333;
    overflow: hidden;
    background-color: #fff;

    #videoViewer {
      height: 270px;
    }

    @media (max-width: 900px) {
      width: 100%;
      height: 100vh;
      margin: 0 !important;

      .container {
        max-width: 100% !important;
      }
    }

    & .close-icon {
      text-align: right;
      width: auto;
      padding: 1rem;

      button {
        background-color: transparent;
        border: none;
      }
    }

    & .video-container {
      text-align: center;
    }
  `
};

export const bundle = {
  hidden: css`
    display: none;
  `,
  visible: css`
    display: block;
  `
};

export const adjustButton = css`
  padding-left: 0;
  padding-right: 0;
  width: 100%;
  min-height: 3.5rem;
`;

export const disabledStyle = css`
  background-color: #b2cce4 !important;
  opacity: 0.5;
`;

// ${media.lg`
// font-size: 14px;
// `};
