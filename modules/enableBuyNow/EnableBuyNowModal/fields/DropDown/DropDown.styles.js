import { css } from 'react-emotion';

export const label = css`
  width: 100%;
  font-weight: bold;
`;

export const hasError = css`
  button {
    border-color: #c00000 !important;
  }
`;

export const stateDropdown = css`
  ul#customDropdownList li:first-child {
    display: none;
  }
`;
