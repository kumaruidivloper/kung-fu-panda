import { css } from 'react-emotion';
import { colorPrimary, colorHover, colorWhite, colorLightSteelBlue, colorGrey, getPrimaryColor } from './color';

export const secondaryBtnStyles = props => {
  let borderColor = colorPrimary;
  const bgBtnColor = 'rgba(0, 0, 0, 0)';
  let textColor = getPrimaryColor(props, colorLightSteelBlue, colorPrimary);
  const bgDisabledBtnColor = 'rgba(0, 0, 0, 0)';
  let bgHoverColor = 'rgba(0, 0, 0, 0.1)';
  let hoverBorderColor = colorHover;
  let hoverTextColor = colorHover;
  const bgFocusColor = 'rgba(0, 0, 0, 0)';
  let borderFocusColor = colorPrimary;
  let textActiveColor = colorWhite;
  let bgActiveColor = colorPrimary;
  if (props.btnvariant === 'secondary') {
    borderColor = '#4a4a4a';
    textColor = getPrimaryColor(props, colorGrey, '#333333');
    bgHoverColor = '#f6f6f6';
    hoverBorderColor = '#9b9b9b';
    hoverTextColor = '#9b9b9b';
    borderFocusColor = colorGrey;
    textActiveColor = colorWhite;
    bgActiveColor = colorGrey;
  } else if (props.btnvariant === 'tertiary') {
    borderColor = colorWhite;
    textColor = colorWhite;
    hoverBorderColor = colorWhite;
    hoverTextColor = colorWhite;
    borderFocusColor = colorWhite;
    textActiveColor = colorGrey;
    bgActiveColor = colorWhite;
  }
  return css`
    border: 3px solid ${borderColor};
    background-color: ${bgBtnColor};
    color: ${textColor};
    border-color: ${textColor};
    background-color: ${props.disabled && `${bgDisabledBtnColor} !important`};
    &:hover {
      background-color: ${bgHoverColor};
      border-color: ${hoverBorderColor};
      color: ${hoverTextColor};
    }

    &:focus {
      outline: none;
      background-color: ${bgFocusColor};
    }
    &:focus:before {
      content: '';
      border: 1px dotted ${borderFocusColor};
      border-radius: 35px;
      display: block;
      position: absolute;
      top: -4px;
      right: -4px;
      left: -4px;
      bottom: -4px;
    }
    &:active {
      outline: none;
      border-color: ${bgActiveColor};
      color: ${textActiveColor};
      background-color: ${bgActiveColor};
    }
    &:active:before {
      display: none;
    }
  `;
};
