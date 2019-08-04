import { css } from 'react-emotion';

const desktopLinkStyle = css`
  a {
    color: #333333;
    text-decoration: none;
    text-transform: capitalize;
  }
  a.navActive {
    font-weight: bold;
    color: #0054ac;
    border-left: 3px solid #0556a4;
    overflow: hidden;
  }
`;

const myAccountCard = css`
  background-color: #ffffff;
  box-shadow: 0 0.0625rem 0.3125rem 0 rgba(0, 0, 0, 0.08), 0 0.1875rem 0.25rem 0 rgba(0, 0, 0, 0.04), 0 0.0625rem 0.25rem 0 rgba(0, 0, 0, 0.12);
`;

const rightArrow = css`
  width: 1rem;
  height: 1rem;
  color: #0055a6;
  line-height: unset;
`;

const mobileLinkStyle = css`
  a {
    color: #262626;
    text-decoration: none;
    text-transform: capitalize;
  }
  a.navActive {
    text-decoration-line: none;
    font-weight: bold;
    color: #333333;
  }
`;

const activeOrder = css`
  color: #0055a6;
  font-weight: normal;
`;
const accountPopover = css`
  position: absolute;
  top: 100%;
  left: -100%;
  margin-top: 1rem;
  z-index: 2;
  display: block;
  width: 190px;
  word-wrap: break-word;
  background-color: #fff;
  filter: drop-shadow(0 0 6px rgba(51, 51, 51, 0.4));
`;
const arrow = css`
   {
    width: 0;
    height: 0;
    border-style: solid;
    border-width: 0 10px 10px 10px;
    border-color: transparent transparent rgba(255, 255, 255, 0.9) transparent;
    position: absolute;
    top: -0.6em;
    margin-left: -1.5rem;
    left: 70%;
  }
`;

export { arrow, desktopLinkStyle, myAccountCard, rightArrow, mobileLinkStyle, activeOrder, accountPopover };
