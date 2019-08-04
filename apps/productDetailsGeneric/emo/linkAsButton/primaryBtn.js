import { css } from 'react-emotion';
import { colorPrimary, colorHover, colorMarineBlue, colorWhite, colorLightSteelBlue, colorGrey, getPrimaryColor } from './color';

export const primaryBtnStyle = props => {
  let textColor = colorWhite;
  let bgBtnColor = getPrimaryColor(props, colorLightSteelBlue, colorPrimary);
  let bgHoverColor = colorHover;
  let bgFocusColor = colorPrimary;
  let borderFocusColor = colorPrimary;
  let bgActiveColor = colorMarineBlue;
  if (props.btnvariant === 'secondary') {
    bgBtnColor = getPrimaryColor(props, '#cccccc', colorGrey);
    bgHoverColor = '#7f7f7f';
    bgFocusColor = colorGrey;
    borderFocusColor = '#080808';
    bgActiveColor = '#262626';
  } else if (props.btnvariant === 'tertiary') {
    textColor = colorGrey;
    bgBtnColor = getPrimaryColor(props, '#d8d8d8', colorWhite);
    bgHoverColor = '#f2f2f2';
    bgFocusColor = colorWhite;
    borderFocusColor = colorWhite;
    bgActiveColor = '#e8e8e8';
  }
  return css`
    border: none;
    color: ${textColor};
    background-color: ${bgBtnColor};
    &:hover {
      color: ${textColor};
      background-color: ${bgHoverColor};
    }
    &:focus {
      outline: none;
      background-color: ${bgFocusColor};
    }
    &:focus:before {
      content: '';
      border: 1px dotted ${borderFocusColor};
      border-radius: 37px;
      display: block;
      position: absolute;
      top: -4px;
      right: -4px;
      left: -4px;
      bottom: -4px;
    }
    &:active {
      outline: none;
      background-color: ${bgActiveColor};
    }
    &:active:before {
      display: none;
    }
  `;
};
