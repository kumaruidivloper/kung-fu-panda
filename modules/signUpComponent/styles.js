import { css } from 'react-emotion';

const fullWidth = css`
  width: 100% !important;
`;

const signin = css`
  margin-top: 64px;
  @media minwidth(576px) {
    margin-top: 64px;
  }
`;
const errorText = css`
  color: #ee0000;
`;
const errorWrapper = css`
  border-radius: 4px;
  border: solid 1px #e30300;
  background-color: rgba(224, 0, 0, 0.03);
`;

const Btn = css`
  cursor: pointer;
  color: #0055a6;
  border: none;
  width: auto;
  background: none;
  padding-left: 0;

  &:hover {
    text-decoration: underline;
  }
`;
const hr = css`
  color: #0055a6;
`;

const checkStyle = css`
  cursor: pointer;

  input {
    border: none;
  }
`;

const errorRedColor = css`
  color: #c00000;
`;

const passwordFocus = css`
  :focus {
    outline: -webkit-focus-ring-color auto 5px !important;
  }
`;

const errorBorder = css`
  border-color: #c00000 !important;
`;

const TitleSuccessMsg = css`
  font-size: 2.3rem;
  line-height: 2.3rem;
  @media (min-width: 768px) {
    font-size: 2.625rem;
    line-height: 2.625rem;
  }
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

export const containerMargin = css`
margin: 56px 0;
`;

export { fullWidth, signin, errorText, errorWrapper, Btn, hr, checkStyle, errorRedColor, passwordFocus, errorBorder, TitleSuccessMsg };
