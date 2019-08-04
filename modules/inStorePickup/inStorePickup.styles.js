import { css } from 'react-emotion';

export const marginBottomNull = css`
  p {
    margin-bottom: 0rem !important;
  }
`;

export const cardStyles = css`
  width: 52px;
  height: 52px;
  border: solid 1px #cccccc;
`;

export const pointerStyle = css`
  cursor: pointer;
  &: hover {
    color: #0056b3;
  }
`;

export const pickupInstruction = css`
  cursor: pointer;
  &: hover {
    color: #0056b3;
    .storeLink {
      text-decoration: underline;
    }
  }
`;

export const changeLocation = css`
  color: #0055a6;
  &: hover {
    text-decoration: underline;
  }
`;

export const errorWrapper = css`
  border-radius: 4px;
  border: solid 1px #e30300;
  background-color: rgba(224, 0, 0, 0.03);
`;

export const CheckboxStyles = css`
  position: relative;
  cursor: pointer;
  padding: 0;
  margin-right: 10px;
  margin-top: 3px;
  &:before {
    content: '';
    margin-right: 10px;
    display: inline-block;
    vertical-align: text-top;
    width: 18px;
    height: 18px;
    background: #fff;
    border: 2px solid #585858;
    border-radius: 2px;
    top: -2px;
    position: absolute;
  }
  &:hover:after {
    color: #fff;
  }
  &:checked:before {
    background: #585858;
  }
  &:disabled {
    color: #b8b8b8;
    cursor: auto;
  }
  &:disabled:before {
    background: #ddd;
  }
  &:checked:after {
    content: '';
    display: block;
    position: absolute;
    top: 0;
    left: 6px;
    width: 6px;
    height: 11px;
    border: solid #fff;
    border-width: 0 2px 2px 0;
    -webkit-transform: rotate(35deg);
    transform: rotate(35deg);
  }
`;

export const iconColor = css`
  color: #0055a6;
`;

export const errorText = css`
  color: #ee0000;
`;
