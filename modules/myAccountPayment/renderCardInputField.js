import React from 'react';
import PropTypes from 'prop-types';
import InputField from '@academysports/fusion-components/dist/InputField';
import Tooltip from '@academysports/fusion-components/dist/Tooltip';
import classNames from 'classnames';
import { AMEX, VISA, DISC, MAST, AMERICAN_EXPRESS, MASTER_CARD } from './constants';
import { isMobile } from '../../utils/userAgent';
import { redColor, borderRed, tooltipStyle } from './styles';
/**
 *
 * @param {string} cardName - provided by ourself for validation
 * @param {*} propValues - list of creditcard urls
 */
const getCurrentImage = (cardName, cardsAccepted) => {
  let cardurl = '';
  if (cardsAccepted && cardsAccepted.length) {
    cardurl = cardsAccepted.filter(cardObj => (cardObj.label && cardObj.label.toLowerCase().indexOf(cardName) !== -1 ? cardObj.url : ''));
  }
  return cardurl && cardurl[0] ? cardurl[0].url : '';
};
/**
 * @function this function sets the credit card image when user clicks on edit
 * @param {string} type
 * @param {Object} cms
 * @param {function} setCvvLengthOnEdit
 */
const getimageByType = (type, cms, setCvvLengthOnEdit) => {
  const cardType = type.replace(' ', '').toLowerCase();
  const { commonLabels } = cms;
  if (cardType === AMERICAN_EXPRESS) {
    setCvvLengthOnEdit(4);
    return getCurrentImage(AMEX, commonLabels.cardsAccepted);
  } else if (cardType === MASTER_CARD) {
    setCvvLengthOnEdit(3);
    return getCurrentImage(MAST, commonLabels.cardsAccepted);
  } else if (cardType === VISA) {
    setCvvLengthOnEdit(3);
    return getCurrentImage(VISA, commonLabels.cardsAccepted);
  }
  setCvvLengthOnEdit(3);
  return getCurrentImage(DISC, commonLabels.cardsAccepted);
};
/**
 * @function this function returns the credit card image when the user add new credit card
 * @param {boolean} validCard
 * @param {url} fetchCardSrc
 */
const getValidCardimage = (validCard, fetchCardSrc) => (
  <React.Fragment>
    {validCard ? (
      <span className="creditcarsBg">
        <img className="loadcardInfo" alt="" src={fetchCardSrc} />
      </span>
    ) : null}
  </React.Fragment>
);
/**
 * @function this function handles the condition whether the user is adding new credit card
 * or editing the existing one. Calls the required functions accordingly
 * @param {boolean} editCreditCard
 * @param {boolean} validCard
 * @param {url} fetchCardSrc
 * @param {Object} cms
 * @param {string} cardType
 * @param {function} setCvvLengthOnEdit
 */
const getImageDiv = (editCreditCard, validCard, fetchCardSrc, cms, cardType, setCvvLengthOnEdit) => (
  <React.Fragment>
    {editCreditCard ? (
      <span className="creditcarsBg">
        <img className="loadcardInfo" alt="" src={getimageByType(cardType, cms, setCvvLengthOnEdit)} />
      </span>
    ) : (
      getValidCardimage(validCard, fetchCardSrc)
    )}
  </React.Fragment>
);
const renderField = ({
  input,
  label,
  className,
  validCard,
  fetchCardSrc,
  maxLength,
  cvvCls,
  msg,
  forAttr,
  type,
  editCreditCard,
  cms,
  id,
  cardType,
  meta: { touched, error },
  setCvvLengthOnEdit
}) => {
  const fieldCls = forAttr === 'creditcardField' ? 'form-group mb-0 mb-xl-2' : 'form-group mb-2';
  return (
    <div className={`${fieldCls}`}>
      <label htmlFor={forAttr} className="w-100">
        {label === 'CVV' && (
          <React.Fragment>
            <label className={`body-14-bold ${cvvCls}`} htmlFor={id}>{label}</label>
            <Tooltip
              auid="myAct_payment_crdtCard_cvv"
              direction="top"
              align="C"
              lineHeightFix={1.5}
              className="body-12-normal"
              content={<div id="descriptionTooltipMyAccountCC" role="alert" style={{ width: '150px', fontSize: '12px', fontFamily: 'Mallory-Book', fontWeight: 'normal', margin: '0px' }}>{msg}</div>}
              showOnClick={isMobile()}
              ariaLabel={msg}
            >
              <button
                className={`academyicon icon-information mx-half ${tooltipStyle}`}
                role="tooltip" //eslint-disable-line
                aria-describedby="descriptionTooltipMyAccountCC"
              />
            </Tooltip>
          </React.Fragment>
        )}
        {label !== 'CVV' && <label className="body-14-bold" htmlFor={id}>{label}</label>}
        <InputField
          disabled={editCreditCard}
          width="100%"
          height="2.5rem"
          bordercolor="#cccccc"
          borderradius="6px"
          activebordercolor="red"
          activeborderwidth="3px"
          fontWeight="500"
          id={id}
          maxLength={maxLength}
          {...input}
          classname={`${className} ${touched && error ? borderRed : ''}`}
          type={type}
          data-auid={forAttr}
        />
        {getImageDiv(editCreditCard, validCard, fetchCardSrc, cms, cardType, setCvvLengthOnEdit)}
      </label>
      <div className="invalidTxt">{touched && (error && <span className={classNames('body-12-regular', redColor)}>{error}</span>)}</div>
    </div>
  );
};

renderField.propTypes = {
  input: PropTypes.object,
  label: PropTypes.string,
  id: PropTypes.string,
  type: PropTypes.string,
  meta: PropTypes.object,
  className: PropTypes.string,
  placeholder: PropTypes.string,
  forAttr: PropTypes.string,
  maxLength: PropTypes.string,
  cvvCls: PropTypes.string,
  msg: PropTypes.string,
  fetchCardSrc: PropTypes.string,
  validCard: PropTypes.bool,
  editCreditCard: PropTypes.bool,
  cms: PropTypes.object,
  cardType: PropTypes.string,
  setCvvLengthOnEdit: PropTypes.any
};
export default renderField;
