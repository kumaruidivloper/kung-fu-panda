import React from 'react';
import PropTypes from 'prop-types';
import { cx } from 'react-emotion';
import Button from '@academysports/fusion-components/dist/Button';
import * as style from '../styles';
import { NOTIFY_HEADLINE, NOTIFY_BODY, ERROR_MSG, EMAIL_SUBMIT, EMAIL_LABEL } from '../constants';

const BisModalContent = ({ s, onClickSubmitNotified, onChangeinput, toggleModal, labels = {} }) => (
  <div className="container pb-md-6 px-sm-3">
    <div className="row">
      <style.CloseButton onClick={toggleModal}>
        <style.CloseIcon className={cx('academyicon', 'icon-close')} aria-hidden="true" />
      </style.CloseButton>
    </div>
    <div className="row">
      <h4 className={cx(style.backInStock, 'mb-2', 'pt-1', 'pt-md-1', 'pt-sm-0', 'px-half')}>{labels.NOTIFY_HEADLINE || NOTIFY_HEADLINE}</h4>
      <p className={cx(style.emailText, 'mb-sm-3', 'px-half', 'col-lg-12', 'o-copy__16reg')}>{labels.NOTIFY_BODY || NOTIFY_BODY}</p>
      <div className="col-12">
        <form
          onSubmit={e => onClickSubmitNotified(e)}
          action="/api/inventory/notify"
          className={style.signUpForm}
          id="backInStockNotification"
          noValidate
        >
          <style.Label className="mb-0 o-copy__14bold" htmlFor="email-address">
            {labels.EMAIL_LABEL || EMAIL_LABEL}
          </style.Label>
          <style.Input
            type="email"
            id="email-address"
            name="emailId"
            className={s.emailError ? `${style.placeholder} ${style.invalid}` : style.placeholder}
            required
            onChange={e => onChangeinput(e)}
          />
          <span className={s.emailError ? style.errorMsgDisp : style.errMsg}>{labels.ERROR_MSG || ERROR_MSG}</span>
          <Button form="backInStockNotification" auid="email-signup-button" type="submit" className={cx(style.submit, 'mt-2')}>
            {labels.EMAIL_SUBMIT || EMAIL_SUBMIT}
          </Button>
        </form>
      </div>
    </div>
  </div>
);

BisModalContent.propTypes = {
  labels: PropTypes.object,
  toggleModal: PropTypes.func,
  onClickSubmitNotified: PropTypes.func,
  onChangeinput: PropTypes.func,
  s: PropTypes.object
};

export default BisModalContent;
