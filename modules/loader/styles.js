import { css } from 'react-emotion';

export const spinnerWrapper = css`
  position: relative;
  margin: 0 auto;
  background: rgba(255, 255, 255, 0 );
  z-index: 9999;
  top: 0;
  left: 0;
`;
export const spinnerOverlay = css`
  width: 100%;
  height: 100vh !important;
  position: fixed;
  margin: 0 auto;
  background: rgba(255, 255, 255, 0.4 );
`;
export const spinner = css`
    position: absolute;
    width: 48px;
    height: 48px;
    background: #FFF;
    box-shadow: 0 14px 36px 8px rgba(0, 0, 0, 0.06), 0 12px 32px 6px rgba(0, 0, 0, 0.04), 0 5px 12px 0 rgba(0, 0, 0, 0.06);
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    border-radius: 50%;
    display:flex; 
    justify-content: center;
    .spinner{
      align-self: center;
    }
`;

export const spinnerSize = css`
  width: 24px;
  height: 24px;
`;
