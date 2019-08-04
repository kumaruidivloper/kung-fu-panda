import { css } from 'emotion';
import media from '../../utils/media';
import { isIpad } from '../../utils/navigator';

const darkGray = '#585858';
const lightGray = '#f6f6f6';

/**
 * CONTAINER
 */
const columnContainerFlexMobile = media.md(`
  display: -webkit-box;
  display: -moz-box;
  display: -ms-flexbox;
  display: -webkit-flex;
  display: flex;
  -webkit-box-direction: normal;
  -moz-box-direction: normal;
  -webkit-box-orient: vertical;
  -moz-box-orient: vertical;
  -webkit-flex-direction: column;
  -ms-flex-direction: column;
  flex-direction: column;
  -webkit-flex-wrap: nowrap;
  -ms-flex-wrap: nowrap;
  flex-wrap: nowrap;
  -webkit-box-pack: start;
  -moz-box-pack: start;
  -webkit-justify-content: flex-start;
  -ms-flex-pack: start;
  justify-content: flex-start;
  -webkit-align-content: stretch;
  -ms-flex-line-pack: stretch;
  align-content: stretch;
  -webkit-box-align: stretch;
  -moz-box-align: stretch;
  -webkit-align-items: stretch;
  -ms-flex-align: stretch;
  align-items: stretch;
`);

const columnContainerFlexDesktop = css`
  display: -moz-box;
  display: -ms-flexbox;
  display: -webkit-flex;
  display: flex;
  -webkit-box-direction: normal;
  -moz-box-direction: normal;
  -webkit-box-orient: horizontal;
  -moz-box-orient: horizontal;
  -webkit-flex-direction: row;
  -ms-flex-direction: row;
  flex-direction: row;
  -webkit-flex-wrap: nowrap;
  -ms-flex-wrap: nowrap;
  flex-wrap: nowrap;
  -webkit-box-pack: start;
  -moz-box-pack: start;
  -webkit-justify-content: flex-start;
  -ms-flex-pack: start;
  justify-content: flex-start;
  -webkit-align-content: stretch;
  -ms-flex-line-pack: stretch;
  align-content: stretch;
  -webkit-box-align: stretch;
  -moz-box-align: stretch;
  -webkit-align-items: stretch;
  -ms-flex-align: stretch;
  align-items: stretch;
`;

const columnContainerMarginsDesktop = css`
  margin-left: 7.8125vw;
  margin-right: 7.8125vw;
`;

const columnContainerMarginsMobile = media.sm(`
  margin-left: 0;
  margin-right: 0;
`);

const columnContainerMarginsMobileTablet = media.md(`
  margin-left: 0;
  margin-right: 0;
`);

export const columnContainer = css`
  ${columnContainerFlexDesktop};
  ${columnContainerFlexMobile};
  ${columnContainerMarginsDesktop};
  ${columnContainerMarginsMobileTablet};
  ${columnContainerMarginsMobile};

  @media (min-width: 1280px) {
    max-width: 1080px;
    margin-left: auto;
    margin-right: auto;
  }
`;

/**
 * COLUMN
 */

const column = {
  flex: css`
    -webkit-order: 0;
    -ms-flex-order: 0;
    order: 0;
    -webkit-flex: 1 0 auto;
    -ms-flex: 1 0 auto;
    flex: 1 0 auto;
    -webkit-align-self: auto;
    -ms-flex-item-align: auto;
    align-self: auto;
  `,
  actionWrapper: css`
    display: -webkit-box;
    display: -moz-box;
    display: -ms-flexbox;
    display: -webkit-flex;
    display: flex;
    -webkit-box-direction: normal;
    -moz-box-direction: normal;
    -webkit-box-orient: horizontal;
    -moz-box-orient: horizontal;
    -webkit-flex-direction: row;
    -ms-flex-direction: row;
    flex-direction: row;
    -webkit-flex-wrap: nowrap;
    -ms-flex-wrap: nowrap;
    flex-wrap: nowrap;
    -webkit-box-pack: center;
    -moz-box-pack: center;
    -webkit-justify-content: center;
    -ms-flex-pack: center;
    justify-content: center;
    -webkit-align-content: center;
    -ms-flex-line-pack: center;
    align-content: center;
    -webkit-box-align: center;
    -moz-box-align: center;
    -webkit-align-items: center;
    -ms-flex-align: center;
    align-items: center;
  `,
  desktop: {
    widthHeight: css`
      width: 42.1875vw;
      min-height: 42.1875vw;
    `
  },
  mobile: {
    image: {
      widthHeight: media.sm(`
        width: 100vw;
        min-height: 100vw;`)
    },
    actions: {
      widthHeight: media.md(`
        width: 100vw;
        min-height: 50vw;`)
    }
  },
  tablet: {
    image: {
      widthHeight: media.md(`
        width: 100vw;
        min-height: 100vw;`)
    }
  }
};

