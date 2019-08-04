import styled, { css } from 'react-emotion';
import media, { sizes } from '../../utils/media';

export const msg = css`
  font-weight: bold;
  text-transform: uppercase;
`;
export const IconStyle = available => {
  let basicStyle = `
    font-size: 1.5rem;
  `;

  if (available) {
    basicStyle = ` ${basicStyle}
    color: #00bb11;`;
  } else {
    basicStyle = ` ${basicStyle}
    color: #ee0000;`;
  }

  return css`
    ${basicStyle};
  `;
};

export const bgTransparent = css`
  background: transparent !important;
`;
export const tooltipStyle = css`
  margin: 0;
  padding: 0;
  background: transparent;
  color: #333;
  border: none;
`;
export const link = css`
  color: #0055a6;
  cursor: pointer;
  margin-top: 0.1rem;
  outline: none;
  border: none;
  background: none;
  padding: 0;
  text-align: left;

  :hover {
    text-decoration: underline;
  }
`;
export const BaitStyle = css`
  color: #0055a6;
`;
export const showLink = css`
  color: #0055a6;
  display: inline-block;
  text-align: center;
  cursor: pointer;

  :hover {
    outline: none;
  }
`;
export const font = css`
  line-height: 1.43;
`;

export const fade = css`
  position: relative;
  height: 5.8em;
  overflow: hidden;
  text-align: justify;

  &:after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 5.8em;
    background: linear-gradient(to bottom, rgba(255, 255, 255, 0), rgba(255, 255, 255, 1));
  }
`;

export const setSvg = css`
  margin: 0 auto;
  padding-top: 7rem;
  padding-bottom: 2rem;
  svg {
    margin: 0 auto;
    width: 80px;
    height: auto;
    @media screen and (min-width: 768px) {
      width: 120px;
    }
  }

  @media screen and (min-width: 768px) {
    padding-top: 4rem;
  }
`;

export const OverLay = css`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.4);
  width: 100%;
  height: 100%;
  overflow: scroll;
  -webkit-overflow-scrolling: touch;
`;

export const modal = css`
  box-sizing: border-box;
  width: 38%;
  height: auto;
  background-color: #fff;
  margin: 10% auto;
  vertical-align: middle;

  @media screen and (max-width: 767px) {
    position: absolute;
    margin: 0;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    width: 100%;
    height: 100%;
  }
`;

export const set = css`
  margin-top: 1rem;
  text-align: center;

  @media screen and (max-width: 767px) {
    font-size: 2rem;
    line-height: 1.75;
    letter-spacing: 0.5px;
  }
`;

export const promise = css`
  margin: 1rem 0 25%;
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
`;

export const backInStock = css`
  text-align: center;
  text-transform: uppercase;

  @media screen and (min-width: 768px) and (max-width: 1024px) {
    font-size: 2rem;
    line-height: 1;
    letter-spacing: 0.5px;
  }
  @media screen and (max-width: 767px) {
    font-size: 2rem;
    line-height: 1;
    letter-spacing: 0.5px;
  }
`;

export const emailText = css`
  height: auto;
  font-size: 1rem;
  font-weight: normal;
  font-stretch: normal;
  line-height: 1.25;
  letter-spacing: 0.8px;
  text-align: center;
  color: #333333;
  @media screen and (min-width: 768px) and (max-width: 1024px) {
    font-size: 0.825rem;
    line-height: 1.43;
    letter-spacing: 0.7px;
  }
  @media screen and (max-width: 767px) {
    font-size: 0.875rem;
    font-weight: normal;
    font-stretch: normal;
    line-height: 1.43;
    letter-spacing: 0;
    text-align: center;
    display: block;
  }
`;
export const signUpForm = css`
  padding: 1.5% 2.5%;
  @media screen and (min-width: 768px) and (max-width: 1024px) {
    font-size: 0.825rem;
  }
  @media screen and (max-width: 767px) {
    margin-top: 5.4%;
    padding: 0;
  }
`;
export const Input = styled('input')`
  width: 100%;
  height: 40px;
  border-radius: 4px;
  border: solid 1px rgba(0, 0, 0, 0.2);
  margin-top: 8px;
`;
export const Label = styled('label')`
  width: 100%;
  font-size: 0.875em;
  font-weight: 500;
  font-stretch: normal;
  line-height: 1.29;
  letter-spacing: normal;
  text-align: left;
  color: #585858;
`;
export const placeholder = css`
  font-size: 0.875em;
  line-height: 1.29;
  text-align: left;
  padding: 10px 16px;
  color: rgba(0, 0, 0, 0.6);
`;

