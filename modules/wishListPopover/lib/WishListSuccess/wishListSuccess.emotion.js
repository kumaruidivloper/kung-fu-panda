import styled, { css } from 'react-emotion';

export const wrapper = css`
  margin: 0;
  padding: 0;
  text-align: center;
`;

export const H6 = styled('h6')`
  color: #333333;
  text-transform: uppercase;
`;

export const Text = styled('div')`
  color: #585858;
`;

export const ImageWrapper = styled('div')`
  height: 130px;
  display: flex;
  align-items: center;
`;

export const Image = styled('img')`
  max-height: 130px;
  max-width: 130px;
  margin-left: auto;
  margin-right: auto;
`;
