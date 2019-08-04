import { css } from 'react-emotion';
import { colorWhite, colorPrimary } from './color';
import { BTN_SIZE_LARGE } from './constants';

export const tertiaryBtnStyles = props => {
  let textColor = colorPrimary;
  let bgBtnColor = colorWhite;
  let hoverTextColor = '#0255cc';
  let borderFocusColor = '#141414';
  let bgActiveColor = '#e6e6e6';
  const btnpadding = props.size === BTN_SIZE_LARGE ? '0 1.5rem' : '0 1rem';
  if (props.btnvariant === 'secondary') {
    textColor = colorWhite;
    bgBtnColor = 'rgba(0, 0, 0, 0)';
    hoverTextColor = colorWhite;
    borderFocusColor = colorWhite;
    bgActiveColor = '#333333';
  }
  return css`
    border: none;
    border-radius: unset;
    color: ${textColor};
    background-color: ${bgBtnColor};
    font-family: 'Mallory-Book';
    font-weight: normal;
    letter-spacing: normal;
    line-height: 1.29;
    outline: none;
    text-decoration: none;
    padding: ${btnpadding};
    min-width: auto;
    text-transform: inherit;
    &:hover {
      color: ${hoverTextColor};
      text-decoration: underline;
    }
    &:focus {
      outline: none;
    }
    &:focus:before {
      content: '';
      border: 1px dotted ${borderFocusColor};
      border-radius: 4px;
      display: block;
      position: absolute;
      top: -4px;
      right: -4px;
      left: -4px;
      bottom: -4px;
    }
    &:active {
      outline: none;
      border-radius: 4px;
      background-color: ${bgActiveColor};
    }
    &:active:before {
      display: none;
    }
  `;
};
