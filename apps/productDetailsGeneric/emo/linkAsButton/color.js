const colorPrimary = '#0055a6';
const colorHover = '#0255cc';
const colorMarineBlue = '#003366';
const colorWhite = '#fff';
const colorLightSteelBlue = '#b2cce4';
const colorGrey = '#585858';
const getPrimaryColor = (props, bgDisabledBtnColor, bgActiveBtnColor) => (props.disabled ? `${bgDisabledBtnColor} !important` : bgActiveBtnColor);
export { colorPrimary, colorHover, colorMarineBlue, colorWhite, colorLightSteelBlue, colorGrey, getPrimaryColor };
