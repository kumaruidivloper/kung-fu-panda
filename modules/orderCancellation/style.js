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

const imageStyle = css`
  height: 4.75rem;
  width: 4.75rem;
`;
const card = css`
  border-radius: 4px;
  background-color: #ffffff;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 2px 2px 0 rgba(0, 0, 0, 0.04), 0 0 2px 0 rgba(0, 0, 0, 0.1);
`;
const promoDiv = css`
color: #008800;
`;
const horzLine = css`
color: #cccccc;
`;
const giftCardTitle = css`
  color: #ee0000;
`;

export { bgNone, imageStyle, card, promoDiv, horzLine, giftCardTitle };
