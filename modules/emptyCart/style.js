import { css } from 'react-emotion';

export const emptyCart = css`
  margin-bottom: 120px;
  @media (max-width: 576px) {
    margin-bottom: 32px;
  }
`;

export const btn = css`
  width: 100%;
  white-space: nowrap;
`;

export const continueShopping = css`
  :hover {
    text-decoration: none;
  }
  color: #585858;
  display: inline-block;
  span:hover {
    color: #0055a6;
    text-decoration: underline;
  }
`;

export const arrowIcon = css`
  top: 2px;
  position: relative;
  color: #0055a6;
`;
