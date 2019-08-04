import styled, { css } from 'react-emotion';
import media from '../../utils/media';
import {
  OUTTER_GUTTER_SPACE_XS,
  OUTTER_GUTTER_SPACE_SM,
  OUTTER_GUTTER_SPACE_MD,
  CONTAINER_MAX_WIDTH_XS,
  CONTAINER_MAX_WIDTH_SM,
  CONTAINER_MAX_WIDTH_MD
} from './constants';

const gridSpaces = css`
  @media screen and (min-width: 320px) {
    padding-left: calc(${OUTTER_GUTTER_SPACE_XS} + (100vw - ${CONTAINER_MAX_WIDTH_XS}) / 2);
    padding-right: calc(${OUTTER_GUTTER_SPACE_XS} + (100vw - ${CONTAINER_MAX_WIDTH_XS}) / 2);
  }
  @media screen and (min-width: 524px) {
    padding-left: calc(${OUTTER_GUTTER_SPACE_SM} + (100vw - ${CONTAINER_MAX_WIDTH_SM}) / 2);
    padding-right: calc(${OUTTER_GUTTER_SPACE_SM} + (100vw - ${CONTAINER_MAX_WIDTH_SM}) / 2);
  }
  @media screen and (min-width: 768px) {
    padding-left: calc(${OUTTER_GUTTER_SPACE_MD} + (100vw - ${CONTAINER_MAX_WIDTH_MD}) / 2);
    padding-right: calc(${OUTTER_GUTTER_SPACE_MD} + (100vw - ${CONTAINER_MAX_WIDTH_MD}) / 2);
  }
`;

const mobileStyles = css`
  @media screen and (max-width: 992px) {
    border-bottom: 1px solid #e6e6e6;
    padding: 1.2rem 0.25rem;
    ${gridSpaces};
  }
`;

const footerContainer = css`
  background-color: #585858;

  [class*='header-container'] a {
    margin-bottom: 0.625rem;

    @media screen and (max-width: 992px) {
      margin: 0.75rem 0;
    }
  }

  [class*='detail-link-cont'] a {
    margin-bottom: 1rem;

    @media screen and (max-width: 992px) {
      margin: 0.75rem 0;
    }
  }

  .icon-minus {
    font-size: 79%;
  }
  @media screen and (max-width: 992px) {
    padding-top: 0;
  }
`;
const mobileContainer = css`
  @media screen and (min-width: 992px) {
    display: none;
  }
`;
const desktopContainer = css`
  display: none;
  @media screen and (min-width: 992px) {
    display: block;
  }
`;
const FooterLinks = css`
  flex-flow: column nowrap;
  justify-content: space-evenly;

  &.applyColor * {
    color: #fff;
  }
`;

const FooterAccordian = css`
  div:first-child {
    letter-spacing: 0.5px;
    line-height: 1.5;
  }
`;

const StyledDiv = css`
  background-color: #585858;
  border: none;
  border-bottom: 1px solid #b0b0b0;
  padding: 1.5rem 1rem;
  ${gridSpaces};
`;

const subItems = css`
  @media screen and (max-width: 992px) {
    border-bottom: 1px solid #585858;
    padding: 5px 1rem;
    background-color: #404040;
    ${gridSpaces};
  }
`;

const hrStyles = css`
  border: 0;
  width: 1.875rem;
  height: 2px;
  text-align: left;
  background-color: white;
  margin: 1.2rem 0 0.9375rem;

  @media screen and (max-width: 992px) {
    display: none;
  }
`;

const lineSeparator = css`
  margin: -2px 8px;
  @media screen and (max-width: 992px) {
    margin: -2px 3px;
  }
`;

const headerListContainer = css`
  margin-bottom: 1.875rem;
`;

const containerPadding = css`
  @media screen and (max-width: 992px) {
    padding: 0 1rem;
    ${gridSpaces};
  }
`;

const detailList = css`
  &.detail-link-container {
    > .social-item {
      .academyicon {
        font-size: 1.25rem;
        width: 1.5rem;
        display: inline-block;
      }
      > a {
        padding-left: 1rem;
      }
    }
    ${mobileStyles};
  }

  &.social-link-container {
    margin-bottom: 0.9375rem;
    > .social-item {
      border: 1px solid white;
      border-radius: 50%;
      width: 2rem;
      height: 2rem;
      padding-top: 1px;
      margin-right: 0.5rem;
      > a {
        font-size: 1.85rem;
        img {
          height: 0;
          width: 0;
        }
      }
      a:hover {
        text-decoration: none;
      }
    }
    ${mobileStyles} ${media.lg`
    padding-top: 0.875rem;
    padding-bottom: 0.875rem;
    > .social-item {
      width: 2.25rem;
      height: 2.25rem;
      margin-right: 1rem;
      .social-link {
        margin: auto;
        font-size: 2rem;  
      }
    `};
  }
`;

const mbtm10 = css`
  margin-bottom: 0.625rem;
  line-height: 10px;
`;

const LinkWithIcon = styled('div')`
  display: flex;
  > span {
    margin-right: 1rem;
    font-size: 1.85rem;
    ${media.lg`
      margin-top: auto;
      margin-bottom: auto;
    `};
  }
  > .social-link {
    margin-right: 0;
  }
`;

const legalLinkContainer = css`
  a {
    line-height: normal;
    font-style: normal;
    font-stretch: normal;
    font-weight: 300;
    color: white;
  }
  @media (max-width: 992px) {
    .legal-item {
      margin-top: 0.3125rem;
    }
  }
`;

const searchDexOverride = css`
  a {
    margin-right: 10px;
  }
`;

export {
  footerContainer,
  FooterLinks,
  FooterAccordian,
  hrStyles,
  lineSeparator,
  headerListContainer,
  subItems,
  detailList,
  StyledDiv,
  mbtm10,
  containerPadding,
  legalLinkContainer,
  LinkWithIcon,
  searchDexOverride,
  desktopContainer,
  mobileContainer
};
