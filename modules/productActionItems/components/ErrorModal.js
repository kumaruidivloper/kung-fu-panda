import React, { Fragment } from 'react';
// import Anchor from '@academysports/fusion-components/dist/Anchor';
// import Button from '@academysports/fusion-components/dist/Button';
import PropTypes from 'prop-types';
import { C } from './styles';
import * as styles from '../styles';

const ModalContent = props => (
  <Fragment>
    {props.errorMessage &&
      props.exceptionMessage && (
        <div className="mt-4 px-1">
          <C.Alert>{props.errorMessage || props.exceptionMessage || ''}</C.Alert>
        </div>
      )}
    <div className="container">
      <div className={`${styles.setSvg} row`}>
        <svg xmlns="http://www.w3.org/2000/svg" width="114" height="114" viewBox="0 0 114 114">
          <g fill="none" fillRule="evenodd" stroke="#333" strokeLinecap="round">
            <path strokeWidth="2" d="M32.778 6.495C13.978 15.528 1 34.748 1 57c0 30.928 25.072 56 56 56s56-25.072 56-56S87.928 1 57 1" />
            <path
              fill="#333"
              strokeLinejoin="round"
              strokeWidth="3"
              d="M74.043 44.46l-3.286-3.286-13.148 13.148L44.46 41.174l-3.287 3.287 13.148 13.148-13.148 13.148 3.287 3.286 13.148-13.147 13.148 13.147 3.286-3.286-13.147-13.148z"
            />
          </g>
        </svg>
      </div>
      <div className="row">
        <h3 className={`${styles.set} col-12`}>WE FUMBLED</h3>
        <div className="col-12 text-center">
          <p className={styles.promise}>Please try again later</p>
        </div>
      </div>
    </div>
  </Fragment>
);

ModalContent.propTypes = {
  exceptionMessage: PropTypes.string,
  errorMessage: PropTypes.string
};

export default ModalContent;
