import styled, { css } from 'react-emotion';
import { sizes, sizesMax } from '../../utils/media';

export const Overlay = {
  backdrop: css`
    width: 100%;
    max-height: 100%;
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    background-color: rgba(0, 0, 0, 0.4);
    z-index: 99;
    overflow-y: scroll !important;

    @media screen and (max-width: ${sizesMax.smMax}px) {
      top: 0;
      z-index: 99;
      background-color: #fff;
    }
  `,

  CloseModal: styled.button`
    color: #585858;
    background-color: #ffffff;
    margin: 0.2rem 0.5rem 0 0;
    border: none;
    text-align: right;
    display: block;
    font-size: 1.1rem;
    cursor: pointer;
    @media (max-width: ${sizesMax.smMax}px) {
      font-size: 1rem;
    }
  `
};
export const ModalCloseRow = styled.div`
  display: flex;
  justify-content: space-between;
`;
export const Container = {
  Content: css`
     {
      position: absolute;
      left: 27.5%;
      width: 45%;
      border: 1px solid rgb(204, 204, 204);
      box-sizing: border-box;
      background: rgb(255, 255, 255);
      overflow: none;
      border-radius: 4px;
      outline: none;
      padding: 20px;
      @media only screen and (min-width: ${sizes.md}px) and (max-width: ${sizes.lg}px) {
        left: 50%;
        transform: translateX(-50%);
        width: 75%;
      }
      @media screen and (max-width: ${sizesMax.smMax}px) {
        top: 0;
        left: 0;
        right: 0;
        width: 100% !important;
        max-width: 100% !important;
        height: 100%;
        margin: 0;
        overflow-y: scroll;
        scroll-behavior: smooth;
        -webkit-overflow-scrolling: touch;
      }
    }
  `
};

export const msg = css`
  font-weight: bold;
`;
export const link = css`
  color: #0055a6;
`;

export const setSvg = css`
  margin: 15% 0 0 calc(50% - 57px);

  @media screen and (max-width: ${sizesMax.smMax}px) {
    width: 21.33%;
    margin: 30% 0 0 calc(50% - 40px);
  }
`;

export const set = css`
  margin-top: 4.3%;
  height: 15%;
  font-size: 3.5rem;
  font-family: 'MalloryCond-Black';
  font-weight: 900;
  font-stretch: condensed;
  line-height: 1;
  letter-spacing: 1.3px;
  text-align: center;
  color: #333333;

  @media screen and (max-width: ${sizesMax.smMax}px) {
    margin-top: 0%;
    font-size: 2rem;
    line-height: 1.75;
    letter-spacing: 0.5px;
  }
`;

export const promise = css`
  height: 8.5%;
  margin: 2% 0 25%;
  text-align: center;
  font-family: 'Mallory-Book', 'Helvetica Neue', sans-serif;
  font-size: 1em;
  font-weight: normal;
  font-style: normal;
  font-stretch: normal;
  line-height: 1.25;
  letter-spacing: 0.8px;
  color: #555555;

  @media screen and (max-width: ${sizesMax.smMax}px) {
    margin-top: 0%;
    font-size: 0.875rem;
    line-height: 1.43;
    letter-spacing: 0.7px;
    color: #333333;
  }
`;

export const OtherAmount = {
  Input: styled('input')`
    height: 40px;
    border-radius: 5%;
  `,
  Heading: styled('h3')`
    padding-left: 15px;
    font-family: Mallory-Bold;
    font-weight: bold;
    font-size: 14px;
    color: #333333;
    line-height: 1.43;
    letter-spacing: 0.4px;
  `
};

export const Common = {
  Alert: styled.section`
    width: 100%;
    font-family: 'Mallory-Book', 'Helvetica Neue', sans-serif;
    font-size: 16px;
    color: #d0021b;
    border: solid 1px #e30300;
    position: relative;
    padding: 0.75rem 1.25rem;
    border-radius: 0.25rem;
    text-align: center;
    background: rgba(224, 0, 0, 0.03);
  `
};

