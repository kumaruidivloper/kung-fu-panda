import styled, { css } from 'react-emotion';

const block = css`
  @media screen and (min-width: 576px) {
    border-radius: 4px;
    background-color: #ffffff;
    box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 2px 2px 0 rgba(0, 0, 0, 0.04), 0 0 2px 0 rgba(0, 0, 0, 0.1);
  }
`;
const errorStyles = css`
  color: red;
`;
const labelStyle = css`
  width: 100%;
  font-weight: bold;
  line-height: 1.43;
`;

const invalid = css`
  border: solid 1px #c00000 !important;
`;
const bgNone = css`
  font-size: 0.875rem;
  color: #0055a6;
  cursor: pointer;
  border: none;
  width: auto;
  background: none;
  padding: 0;
  :hover {
    span {
      text-decoration: underline;
      color: #0055a6;
    }
  }
`;

const hrLine = css`
  border: 1px 0px 0px #cccccc;
`;

const lineOnHover = css`
  :hover {
    color: #0055a6;
    text-decoration: underline;
    cursor: pointer;
  }
`;

const borderBottom = css`
  border: 1px solid #cccccc;
  margin: 0 1.5rem 0 1.5rem;
  @media screen and (max-width: 576px) {
    margin: 0;
  }
`;

const checkboxWrapper = css`
  input[type='checkbox'] {
    border: none;
  }
`;

const backProfileBtn = css`
  font-size: 0.75rem;
  color: #0055a6;
  border: none;
  width: auto;
  background: none;
  padding-left: 0;
  :hover {
    i {
      cursor: pointer;
    }
    span {
      cursor: pointer;
      text-decoration: underline;
      color: #0055a6;
    }
  }
`;
const inputField = css`
  @media screen and (max-width: 576px) {
    width: 100%;
  }
`;
const changePassword = css`
  &:hover {
    text-decoration: underline;
    color: #0055a6;
  }
`;
const editStyle = css`
  &:hover {
    text-decoration: underline;
    color: #0055a6;
  }
`;
const unsubscribe = css`
  color: #9b9b9b;
`;

const errorWrapper = css`
  border-radius: 4px;
  border: solid 1px #e30300;
  background-color: rgba(224, 0, 0, 0.03);
`;

const passwordFieldStyle = css`
  width: 100%;
  button {
    right: 2%;
  }
  @media screen and (min-width: 992px) {
    width: 508px;
  }
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
  }
  .closeButton {
    color: #1eaa1e;
    background: none;
    border: none;
  }
`;

const displayMobileNone = css`
  @media screen and (max-width: 767px) {
    display: none !important;
  }
`;

const INLINE_BUTTON_FONT_SIZE = '0.75rem';

export {
  block,
  errorStyles,
  editStyle,
  unsubscribe,
  changePassword,
  hrLine,
  labelStyle,
  invalid,
  bgNone,
  borderBottom,
  backProfileBtn,
  lineOnHover,
  inputField,
  errorWrapper,
  passwordFieldStyle,
  Message,
  INLINE_BUTTON_FONT_SIZE,
  checkboxWrapper,
  displayMobileNone
};
