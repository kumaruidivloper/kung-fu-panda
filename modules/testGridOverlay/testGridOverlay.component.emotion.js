import styled, { css } from 'react-emotion';

export const portalWrapper = css`
  position: relative;
  z-index: 99999;
`;

const togglePositioning = css`
  position: fixed;
  z-index: 1002;

  bottom: 10px;
  left: 10px;
`;

export const Toggle = styled('button')`
  ${togglePositioning};
  background-color: #ccc;
  text-align: center;
  font-family: 'MS Reference Sans Serif';
  font-weight: bolder;
  font-size: 12px;
  float: left;
  display: inline-block;
  padding: 25px 25px;
  cursor: pointer;
  user-select: none;

  &:focus {
    outline: none;
  }
`;

const gridWrapperPositioning = css`
  position: fixed;
  z-index: 1001;

  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
`;

export const GridWrapper = styled('div')`
  ${gridWrapperPositioning};
  text-align: center;
  background-color: rgba(255, 255, 255, 0.4);
`;

export const gridContainer = css`
  color: black;
  height: 100vh;
`;

export const gridRow = css`
  color: black;
  height: 100vh;
`;

export const gridCol = css`
  color: black;
  height: 100vh;
  background-color: rgba(255, 0, 0, 0.2);
`;

export const gridColContent = css`
  color: black;
  height: 100vh;
  width: 100%;
  margin: 0;
  background-color: rgba(255, 0, 0, 0.2);
`;
