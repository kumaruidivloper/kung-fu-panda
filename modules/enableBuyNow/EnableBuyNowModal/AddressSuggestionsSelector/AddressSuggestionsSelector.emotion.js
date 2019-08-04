import { css } from 'react-emotion';
import { sizes } from '../../../../utils/media';

export const iconColor = css`
  color: #00bb11;
  font-size: 3rem;
  align-self: center;
`;

export const textStyle = css`
  line-height: 1.25;
  color: #333333;
  @media (min-width: ${sizes.md}px) {
      font-size: 1rem;
  }
`;

const suggestAddress = css`
  border-radius: 4px;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
  background-color: #ffffff;
  border: solid 2px;
`;

const suggestAddressSelected = css`
  ${suggestAddress};
  border: solid 2px #0055a6;
`;

export const styleSuggestAddress = isSelected => (isSelected ? suggestAddressSelected : suggestAddress);

export const addressStyle = css`
  line-height: 1.25;
  letter-spacing: normal;
  color: #333333;
  &:hover {
    text-decoration: none;
  }
`;

export const modifyAddressStyles = css`
  color: #0055a6;
`;

export const suggestAddressAnchor = css`
  color: #fff;
  &:hover {
    text-decoration: none;
  }
`;

const font32px = css`
  font-size: 2rem;
  line-height: 2rem;
`;

export const formTitle = css`
  font-size: 30px;
  line-height: 30px;

  @media (min-width: ${sizes.md}px) {
    ${font32px};
  }
`;
