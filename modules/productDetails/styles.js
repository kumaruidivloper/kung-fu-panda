import styled, { css } from 'react-emotion';

const ProductDetailsWrapperStyle = css`
  display: flex;
  flex-wrap: wrap;
  flex-direction: column;
  align-items: flex-start;

  h1 {
    height: auto !important;
  }

  > div:first-child {
    left: 0 !important;
  }
  > div > span {
    font-family: Mallory;
    font-size: 14px;
    font-weight: normal;
    font-style: normal;
    font-stretch: normal;
    line-height: 1.43;
    letter-spacing: normal;
    color: #333333;
  }
`;
const descriptionLinkStyle = css`
  color: #0055a6;
`;
export const StyledModal = css`
  box-sizing: border-box;
  position: absolute;
  overflow-y: scroll;
  top: 10%;
  left: 23%;
  right: 23%;
  width: 54%;
  bottom: 20%;
  color: #000000;
  overflow: auto;
  background-color: #fff;
  @media screen and (max-width: 767px) {
    width: 100%;
    top: 0%;
    left: 0%;
    right: 0%;
    bottom: 0;
  }
`;
export const Overlay = {
  backdrop: css`
    width: 100%;
    max-height: 100%;
    overflow: auto;
    position: fixed;
    top: 0;
    left: 0;
    background-color: rgba(0, 0, 0, 0.4);
    min-height: 100vh;
    z-index: 99;

    @media screen and (max-width: 767px) {
      top: 0;
      z-index: 99;
    }
  `,
  container: css`
    box-sizing: border-box;
    margin: 4rem auto;
    width: 68.9%;
    color: #000000;
    overflow: auto;
    background-color: #fff;
    padding-bottom: 1rem;
    font-family: 'Mallory-Book', 'Helvetica Neue', sans-serif;
    font-style: normal;

    @media screen and (max-width: 767px) {
      width: 100%;
      margin: 0;
      min-height: 100vh;
      height: 100vh;
      position: relative;
    }
  `,
  CloseModal: styled.button`
    background-color: #ffffff;
    margin: 0.2rem 0.5rem 0 0;
    border: none;
    float: right;
    font-size: 1.8rem;
    cursor: pointer;
    @media (max-width: 767px) {
      font-size: 1.5rem;
    }
  `
};
const BVRRSummaryContainer = styled.div(css`
  @media screen and (max-width: 767px) {
    margin-top: 0.5rem;
  }
`);

const BadgeWrapper = styled.div(css`
  position: relative;
  padding-bottom: 1rem;

  div:first-child {
    left: 0;

    @media screen and (max-width: 567px) {
      left: -15px;
    }
  }
`);

const ErrorMessage = styled.div(css`
  color: red;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
`);

const ProductName = styled.h1(css`
  font-family: 'Mallory-Light';
  font-size: 1.75rem;
  font-weight: 300;
  font-style: normal;
  font-stretch: normal;
  line-height: 1.14;
  letter-spacing: 0.5px;
  color: #333333;
  width: 100%;
`);

export { ProductDetailsWrapperStyle, descriptionLinkStyle, BadgeWrapper, ErrorMessage, ProductName, BVRRSummaryContainer };
