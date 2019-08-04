import React from 'react';
import PropTypes from 'prop-types';
import styled from 'react-emotion';

const Wrapper = styled('div')`
  position: absolute;
  text-align: center;
  pointer-events: none;
  max-width: 280px;
  top: 27%;
  @media (min-width: 375px) {
    top: 22%;
    max-width: 300px;
  }
  @media (min-width: 568px) {
    top: 20%;
  }
  @media (min-width: 577px) {
    right: ${props => (props.orientation === 'left' ? '0' : 'auto')};
  }
  @media (min-width: 667px) {
    top: 5%;
    left: ${props => (props.orientation === 'right' ? 'auto' : '50%')};
    right: ${props => (props.orientation === 'right' ? '50%' : 'auto')};
    max-width: 280px;
  }
  @media (min-width: 768px) {
    left: ${props => (props.orientation === 'right' ? 'auto' : '35%')};
    top: 5%;
    right: ${props => (props.orientation === 'right' ? '40%' : 'auto')};
  }
  @media (min-width: 1024px) {
    left: ${props => (props.orientation === 'right' ? 'auto' : '42%')};
    right: ${props => (props.orientation === 'right' ? '42%' : 'auto')};
    top: 15%;
  }
  @media (min-width: 1280px) {
    max-width: 350px;
  }

  img {
    max-width: 100%;
  }
`;

const ForegroundImage = props => {
  const { src, position = 'center', orientation = 'left' } = props;
  return (
    <Wrapper imgPos={position} orientation={orientation}>
      <img alt="foreground" src={src} />
    </Wrapper>
  );
};

ForegroundImage.propTypes = {
  src: PropTypes.string.isRequired,
  position: PropTypes.string,
  orientation: PropTypes.string
};

export default ForegroundImage;
