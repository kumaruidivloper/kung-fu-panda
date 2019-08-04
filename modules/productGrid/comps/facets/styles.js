import { css } from 'react-emotion';

export const facetDrawerBackground = css`
  color: #333333;
  border-bottom: 1px solid #e6e6e6;
  & button:active {
    color: #333;
  }
`;

export const filtersLabel = css`
  margin-left: 0.75rem;
`;

export const filterListItem = css`
  list-style: none;
  padding: 0;
  margin: 0px;

  & i.icon-checkbox-inactive,
  i.icon-checkbox-active {
    font-size: 18px;
  }
`;

export const facetsOverlay = css`
  background-color: rgba(0, 0, 0, 0.6);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
`;

export const facetsModal = css`
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: auto;
  position: fixed;
  outline: none;
  transform: translateX(100%);
`;

export const facetsContentWrapper = css`
  border-radius: 0;
  background-color: #fff;
  border: 1px solid #eee;
  position: fixed;
  top: 0;
  bottom: 0;
  right: 0;
  left: 64px;
`;
export const facetsModalAfterOpen = css`
  overflow: hidden;
  transform: translateX(0);
  transition: transform 300ms linear;
  -webkit-transition: transform 300ms linear;
  -moz-transition: transform 300ms linear;
  -o-transition: transform 300ms linear;
`;

export const facetsModalBeforeClose = css`
  transform: translateX(100%);
  transition: transform 300ms linear;
  -webkit-transition: transform 300ms linear;
  -moz-transition: transform 300ms linear;
  -o-transition: transform 300ms linear;
`;
export const facetModalContent = css`
  color: #333333;
  height: calc(100% - 64px);
  width: 100%;
  position: absolute;
  z-index: 1000;
  overflow-y: auto;
  overflow-x: none;
  -webkit-overflow-scrolling: touch;
`;

export const filterIconBlue = css`
  color: #0055a6;
`;

export const filterMinHeight = css`
  min-height: 36px;
`;

export const facetsCTA = css`
  position: absolute;
  bottom: 0;
  background-color: #fff;
  z-index: 1111;
  width: 100%;
  & button {
    min-height: 65px;
    padding: 0;
    width: 50%;
    border: 0;
    border-left: solid 1px #e6e6e6;
    border-top: solid 1px #e6e6e6;
    background-color: #fff;
  }
`;
