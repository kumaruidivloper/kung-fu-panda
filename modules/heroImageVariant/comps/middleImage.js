import React from 'react';
import PropTypes from 'prop-types';
import styled, { css } from 'react-emotion';
import media from '../../../utils/media';

const Wrapper = styled('div')`
  position: absolute;
  background: url('${props => props.bgImg}');
  background-size:cover;
  background-position:center;
  width: 598px;
  border-radius: 4px;
  height: 500px;
  ${props =>
    props.position === 'left' &&
    css`
      right: 44.5%;
    `};
  ${props =>
    props.position === 'right' &&
    css`
      left: 44.5%;
    `};
  ${media.sm`
    width: 100%;
    height: 450px;
    left: 0;
    top: 0;
  `}

  @media (min-width: 577px) and (max-width: 767px) {
    width:345px;
    height:360px;
    
    ${props =>
      props.position === 'left' &&
      css`
        right: 40%;
      `};
    ${props =>
      props.position === 'right' &&
      css`
        left: 40%;
      `};
  }

  @media (min-width: 768px) and (max-width: 1200px) {
    width: 410px;
    height: 320px;
  }
`;

const MiddleImage = props => {
  const { src, position } = props;
  return <Wrapper bgImg={src} className="mt-md-3" position={position} />;
};

MiddleImage.propTypes = {
  src: PropTypes.string.isRequired,
  position: PropTypes.string.isRequired
};

export default MiddleImage;