export const ModalStyles = {
  Row: styled.div``,
  Name: styled.div``,
  customStylesImg: css`
    @media (max-width: ${sizesMax.smMax}px) {
      width: '30%';
    }
  `,
  customStylesImgContent: css`
    @media(min-width: ${sizesMax.smMax}px) {
      width: '70%',
      margin: '0 auto'
    }
  `,

  customStylesDetails: css`
    @media (max-width: ${sizesMax.smMax}px) {
      width: '70%';
    }
  `,
  justifyContentheight: css`
    justifyContent: 'space-around',
    @media(max-width: ${sizesMax.smMax}px){
      flexDirection: 'column',
      height: '10rem',
      margin: 0,
      padding: '0 !important'
    }
  `,
  H4: styled.h4`
    font-size: 2.5rem;
    margin-bottom: 2rem;
    text-transform: uppercase;
    @media (max-width: ${sizesMax.smMax}px) {
      font-size: 1.75rem;
    }
  `,
  ContinueShoppingIconStyle: css`
    color: #0055a6;
    margin-left: 4px;
    font-size: 0.7rem;
  `,
  CloseModalClick: styled.button`
    background: none;
    border: none;
    outline: none;
    :hover {
      text-decoration: underline;
      background: none;
      border: none;
      outline: none;
    }
    :focus {
      text-decoration: underline;
      background: none;
      border: none;
      outline: none;
    }
  `,
  TextAlign: styled.div`
    text-align: center;
    @media (max-width: ${sizesMax.smMax}px) {
      margin: 1em auto;
    }
  `,
  Price: styled.div`
    font-family: Mallory-Condensed-Black;
    font-size: 2.25rem;
    line-height: 0.67;
    letter-spacing: 0.6px;
    color: #333333;
    font-weight: bold;
    &:before {
      vertical-align: top;
      font-size: 1.2rem;
    }
    small {
      vertical-align: top;
      font-size: 0.4em;
    }
    margin-top: 1rem;
  `,

  Attributes: styled.div`
    text-transform: capitalize;
    > span:first-child {
      font-weight: bold;
    }
  `,
  Divider: styled('div')`
    height: 1px;
    min-height: 1px;
    max-height: 1px;
    background-color: #ccc;
  `
};

export const addToCartHolder = css`
  display: flex;
  justify-content: space-between;
  flex-direction: row;
  outline: none;
  button {
    width: 100%;
  }
  @media (max-width: ${sizesMax.smMax}px) {
    position: fixed;
    z-index: 2;
    bottom: 0;
    left: 0;
    flex-direction: row;
    background-color: white;
    height: auto;
    box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 2px 2px 0 rgba(0, 0, 0, 0.04), 0 0 2px 0 rgba(0, 0, 0, 0.1);
    width: 100%;
    padding: 0.625rem 1rem;
    margin: 0;
    .col-12 {
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
      width: calc(100% - 175px);
      max-width: calc(100% - 175px);
      flex: auto;
      padding-right: 20px;
      > div {
        width: 100%;
      }
    }
    & button {
      max-width: 175px;
    }
  }
`;
export const actionButton = css`
  @media (max-width: ${sizesMax.smMax}px) {
    font-size: 0.75rem;
    min-height: auto;
  }
`;

export const widthAdjust = css`
  @media (max-width: ${sizes.xs}px) {
    padding: 1rem 0.75rem;
  }
  @media (max-width: ${sizesMax.smMax}px) {
    font-size: 0.875rem;
  }
  @media (min-width: ${sizes.md}px) {
    font-size: 0.8125rem;
  }
  @media (min-width: ${sizes.xl}px) {
    font-size: 1rem;
  }
  @media (max-width: ${sizesMax.lgMax}px) {
    min-width: auto !important;
  }
`;

export const flexItem = css`
  flex: auto;
`;
export const BtnAdjustWidth = css`
  margin: 0 auto;
  width: 65%;
  min-height: 1rem;
  @media (max-width: ${sizesMax.smMax}px) {
    width: 100%;
  }
`;

export const bodyOverrides = css`
  @media (max-width: ${sizesMax.smMax}px) {
    margin-bottom: 5.25rem;
  }
`;

export const ViewCartCTA = css`
  cursor: pointer;
  color: #0055a6;
  text-decoration: underline;
`;
