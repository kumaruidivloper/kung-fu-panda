import { css } from 'react-emotion';
import { sizes } from './../../utils/media';

export const minHeight = css`
  height: calc(100vh - 452px);
  @media screen and (min-width: ${sizes.md}px) {
    height: calc(100vh - 365px);
  }
`;
