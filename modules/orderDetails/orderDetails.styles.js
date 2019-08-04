import { css } from 'react-emotion';

export const card = css`
  border-radius: 4px;
  background-color: #ffffff;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 2px 2px 0 rgba(0, 0, 0, 0.04), 0 0 2px 0 rgba(0, 0, 0, 0.1);
`;

export const backButton = css`
  font-size: 0.75rem;
  color: #0055a6;
  border: none;
  width: auto;
  background: none;
  padding-left: 0;
  :focus {
    outline: none;
  }
  :hover {
    cursor: pointer;
  }
`;

export const imageStyle = css`
  max-height: 4.75rem;
  max-width: 100%;
`;

export const skulabel = css`
  color: #9b9b9b;
`;
export const blueColor = css`
  color: #0055a6;
`;
export const headingBox = css`
  border-bottom: 1px solid #cccccc;
`;

export const editBtn = css`
  color: #0055a6;
`;
export const errorWrapper = css`
  border-radius: 4px;
  border: solid 1px #e30300;
  background-color: rgba(224, 0, 0, 0.03);
`;
export const returnWrapper = css`
  border-radius: 4px;
  border: solid 1px #0055a6;
  background-color: rgba(0, 85, 166, 0.03);
`;
export const promoDiv = css`
color: #008800;
`;
export const storeLink = css`
cursor: pointer;
&:hover {
  .label {
    color: #0055a6;
    text-decoration: underline;
  } 
}
`;
export const hoverBlue = css`
  :hover {
    color: #0055a6;
  }
`;
export const displayMobileNone = css`
  @media screen and (max-width: 767px) {
    display: none !important;
  }
`;
