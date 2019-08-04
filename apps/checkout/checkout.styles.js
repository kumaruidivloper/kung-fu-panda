import styled, { css } from 'react-emotion';
import { sizesMax, sizes } from './../../utils/media';

export const signLinkWrapper = css`
  a::before {
    @media screen and (max-width: ${sizesMax.xsMax}px) {
      content: ' ';
      display: block;
    }
  }
  p {
    padding: 0;
    margin: 0;
    white-space: nowrap;
  }
  a {
    color: #0055A6;
  }
`;

export const heading = css`
  display: inline-block;
  font-size: 2.625rem;
  letter-spacing: 0;
  line-height: 2.625rem;
`;

export const StyledH2 = styled.h2(css`
  text-transform: uppercase;
  font-size: 2rem;
  letter-spacing: 0;
  line-height: 2rem;
`);
export const sectionWrapper = css`
  border-radius: 4px;
  margin-top: 16px;
  background-color: #ffffff;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 2px 2px 0 rgba(0, 0, 0, 0.04), 0 0 2px 0 rgba(0, 0, 0, 0.1);
`;
export const StepProgress = css`
  position: relative;
  list-style: none;
`;
export const stepProgressItem = css`
  position: relative;
  counter-increment: list;
  margin-bottom: 32px;
  &::before {
    display: inline-block;
    content: '';
    position: absolute;
    left: -26px;
    height: calc(100% - 8px);
    margin-top: 32px;
    width: 10px;
    border-left: 2px solid #cccccc;
  }
  &:last-child::before {
    content: '';
    height: 0;
  }
  &::after {
    content: counter(list);
    text-align: center;
    color: #666666;
    display: inline-block;
    position: absolute;
    top: 0;
    font-family: 'Mallory-Book';
    font-size: 16px;
    font-weight: bold;
    text-align: center;
    border-radius: 4px;
    left: -37px;
    width: 24px;
    height: 24px;
    background-color: #ccc;
    line-height: 1.5;
    letter-spacing: 0.5px;
  }
`;

export const stepProgressDone = css`
  margin-bottom: 16px;
  &::before {
    border-left: 2px solid #cccccc;
    border-radius: 1px;
    height: calc(100% - 26px);
  }
`;

export const stepProgressCurrent = css`
  margin-bottom: 16px;
  &::before {
    border-radius: 1px;
    height: calc(100% - 26px);
  }

  &::after {
    color: #fff;
    background-color: #0055a6;
  }
`;

export const stepNotDone = css`
  &::after {
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #fff;
    border: 2px solid #cccccc;
  }
`;

export const errorAlert = css`
  background-color: rgba(224, 0, 0, 0.03);
  border: solid 1px #e30300;
  border-radius: 4px;
`;
export const fontNotVisited = css`
  font-size: 16px;
  font-weight: bold;
  font-style: normal;
  font-stretch: normal;
  line-height: 1.5;
  letter-spacing: 0.5px;
  color: #767676;
  font-family: 'Mallory-Book';
`;
// TODO Make it mobile first
export const breakOut = css`
  @media screen and (max-width: ${sizesMax.smMax}px) {
    margin: 0 calc(50% - 50vw);
    max-width: none;
    width: 100vw;
    flex: 0 0 100vw;
    padding: 0;
    z-index: 99;
  }
`;
// TODO - move this to vendor.css
export const minHeight = css`
  height: calc(100vh - 452px);
  @media screen and (min-width: ${sizes.md}px) {
    height: calc(100vh - 365px);
  }
`;

export const fontIconColor = css`
  color: #0055a6;
`;