export const invalid = css`
  border: solid 1px #ee0000;
`;
export const errMsg = css`
  display: none;
`;

export const errorMsgDisp = css`
  font-size: 0.75rem;
  font-weight: normal;
  font-stretch: normal;
  line-height: 1.08;
  letter-spacing: normal;
  text-align: left;
  color: #ee0000;
  display: inline;
`;

export const submit = css`
  width: 100%;
  height: 100%;
  min-height: 3.75rem !important;
  margin-top: 8.5%;
  font-size: 1.125em;
  font-weight: bold;
  font-stretch: normal;
  line-height: normal;
  letter-spacing: 1px;
  text-align: center;
  color: #ffffff;

  :focus {
    outline: none;
  }

  @media screen and (max-width: 767px) {
    margin: 11% 0 18.5%;
    font-size: 0.875em;
    font-weight: bold;
    font-stretch: normal;
    line-height: normal;
    letter-spacing: 1px;
    text-align: center;
    color: #ffffff;
  }
`;

export const OtherAmount = {
  Input: styled('input')`
    padding-left: 4%;
    height: 40px;
    border-radius: 4px;
    border: 1px solid #ccc;
    @media screen and (max-width: 767px) {
      padding-left: 6%;
    }
  `,
  Heading: styled('h3')`
    font-family: Mallory-Bold;
    font-weight: bold;
    font-size: 14px;
    color: #333333;
    line-height: 1.43;
    letter-spacing: 0.4px;
  `
};

export const swatchLabel = css`
  padding-bottom: 0.5rem;
  padding-right: 1rem;
`;

export const addToCartHolder = css({
  button: {
    width: '100%',
    fontFamily: 'Mallory-bold',
    minHeight: '3.75rem!important'
  }
});

export const order2 = css`
  @media screen and (max-width: 768px) {
    order: 2;
  }
`;

export const Divider = styled('div')`
  height: 1px;
  min-height: 1px;
  max-height: 1px;
  background-color: #ccc;
`;

export const otherAmount = css`
  > span {
    position: absolute;
    margin-left: 2%;
    margin-top: 8px;
    z-index: 1;
  }
`;

export const warningText = css`
  color: #f00;
`;

export const CloseButton = styled('button')`
  text-align: right;
  margin: 1rem 0 0 0;
  height: 1.375rem;
  width: 100%;
  padding: 0;
  border: 0;
  border-color: transparent;
  background-color: white;
  color: #585858;
  line-height: 0;
  cursor: pointer;
`;

export const CloseIcon = styled('span')`
  font-size: 1.33rem;
`;

const linkLikeButtonCommon = css`
  position: relative;
  border-radius: 2.1875rem;
  font-family: 'Mallory-Bold';
  font-weight: bold;
  text-transform: uppercase;
  outline: none;
  cursor: pointer;
  &:disabled {
    opacity: 0.5;
  }
`;

const linkLikeButtonSizes = css`
  min-width: 180px;
  font-size: 1rem;
  letter-spacing: 0.5px;
  line-height: 1.375rem;
  min-height: 4.375;
  padding: 1rem 2rem;
`;

export const linkLikeButton = css`
  ${linkLikeButtonCommon};
  ${linkLikeButtonSizes};
`;

