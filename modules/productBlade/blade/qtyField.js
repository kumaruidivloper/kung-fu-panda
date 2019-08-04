import React from 'react';
import PropTypes from 'prop-types';
import { css } from 'emotion';
import { ZERO_KEY, NINE_KEY, ENTER_KEY, QUANTITY_MESSAGE } from './constants';
import * as styles from '../styles';

const pointerCss = css`
  cursor: pointer;
`;

export const QtyField = props => (
  <div data-auid="crt_qtyField" className={`mb-0 mb-sm-1 mt-3 mt-md-0 d-flex flex-column ${styles.qtycontainer}`}>
    <label className={pointerCss} htmlFor="crt-input-Qty">
      {props.label}:
    </label>
    <form className="qtyFieldLarge">
      <input
        data-auid="crt_inputQty"
        id="crt-input-Qty"
        type="tel"
        className={`${styles.qtyField} mt-quarter o-copy__14reg `}
        value={props.qty}
        onChange={props.onChange}
        onBlur={props.onSubmit}
        onKeyPress={e =>
          ((e.which < ZERO_KEY || e.which > NINE_KEY) && e.preventDefault()) || (e.which === ENTER_KEY && props.onSubmit(e) && e.preventDefault())
        }
      />
      {props.quantityError && <span className="sr-only" role="alert">{QUANTITY_MESSAGE}</span>}
      {props.showLoader && <span className={styles.spinner} />}
    </form>
  </div>
);

QtyField.propTypes = {
  label: PropTypes.string,
  qty: PropTypes.number,
  quantityError: PropTypes.string,
  onChange: PropTypes.func,
  onSubmit: PropTypes.func,
  showLoader: PropTypes.bool
};
