import styled, { css } from 'react-emotion';
import { sizesMax } from '../../utils/media';

const swatchStyle = ({ selected, sellable, boxSize }) => {
  let base = `
    padding: 0.5rem 1rem;
    box-shadow: 1px 0 0 0 #ccc, 0 1px 0 0 #ccc, 1px 1px 0 0 #ccc, 1px 0 0 0 #ccc inset, 0 1px 0 0 #ccc inset;
    cursor: pointer;
    height: 3.75rem;
    text-align: center;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    border: none;
    background: none;
    word-break: break-word;
    position: relative;

    img {
      max-height: 2.3rem !important;
      text-indent: -999999px;
    }

    :hover {
      border: 1px solid #ccc;
      outline: none;
    }

    :focus {
      outline: none;
    }
  `;

  if (selected) {
    base = `${base}
      box-shadow: 0px 1px 0px 0px #0055a6, 1px 0px 0px 0px #0055a6, 1px 1px 0px 0px #0055a6;
      border-top: 3px solid #0055a6 !important;
      border-right: 2px solid #0055a6 !important;
      border-bottom: 2px solid #0055a6 !important;
      border-left: 3px solid #0055a6 !important;
      z-index: 1;
    `;
  }

  if (boxSize) {
    const boxSizeInRem = `${0.0625 * boxSize}rem`;
    const paddingInRem = `${0.0625 * (boxSize / 8)}rem`;
    base = `${base}
      width: ${boxSizeInRem} !important;
      height: ${boxSizeInRem} !important;
      padding: ${paddingInRem} !important;
    `;
  }

  if (!sellable) {
    base = `${base}
    :after {
      content: '';
      position: absolute;
      right:0;
      left:0;
      bottom:0;
      width: 100%;
      height: 100%;
      top: 0;
      background: rgba(230, 230, 230, 0.67);
      z-index: 0;
    }
  `;
  }
  return css`
    ${base};
  `;
};

const flexDirection = inline =>
  css`
    flex-direction: ${inline ? 'column' : 'row'};
  `;

export const StyledButton = css`
  :focus {
    outline: 5px auto -webkit-focus-ring-color;
  }
`;

export const textAttributeStyle = css`
  padding: 0.75rem 1rem;
  min-height: 3.75rem !important;
  height: auto !important;

  span {
    line-height: 1.125rem;
  }

  @media (max-width: ${sizesMax.smMax}) {
    padding: 0.75rem;
  }
`;

export const Image = styled.img`
  z-index: 2;
`;

export const ItemText = styled.span`
  z-index: 4;
`;

export { swatchStyle, flexDirection };
