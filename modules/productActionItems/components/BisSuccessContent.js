import React from 'react';
import PropTypes from 'prop-types';
import * as style from '../styles';
import { NOTIFY_SUCCESS, SUCCESS_BODY } from '../constants';

const BisSuccessContent = ({ labels, toggleModal }) => (
  <div className="container">
    <div className="row">
      <style.CloseButton onClick={toggleModal}>
        <style.CloseIcon className="academyicon icon-close pr-md-1" aria-hidden="true" />
      </style.CloseButton>
    </div>
    <div>
      <div className="row">
        <div className={`${style.setSvg}`}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 114 114">
            <g fill="none" fillRule="evenodd">
              <path
                stroke="#0055A6"
                strokeLinecap="round"
                strokeWidth="2"
                d="M32.778 6.495C13.978 15.528 1 34.748 1 57c0 30.928 25.072 56 56 56s56-25.072 56-56S87.928 1 57 1"
              />
              <path
                fill="#0055A6"
                fillRule="nonzero"
                d="M76.047 46.327l-3.921-3.922a1.385 1.385 0 0 0-1.96.002l-19.12 19.118-6.76-6.758a1.385 1.385 0 0 0-1.959-.002l-3.922 3.922c-.54.542-.54 1.419.002 1.961l11.16 11.16c.4.401.92.928 1.45.928.531 0 1.107-.527 1.508-.928l23.521-23.52c.542-.542.542-1.42.001-1.961z"
              />
            </g>
          </svg>
        </div>
      </div>
      <div className="row">
        <h4 className={`${style.set} col-12`}>{labels && labels.NOTIFY_SUCCESS ? labels.NOTIFY_SUCCESS : NOTIFY_SUCCESS}</h4>
        <div className="col-12">
          <p className={style.promise}>{labels && labels.SUCCESS_BODY ? labels.SUCCESS_BODY : SUCCESS_BODY}</p>
        </div>
      </div>
    </div>
  </div>
);

BisSuccessContent.propTypes = {
  labels: PropTypes.object,
  toggleModal: PropTypes.func
};

export default BisSuccessContent;
