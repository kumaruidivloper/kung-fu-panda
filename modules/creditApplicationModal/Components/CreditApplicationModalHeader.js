/* eslint-disable linebreak-style */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { modalHeader, titlePart, stepsPart, stepTitle, lineBetween, stepsPartActive, isMobileColumn, mobileFont } from '../styles';

// eslint-disable-next-line react/prefer-stateless-function
class CreditApplicationModalHeader extends Component {
  // eslint-disable-next-line no-useless-constructor
constructor(props) {
super(props);
}

render() {
const { formState } = this.props;
return (
  <div className={`row ${modalHeader}`}>
    <div className={classNames(`${isMobileColumn}`, 'col-md-4')}>
      <img src="https://i.postimg.cc/Y9h0LLxk/imageedit-1-2106158513.png" alt="img" width="150" />
    </div>
    <div className={classNames(`${isMobileColumn}`, 'col-md-8')}>
      { formState === 1 ? (<div className={`row ${stepTitle} ${mobileFont}`}><h5> STEP1: APPLICATION FORM </h5></div>) : null }
      { formState === 2 ? (<div className={`row ${stepTitle} ${mobileFont}`}><h5> STEP2: CONSENT </h5></div>) : null }
      <div className={`row ${titlePart}`}>
        <button className={`${formState === 1 ? stepsPartActive : stepsPart}`}>1</button>
        <div className={`${lineBetween}`}></div>
        <button className={`${formState === 2 ? stepsPartActive : stepsPart}`}>2</button>
      </div>
    </div>
  </div>
);
}
}

CreditApplicationModalHeader.propTypes = {
  formState: PropTypes.number
};

export default CreditApplicationModalHeader;