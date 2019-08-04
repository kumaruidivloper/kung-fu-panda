import { css } from 'react-emotion';

export const orderSummaryDiv = css`
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 2px 2px 0 rgba(0, 0, 0, 0.04), 0 0 2px 0 rgba(0, 0, 0, 0.1);
  flex-direction: column;
  @media (max-width: 768px) {
    flex-direction: column-reverse;
  }
`;

export const upperBorderBox = css`
  @media (max-width: 768px) {
    border-top: 1px solid #cccccc;
  }
`;

export const BoxBorder = css`
  border-top: 1px solid #cccccc;
`;

export const orderSummaryHeading = css`
  text-transform: uppercase;
  margin-bottom: 1.25rem;
`;

export const addIcon = css`
  color: #0055a6;
`;

export const orderSummaryLine = css`
  margin-top: 0.6rem;
`;

export const pricesBox = css`
  border-bottom: 1px solid #cccccc;
  padding-bottom: 0.81rem;
`;

export const itemCount = css`
  margin-top: 1.4rem;
`;

export const itemBox = css`
  padding-top: 1.5rem;
`;

export const itemImageBox = css`
  margin-right: 0.56rem;
`;

export const itemImage = css`
  height: 50px;
  width: 50px;
`;

export const itemRow = css`
  margin-top: 0.75rem;
`;

export const itemRowValue = css`
  margin-left: 0.4rem;
`;

export const editMyCart = css`
  border-bottom: 1px solid #cccccc;
  @media (min-width: 768px) {
    padding-top: 0.5rem;
    border-bottom: 0;
  }
  padding-bottom: 0.75rem;
  margin-bottom: 1rem;
`;

export const itemsArrowIcon = css`
  color:#585858;
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
  border-top: 0;
  padding-top: 0;
`;

export const titleStyleOpen = css`
  padding-bottom: 0;
`;

export const titleStyle = css`
  padding-top: 0;
  border-top: 0;
`;

export const orderSummaryBox = css`
  padding-bottom: 1.5rem;
  @media (min-width: 768px) {
    padding-bottom: 0.875rem;
  }
`;
