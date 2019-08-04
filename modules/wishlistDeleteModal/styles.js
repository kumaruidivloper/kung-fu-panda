import { css } from 'react-emotion';

const header = css`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const shareWishlistButton = css`
  height: 3.75rem;
  width: 25rem;
`;

const Btn = css`
  border: none;
  box-shadow: none;
  background: none;
  outline: none;
  cursor: pointer;
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
const CloseIcon = css`
  font-size: 22px;
  color: #333333;
  border: none;
  position: absolute;
  top: 0;
  right: 0;
  background: none;
  cursor: pointer;
  padding: 1rem 1rem 0 0;
`;

const buttonContainer = css`
  margin: 0 auto;
  @media (min-width: 524px) {
    width: 370px;
  }
`;
const iconStyle = css`
  color: #0055a6;
`;
const modalStyles = css`
  overflow-y: hidden;
  @media only screen and (min-width: 992px) {
    min-height: 380px;
}
`;
const linkStyle = css`
  :hover {
    color: #0055a6;
    text-decoration: underline;
  }
`;
const deletePopover = css`
  transform: translateX(-80%);
  min-width: 200px;
  @media (min-width: 524px) {
    transform: inherit;
  }
`;
const margin = css`
  margin: auto -20px;
  @media only screen and (min-width: 768px) {
    margin: 0;
}
`;

export { margin, header, shareWishlistButton, buttonContainer, Btn, iconStyle, modalStyles, linkStyle, deletePopover, CloseIcon };
