import { css } from 'react-emotion';

const header = css`
  height: 82px;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.09);
  * :focus {
    outline: 1px dotted #333;
  }
  @media screen and (min-width: 576px) {
    height: 100px;
  }
`;
const container = css`
  height: 100%;
  display: flex;
  align-items: center;
`;
const logoWrapper = css`
  min-width: 150px;
  max-width: 150px;
  img {
    max-width: 100%;
    height: auto;
    margin-left: -4px;
  }
  @media screen and (min-width: 576px) {
    min-width: 210px;
    max-width: 210px;
  }
`;
const iconsWrapper = css`
  display: flex;
  flex: 1;
  justify-content: flex-end;
  align-items: center;
  position: relative;
  padding-right: 12px;
  span {
    font-size: 24px;
  }
`;
const miniCartStyles = css`
  .mini-cart {
    &:hover,
    &:focus {
      outline: none;
      text-decoration: none;
      border-bottom: 2px solid #0055a6;
    }
    span {
      font-size: 1.5rem;
      color: #585858;
      &.mini-cart-count {
        width: 19px;
        height: 19px;
        display: inline-block;
        position: absolute;
        top: -7px;
        right: -6px;
        color: #fff !important;
        text-align: center;
        line-height: 19px;
        font-size: 9px !important;
        background: #e00;
        border-radius: 50%;
      }
    }
  }
`;

export { header, container, logoWrapper, iconsWrapper, miniCartStyles };
