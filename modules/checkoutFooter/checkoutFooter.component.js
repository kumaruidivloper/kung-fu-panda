import ExecutionEnvironment from 'fbjs/lib/ExecutionEnvironment';
import PropTypes from 'prop-types';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import './checkoutFooter.component.scss';
import AnalyticsWrapper from '../analyticsWrapper/analyticsWrapper.component';
import {
  footer,
  cardAcceptedStyle,
  spanStyling,
  hrStyle,
  contactStyles,
  phoneNumberStyles,
  contactWrapper,
  rowWrapper,
  phoneNumberLinkStyles
} from './checkoutFooter.styles';
import { NODE_TO_MOUNT, DATA_COMP_ID, CHAT_NOW } from './constants';

class CheckoutFooter extends React.PureComponent {
  constructor(props) {
    super(props);
    this.handleLinkClick = this.handleLinkClick.bind(this);
  }
  /**
   * @param  {} label
   * Method to redirect on click of Footer links
   */
  handleLinkClick(label) {
    const { analyticsContent, pageInfo, cms } = this.props;
    const analyticsData = {
      event: 'footerClicks',
      eventCategory: 'footer',
      eventAction: label || cms.chatNowLabel,
      eventLabel: `${pageInfo && pageInfo.seoURL}`
    };
    if (label !== cms.contactNumber) {
      analyticsData.chatclick = label === CHAT_NOW ? 1 : 0;
    }
    analyticsContent(analyticsData);
  }
  render() {
    const { cms } = this.props;
    return (
      <footer data-auid="checkout_footer_component" className={`${footer}`}>
        <div className="container">
          <div className={`${rowWrapper} row`}>
            <div className={`${contactWrapper} col-md-5 col-12 px-1 pl-sm-0`}>
              <div className="o-copy__16bold text-white text-uppercase">{cms.helpLabel}</div>
              <hr className={`${hrStyle}`} />
              <div className={`${contactStyles} d-flex`}>
                <div className="d-flex flex-wrap pr-1">
                  <span className="academyicon icon-chat-filled" />
                  <a
                    data-auid="checkout_footer_chat_now_link"
                    className="o-copy__14reg"
                    href={cms.checkoutChatUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => this.handleLinkClick(cms.chatNowLabel)}
                  >
                    {cms.chatNowLabel}
                  </a>
                </div>
                <div className={`${phoneNumberStyles} d-flex flex-wrap`}>
                  <span className="academyicon icon-phone-filled" />
                  <a
                    data-auid="checkout_footer_contact_number_link_m"
                    className={`${phoneNumberLinkStyles} o-copy__14reg`}
                    href={`tel:${cms.contactNumber}`}
                    onClick={() => this.handleLinkClick(cms.contactNumber)}
                  >
                    {cms.contactNumber}
                  </a>
                </div>
              </div>
            </div>
            <div className="col-md-7 col-12 pr-0 d-md-flex justify-content-end">
              {cms &&
                cms.commonLabels &&
                cms.commonLabels.cardsAccepted &&
                cms.commonLabels.cardsAccepted.map(item => (
                  <img
                    data-auid={`checkout_footer_accepted_card_${item.label}_icon`}
                    src={item.url}
                    alt={item.label}
                    className={`${cardAcceptedStyle} mr-1`}
                  />
                ))}
            </div>
          </div>
          <div className="row">
            <div className="col-12 px-1 pl-sm-0">
              <div className="d-flex flex-wrap">
                {cms &&
                  cms.legalLinks &&
                  cms.legalLinks.map((link, index) => (
                    <div key={link.label}>
                      {link.label && (
                        <a
                          data-auid={`checkout_footer_legal_link_${link.label}`}
                          key={link.label}
                          href={link.url}
                          className="o-copy__12reg"
                          onClick={() => this.handleLinkClick(link.label)}
                        >
                          {link.label}
                        </a>
                      )}
                      {cms.legalLinks.length - 1 !== index && <span className={spanStyling}> | </span>}
                    </div>
                  ))}
              </div>
              <div className="o-copy__12reg text-white">{cms.copyrightText}</div>
            </div>
          </div>
        </div>
      </footer>
    );
  }
}

CheckoutFooter.propTypes = {
  cms: PropTypes.object.isRequired,
  analyticsContent: PropTypes.func,
  pageInfo: PropTypes.object
};

if (ExecutionEnvironment.canUseDOM) {
  const AnalyticsWrappedCheckoutFooter = AnalyticsWrapper(CheckoutFooter);
  [...document.querySelectorAll(`[data-component="${NODE_TO_MOUNT}"]`)].forEach(el => {
    ReactDOM.hydrate(
      <Provider store={window.store}>
        <AnalyticsWrappedCheckoutFooter {...window.ASOData[el.getAttribute(`${DATA_COMP_ID}`)]} />
      </Provider>,
      el
    );
  });
}

export default AnalyticsWrapper(CheckoutFooter);
