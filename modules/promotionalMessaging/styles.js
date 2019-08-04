import { css } from 'react-emotion';

const iconPlus = css`
  width: 0.875rem;
  height: 0.875rem;
  position: relative;
  top: 2px;
`;

const iconBtn = css`
  border: none;
  width: auto;
  background: none;
  padding: 0;
  color: #0055a6;
  cursor: pointer;
  &:hover {
    .addLabel,
    .hideLabel {
      color: #0055a6;
      text-decoration: underline;
    }
  }
`;

const iconMinus = css`
  width: 0.875rem;
  height: 0.1125rem;
  position: relative;
  top: 2px;
`;

const enterField = css`
  flex-direction: column;
  input {
    width: 98%;
  }
  button {
    width: 98%;
  }
  @media screen and (min-width: 768px) {
    flex-direction: row;
    input {
      width: 8.75rem;
    }
  }
  @media screen and (min-width: 1024px) {
    input {
      width: 10rem;
    }
    button {
      width: 7.5rem;
    }
  }
`;

const inputField = css`
  @media screen and (min-width: 576px) {
    height: 3.125rem !important;
  }
`;

const borderError = css`
  border-color: #c00000 !important;
`;

export { iconPlus, iconMinus, enterField, inputField, iconBtn, borderError };