export const columnImage = css`
  ${column.desktop.widthHeight};
  ${column.tablet.image.widthHeight};
  ${column.mobile.image.widthHeight};

  @media (min-width: 1280px) {
    width: 540px;
    min-width: 540px;
    max-width: 540px;
    height: 540px;
    min-height: 540px;
    max-height: 540px;
  }
`;

export const columnActionsDefault = css`
  ${column.flex};
  ${column.desktop.widthHeight};
  ${column.mobile.actions.widthHeight};
  ${column.actionWrapper};
  background-color: ${lightGray};
  color: ${darkGray};

  @media (min-width: 1280px) {
    width: 540px;
    min-width: 540px;
    max-width: 540px;
    height: 540px;
    min-height: 540px;
    max-height: 540px;
  }
`;

export const columnActionsWhiteTheme = css`
  ${columnActionsDefault};
`;

export const columnActionsGrayTheme = css`
  ${columnActionsDefault};
  background-color: ${darkGray};
  color: ${lightGray};
`;

export const backgroundImageBase = css`
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
`;

const contentFlex = css`
  -webkit-order: 0;
  -ms-flex-order: 0;
  order: 0;
  -webkit-flex: 1 1 auto;
  -ms-flex: 1 1 auto;
  flex: 1 1 50%;
  -webkit-align-self: auto;
  -ms-flex-item-align: auto;
  align-self: auto;
`;

export const content = css`
  ${contentFlex};
  padding: 40px;
`;

export const headerText = css`
  text-align: center;
  text-transform: uppercase;
`;

export const subHeaderText = css`
  text-align: center;
`;

const buttonContainerFlex = css`
  display: -webkit-box;
  display: -moz-box;
  display: -ms-flexbox;
  display: -webkit-flex;
  display: flex;
  -webkit-box-direction: normal;
  -moz-box-direction: normal;
  -webkit-box-orient: horizontal;
  -moz-box-orient: horizontal;
  -webkit-flex-direction: row;
  -ms-flex-direction: row;
  flex-direction: row;
  -webkit-flex-wrap: wrap;
  -ms-flex-wrap: wrap;
  flex-wrap: wrap;
  -webkit-box-pack: start;
  -moz-box-pack: start;
  -webkit-justify-content: flex-start;
  -ms-flex-pack: start;
  justify-content: flex-start;
  -webkit-align-content: stretch;
  -ms-flex-line-pack: stretch;
  align-content: stretch;
  -webkit-box-align: start;
  -moz-box-align: start;
  -webkit-align-items: flex-start;
  -ms-flex-align: start;
  align-items: flex-start;
`;

export const buttonContainer = css`
  ${buttonContainerFlex};
  margin-top: 20px;
`;

const buttonWrapperFlex = css`
  -webkit-order: 0;
  -ms-flex-order: 0;
  order: 0;
  -webkit-flex: 1 0 auto;
  -ms-flex: 1 0 auto;
  flex: 1 0 auto;
  -webkit-align-self: auto;
  -ms-flex-item-align: auto;
  align-self: auto;
`;
/* Added to override flex-basis issue on safari browsers
* More Info: https://bugs.webkit.org/show_bug.cgi?id=136041#c2
* https://stackoverflow.com/questions/29986668/flex-wrap-not-working-as-expected-in-safari?noredirect=1&lq=1
*/
const safariOverrides = css`
  @media only screen and (max-device-width: 768px) and (orientation: portrait) {
    -webkit-flex: 1 0 50%;
    -ms-flex: 1 0 50%;
    flex: 1 0 50%;
  }

  @media only screen and (min-device-width: 768px) and (max-device-width: 1024px) and (orientation: landscape) {
    -webkit-flex: 1 0 100%;
    -ms-flex: 1 0 100%;
    flex: 1 0 100%;
  }
`;

export const buttonWrapper = css`
  ${buttonWrapperFlex};
  ${isIpad() && safariOverrides};
  min-width: 50%;
  padding: 10px;
`;

export const buttonDefault = css`
  width: 100%;
  font-family: Mallory-Bold;
  color: ${darkGray};
  border: 3px solid ${darkGray};
  background-color: transparent;
  cursor: pointer;

  &:hover {
    color: ${lightGray};
    background-color: ${darkGray};
    border: 3px solid ${darkGray};
  }

  &:focus {
    color: ${lightGray};
    background-color: ${darkGray};
    border: 3px solid ${darkGray};
  }
`;

export const buttonWhiteTheme = css`
  ${buttonDefault};
`;

export const buttonGrayTheme = css`
  ${buttonDefault};
  color: ${lightGray};
  border: 3px solid ${lightGray};

  &:hover {
    color: ${darkGray};
    background-color: ${lightGray};
    border: 3px solid ${lightGray};
  }

  &:focus {
    color: ${darkGray};
    background-color: ${lightGray};
    border: 3px solid ${darkGray};
  }
`;

export const buttonOverrides = css`
  padding: 13px 12px;
`;
