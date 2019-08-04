import styled, { css } from 'react-emotion';

const submitBtnHeight = css`
  max-height: 40px;
  padding-top: 12px;
`;

const passwordFieldShowHideButton = css`
  button {
    right: 6%;
    @media screen and (min-width: 576px) {
      right: 8%;
    }
`;

const itemImageThumbnail = css`
  width: 3.2rem;
  height: 3.2rem;
  object-fit: contain;
`;
const iconSize = css`
  font-size: 1.5rem;
`;
const errorStyles = css`
  color: red;
  font-size: 0.875rem;
`;
const labelStyle = css`
  width: 100%;
  font-weight: bold;
  line-height: 1.43;
`;
const successModal = css`
  border-width: 0.0625rem;
  border-style: solid;
  border-color: #1eaa1e;
  border-radius: 0.31rem;
  background-color: rgba(30, 170, 30, 0.03);
  height: 2.68rem;
`;
const colorGreen = css`
  color: #00bb11;
  cursor: pointer;
`;
const cursorPointer = css`
  cursor: pointer;
  &: hover {
    color: #0055a6;
    .label {
      text-decoration: underline;
    }
  }
`;
const bundleItemContainer = css`
  background-color: #f6f6f6;
`;
const triangleUp = css`
  width: 0;
  height: 0;
  border-left: 1rem solid transparent;
  border-right: 1rem solid transparent;
  border-bottom: 1rem solid #f6f6f6;
`;
const containerBox = css`
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 2px 2px 0 rgba(0, 0, 0, 0.04), 0 0 2px 0 rgba(0, 0, 0, 0.1);
  height: fit-content;
`;
const boxHeading = css`
  border-bottom: 0.0625rem solid #cccccc;
`;
const boxHeadingTop = css`
  border-top: 0.0625rem solid #cccccc;
`;
const cancelModal = css`
  overflow-y: hidden;
  min-height: 0px !important;
  width: 43rem !important;
`;
const linkLabels = css`
  color: #0055a6;
  cursor: pointer;
`;
const CancelLabels = css`
  font-size: 0.875rem;
`;
const estimatedPickupBox = css`
  border-radius: 0.25rem;
  background-color: rgba(255, 196, 0, 0.03);
  border: solid 0.0625rem #ffc400;
`;
const colorBlue = css`
  color: #0055a6;
`;
const storeInfo = css`
  > span {
    display: block;
    font-weight: 500;
    width: 9.6rem;
  }
`;

const discountColor = css`
  color: #1eaa1e;
`;
const btnStyle = css`
  border: none;
  width: auto;
  background: none;
  padding: 0;
  :focus {
    outline: none;
  }
`;
const cancelOrderLabel = css`
  color: #0055a6;
  &:hover {
    text-decoration: underline;
    cursor: pointer;
  }
`;
const textStyle = css`
  word-wrap: break-word;
`;
const btnContainer = css`
  display: flex;
  flex-direction: row;
  @media screen and (max-width: 576px) {
    flex-direction: column;
  }
`;
const errorWrapper = css`
  border-radius: 4px;
  border: solid 1px #e30300;
  background-color: rgba(224, 0, 0, 0.03);
`;

const Message = styled.div`
  width: 100%;
  height: 43px;
  border-radius: 4px;
  background-color: rgba(30, 170, 30, 0.03);
  border: solid 1px #1eaa1e;
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 0 14px;
  .message {
    flex: 1;
    color: #1eaa1e;
    text-align: center;
  }
  .closeButton {
    color: #1eaa1e;
    background: none;
    border: none;
  }
`;
const imageContainer = css`
  width: 3.125rem;
  height: 3.125rem;
`;
const lastParagraph = css`
  p:last-child {
    margin-bottom: 0;
  }
`;
const textMiddle = css`
  align-items: center;
`;

const textGreen = css`
  color: #1eaa1e;
`;

export {
  colorBlue,
  storeInfo,
  linkLabels,
  estimatedPickupBox,
  cursorPointer,
  cancelModal,
  boxHeading,
  boxHeadingTop,
  containerBox,
  itemImageThumbnail,
  errorStyles,
  labelStyle,
  successModal,
  colorGreen,
  CancelLabels,
  bundleItemContainer,
  triangleUp,
  iconSize,
  discountColor,
  btnStyle,
  cancelOrderLabel,
  btnContainer,
  errorWrapper,
  Message,
  submitBtnHeight,
  passwordFieldShowHideButton,
  imageContainer,
  lastParagraph,
  textMiddle,
  textStyle,
  textGreen
};
