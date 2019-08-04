import { css } from 'react-emotion';

export const card = css`
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 2px 2px 0 rgba(0, 0, 0, 0.04), 0 0 2px 0 rgba(0, 0, 0, 0.1);
`;
export const button = css`
  min-height: 40px;
`;
const boxBlock = css`
  border-radius: 4px;
  background-color: #ffffff;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 2px 2px 0 rgba(0, 0, 0, 0.04), 0 0 2px 0 rgba(0, 0, 0, 0.1);
  @media (max-width: 576px) {
    box-shadow: none;
  }
`;
const bgNone = css`
  background-color: #fff;
  border: none;
  &:hover {
    cursor: pointer;
    color: #0055a6;
    .linkStyle {
      text-decoration: underline;
    }
  }
`;
const iconPlus = css`
  color: #0055a6;
`;
const defaultBanner = css`
  background-color: #0055a6;
`;
const iconColor = css`
  color: #00bb11;
  font-size: 3rem;
  align-self: center;
`;
const namesBlock = css`
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;

  .form-group {
    width: 100%;
    &:nth-child(1) {
      width: 48%;
    }
    &:nth-child(2) {
      width: 48%;
    }
  }
`;
const AddOptionalAddressLink = css`
  cursor: pointer;
  text-decoration: none !important;
  color: #0055a6;
`;
const AddressField = css`
  margin-bottom: 0.75rem;
`;
const AddressBlock = css`
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
const formControl = css`
  display: block;
  width: 100%;
  height: 2.5rem;
  padding: 6px 12px;
  line-height: 1.6;
  background-color: #fff;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

const shippingAddressForm = css`
  background-color: blue;
`;

const titleStyle = css`
  line-height: 1.71;
  letter-spacing: 0.1px;
`;

const labelStyle = css`
  width: 100%;
  font-weight: bold;
  line-height: 1.43;
`;

const addCompanyStyle = css`
  line-height: 1.43;
  color: #0055a6;
`;

const addressBlock = css`
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
const clsBtn = css`
  background: #fff;
  border: none;
  height: 22px;
  width: 22px;
  cursor: pointer;
`;

const OverLay = css`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.4);
`;
const textStyle = css`
  font-size: 1rem;
  line-height: 1.25;
  color: #333333;
`;

const suggestAddress = defaultFocusColor => css`
  border-radius: 4px;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
  background-color: #ffffff;
  border: solid 2px ${defaultFocusColor};
`;
const addressStyle = css`
  line-height: 1.25;
  letter-spacing: normal;
  color: #333333;
  &:hover {
    text-decoration: none;
  }
`;
const modifyAddressStyles = css`
  color: #0055a6;
`;

const fullNameStyles = css`
  @media (max-width: 576px) {
    flex-direction: column;
  }
`;
const dropDownTextStyle = css`
  color: #fff;
`;
const formFieldsFlex = css`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
`;
const creditcardDetails = css`
  ${formFieldsFlex};
  .form-group {
    width: 100%;
    &:nth-child(2) {
      width: 60%;
    }
    &:nth-child(3) {
      width: 35%;
    }
    @media screen and (min-width: 992px) {
      &:nth-child(1) {
        width: 47%;
      }
      &:nth-child(2) {
        width: 29%;
      }
      &:nth-child(3) {
        width: 18%;
      }
    }
`;
const suggestAddressAnchor = css`
  color: #fff;
  &:hover {
    text-decoration: none;
  }
`;
const iconColorCode = css`
  color: #008000;
`;

const seperateLineStyle = css`
  width: '100%';
  height: 1px;
  background-color: #cccccc;
`;
const errorStyles = css`
  color: red;
`;
const errorWrapper = css`
  border-radius: 4px;
  border: solid 1px #e30300;
  background-color: rgba(224, 0, 0, 0.03);
`;

const errorBorder = css`
  border: solid 1px #c00000 !important;
`;

const cancelLink = css`
  color: #0055a6;
  &:hover {
    text-decoration: underline;
  }
`;
const addressForm = css`
  label {
    margin-bottom: 0;
  }
`;
const stateDropdown = css`
  ul#customDropdownList li:first-child {
    display: none;
  }
`;

export {
  creditcardDetails,
  formControl,
  boxBlock,
  bgNone,
  iconPlus,
  defaultBanner,
  iconColor,
  namesBlock,
  AddOptionalAddressLink,
  AddressField,
  AddressBlock,
  errorStyles,
  fullNameStyles,
  suggestAddress,
  OverLay,
  modifyAddressStyles,
  clsBtn,
  textStyle,
  modalStyles,
  addressBlock,
  shippingAddressForm,
  dropDownTextStyle,
  titleStyle,
  labelStyle,
  addCompanyStyle,
  iconColorCode,
  seperateLineStyle,
  addressStyle,
  suggestAddressAnchor,
  errorWrapper,
  errorBorder,
  cancelLink,
  addressForm,
  stateDropdown
};
