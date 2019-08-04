import { css } from 'react-emotion';

export const orderSummaryDiv = css`
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 2px 2px 0 rgba(0, 0, 0, 0.04), 0 0 2px 0 rgba(0, 0, 0, 0.1);
  flex-direction: column;
  @media (max-width: 768px) {
    flex-direction: column-reverse;
  }
`;
export const bundleItemContainer = css`
  background-color: #f6f6f6;
  width: calc(100% + 48px);
  margin-left: -24px;
  max-width: none;
`;
export const stickyBackGroundColor = css`
  background-color: #fff;
`;
export const triangleUp = css`
  width: 0;
  height: 0;
  border-left: 1rem solid transparent;
  border-right: 1rem solid transparent;
  border-bottom: 1rem solid #f6f6f6;
`;
export const upperBorderBox = css`
  @media (max-width: 768px) {
    border-top: 1px solid #cccccc;
  }
`;

export const BoxBorder = css`
  border-top: 1px solid #cccccc;
`;

export const shippingItem = css`
  :last-child {
    margin-bottom: 0;
  }
  @media (min-width: 768px) {
    :last-child {
      margin-bottom: 1rem;
    }
  }
`;

export const orderSummaryHeading = css`
  text-transform: uppercase;
  font-size: 2rem;
  letter-spacing: 0;
  line-height: 2rem;
`;

export const pricesBox = css`
  border-bottom: 1px solid #cccccc;
`;

export const imageContainer = css`
  width: 3.125rem;
  height: 3.125rem;
  text-align: center;
`;

export const itemImage = css`
  max-width: 100%;
  max-height: 100%;
`;

export const editMyCart = css`
  //border-bottom: 1px solid #cccccc;
  @media (min-width: 768px) {
    border-bottom: 0;
  }
`;

export const itemsArrowIcon = css`
  color: #585858;
`;

export const hideOndesktop = css`
  @media (min-width: 768px) {
    display: none;
  }
`;

export const showOndesktop = css`
  @media (max-width: 768px) {
    display: none;
  }
`;

export const drawerBodyStyle = css`
  z-index: 100;
  border-top: 0;
  padding: 0 1.5rem;
`;

export const titleStyleOpen = css`
  z-index: 100;
  min-height: 0;
`;

export const titleStyle = css`
  border-top: 0;
  cursor: default;
  padding: 0 1.5rem;
`;

export const discountColor = css`
  color: #1eaa1e;
`;

export const quantityMobileView = css`
  position: absolute;
  right: 0;
  bottom: 0;
`;

export const imageMobileView = css`
  width: 3.625rem;
  flex: 0 0 3.625rem;
`;
export const sticky = css`
  position: fixed;
  bottom: 0px;
  z-index: 100;
  @media (min-width: 768px) {
    position: relative;
  }
`;

export const positionRelative = css`
  position: relative;
`;

export const editCartLink = css`
  :hover {
    text-decoration: none;
  }
  i {
    color: #0055a6;
  }
  span:hover {
    color: #0055a6;
    text-decoration: underline;
  }
`;

export const fontIconColor = css`
  color: #0055a6;
`;

export const fullWidth = css`
  flex-basis: 100%;
  align-self: flex-end;
`;

export const orderExpandedHeight = '40vh';

export const colorGreen = css`
  color: #1eaa1e;
`;
