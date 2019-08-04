import { css } from 'react-emotion';
import { sizes } from './../../utils/media';

const backButton = css`
  font-size: 0.75rem;
  color: #0055a6;
  border: none;
  width: auto;
  background: none;
  padding-left: 0;
  cursor: pointer;
  &:hover {
    .wishlistLabel {
      text-decoration: underline;
      color: #0055a6;
    }
  }
`;

const popOverAlign = css`
  .css-fv9k9u {
    -webkit-transform: none;
    -transform: none;
    right: 0;
    left: auto;
    width: 17rem;
  }
  .css-q0t7am {
    margin: 2rem 0px 0px 0px;
    padding: 2rem;
  }
  .css-q0t7am:before,
  .css-q0t7am:after {
    left: 92%;
  }
`;
const Btn = css`
  border: none;
  box-shadow: none;
  background: none;
  outline: none;
  :active {
    outline: none;
    border: none;
    background-color: none;
  }
  :hover {
    background-color: none;
    outline: none;
  }
  :focus {
    background-color: none;
  }
`;

const closeButton = css`
  .academyicon {
    :focus {
      outline: 5px auto -webkit-focus-ring-color;
    }
  }
`;

const priceInCartPadding = css`
  div.product-card > div:nth-child(2) {
    padding-bottom: 24px !important;
    @media screen and (min-width: ${sizes.sm}px) and (max-width: ${sizes.md}px) {
      padding-bottom: 0px !important;
    }
  }
`;

const deletePopover = css`
  > div[direction] > div[direction] {
    max-width: 286px;
    padding: 10px;
    left: auto;
    right: 122px;
    :before {
      bottom: 94%;
      left: 92%;
    }
    :after {
      bottom: 94%;
      left: 92%;
    }
  }
`;
const errorWrapper = css`
  border-radius: 4px;
  border: solid 1px #e30300;
  background-color: rgba(224, 0, 0, 0.03);
`;
const iconSize = css`
  font-size: 1.5rem;
`;

export { errorWrapper, backButton, popOverAlign, Btn, closeButton, deletePopover, priceInCartPadding, iconSize };
