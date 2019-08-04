import { css } from 'react-emotion';
const select = css`
  min-width: 12.75rem;
  background-color: #fff;
  padding: 5px 16px;
  border-radius: 4px;
  border: 1px solid #d8d8d8;
  color: #333;
`;
const SortByDiv = css`
  color: #4c4c4c;
`;
const custom = css`
  padding-left: 16px;
  cursor: pointer;
  user-select: none;
  list-style-type: none;
  &:hover {
    background-color: #0055a6;
    color: #fff;
  }
  &:focus {
    background-color: #0055a6;
    color: #fff;
  }
`;
const mobileDropdown = css`
  outline: none;
  width: 100%;
  background: transparent;
  appearance: none;
  -moz-appearance: none;
  -ms-progress-appearance: none;
  -webkit-appearance: none;
  ::-ms-expand {
    display: none; /* hide the default arrow in ie10 and ie11 */
  }
  -webkit-scrollbar {
    width: 0 !important;
  }
  > option {
    font-family: 'Mallory-Book';
    font-size: 10px;
  }
`;
const mobileDropdownSelect = css`
  position: relative;
  padding: 3px 0px 3px 10px;
  border: 1px solid rgba(0, 0, 0, 0.3);
  border-radius: 4px;
  > select {
    border: none;
  }

  & > i {
    color: #585858;
    vertical-align: middle;
  }
`;

const mobileDropdownIcon = css`
  z-index: -100;
  position: absolute;
  top: 5px;
  right: 5px;
`;

/* css styles are wrapped inside emotion class */

