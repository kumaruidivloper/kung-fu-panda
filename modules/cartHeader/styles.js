import { css } from 'react-emotion';

const continueShopping = css`
  color: #585858;
  display: inline-block;
  :hover {
    text-decoration: none;
  }
  span:hover {
    text-decoration: underline;
    color: #0055a6;
  }
`;

const arrowIcon = css`
  top: 2px;
  position: relative;
  color: #0055a6;
`;

const cartHeader = css`
  display: inline-block;
  font-size: 2.625rem;
  letter-spacing: 0;
  line-height: 2.625rem;
`;

const qtyDetails = css`
  display: inline-block;
  // Picked up width size from vendor css, based on container desgining
  @media screen and (max-width: 1112px) {
    float: right;
    margin-top: 1rem;
    text-align: right;
    span {
      display: block;
      margin-left: 0px;
    }
  }
`;

export { continueShopping, cartHeader, arrowIcon, qtyDetails };
