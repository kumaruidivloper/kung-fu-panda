import { css } from 'react-emotion';

export const errorWrapper = css`
  border-radius: 4px;
  background-color: rgba(224, 0, 0, 0.03);
  border: solid 1px #e30300;
`;

export const errorText = css`
  text-align: center;
  color: #ee0000;
`;
export const successWrapper = css`
  border-radius: 4px;
  background-color: rgba(0, 85, 166, 0.03);
  border: solid 1px #0055a6;
`;
export const successText = css`
  text-align: center;
  color: #333333;
`;
export const placeOrderBorder = css`
  border-bottom: 1px solid #cccccc;
`;
export const checkboxErrorText = css`
  visibility: hidden;
`;
export const itemThumbnail = css`
  border-style: solid;
  height: 3rem;
  width: 3rem;
  margin-right: 0.6rem;
  border-width: 0.06rem;
  border-color: #cccccc;
  object-fit: contain;
`;
export const warningWrapper = css`
  border-radius: 4px;
  background-color: rgba(255, 196, 0, 0.03);
  border: solid 1px #ffc400;
`;
export const warningText = css`
  color: #333333;
`;
export const checkStyle = css`
  cursor: pointer;
`;
export const linkStyle = css`
  a {
    text-decoration: underline;
  }
`;

export const submitButton = css`
  width: 100%;
  @media (min-width: 768px) {
    width: auto;
  }
`;