export const InvMsg = {
  boldText: css`
    font-weight: bold;
    margin-top: 4px;
  `,
  flex: css`
    display: flex;
  `,
  icons: css`
    display: block;
    height: 24px;
    width: 26px;
    margin-top: 5px;
  `,
  IconSuccess: css`
    display: inline-block;
    width: 28px;
    height: 28px;
    text-align: center;
    color: #fff;
    background: #00bb11;
    border-radius: 100%;
    font-size: 12px;
    line-height: 30px;
    vertical-align: middle;
  `,
  IconFail: css`
    display: inline-block;
    width: 28px;
    height: 28px;
    text-align: center;
    color: #fff;
    background: #d60000;
    border-radius: 100%;
    font-size: 12px;
    line-height: 30px;
    vertical-align: middle;
  `,
  StoreIcon: css`
    //background:url('../../assets/images/store.svg');
    background: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCI+CiAgICA8ZGVmcz4KICAgICAgICA8cGF0aCBpZD0iYSIgZD0iTTIwLjgxMiAxOC40OTRoLTEuNjl2LTcuODIzYzAtLjkyNS0uNzQzLTEuNjc3LTEuNjU2LTEuNjc3SDYuNjQ2Yy0uOTEzIDAtMS42NTUuNzUyLTEuNjU1IDEuNjc3djcuODIzSDMuMTc0Yy0uMTI4IDAtLjIzMi0uMTEzLS4yMzItLjI1VjYuOTNoMTguMTAxdjExLjMxNGMwIC4xMzctLjEwMy4yNS0uMjMuMjV6bS05LjU2OCAwSDYuNDkxdi03LjgyM2MwLS4wOTQuMDctLjE3MS4xNTQtLjE3MWg0LjZ2Ny45OTR6bTYuMzc3IDBoLTQuODc3VjEwLjVoNC43MjJjLjA4NiAwIC4xNTUuMDc3LjE1NS4xNzF2Ny44MjN6TTIuODU3IDEuODI1YS40OTIuNDkyIDAgMCAxIC40NTItLjMxOUgyMC42OWMuMiAwIC4zNzguMTI2LjQ1My4zMmwxLjM0NSAzLjU3NmMtLjAxNS4wMjItLjAyOS4wMjItLjAzNi4wMjJMMS41MDQgNS4zMzVsMS4zNTMtMy41MXptMjEuMDM2IDIuOTY2bC0xLjM1Mi0zLjUxQTEuOTc2IDEuOTc2IDAgMCAwIDIwLjY5MSAwSDMuMzA4YTIgMiAwIDAgMC0xLjg1IDEuMjgyTC4xMDYgNC43OWExLjU4IDEuNTggMCAwIDAgLjE2NyAxLjQ2MmMuMjY4LjM5NC43LjYzMSAxLjE2OC42NjR2MTEuMzI4YzAgLjk2OC43NzcgMS43NTYgMS43MzIgMS43NTZoMTcuNjM4Yy45NTUgMCAxLjczMi0uNzg4IDEuNzMyLTEuNzU2VjYuOTE4Yy40NzItLjAyOS45MS0uMjY3IDEuMTgxLS42NjQuMjkyLS40MjkuMzU3LS45NzYuMTY4LTEuNDYzeiIvPgogICAgPC9kZWZzPgogICAgPGcgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgwIDIpIj4KICAgICAgICA8bWFzayBpZD0iYiIgZmlsbD0iI2ZmZiI+CiAgICAgICAgICAgIDx1c2UgeGxpbms6aHJlZj0iI2EiLz4KICAgICAgICA8L21hc2s+CiAgICAgICAgPHVzZSBmaWxsPSIjMjMxRjIwIiB4bGluazpocmVmPSIjYSIvPgogICAgICAgIDxnIGZpbGw9IiMwQjEiIG1hc2s9InVybCgjYikiPgogICAgICAgICAgICA8cGF0aCBkPSJNLTEzLTE1aDUwdjUwaC01MHoiLz4KICAgICAgICA8L2c+CiAgICA8L2c+Cjwvc3ZnPgo=')
      no-repeat;
  `,
  StoreIconFail: css`
    //background:url('../../assets/images/store-alt.svg');
    background: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCI+CiAgICA8ZGVmcz4KICAgICAgICA8cGF0aCBpZD0iYSIgZD0iTTIwLjgxMiAxOC40OTRoLTEuNjl2LTcuODIzYzAtLjkyNS0uNzQzLTEuNjc3LTEuNjU2LTEuNjc3SDYuNjQ2Yy0uOTEzIDAtMS42NTUuNzUyLTEuNjU1IDEuNjc3djcuODIzSDMuMTc0Yy0uMTI4IDAtLjIzMi0uMTEzLS4yMzItLjI1VjYuOTNoMTguMTAxdjExLjMxNGMwIC4xMzctLjEwMy4yNS0uMjMuMjV6bS05LjU2OCAwSDYuNDkxdi03LjgyM2MwLS4wOTQuMDctLjE3MS4xNTQtLjE3MWg0LjZ2Ny45OTR6bTYuMzc3IDBoLTQuODc3VjEwLjVoNC43MjJjLjA4NiAwIC4xNTUuMDc3LjE1NS4xNzF2Ny44MjN6TTIuODU3IDEuODI1YS40OTIuNDkyIDAgMCAxIC40NTItLjMxOUgyMC42OWMuMiAwIC4zNzguMTI2LjQ1My4zMmwxLjM0NSAzLjU3NmMtLjAxNS4wMjItLjAyOS4wMjItLjAzNi4wMjJMMS41MDQgNS4zMzVsMS4zNTMtMy41MXptMjEuMDM2IDIuOTY2bC0xLjM1Mi0zLjUxQTEuOTc2IDEuOTc2IDAgMCAwIDIwLjY5MSAwSDMuMzA4YTIgMiAwIDAgMC0xLjg1IDEuMjgyTC4xMDYgNC43OWExLjU4IDEuNTggMCAwIDAgLjE2NyAxLjQ2MmMuMjY4LjM5NC43LjYzMSAxLjE2OC42NjR2MTEuMzI4YzAgLjk2OC43NzcgMS43NTYgMS43MzIgMS43NTZoMTcuNjM4Yy45NTUgMCAxLjczMi0uNzg4IDEuNzMyLTEuNzU2VjYuOTE4Yy40NzItLjAyOS45MS0uMjY3IDEuMTgxLS42NjQuMjkyLS40MjkuMzU3LS45NzYuMTY4LTEuNDYzeiIvPgogICAgPC9kZWZzPgogICAgPGcgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj4KICAgICAgICA8ZyB0cmFuc2Zvcm09InRyYW5zbGF0ZSgwIDIpIj4KICAgICAgICAgICAgPG1hc2sgaWQ9ImIiIGZpbGw9IiNmZmYiPgogICAgICAgICAgICAgICAgPHVzZSB4bGluazpocmVmPSIjYSIvPgogICAgICAgICAgICA8L21hc2s+CiAgICAgICAgICAgIDx1c2UgZmlsbD0iIzIzMUYyMCIgeGxpbms6aHJlZj0iI2EiLz4KICAgICAgICAgICAgPGcgZmlsbD0iIzlCOUI5QiIgbWFzaz0idXJsKCNiKSI+CiAgICAgICAgICAgICAgICA8cGF0aCBkPSJNLTEzLTE1aDUwdjUwaC01MHoiLz4KICAgICAgICAgICAgPC9nPgogICAgICAgIDwvZz4KICAgICAgICA8cGF0aCBzdHJva2U9IiNDMDAwMDAiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLXdpZHRoPSIxLjUiIGQ9Ik0xLjUgMjIuNWwyMS0yMSIvPgogICAgPC9nPgo8L3N2Zz4K')
      no-repeat;
  `,
  toolTipContainer: css`
    width: 250px;
    fontsize: 12px;
    fontfamily: Mallory-Book;
    margin: 0px;
  `
};

export const seeDetailsAdjustWidth = css`
  padding-left: 0;
  padding-right: 0;
  min-width: auto;

  ${media.lg`
    font-size: 14px;
  `};
`;

export const borderRightNotMobile = css`
  @media (min-width: ${sizes.md}px) {
    border-right: 1px solid #d8d8d8;
  }
`;

export const disableClicks = css`
  pointer-events: none;
`;
