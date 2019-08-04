import styled, { css } from 'react-emotion';
import { SELECTED_IMAGE_PRESET } from './constants';

export const alignArrows = {
  leftAligned: css`
    position: absolute;
    left: -0.5rem;
    top: 50%;
    transform: translateY(-50%);
  `,
  rightAligned: css`
    position: absolute;
    right: -0.5rem;
    top: 50%;
    transform: translateY(-50%);
  `
};

export const TabsContainer = styled.div`
  position: relative;
  flex-direction: row;
  justify-content: center;
  border-bottom: 1px solid #ccc;
  height: 50px;
  .btn-left,
  .btn-right {
    display: flex;
    flex-direction: row;
    align-items: center;
    cursor: pointer;
  }
`;

export const ScrollContainer = styled.div`
  margin-right: 0px;
  position: relative;
  flex: 1 1 0;
  overflow: hidden;
  display: flex;
  flex-direction: row;
  @media (max-width: 767px) {
    overflow-x: scroll;
    scroll-behavior: smooth;
    -webkit-overflow-scrolling: touch;
    &::-webkit-scrollbar { 
      display: none;
      width: 0px;
      background: transparent;
    }
    &::-webkit-scrollbar-track {
      width: 0px;
    }
    &::-webkit-scrollbar:horizontal {
      width: 0px;
    }
  }
`;

export const ScrollableContent = styled.div`
  display: flex;
  flex-direction: row;
  height: 100%;
  ${props => (!props.scrollable ? 'width: 100%;' : '')};
  ${props => (props.transform ? `transform: translateX(${props.transform}px)` : 'transform: translateX(0px)')};
`;

export const Tab = styled.div`
  padding: 0 1.5rem;
  cursor: pointer;
  width: 66px;
  height: 50px;
  border-radius: ${props => (props.selected ? '4px 4px 0 0' : 'none')};
  border-top: ${props => (props.selected ? '1px solid #ccc' : 'none')};
  border-left: ${props => (props.selected ? '1px solid #ccc' : 'none')};
  border-right: ${props => (props.selected ? '1px solid #ccc' : 'none')};
  border-bottom: ${props => (!props.selected ? '1px solid #ccc' : 'none')};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  background: #fff url(${props => `${props.imageURL}${SELECTED_IMAGE_PRESET}`}) no-repeat;
  background-position: center;
  background-size: contain;

  input {
    opacity: 0;
    height: 100%;
    width: 100%;
    cursor: pointer;
  }
`;

export const LeftIconStyle = styled.span(css`
  font-size: 0.8rem;
  @media (max-width: 767px) {
    display: none;
    pointer-events: none;
    cursor: default;
  }
`);
export const RightIconStyle = styled.span(css`
  font-size: 0.8rem;
  @media (max-width: 767px) {
    display: none;
    pointer-events: none;
    cursor: default;
  }
`);

export const FlexedItem = styled.div`
  flex: 1;
  border-bottom: 1px solid #ccc;
`;

export const ArrowButton = styled.button`
  border: none;
  outline: none;
  background: none;
`;
