import styled, { css } from 'react-emotion';

export const Wrapper = styled('div')`
  margin: 0;
  padding: 0;
  text-align: left;
`;

export const Title = styled('h6')`
  text-transform: uppercase;
  margin-bottom: 0.75rem !important;
`;

export const Ul = styled('ul')`
  list-style-type: none;
  padding: 0;
  max-height: 200px;
  overflow-x: hidden;
  overflow-y: auto;
`;

const liText = css`
  color: #585858;
`;

export const Li = styled('li')`
  ${liText};
  padding: 5px;
`;

export const liButton = css`
  width: 100%;
  text-align: left;
  cursor: pointer;
  padding-top: 0.75rem !important;
  padding-bottom: 0.75rem !important;
`;

export const colorRed = css`
  color: #c00000;
`;
