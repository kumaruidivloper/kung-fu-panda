import ExecutionEnvironment from 'fbjs/lib/ExecutionEnvironment';
import PropTypes from 'prop-types';
import React from 'react';
import ReactDOM from 'react-dom';
import classNames from 'classnames';
import { acceptedPaymentDisplay, rowDiv, verticalDiv, iconLock, policyLinks } from './style';
import { NODE_TO_MOUNT, DATA_COMP_ID } from './constants';

class AcceptedPaymentDisplay extends React.PureComponent {
  render() {
    const { cms } = this.props;
    return (
      <div className={`${acceptedPaymentDisplay} container px-0`}>
        <div className={classNames('d-flex flex-wrap', 'pt-2 pb-0 pb-sm-2 px-md-0 px-1', rowDiv)}>
          <div className={classNames('col-12 col-md-4', 'd-flex flex-row', 'mb-2 mb-md-0', verticalDiv)}>
            <div className={classNames('academyicon icon-lock ', 'mr-md-1', 'ml-md-3', iconLock)} />
            <div className="d-flex flex-column">
              <div className={classNames('o-copy__14bold', 'mb-0 mb-sm-half')}>{cms.shopWithConfidenceTitle}</div>
              <div className="o-copy__12reg">{cms.shopWithConfidenceSubHeading}</div>
            </div>
          </div>

          <div className={classNames('col-12 col-md-3', 'pl-md-2 mb-2 mb-md-0', verticalDiv)}>
            <div className={classNames('o-copy__14bold', 'mb-quarter mb-sm-half')}>{cms.freeInStoreReturns}</div>
            <div className={classNames('o-copy__12reg', policyLinks)}>
              {cms.legalLinks && cms.legalLinks.map && cms.legalLinks.map((link, index) => (
                <span key={link.label}>
                  {link.label && <a data-auid={`crt_lnkLegal_${index}`} className="text-link-12" target="_blank" rel="noopener noreferrer" href={link.url}>{link.label}</a>}
                  {cms.legalLinks.length - 1 !== index && <span>|</span>}
                </span>
              ))}
            </div>
          </div>

          <div className={classNames('col-12 col-md-5', 'mb-2 mb-md-0', verticalDiv)}>
            <div className={classNames('o-copy__14bold', 'mb-quarter mb-md-half', 'pl-0 pl-md-1')}>{cms.weAcceptLabel}</div>
            <div className="pl-0 pl-md-1">
              {cms.commonLabels.cardsAccepted && cms.commonLabels.cardsAccepted.map(item => (
                <React.Fragment key={item.label}>
                  <img src={item.url} alt={item.label} className="cards" />
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

AcceptedPaymentDisplay.propTypes = {
  cms: PropTypes.object.isRequired
};

if (ExecutionEnvironment.canUseDOM) {
  [...document.querySelectorAll(`[data-component="${NODE_TO_MOUNT}"]`)].forEach(el => {
    ReactDOM.hydrate(<AcceptedPaymentDisplay {...window.ASOData[el.getAttribute(`${DATA_COMP_ID}`)]} />, el);
  });
}

export default AcceptedPaymentDisplay;
