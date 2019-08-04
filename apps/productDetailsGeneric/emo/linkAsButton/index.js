import { css } from 'react-emotion';
import { BTN_SIZE_XSMALL, BTN_SIZE_SMALL, BTN_SIZE_MEDIUM, BTN_SIZE_LARGE } from './constants';
import { primaryBtnStyle } from './primaryBtn';
import { secondaryBtnStyles } from './secondaryBtn';
import { tertiaryBtnStyles } from './tertiaryBtn';

const getCursorStyle = props => (props.disabled ? 'not-allowed !important' : 'pointer');

const commonBtnStyle = props => css`
  position: relative;
  border-radius: 2.1875rem;
  font-family: 'Mallory-Bold';
  font-weight: bold;
  text-transform: uppercase;
  outline: none;
  cursor: ${getCursorStyle(props)};
  &:disabled {
    opacity: 0.5;
  }
`;

const buildLargeSizeStyles = props => ({
  minWidth: '180px',
  fontSize: '1rem',
  letterSpacing: '0.5px',
  lineHeight: '1.375rem',
  minHeight: props.btntype === 'tertiary' ? 'auto' : '4.375rem',
  padding: props.btntype === 'primary' ? '1rem 2rem' : '0.75rem 2rem'
});

const buildMediumSizeStyles = props => ({
  ...buildLargeSizeStyles(props),
  minWidth: '150px',
  minHeight: props.btntype === 'tertiary' ? 'auto' : '3.75rem'
});

const buildSmallSizeStyles = props => ({
  ...buildLargeSizeStyles(props),
  minWidth: '120px',
  fontSize: '0.875rem',
  letterSpacing: '0.4px',
  lineHeight: '1.125rem',
  minHeight: props.btntype === 'tertiary' ? 'auto' : '3.125rem',
  padding: props.btntype === 'primary' ? '1rem 1.5rem' : '0.75rem 1.5rem'
});

const buildXSmallSizeStyles = props => ({
  ...buildLargeSizeStyles(props),
  minWidth: '120px',
  fontSize: '0.75rem',
  letterSpacing: '0.3px',
  lineHeight: '1rem',
  minHeight: props.btntype === 'tertiary' ? 'auto' : '2.5rem',
  padding: props.btntype === 'primary' ? '1rem 1.5rem' : '0.75rem 1.5rem'
});

const sizeStyles = props => {
  let sizes;
  switch (props.size) {
    case BTN_SIZE_MEDIUM:
      sizes = buildMediumSizeStyles(props);
      break;

    case BTN_SIZE_SMALL:
      sizes = buildSmallSizeStyles(props);
      break;

    case BTN_SIZE_XSMALL:
      sizes = buildXSmallSizeStyles(props);
      break;

    default:
      sizes = buildLargeSizeStyles(props);
      break;
  }
  return css`
    min-width: ${sizes.minWidth};
    font-size: ${sizes.fontSize};
    letter-spacing: ${sizes.letterSpacing};
    line-height: ${sizes.lineHeight};
    min-height: ${sizes.minHeight};
    padding: ${sizes.padding};
  `;
};

const getTypeStyles = props => {
  switch (props.btntype) {
    case 'secondary':
      return secondaryBtnStyles(props);
    case 'tertiary':
      return tertiaryBtnStyles(props);
    default:
      return primaryBtnStyle(props);
  }
};

const getLinkOverrides = props => {
  if (!props.isLink) {
    return '';
  }

  switch (props.size) {
    case BTN_SIZE_MEDIUM:
      return css`
        line-height: 1.75rem;
      `;

    case BTN_SIZE_SMALL:
      return '';

    case BTN_SIZE_XSMALL:
      return '';

    default:
      return '';
  }
};

export const getLinkAsButtonStyle = props => css`
  ${commonBtnStyle(props)};
  ${sizeStyles(props)};
  ${getTypeStyles(props)};
  ${getLinkOverrides(props)};
`;

export const getLinkAsButtonStyleForModal = (props = {}) => {
  const newProps = { ...props, size: BTN_SIZE_LARGE };

  let secondaryHover = '';
  if (props.btntype === 'secondary') {
    secondaryHover = `
      :hover {
        background-color: rgba(2, 85, 204, 0.1);
      }
    `;
  }
  return css`
    ${getLinkAsButtonStyle(newProps)};
    min-height: auto;
    font-size: 0.875rem;
    line-height: 1.125rem;

    ${secondaryHover};
  `;
};
