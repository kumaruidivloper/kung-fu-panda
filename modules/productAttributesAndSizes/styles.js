import styled, { css } from 'react-emotion';

const ProductAttributeWrapper = styled.div(css`
  > div:last-child {
    padding-bottom: 0;
  }
`);

const AttributeWrapper = styled.div(css`
  display: flex;
  align-items: center;
  padding-bottom: 0.5rem !important;
`);

const SizeChart = styled.div(css`
  flex-grow: 1;
  text-align: right;
  a {
    color: #333333;
    &:hover span {
      color: #0055a6;
      text-decoration: underline;
    }
  }
  i {
    color: #0055a6;
    font-size: 1rem;
    vertical-align: text-top;
    :hover {
      text-decoration: none;
    }
  }
  a:hover {
    text-decoration: none;
  }
`);

const AttributeKey = styled.span(css`
  padding-right: 0.5rem;
`);
const SoldOutText = css`
  > span:first-child {
    text-decoration: line-through;
  }
`;

const link = css`
  color: #0055a6;
  display: inline-block;
  margin: 0 0 1rem 0.5rem;
  font-size: 0.875rem;
`;

const smallIconlink = css`
  color: #0055a6;
  display: inline-block;
  margin: 0 0 1rem 0.5rem;
  color: inherit;
  font-size: 0.6rem;
`;

const LinkSpan = styled.span(css`
  cursor: pointer;
`);


export { AttributeKey, ProductAttributeWrapper, AttributeWrapper, SizeChart, SoldOutText, link, smallIconlink, LinkSpan };
