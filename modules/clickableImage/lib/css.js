import styled, { css } from 'react-emotion';
import media from '../../../utils/media';

export const appendMobileStyles = (cssClass, properties) => css`
  ${cssClass};
  @media (max-width: 767px) {
    ${properties};
  }
`;

export const linkStyles = css`
  &:active,
  &:hover,
  &:focus {
    text-decoration: none;
  }
`;

export const container = css`
  background-color: #f7f7f7;
  border: none;
  margin: 0px;
  text-align: center;
  color: #333;
  ${media.md`
    padding: 0.75rem 0.625rem 3.375rem;
  `};
`;
export const horizontalRule = css`
  margin: 0;
  border: 0.5px solid #ffffff;
  opacity: 0.7;
`;
export const header = css`
  text-align: center;
  text-transform: uppercase;
  margin-top: 0;
  ${media.md`
    font-size: 2rem;
    letter-spacing: 0;
    line-height: 2rem;
  `};
`;

export const Row = styled('div')`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;

  @media (min-width: 864px) and (max-width: 1447px) {
    justify-content: ${props => (props.totalImages.length === 4 ? 'space-between' : 'center')};
  }

  @media (max-width: 767px) {
    display: flex;
    flex-direction: column;
  }
`;

export const item = css`
  flex: 0 0 auto;
  position: relative;
  cursor: pointer;
  margin-top: 5px;
  margin-bottom: 5px;

  @media (max-width: 767px) {
    margin: 0;
  }

  @media (min-width: 768px) {
    border-radius: 4px;

    &:focus,
    &:focus-within {
      outline: 2px solid -webkit-focus-ring-color;
    }

    &:last-child {
      margin-right: 0;
    }
  }
`;

export const itemSize3 = css`
  ${item};

  @media (min-width: 768px) {
    margin-right: 1.875rem;
  }

  @media (min-width: 768px) and (max-width: 991px) {
    width: 180px;
    height: 180px;
  }

  @media (min-width: 992px) {
    width: 240px;
    height: 240px;
  }
`;

export const itemSize4 = css`
  ${item};

  @media (min-width: 768px) {
    width: 238px;
    height: 238px;
    margin-right: 2rem;

    &:last-child {
      margin-right: 2rem;
    }
  }

  @media (min-width: 991px) and (max-width: 1447px) {
    margin-right: 2px !important;

    &:last-child {
      margin-right: 0;
    }
  }
`;

export const itemSize5 = css`
  ${item};

  @media (min-width: 768px) {
    margin-right: 2.25rem;
    width: 180px;
    height: 180px;
  }
`;

export const image = css`
  width: 100%;

  @media (max-width: 767px) {
    display: none;
  }
`;

const labelMobile = css`
  padding-top: 1.5rem;
  padding-bottom: 1.5rem;
`;

const labelDesktop = css`
  padding-top: 1px;
  padding-bottom: 1px;
  margin-bottom: 0.3125rem;
`;

export const label = textColor => css`
  ${labelMobile};
  color: ${textColor && textColor !== '' ? textColor.toLowerCase() : '#ffffff'};
  overflow: hidden;
  text-transform: uppercase;
  font-weight: bold;
  @media (min-width: 768px) {
    ${labelDesktop};
    position: absolute;
    bottom: 10px;
    left: 0;
    right: 0;
  }
`;
