import { css } from 'react-emotion';

const btnStyle = css`
  border: none;
  width: auto;
  background: none;
  padding: 0;
  :focus {
    outline: none;
  }
`;
const cancelOrderLabel = css`
  color: #0055a6;
  &:hover {
    text-decoration: underline;
    cursor: pointer;
  }
`;

const btnContainer = css`
  display: flex;
  flex-direction: row;
  margin: 0 auto;
  @media screen and (max-width: 576px) {
    flex-direction: column;
  }
`;
const errorWrapper = css`
border-radius: 4px;
border: solid 1px #e30300;
background-color: rgba(224, 0, 0, 0.03);
`;
const modalStyles = css`
  overflow-y: hidden;
  @media only screen and (min-width: 992px) {
    min-height: 380px;
}
`;

export { btnStyle, cancelOrderLabel, btnContainer, errorWrapper, modalStyles };
