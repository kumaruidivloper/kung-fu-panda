import styled, { css } from 'react-emotion';
import { sizesMax, sizes } from './../../../utils/media';

export const overlay = css`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  width: 100%;
  height: 100%;
  overflow: scroll;
  z-index: 1040;
  -webkit-overflow-scrolling: touch;
`;

export const content = css`
  position: relative;
  box-sizing: border-box;
  height: auto;
  background-color: #fff;
  vertical-align: middle;
  border: 1px solid white;
  left: 0;
  right: 0;
  width: 100%;
  max-width: 786px;

  @media (min-width: ${sizes.md}px) {
    left: auto;
    right: auto;
    margin-top: 0;
    margin-bottom: 7%;
    margin-left: auto;
    margin-right: auto;
  }
  @media (max-width: ${sizesMax.xsMax}px) {
    width: 100%;
    left: 0%;
    right: 0%;
    margin: 0;
  }
`;

export const CloseButton = styled('button')`
  position: absolute;
  right: 17px;
  top: 17px;
  height: 22px;
  width: 22px;
  padding: 0;
  border: 0;
  border-color: transparent;
  background-color: white;
  color: #585858;
  line-height: 0;
  cursor: pointer;
`;

export const CloseIcon = styled('span')`
  font-size: 1.33rem;
`;

export const submitButtonStyle = css`
  width: 100%;
  min-height: 50px;
  line-height: normal;

  padding: 0;

  font-size: 0.875rem;

  @media (min-width: ${sizes.md}px) {
    width: auto;
    min-height: 70px;
    line-height: 1rem;

    padding: 1rem 2rem;

    font-size: 1rem;
  }
`;

const font16px = css`
  font-size: 1rem;
  line-height: 1.25rem;
`;

const font42px = css`
  font-size: 2.625rem;
  line-height: 2.625rem;
`;

export const formTitleStyle = css`
  @media (min-width: ${sizes.md}px) {
    ${font42px};
  }
`;

export const formSubTitleStyle = css`
  @media (min-width: ${sizes.md}px) {
    ${font16px};
  }
`;

export const loaderMinHeight = css`
  height: calc(100vh - 452px);
  @media screen and (min-width: 768px) {
    height: calc(100vh - 365px);
  }
`;

export const addressetSuggestionWrapperTweaks = css`
  margin-left: -0.5rem;
  margin-right: -0.5rem;

  @media (min-width: ${sizes.md}px) {
    margin-left: 0;
    margin-right: 0;
  }
`;