const desktopDropdownSelect = css`
  .Select {
    position: relative;
  }

  .Select-value {
    background-color: #ffffff !important;
  }

  .Select input::-webkit-contacts-auto-fill-button,
  .Select input::-webkit-credentials-auto-fill-button {
    display: none !important;
  }

  .Select input::-ms-clear {
    display: none !important;
  }

  .Select input::-ms-reveal {
    display: none !important;
  }

  .Select,
  .Select div,
  .Select input,
  .Select span {
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
  }

  .Select.is-disabled .Select-arrow-zone {
    cursor: default;
    pointer-events: none;
    opacity: 0.5;
  }

  .Select.is-disabled > .Select-control {
    background-color: #f9f9f9;
  }

  .Select.is-disabled > .Select-control:hover {
    box-shadow: none;
  }

  .Select.is-open > .Select-control {
    border-radius: 5px;
    background-color: #ffffff;
    box-shadow: 0 4px 12px 0 rgba(0, 0, 0, 0.08), 0 4px 8px 0 rgba(0, 0, 0, 0.04), 0 1px 5px 0 rgba(0, 0, 0, 0.12);
    border-bottom-right-radius: 0;
    border-bottom-left-radius: 0;
  }

  /*after click*/
  .Select.is-open > .Select-control .Select-arrow {
    transform: rotate(-315deg);
    width: 12px;
    height: 12px;
    margin-top: 12px;
    margin-left: 12px;
    border: none;
    border-left: solid 2px #585858;
    border-top: solid 2px #585858;
    display: inline-block;
    position: relative;
  }

  .Select.is-focused > .Select-control {
    background: #fff;
  }

  .Select.is-focused:not(.is-open) > .Select-control {
    background: #fff;
  }

  .Select.has-value.is-clearable.Select--single > .Select-control .Select-value {
    padding-right: 42px;
  }

  .Select.has-value.Select--single > .Select-control .Select-value .Select-value-label,
  .Select.has-value.is-pseudo-focused.Select--single > .Select-control .Select-value .Select-value-label {
    color: #333;
  }

  .Select.has-value.Select--single > .Select-control .Select-value a.Select-value-label,
  .Select.has-value.is-pseudo-focused.Select--single > .Select-control .Select-value a.Select-value-label {
    cursor: pointer;
    text-decoration: none;
  }

  .Select.has-value.Select--single > .Select-control .Select-value a.Select-value-label:hover,
  .Select.has-value.is-pseudo-focused.Select--single > .Select-control .Select-value a.Select-value-label:hover,
  .Select.has-value.Select--single > .Select-control .Select-value a.Select-value-label:focus,
  .Select.has-value.is-pseudo-focused.Select--single > .Select-control .Select-value a.Select-value-label:focus {
    outline: none;
    text-decoration: underline;
  }

  .Select.has-value.Select--single > .Select-control .Select-value a.Select-value-label:focus,
  .Select.has-value.is-pseudo-focused.Select--single > .Select-control .Select-value a.Select-value-label:focus {
    background: #fff;
  }

  .Select.has-value.is-pseudo-focused .Select-input {
    opacity: 0;
  }

  .Select.is-open .Select-arrow,
  .Select .Select-arrow-zone:hover > .Select-arrow {
    border-top-color: #666;
  }

  .Select.Select--rtl {
    direction: rtl;
    text-align: right;
  }

  .Select-control {
    background-color: #fff;
    border-radius: 4px;
    border: 1px solid #d8d8d8;
    color: #333333;
    cursor: pointer;
    display: table;
    border-spacing: 0;
    border-collapse: separate;
    height: 36px;
    outline: none;
    overflow: hidden;
    position: relative;
    width: 100%;
  }

  .Select-control:hover {
    border: 1px solid #585858;
  }

  .Select-control .Select-input:focus {
    outline: none;
    background: #fff;
  }

  .Select-placeholder,
  .Select--single > .Select-control .Select-value {
    bottom: 0;
    color: #aaa;
    left: 0;
    line-height: 34px;
    padding-left: 10px;
    padding-right: 10px;
    position: absolute;
    right: 0;
    top: 0;
    max-width: 100%;
    white-space: nowrap;
  }

  .Select-input {
    height: 34px;
    padding-left: 10px;
    padding-right: 10px;
    vertical-align: middle;
  }

  .Select-input > input {
    width: 100%;
    background: none transparent;
    border: 0 none;
    box-shadow: none;
    cursor: default;
    display: inline-block;
    font-family: inherit;
    font-size: inherit;
    margin: 0;
    outline: none;
    line-height: 17px;
    /* For IE 8 compatibility */
    padding: 8px 0 12px;
    /* For IE 8 compatibility */
    appearance: none;
    -webkit-appearance: none;
    -moz-appearance: none;
    -ms-progress-appearance: none;
  }

  .is-focused .Select-input > input {
    cursor: pointer;
  }

  .has-value.is-pseudo-focused .Select-input {
    opacity: 0;
  }

  .Select-loading-zone {
    cursor: pointer;
    display: table-cell;
    position: relative;
    text-align: center;
    vertical-align: middle;
    width: 16px;
  }

  .Select-loading {
    -webkit-animation: Select-animation-spin 400ms infinite linear;
    -o-animation: Select-animation-spin 400ms infinite linear;
    animation: Select-animation-spin 400ms infinite linear;
    width: 16px;
    height: 16px;
    box-sizing: border-box;
    border-radius: 50%;
    border: 2px solid #ccc;
    border-right-color: #333;
    display: inline-block;
    position: relative;
    vertical-align: middle;
  }

  .Select-clear-zone {
    -webkit-animation: Select-animation-fadeIn 200ms;
    -o-animation: Select-animation-fadeIn 200ms;
    animation: Select-animation-fadeIn 200ms;
    color: #999;
    cursor: pointer;
    display: table-cell;
    position: relative;
    text-align: center;
    vertical-align: middle;
    width: 17px;
  }

  .Select-clear-zone:hover {
    color: #d0021b;
  }

  .Select-clear {
    display: none;
    font-size: 18px;
    line-height: 1;
  }

  .Select-arrow-zone {
    cursor: pointer;
    display: table-cell;
    position: relative;
    text-align: center;
    vertical-align: middle;
    width: 25px;
    padding-right: 5px;
  }

  .Select--rtl .Select-arrow-zone {
    padding-right: 0;
    padding-left: 5px;
  }

  /*classes for arrow*/
  .Select-arrow {
    transform: rotate(-315deg);
    width: 10px;
    height: 10px;
    margin-bottom: 3px;
    margin-right: 3px;
    border-right: solid 2px #585858;
    border-bottom: solid 2px #585858;
    display: inline-block;
    position: relative;
  }

  .Select-control > *:last-child {
    padding-right: 10px;
  }

  .Select .Select-aria-only {
    position: absolute;
    display: inline-block;
    height: 1px;
    width: 1px;
    margin: -1px;
    clip: rect(0, 0, 0, 0);
    overflow: hidden;
    float: left;
  }

  @-webkit-keyframes Select-animation-fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  @keyframes Select-animation-fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  .Select-menu-outer {
    border-radius: 5px;
    background-color: #ffffff;
    box-shadow: 0 4px 12px 0 rgba(0, 0, 0, 0.08), 0 4px 8px 0 rgba(0, 0, 0, 0.04), 0 1px 5px 0 rgba(0, 0, 0, 0.12);
    border: 1px solid #ccc;
    border-top-color: #e6e6e6;
    box-shadow: 0 1px 0 rgba(0, 0, 0, 0.06);
    box-sizing: border-box;
    margin-top: 4px;
    position: absolute;
    left: 0;
    top: 100%;
    width: 100%;
    z-index: 1;
  }

  .Select-option {
    box-sizing: border-box;
    background-color: #fff;
    color: #585858;
    cursor: pointer;
    display: block;
    padding: 8px 10px;
  }

  .Select-option:last-child {
    border-bottom-right-radius: 4px;
    border-bottom-left-radius: 4px;
  }

  .Select-option.is-selected {
    background-color: rgba(2, 85, 204, 0.2);
    color: #333333;
  }

  .Select-option.is-focused,
  .Select-option.is-hover {
    background-color: #0055a6;
    color: #fff;
  }

  .Select-option.is-disabled {
    background-color: #f6f6f6;
    color: #cccccc;
    cursor: default;
  }

  .Select-noresults {
    box-sizing: border-box;
    color: #999999;
    cursor: default;
    display: block;
    padding: 8px 10px;
  }

  @keyframes Select-animation-spin {
    to {
      transform: rotate(1turn);
    }
  }

  @-webkit-keyframes Select-animation-spin {
    to {
      -webkit-transform: rotate(1turn);
    }
  }
`;
export { select, custom, mobileDropdown, mobileDropdownSelect, mobileDropdownIcon, desktopDropdownSelect, SortByDiv };
