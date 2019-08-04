import ExecutionEnvironment from 'fbjs/lib/ExecutionEnvironment';
import React from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import Spinner from '@academysports/fusion-components/dist/Spinner';
import { NODE_TO_MOUNT, DATA_COMP_ID } from './constants';
import { spinnerWrapper, spinner, spinnerOverlay, spinnerSize } from './styles';
// import spinnerConstant from './../../assets/images/spinner.svg';

const Loader = ({ className, overlay }) => {
  const defaultClasses = overlay ? `${spinnerWrapper} ${spinnerOverlay}` : `${spinnerWrapper}`;
  return (
    <div className={`${defaultClasses} ${className}`} >
      <div className={`${spinner}`}>
        <div className="spinner">
          <Spinner className={spinnerSize} />
        </div>
      </div>
    </div>
  );
};

Loader.propTypes = {
  className: PropTypes.string,
  overlay: PropTypes.bool
};


if (ExecutionEnvironment.canUseDOM) {
  [...document.querySelectorAll(`[data-component="${NODE_TO_MOUNT}"]`)].forEach(el => {
    ReactDOM.hydrate(
      <Loader {...window.ASOData[el.getAttribute(`${DATA_COMP_ID}`)]} />,
      el
    );
  });
}

export default Loader;
