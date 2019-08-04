import React from 'react';
import styled from 'react-emotion';

const LoaderAnimation = styled('div')`
  animation: animate 1.5s linear infinite;
  clip: rect(0, 80px, 80px, 40px);
  height: 80px;
  width: 80px;
  position: absolute;
  left: calc(50% - 40px);
  top: calc(50% - 40px);
  @keyframes animate {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(220deg);
    }
  }
  &:after {
    animation: animate2 1.5s ease-in-out infinite;
    clip: rect(0, 80px, 80px, 40px);
    content: '';
    border-radius: 50%;
    height: 80px;
    width: 80px;
    position: absolute;
  }
  @keyframes animate2 {
    0% {
      box-shadow: inset #0055a6 0 0 0 17px;
      transform: rotate(-140deg);
    }
    50% {
      box-shadow: inset #0055a6 0 0 0 2px;
    }
    100% {
      box-shadow: inset #0055a6 0 0 0 17px;
      transform: rotate(140deg);
    }
  }
`;

const LoaderWrapper = styled('div')`
  display: block;
  position: relative;
  height: 100%;
  width: 100%;
  min-height: 160px;
`;

const Loader = () => (
  <LoaderWrapper>
    <LoaderAnimation />
  </LoaderWrapper>
);

export default Loader;
