import { css } from 'react-emotion';

const formFieldsFlex = css`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
`;

export const toolTipStyle = css`
background: transparent;
color: #333;
border: none;
`;

export const paymentContainer = css`
  legend,
  fieldset,
  label {
    margin: 0;
    padding: 0;
    font-size: inherit;
  }

  .selectPayment {
    input[type='radio'] {
      margin-right: 10px;
    }
    input[type='radio']:disabled + strong:before {
      border: 1px solid #ccc;
    }
    
    input[type='radio']:disabled + strong:after {
      background: #ccc;
    }
    label {
      position: relative;
      margin-bottom: 10px;
      margin-right: 35px;
      &:last-child {
        margin-bottom: 0;
      }
      @media screen and (min-width: 992px) {
        margin-bottom: 0;
      }
    }
  }

  .relativePos {
    position: relative;
  }

  .form-control {
    display: block;
    width: 100%;
    height: 2.5rem;
    letter-spacing: -0.5px; // Made this change to show the entire creditcard number in mobile. Otherwise it is overlapping the card number in mobile.
    padding: 6px 12px;
    line-height: 1.6;
    background-color: #fff;
    border: 1px solid #ccc;
    border-radius: 4px;
    margin-top: 5px;
    @media screen and (min-width: 992px) {
      letter-spacing: inherit;
    }
  }

  .invalidField {
    border: 1px solid #c00000;
  }
  
  .mt-20 {
    margin-top: -1.25rem;
  }

  .invalidTxt {
    line-height: 1rem;
  }
  .invalidTxt span {
    color: #c00000;
  }

  .creditcardDetails {
    ${formFieldsFlex};
    .savedCreditcard {
      cursor: pointer;
      text-align: left;
      padding-top: 0.5rem;
    }

    .expiry label > span {
      letter-spacing: -0.5px;
      white-space: nowrap;
      @media screen and (min-width: 992px) {
        letter-spacing: inherit;
        white-space: inherit;
      }
    }

    button {
      padding: 0 10px 0 15px;
    }

    .creditcarsBg {
      display: block;
      position: relative;
      img {
        max-width: 40px;
        transform: translateY(50%);
        position: absolute;
        top: -42px;
        right: 4px;
        max-height: 32px;
        @media screen and (min-width: 992px) {
          max-width: none;
          transform: none;
          top: -38px;
        }
      }
    }
  }
`;

export const topBorderBtn = css`
  border-top: 1px solid #cccccc;
`;

export const headingBox = css`
  border-top: 1px solid #cccccc;
`;

export const radioFocus = css`
  &:focus-within {
    outline: -webkit-focus-ring-color auto 5px;
  }
`;

export const cvvField = css`
  text-security: disc;
  -webkit-text-security: disc;
  -mox-text-security: disc;
`;
export const hr = css`
  color: #0055a6;
`;

export const submitButton = css`
  width: 100%;
  @media (min-width: 768px) {
    width: auto;
  }
`;
