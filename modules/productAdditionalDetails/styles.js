import styled, { css } from 'react-emotion';

const ProductAddDtlsWrapper = styled.div(css`
  display: flex;
  flex-direction: column;
`);

const priceWrapperStyle = css`
  font-size: 2.25rem;
  font-weight: 900;
  font-style: normal;
  font-stretch: condensed;
  line-height: 0.93;
  letter-spacing: 0.7px;

  > p {
    margin: 1rem 0 0;
    font-size: 0.875rem;
    font-weight: normal;
    font-stretch: normal;
    line-height: 1.29;
    letter-spacing: normal;
  }
`;

const PromoMessage = styled.p(css`
  margin: 2rem 0;
  font-size: 0.875rem;
  font-weight: normal;
  font-style: normal;
  font-stretch: normal;
  line-height: 1.29;
  letter-spacing: normal;
  color: #ee0000;
`);

const PPUWrapper = styled.span(css`
  font-size: 0.875rem;
  font-weight: normal;
  font-stretch: normal;
  line-height: 1.29;
  letter-spacing: normal;
  margin-left: 1rem;
`);

const DividerRule = styled.div(css`
  height: 1px;
  background-color: #cccccc;
`);

export const DividerRuleDesktopOnly = styled('div')`
  height: 1px;
  background-color: #cccccc;

  @media (max-width: 767px) {
    display: none;
  }
`;

export { ProductAddDtlsWrapper, priceWrapperStyle, PromoMessage, DividerRule, PPUWrapper };
