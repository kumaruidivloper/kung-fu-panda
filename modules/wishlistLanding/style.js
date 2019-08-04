import { css } from 'react-emotion';

const wishlistBox = css`
  border-radius: 0.25rem;
  background-color: #ffffff;
  box-shadow: 0 0.0625rem 0.1875rem 0 rgba(0, 0, 0, 0.1), 0 0.125rem 0.125rem 0 rgba(0, 0, 0, 0.04), 0 0 0.125rem 0 rgba(0, 0, 0, 0.1);
`;

const iconStyle = css`
  width: 0.4375rem;
  height: 0.75rem;
  color: #0055a6;
`;

const focusText = css`
  cursor: pointer;
`;

const Btn = css`
  border: none;
  box-shadow: none;
  background: white;
  outline: none;
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
const errorWrapper = css`
  border-radius: 4px;
  border: solid 1px #e30300;
  background-color: rgba(224, 0, 0, 0.03);
`;
export { wishlistBox, iconStyle, Btn, focusText, errorWrapper };
