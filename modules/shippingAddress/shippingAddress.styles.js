import { css } from 'react-emotion';

export const shippingAddressForm = css`
  background-color: blue;
`;

export const titleStyle = css`
  line-height: 1.71;
  letter-spacing: 0.1px;
`;

export const labelStyle = css`
  width: 100%;
  font-weight: bold;
  line-height: 1.43;
`;

export const addCompanyStyle = css`
  color: #0055a6;
  font-size: 0.7rem;
  line-height: 1.29;
  @media (min-width: 768px) {
    font-size: 0.875rem;
  }
`;

export const addressBlock = css`
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;

  .form-group {
    width: 100%;
    &:nth-child(1) {
      width: 52%;
    }
    &:nth-child(2) {
      width: 60%;
    }
    &:nth-child(3) {
      width: 32%;
    }
    @media screen and (min-width: 992px) {
      &:nth-child(1) {
        width: 42%;
      }
      &:nth-child(2) {
        width: 32%;
      }
      &:nth-child(3) {
        width: 20%;
      }
    }
  }
`;

export const modalStyles = css`
  box-sizing: border-box;
  position: absolute;
  width: 100%;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: auto;
  background-color: #fff;

  @media (min-width: 768px) {
    top: 7%;
    left: 23%;
    right: 23%;
    width: 54%;
    bottom: 7%;
  }
`;
export const clsBtn = css`
  background: #fff;
  border: none;
  height: 22px;
  width: 22px;
  cursor: pointer;
`;

export const OverLay = css`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.4);
`;
export const textStyle = css`
  font-size: 1rem;
  line-height: 1.25;
  color: #333333;
`;

export const suggestAddress = defaultFocusColor => css`
  border-radius: 4px;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
  background-color: #ffffff;
  border: solid 2px ${defaultFocusColor};
`;
export const suggestAddressAnchor = css`
  color: #fff;
  &:hover {
    text-decoration: none;
  }
`;
export const addressStyle = css`
  line-height: 1.25;
  letter-spacing: normal;
  color: #333333;
  &:hover {
    text-decoration: none;
  }
`;
export const modifyAddressStyles = css`
  color: #0055a6;
`;
export const iconColor = css`
  color: #00bb11;
  font-size: 3rem;
  align-self: center;
`;

export const seperateLineStyle = css`
  width: '100%';
  height: 1px;
  background-color: #cccccc;
`;
export const errorStyles = css`
  color: red;
`;
export const dropDownTextStyle = css`
  color: #fff;
`;
export const errorWrapper = css`
  border-radius: 4px;
  border: solid 1px #e30300;
  background-color: rgba(224, 0, 0, 0.03);
`;

export const mtop = css`
  margin-top: -0.75rem; // Reduced the top space for instruction message
`;

export const submitButton = css`
  width: 100%;
  @media (min-width: 768px) {
    width: auto;
  }
`;

export const containerMargin = css`
  margin: 56px 0;
`;

export const errorText = css`
  color: #ee0000;
`;

export const prop65ErrorWrapper = css`
  border-radius: 4px;
  border: solid 1px #e30300;
  background-color: rgba(255, 196, 0, 0.03);
`;
export const itemThumbnail = css`
  width: 52px;
  height: 52px;
  border: solid 1px #cccccc;
`;
export const thumbnailImg = css`
  max-width: 100%;
  max-height: 100%;
  margin: 0 auto;
`;
export const warningText = css`
  color: #333333;
`;
export const prop65WarningWrapper = css`
  border-radius: 4px;
  background-color: rgba(255, 196, 0, 0.03);
  border: solid 1px #ffc400;
`;
export const stateDropdown = css`
  ul#customDropdownList li:first-child {
    display: none;
  }
`;

export const wordBreak = css`
  word-break: break-word;
`;
