import styled, { css } from 'react-emotion';
export const BaitQuantity = {
  QtyNumberContainer: styled('div')`
    height: 2.5rem;
    border-radius: 4px;
    border: solid 1px #cccccc;
    padding: 0;
    margin: 0;
    font-family: 'Mallory-Book', 'Helvetica Neue', sans-serif;
    box-sizing: border-box;
    &:hover,
    &:focus {
      cursor: pointer;
    }

    @media (max-width: 768px) {
      width: 100%;
    }
  `,
  ButtonLeft: styled('button')`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 30%;
    height: 2.4rem;
    border-radius: 4px 0 0 4px;
    background-color: #f6f6f6;
    text-align: center;
    float: left;
    font-size: 0.875rem;
    border: hidden;
    border-right: 1px solid #cccccc;
    @media (min-width: 768px) and (max-width: 992px) {
      width: 33%;
    }
    &:hover,
    &:focus {
      cursor: pointer;
      ${focusedZindex};
    }
  `,
  ButtonRight: styled('button')`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 30%;
    height: 2.4rem;
    border-radius: 0 4px 4px 0;
    background-color: #f6f6f6;
    text-align: center;
    float: left;
    font-size: 0.875rem;
    border: hidden;
    border-left: 1px solid #cccccc;
    @media (min-width: 768px) and (max-width: 992px) {
      width: 33%;
    }
    &:hover,
    &:focus {
      cursor: pointer;
    }
    ${focusedZindex};
  `,
  Heading: styled('h3')`
    padding-left: 15px;
    font-family: Mallory-Bold;
    font-weight: bold;
    font-size: 14px;
    color: #333333;
    line-height: 1.43;
    letter-spacing: 0.4px;
  `,
  QtyNumberInput: styled('input')`
    display: inline-block;
    width: 100%;
    border: 0;
    height: 2.4em;
    text-align: center;
    &:hover,
    &:focus {
      cursor: pointer;
    }
    &::-webkit-inner-spin-button {
      -webkit-appearance: none;
      -moz-appearance: none;
      appearance: none;
      margin: 0;
    }
  `,
  QtyNumber: styled('span')`
    display: inline-block;
    font-size: 1.1rem;
    width: 40%;
    font-family: Mallory;
    font-size: 16px;
    font-weight: normal;
    font-style: normal;
    font-stretch: normal;
    line-height: 1.25;
    letter-spacing: 0.5px;
    text-align: center;
    color: #333333;
    float: left;
    @media (min-width: 768px) and (max-width: 992px) {
      width: 33%;
    }
  `
};

export const imageStyle = styled.div`
  padding: 4px 8px;
`;

export const QuantityCardContainer = styled.div`
  flex-direction: row;
  margin: 0;
  @media (max-width: 767px) {
    flex-direction: column;
  }
`;

export const QtyNumberInputStyle = css`
  display: inline-block;
  width: 100%;
  border: 0;
  height: 2.3rem;
  text-align: center;
  &:hover,
  &:focus {
    cursor: pointer;
  }
  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    margin: 0;
  }
`;
export const focusedZindex = css`
  position: relative;
  &:focus {
    z-index: 2;
  }
`;
