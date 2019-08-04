import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { atc } from '../style';
import { atcLabels } from '../constants';

const ErrorModal = props => (
  <Fragment>
    {props.exceptionMessage && props.exceptionMessage !== '' ? (
      <atc.Alert>{props.exceptionMessage}</atc.Alert>
    ) : (
      <section className={atc.NoError} />
    )}

    <div className="container">
      <div className={`${atc.setSvg} row`}>
        <svg xmlns="http://www.w3.org/2000/svg" width="114" height="114" viewBox="0 0 114 114">
          <g fill="none" fillRule="evenodd" stroke="#333" strokeLinecap="round">
            <path
              strokeWidth="2"
              d="M32.778 6.495C13.978 15.528 1 34.748 1 57c0 30.928 25.072 56 56 56s56-25.072 56-56S87.928 1 57 1"
            />
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
        <h3 className={`${atc.set} col-12`}>{atcLabels.ERR_MSG}</h3>
        <div className="col-12 text-center">
          <p className={atc.promise}>{atcLabels.ERR_TRY_LATER}</p>
        </div>
      </div>
    </div>
  </Fragment>
);

ErrorModal.propTypes = {
  exceptionMessage: PropTypes.string
};

export default ErrorModal;
