import { css } from 'react-emotion';

const boxBlock = css`
  border-radius: 4px;
  background-color: #ffffff;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 2px 2px 0 rgba(0, 0, 0, 0.04), 0 0 2px 0 rgba(0, 0, 0, 0.1);
`;

const setDefaultBtn = css`
  button {
    float: none;
    @media screen and (min-width: 768px) {
      float: right;
    }
  }
`;

const bgNone = css`
  background-color: #fff;
  border: none;
  outline: none;
  cursor: pointer;
  display: inline-flex;
  :active {
    outline: none;
    border: none;
    background-color: none;
}
:hover {
    color: #0055a6;
    background-color: none;
    outline: none;
    .linkStyle {
      text-decoration: underline;
    }
}
:focus {
    background-color: none;
    outline: -webkit-focus-ring-color auto 5px;
}
`;
const defaultBanner = css`
  background-color: #0055a6;
`;
const iconColor = css`
  color: #0055a6;
`;
const buttonHover = css`
white-space: nowrap;
&:focus {
  outline: -webkit-focus-ring-color auto 5px;
}
`;

export { boxBlock, bgNone, defaultBanner, iconColor, buttonHover, setDefaultBtn };

