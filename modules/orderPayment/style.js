import { css } from 'react-emotion';

const paymentContainer = css`
  border-radius: 4px;
  background-color: #ffffff;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 2px 2px 0 rgba(0, 0, 0, 0.04), 0 0 2px 0 rgba(0, 0, 0, 0.1);
`;

const horizontalLine = css`
  border: 1px solid #cccccc;
`;

const visaStyle = css`
  justify-content: space-between;
  @media screen and (max-width: 576px) {
    flex-direction: column;
  }
`;

const visaLabel = css`
  @media screen and (max-width: 576px) {
    padding-bottom: 2rem;
  }
`;

const displayBlock = css`
  display: block;
`;

export { paymentContainer, horizontalLine, visaStyle, visaLabel, displayBlock };
