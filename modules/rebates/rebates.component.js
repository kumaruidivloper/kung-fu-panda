import ExecutionEnvironment from 'fbjs/lib/ExecutionEnvironment';
import PropTypes from 'prop-types';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider, connect } from 'react-redux';

import Card from './lib/card';
import { cardText, buttonStyle, expStyle } from './styles';
import { NODE_TO_MOUNT, DATA_COMP_ID } from './constants';

class Rebates extends React.PureComponent {
  constructor(props) {
    super(props);
    this.onClickAnalytics = this.onClickAnalytics.bind(this);
  }
  /**
   * updating analytics
   * @param  {string} evtAction The event name
   * @param  {string} evtLabel The label name
   */

  onClickAnalytics(evtAction, evtLabel) {
    const eventLabel = evtLabel
      ? evtLabel
          .split('/')
          .pop()
          .split('.')
          .pop()
      : '';

    this.props.gtmDataLayer.push({
      event: 'downloadContent',
      eventCategory: 'download',
      eventAction: `rebate|${evtAction && evtAction.toLowerCase()}`,
      eventLabel: `${eventLabel.toLowerCase()}`
    });
  }

  render() {
    const {
      cms: { heading, offerInformation, ctaLink, ctaURL, expiryDate }
    } = this.props;
    return (
      <Card title={heading} content={<div className={`card-text ${cardText}`}>{offerInformation}</div>}>
        <a
          onClick={() => this.onClickAnalytics(`${heading}|${ctaLink}`, ctaURL)}
          href={ctaURL}
          className={buttonStyle}
          target="_blank"
          rel="noopener noreferrer"
        >
          {ctaLink}
        </a>
        <p className={expStyle}>
          Expires <span>{expiryDate}</span>
        </p>
      </Card>
    );
  }
}

Rebates.propTypes = {
  cms: PropTypes.object.isRequired,
  gtmDataLayer: PropTypes.array
};

const mapStateToProps = state => ({
  gtmDataLayer: state.gtmDataLayer
});
const RebatesContainer = connect(mapStateToProps)(Rebates);
if (ExecutionEnvironment.canUseDOM) {
  [...document.querySelectorAll(`[data-component="${NODE_TO_MOUNT}"]`)].forEach(el => {
    ReactDOM.hydrate(
      <Provider store={window.store}>
        <RebatesContainer {...window.ASOData[el.getAttribute(`${DATA_COMP_ID}`)]} />
      </Provider>,
      el
    );
  });
}

export default Rebates;
