import PropTypes from 'prop-types';
import React from 'react';
import styled, { css } from 'react-emotion';

const pulsateAnimation = css`
  @keyframes pulse {
    0% {
      background-color: rgba(165, 165, 165, 0.1);
    }
    50% {
      background-color: rgba(165, 165, 165, 0.3);
    }
    100% {
      background-color: rgba(165, 165, 165, 0.1);
    }
  }
`;

const skeletonWrapper = css`
  width: 100%;
  height: 435px;
  background: #ededee;
  border: 1px solid #ecf0f1;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #bdc3c7;
  animation: pulse 1s infinite ease-in-out;

  @media only screen and (max-width: 767px) {
    height: 350px;
  }

  ${pulsateAnimation};
`;

const Thumbnails = styled.div`
  display: flex;
  flex-direction: column;
`;

const Thumbnail = styled.div`
  width: 50px;
  height: 50px;
  background: #ededee;
  border: 1px solid #e4e4e4;
  animation: pulse 1s infinite ease-in-out;
  margin-bottom: 14px;

  ${pulsateAnimation};
`;

class ProductMixedMediaLoaderBox extends React.PureComponent {
  render() {
    const { swatchList = [], isMobile } = this.props;
    return (
      <div className="d-flex">
        {!isMobile && (
          <Thumbnails className="mr-1">
            {swatchList.slice(0, 7).map(() => (
              <Thumbnail />
            ))}
          </Thumbnails>
        )}
        <div className={`${skeletonWrapper} ${isMobile ? 'col-12' : 'col-10'}`} />
      </div>
    );
  }
}
ProductMixedMediaLoaderBox.propTypes = {
  swatchList: PropTypes.array,
  isMobile: PropTypes.bool
};

export default ProductMixedMediaLoaderBox;
