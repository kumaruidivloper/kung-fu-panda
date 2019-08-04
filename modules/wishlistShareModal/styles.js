import { css } from 'react-emotion';

const mobileContainer = css`
  @media (max-width: 576px) {
    margin-top: 72px;
    margin-bottom: 72px;
  }
`;

const header = css`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

// This is not working as expected, but as I lack proper context, I'm leaving in for now.
// It appears that the attributes of @academysports/fusion-components/dist/InputField override passed in styles via className
// If you don't pass in props for width/border etc..., the default props of InputField still override those values set via css & className.
const hasError = blnHasError =>
  css`
    ${blnHasError ? 'border-color: #c00000' : ''};
  `;

const textArea = css`
  width: 100%;
  height: 5.25rem;
  border-radius: 4px;
  border: solid 1px #cccccc;
`;

const redColor = css`
  color: #c00000;
`;

const shareWishlistButton = css`
  height: 3.75rem;
  // width: 25rem;
`;

const suggestion = css`
  color: #9b9b9b;
`;

const buttonContainer = css`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Btn = css`
  border: none;
  box-shadow: none;
  background: none;
  cursor: pointer;
  :active {
    border: none;
    background-color: none;
  }
  :hover {
    background-color: none;
  }
  :focus {
    background-color: none;
  }
`;

const iconStyle = css`
  color: #0055a6;
`;
const modalStyle = css`
  overflow-y: hidden;
`;
const linkStyle = css`
  :hover {
    color: #0055a6;
    text-decoration: underline;
  }
`;
const OverLay = css`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.4);
`;

const modalStyles = css`
  box-sizing: border-box;
  position: absolute;
  top: 7%;
  left: 23%;
  right: 23%;
  width: 54%;
  bottom: 7%;
  overflow: auto;
  background-color: #fff;

  @media (max-width: 768px) {
    width: 100%;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
  }
`;

const fontBtn = css`
  font-size: 20px;
  border: none;
  box-shadow: none;
  background: none;
  cursor: pointer;
  :active {
    border: none;
    background-color: none;
  }
  :hover {
    background-color: none;
  }
  :focus {
    background-color: none;
  }
`;
const centerAlign = css`
  text-align: center;
`;
export { mobileContainer, redColor, header, hasError, suggestion, textArea, shareWishlistButton, buttonContainer, Btn, iconStyle, modalStyle, linkStyle, OverLay, modalStyles, fontBtn, centerAlign };
