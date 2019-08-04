import { css } from 'react-emotion';

const meterYellow = css`
  background-color: #ffc400;
  height: 8px;
  border-radius: 10px;
`;
const tooltipStyle = css`
margin: 0;
padding: 0;
background: transparent;
color: #333;
border: none;
`;
const meterGreen = css`
  background-color: #1eaa1e;
  height: 8px;
  border-radius: 10px;
`;
const meterRed = css`
  background-color: red;
  height: 8px;
  border-radius: 10px;
`;
const meterBackground = css`
  background-color: #f2f2f2;
  border-radius: 10px;
  height: 8px;
`;

const tranlateFuntion = y => css`
  transform: translateY(${y}%);
`;

const insideMeter = css`
  // height: 8px;
  // border-radius: 10px;
`;

const labelError = css`
  color: red;
`;
const labelGreen = css`
  color: green;
`;
export { tooltipStyle, meterYellow, meterGreen, meterBackground, tranlateFuntion, insideMeter, labelError, labelGreen, meterRed };
