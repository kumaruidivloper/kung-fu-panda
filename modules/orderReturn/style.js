import { css } from 'react-emotion';

const bgNone = css`
  font-size: 0.875rem;
  color: #0055a6;
  border: none;
  width: auto;
  background: none;
  padding: 0;
  cursor: pointer;
  :focus {
    outline: none;
  }
`;
 const returnWrapper = css`
  border-radius: 4px;
  border: solid 1px #0055a6;
  background-color: rgba(0, 85, 166, 0.03);
`;
const orderReturn = css`
  flex: display;
  flex-direction: row;
  @media screen and (max-width: 576px) {
    flex-direction: column;
  }
`;

const imageStyle = css`
  height: 4.75rem;
`;

const containerStyle = css`
  border-radius: 4px;
  background-color: #ffffff;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 2px 2px 0 rgba(0, 0, 0, 0.04), 0 0 2px 0 rgba(0, 0, 0, 0.1);
`;

const skulabel = css`
  color: #9b9b9b;
`;
const errorWrapper = css`
  border-radius: 4px;
  border: solid 1px #e30300;
  background-color: rgba(224, 0, 0, 0.03);
`;
const instrucContainer = css`
  border-radius: 4px;
  background-color: #ffffff;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 2px 2px 0 rgba(0, 0, 0, 0.04), 0 0 2px 0 rgba(0, 0, 0, 0.1);
`;
const btnAlignment = css`
  text-align: center;
  @media screen and (min-width: 768px) {
    text-align: right;
    padding-right: 8px;
  }
`;

export { bgNone, orderReturn, imageStyle, containerStyle, skulabel, returnWrapper, errorWrapper, instrucContainer, btnAlignment };
