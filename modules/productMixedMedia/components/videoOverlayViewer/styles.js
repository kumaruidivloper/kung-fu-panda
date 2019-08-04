import styled, { css } from 'react-emotion';
import { sizes, sizesMax } from '../../../../utils/media';

const CloseIcon = styled.div(css`
  right: 1em;
  top: 1rem;
  position: absolute;
  text-align: right;
  cursor: pointer;
  color: white;
  z-index: 1;
  cursor: pointer;
  font-size: 2.5rem;
`);

const contentOverrideStyle = css`
  background: none !important;
  padding: 0 !important;
  border: 0;
  box-shadow: none;
  position: relative;

  @media only screen and (min-width: ${sizes.lg}px) {
    width: 940px !important;
  }

  @media only screen and (min-width: ${sizes.md}px) and (max-width: ${sizesMax.mdMax}px) {
    width: 720px !important;
  }

  @media only screen and (min-width: 0px) and (max-width: ${sizesMax.smMax}px) {
    max-height: 100% !important;
    width: 100%;
    min-height: 100vh;

    .s7container {
      height: 100vh !important;
    }
  }
`;

const overlayStyleOverrides = css`
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  display: flex;
  align-items: center;
  margin: 0 auto;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.4);
`;

export { CloseIcon, contentOverrideStyle, overlayStyleOverrides };
