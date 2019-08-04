import styled, { css } from 'react-emotion';
import { sizesMax } from '../../utils/media';

const ProductMediaContainer = styled.div(css`
  width: 100%;
`);

const ImageContainerDiv = styled.div(css`
  text-align: center;
  max-height: 435px;
  object-fit: contain;
  margin: 0px 25px 25px 25px;
`);

const ImageListWrapper = styled.div(css`
  display: flex;
  flex-flow: column;
  padding-left: 5em;
  position: static;
`);

const ProductMixedMediaStyle = styled('div')`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: -0.5rem;
  @media (max-width: ${sizesMax.smMax}px) {
    margin-left: -1rem;
    margin-right: -1rem;
  }
`;

const AbsolutePosDiv = styled.div(css`
  // position: absolute;
  display: flex;
`);

const AbsoluteModal = styled.div(css`
  position: absolute;
  display: flex;
  top: -9em;
  margin-left: 117px;
`);

const ImageContainerDivModal = styled.img(css`
  margin-bottom: 2.5rem;
  max-width: 100%;
  height: auto;
  border: 0;
  max-height: 600px;
`);

const ImageDiv = styled.div(css``);

const PlayButton = styled('div')`
  cursor: pointer;
  padding-top: 2rem;
  display: flex;
  align-items: center;

  :focus {
    outline: none;
  }

  span {
    padding-left: 0.5rem;
    font-size: 0.875rem;
    :hover {
      color: #0055a6;
      text-decoration: underline;
    }
  }
`;

const PlayIcon = styled.div`
  svg {
    width: 1.5rem;
    height: 1.5rem;
  }
`;

const modalContentOverride = css`
  width: 100% !important;
  height: 100% !important;
  max-height: 100vh !important;
  display: flex;
  padding: 0 !important;
  overflow-y: hidden;
`;

const modalContentOverrideMobile = css`
  max-height: 100% !important;
  padding-left: 0;
  padding-right: 0;
`;

const CloseIcon = styled.button`
  position: absolute;
  // top: 3rem;
  // right: 7.3125rem;
  background: none;
  border: 0;
  cursor: pointer;
  text-align: right;
  top: 1rem;
  right: 1rem;
`;

const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  height: 6.25rem;

  button {
    flex-grow: 1;
  }
`;

const ModalContent = styled.div`
  display: flex;

  > div:first-child {
    > div {
      > button {
        margin-bottom: 1.5rem;
      }
    }
  }
`;

const ModalWrapper = styled.div`
  position: relative;
  display: flex;
  padding: 0rem 7.3125rem 2.5rem 7.3125rem;
  width: 100%;
  height: 100%;
  flex-direction: column;
`;

const BackIcon = styled.span`
  color: #0055a6;
  font-size: 0.75rem;
  padding-right: 1em;
  cursor: pointer;
  @media (max-width: 767px) {
    display: inline-block;
  }
`;

const HeaderText = styled.span`
  font-size: 1.25rem;
`;

const zoomModal = css`
  top: 2rem;
`;

const fixedSwatch = css`
  & .row.m-0 {
    position: fixed;
  }
`;

const FixedPositioned = styled.div`
  position: fixed;
  display: flex;
  flex-direction: column;
`;

const swatchStyle = css`
  padding: 0.5rem 1rem;
  border: 1px solid #ccc;
  cursor: pointer;
  height: 4.6875rem;
  width: 4.6875rem;
  text-align: center;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  word-break: break-word;
  overflow: hidden;

  img {
    max-height: 3.75rem !important;
  }

  :hover {
    border: 1px solid #ccc;
    outline: none;
  }
`;
const swatchStyleMin = css`
  padding: 0.5rem 1rem;
  border: 1px solid #ccc;
  cursor: pointer;
  height: 3rem;
  width: 3rem;
  text-align: center;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  word-break: break-word;
  overflow: hidden;

  img {
    max-height: 2rem !important;
  }

  :hover {
    border: 1px solid #ccc;
    outline: none;
  }
`;

const swatchActiveStyle = css`
  border: 3px solid #0055a6 !important;
  box-shadow: none;
`;

const scrollContainer = css`
  position: absolute;
  height: 85%;
  overflow-y: scroll;
  margin-left: 7rem;
`;

export {
  ProductMediaContainer,
  ProductMixedMediaStyle,
  AbsolutePosDiv,
  ImageContainerDiv,
  ImageListWrapper,
  AbsoluteModal,
  ImageContainerDivModal,
  ImageDiv,
  PlayButton,
  PlayIcon,
  modalContentOverride,
  CloseIcon,
  ModalHeader,
  ModalContent,
  ModalWrapper,
  BackIcon,
  HeaderText,
  modalContentOverrideMobile,
  zoomModal,
  fixedSwatch,
  FixedPositioned,
  swatchStyle,
  swatchActiveStyle,
  scrollContainer,
  swatchStyleMin
};
