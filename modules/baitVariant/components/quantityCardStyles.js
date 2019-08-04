import styled, { css } from 'react-emotion';
import { sizes, sizesMax } from '../../../utils/media';

const blueBackground = css`
  background: #0055a6;
  color: #fff;
  margin-bottom: 0;
  border-bottom: 1px solid rgba(0, 0, 0, 0.125);
`;
const card = css`
  word-wrap: break-word;
  background-color: #fff;
  background-clip: border-box;
  border: 1px solid rgba(0, 0, 0, 0.125);
  box-shadow: 0 0.062rem 0.1875rem 0 rgba(0, 0, 0, 0.1);
  border-radius: 0.25rem;
`;
const cardBlueBorder = css`
  word-wrap: break-word;
  background-color: #fff;
  background-clip: border-box;
  border: 1px solid #0055a6;
  box-shadow: 0 0.062rem 0.1875rem 0 rgba(0, 0, 0, 0.1);
  border-radius: 0.25rem;
`;
const cardheader = css`
  padding: 0;
  margin-bottom: 0;
  background-color: #fff;
  border-bottom: 1px solid rgba(0, 0, 0, 0.125);
  color: #333333;
`;
const QuantityPanel = styled('div')`
  padding-top: 0.5rem;
`;
const QuantityHeader = styled('div')`
  padding-top: 0.625rem;
  padding-bottom: 0.625rem;
`;
const cardbody = css`
  padding: 0 1rem 1rem 1rem;
`;

const QtyCardHeaderWeight = styled('span')`
  width: 2.625rem;
  height: 1.125rem;
`;
const QtyCardHeader = styled('span')`
  width: 2.625rem;
  height: 1.125rem;
`;
const PriceStyle = css`
  font-family: $font-family-cond-black;
  font-size: 2.25rem;
  line-height: 1;
  color: $academy-gray;
  letter-spacing: 0;
  margin-bottom: 0.562rem;
`;
const mt20 = css`
  margin-top: 1.25rem;
`;
const w40 = css`
  width: 50%;
`;
const w60 = css`
  width: 50%;
`;
const whiteText = css`
  color: #fff;
`;

const WasNowWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;

  > span {
    display: inline-block;
  }
`;

const OurPriceInCart = styled.div`
  div:first-child {
    font-size: 0.875rem;
    @media screen and (max-width: ${sizesMax.smMax}px) {
      font-size: 0.8rem;
    }
    span {
      font-size: 0.875rem;
      @media screen and (max-width: ${sizes.md}px) {
        font-size: 0.7rem;
    }
    @media screen and (max-width: ${sizes.xl}px) {
      font-size: 0.8rem;
    }
  }
  div:last-child {
    font-size: 0.875rem;
    @media screen and (max-width: ${sizes.md}px) {
      font-size: 0.7rem;
    }
  }
`;

export {
  blueBackground,
  cardheader,
  PriceStyle,
  QtyCardHeader,
  QtyCardHeaderWeight,
  cardbody,
  QuantityHeader,
  QuantityPanel,
  card,
  cardBlueBorder,
  mt20,
  w40,
  w60,
  whiteText,
  WasNowWrapper,
  OurPriceInCart
};
