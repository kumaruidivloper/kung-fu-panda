import styled, { css } from 'react-emotion';

const Overlay = css`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  width: 100%;
  height: 100%;
  overflow: scroll;
  z-index: 1040;
  -webkit-overflow-scrolling: touch;
`;

const ContentWide = css`
  position: relative;
  box-sizing: border-box;
  left: 15%;
  right: 15%;
  width: 70%;
  height: auto;
  background-color: #fff;
  margin-top: 7%;
  margin-bottom: 7%;
  vertical-align: middle;
  border: 1px solid white;

  @media (min-width: 1032px) and (max-width: 1280px) {
    width: 80%;
    left: 10%;
    right: 10%;
  }

  @media (max-width: 1031px) {
    width: 90%;
    left: 5%;
    right: 5%;
  }
`;

const ContentNarrow = css`
  position: relative;
  box-sizing: border-box;
  max-width: 720px;
  height: auto;
  background-color: #fff;
  margin: 7% auto;
  vertical-align: middle;
  border: 1px solid white;
`;

const CloseButton = styled('button')`
  position: absolute;
  right: 17px;
  top: 17px;
  height: 22px;
  width: 22px;
  padding: 0;
  border: 0;
  border-color: transparent;
  background-color: white;
  color: #585858;
  line-height: 0;
  cursor: pointer;
`;

const CloseIcon = styled('span')`
  font-size: 1.33rem;
`;

export { Overlay, ContentWide, ContentNarrow, CloseButton, CloseIcon };
