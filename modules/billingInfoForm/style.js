import { css } from 'react-emotion';

export const ShippingAddressCheckbox = css`
  width: 1.125rem;
  height: 1.125rem;
  background-color: #585858; !important
`;

export const AddOptionalAddressLink = css`
  cursor: pointer;
  line-height: 1.29;
  color: #0055a6;
`;
export const formControl = css`
  display: block;
  width: 100%;
  height: 2.5rem;
  padding: 6px 12px;
  line-height: 1.6;
  background-color: #fff;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

export const namesBlock = css`
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

export const AddressField = css`
  margin-bottom: 0.75rem;
`;

export const AddressBlock = css`
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
              width: 24%;
          }
          &:nth-child(2) {
              width: 45%;
          }
          &:nth-child(3) {
              width: 23%;
          }
      }
  }
}
`;

export const labelStyle = css`
  display: block;
  max-width: 100%;
  margin-bottom: 5px;
  font-weight: 700;
`;

export const titleTestClass = css`
  font-weight: 700;
  display: flex;
  justify-content: flex-start;
`;

export const subtitleTestClass = css`
  font-weight: 200;
  display: flex;
  justify-content: flex-start;
`;

export const textStyle = css`
  font-size: 1rem;
  line-height: 1.25;
  color: #333333;
`;
export const containerMargin = css`
  margin: 56px 0;
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
  text-decoration: none;
  // width: 178px;
  // height: 40px;
  line-height: 1.25;
  letter-spacing: normal;
  color: #333333;
`;
export const iconColor = css`
  color: #00bb11;
`;

export const checkCircleFont = css`
  display: flex;
  font-size: 2.5rem;
  cursor: pointer;
  align-items: center;
`;

export const invalidTxt = css`
  line-height: 1rem;
  span {
    color: #c00000;
  }
`;

export const billingFromError = css`
  .invalidField {
    border: 1px solid #c00000;
  }
`;
export const nameWrap = css`
  word-wrap: break-word;
`;

export const stateDropdown = css`
  ul#customDropdownList li:first-child {
    display: none;
  }
`;
