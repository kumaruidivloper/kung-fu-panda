import React from 'react';
import PropTypes from 'prop-types';
import styled from 'react-emotion';

const Wrapper = styled('div')`
  height: 700px;
  background: white;
  @media (min-width: 577px) {
    height: 440px;
    background: url('${props => props.bgImg}');
    background-size: cover;
  }
  @media (min-width: 1201px) {
    height: 617px;
  }
`;
Wrapper.displayName = 'BackgroundImageContainer';

const Content = styled('div')`
  max-width: 1440px;
  margin: 0 auto;
  position: relative;
  width: 100%;
  height: 100%;
`;

Content.displayName = 'Content';

const BackgroundImage = ({ src, children, ...rest }) => (
  <Wrapper bgImg={src} {...rest}>
    <Content>{children}</Content>
  </Wrapper>
);

BackgroundImage.propTypes = {
  src: PropTypes.string.isRequired,
  children: PropTypes.array.isRequired
};

export default BackgroundImage;
