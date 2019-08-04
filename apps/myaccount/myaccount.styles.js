import styled, { css } from 'react-emotion';

const desktopStyles = css`
  @media screen and (max-width: 576px) {
    margin-left: 0px;
    margin-right: 0px;
    max-width: 100%;
    padding: 0px;
  }
  @media print {
    flex: 0 0 100%;
    max-width: 100%;
  }
`;

const wordWrap = css`
  word-break: break-word;
`;

const shippingAddressWrapper = css`
  border-radius: 4px;
  background-color: #ffffff;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 2px 2px 0 rgba(0, 0, 0, 0.04), 0 0 2px 0 rgba(0, 0, 0, 0.1);
`;
const StepProgress = css`
  position: relative;
  list-style: none;
`;
const stepProgressItem = css`
  position: relative;
  counter-increment: list;
  &:not(:last-child) {
    padding-bottom: 24px;
  }
  &::before {
    display: inline-block;
    content: '';
    position: absolute;
    left: -26px;
    height: 100%;
    width: 10px;
    border-left: 2px solid #cccccc;
  }

  &::after {
    content: counter(list);
    text-align: center;
    color: #9b9b9b;
    display: inline-block;
    position: absolute;
    top: 0;
    font-family: Mallory;
    font-size: 16px;
    border-radius: 4px;
    left: -37px;
    width: 22px;
    height: 22px;
    border: 2px solid #ccc;
    background-color: #fff;
    font-style: normal;
    font-stretch: normal;
    line-height: 1.5;
    letter-spacing: 0.5px;
  }
`;

const stepProgressDone = css`
  &::before {
    border-left: 2px solid #cccccc;
    border-radius: 1px;
  }
  &::after {
    content: counter(list);
    font-size: 16px;
    color: grey;
    text-align: center;
    font-weight: bold;
    border: 2px #9b9b9b;
    background-color: #cccccc;
  }
`;

const stepProgressCurrent = css`
  &::before {
    border-radius: 1px;
  }

  &::after {
    content: counter(list);
    width: 22px;
    height: 22px;
    top: -4px;
    font-size: 16px;
    font-weight: bold;
    text-align: center;
    color: white;
    border: 2px #ffffff;
    background-color: #0055a6;
  }
`;

const outline0 = css`
  outline: none;
`;
const BreadCrumbResponsive = styled.div(css`
  margin-top: 1em;
  color: #585858;
`);

const AnchorStyle = styled.a(css`
  text-decoration: none;
  color: #333333;
`);
const BackIcon = styled.span(css`
  font-size: 0.8em;
  color: #0055a6;
  padding-right: 0.6em;
`);
export { StepProgress, outline0, stepProgressCurrent, stepProgressDone, stepProgressItem, shippingAddressWrapper, desktopStyles, wordWrap, BreadCrumbResponsive, AnchorStyle, BackIcon };
