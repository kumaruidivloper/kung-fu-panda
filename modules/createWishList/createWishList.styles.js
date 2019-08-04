import { css } from 'react-emotion';

const fullWidth = css`
  width: 100%;
  @media only screen and (max-width: 576px) {
    width: 95%;
  }
`;
const redColor = css`
  color: #c00000;
`;
const fullDivWidthInput = css`
  width: 100%;
  border-color: #c00000;
`;
const popoverWidth = css`
  .css-1rjorz4 {
    @media only screen and (max-width: 576px) {
      width: 100%;
    }
    display: flex;
    justify-content: center;
  }
`;
const popoverModal = css`
  .css-1ebrjtl {
    width: 90%;
  }
  .css-bn4it8 {
    padding: 0px;
  }
`;

const iconStyle = css`
  position: absolute;
  top: 4px;
  right: 4px;
  float: right;
  font-size: 1rem;
  border: none;
  box-shadow: none;
  background: white;
  outline: none;
  :active {
    outline: none;
    border: none;
    background-color: none;
  }
  :hover {
    background-color: none;
    outline: none;
  }
  :focus {
    background-color: none;
    outline: -webkit-focus-ring-color auto 5px;
  }
`;

const iconStyleSpan = css`
  border: none;
  color: #585858;
`;
const popoverModalWidth = css`
    min-width: 20rem;
    @media only screen and (max-width: 576px){
        min-width: 12.5rem;
    }    
`;
const centeredContent = css`
  text-align: center;
`;

const card = css`
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 2px 2px 0 rgba(0, 0, 0, 0.04), 0 0 2px 0 rgba(0, 0, 0, 0.1);
  padding-top: 1.5rem;
  padding-bottom: 1.5rem;
`;
const marginFix = css`
  > p {
    margin: 0;
  }
`;
const errorWrapper = css`
  border-radius: 4px;
  border: solid 1px #e30300;
  background-color: rgba(224, 0, 0, 0.03);
`;
const WishButton = css`
  padding: 0;
  margin-top: 1.5rem;
`;

export {
  WishButton,
  marginFix,
  errorWrapper,
  fullWidth,
  card,
  popoverWidth,
  popoverModal,
  iconStyle,
  iconStyleSpan,
  fullDivWidthInput,
  redColor,
  popoverModalWidth,
  centeredContent
};
