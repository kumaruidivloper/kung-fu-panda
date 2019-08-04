import ExecutionEnvironment from 'fbjs/lib/ExecutionEnvironment';
import PropTypes from 'prop-types';
import React from 'react';
import ReactDOM from 'react-dom';
import { connect, Provider } from 'react-redux';
import { css } from 'react-emotion';

import Drawer from '@academysports/fusion-components/dist/Drawer';

import { NODE_TO_MOUNT, DATA_COMP_ID } from './constants';

const accordionList = css`
  list-style-type: none;
  padding: 5px 10px 0;
  margin-bottom: 0;
`;

export class Accordion extends React.PureComponent {
  constructor(props) {
    super(props);
    const today = new Date();
    let open = false;
    if (today.getFullYear() === parseInt(props.cms.year, 10)) {
      open = true;
    }
    this.state = { expanded: open };
    this.onClickLinkLogGA = this.onClickLinkLogGA.bind(this);
  }

  /**
   * Click handler for accordion body links
   * @param {string} linkName - Link text
   */
  onClickLinkLogGA(linkName) {
    this.props.gtmDataLayer.push({
      event: 'accordionLinks',
      eventCategory: 'press releases',
      eventAction: 'link ',
      eventLabel: linkName.toLowerCase()
    });
  }

  /**
   * Generate accordion body items
   * @param {array} accordionItems - Array of body items
   */
  renderAccordianBody(accordionItems) {
    let content = null;
    if (Array.isArray(accordionItems)) {
      content = (
        <ul className={accordionList}>
          {accordionItems.map(item => (
            <li key={item.linkUrl}>
              {item.linkText ? (
                <a onClick={() => this.onClickLinkLogGA(item.linkText)} href={item.linkUrl}>
                  {item.linkText}
                </a>
              ) : null}
              {item.content ? item.content : null}
            </li>
          ))}
        </ul>
      );
    } else {
      content = <div>{accordionItems}</div>;
    }
    return content;
  }

  render() {
    const {
      cms: { accordionItems, year },
      gtmDataLayer
    } = this.props;
    return (
      <div className="row">
        <div className="container">
          <Drawer
            isOpen={this.state.expanded}
            title={year}
            closeIcon="academyicon icon-plus"
            openIcon="academyicon icon-minus"
            tabIndex={0}
            gtmDataLayer={gtmDataLayer}
            eventCategory="press releases"
            eventLabel={year}
          >
            {this.renderAccordianBody(accordionItems)}
          </Drawer>
        </div>
      </div>
    );
  }
}

Accordion.propTypes = {
  gtmDataLayer: PropTypes.array,
  cms: PropTypes.object.isRequired
};
const mapStateToProps = state => ({
  gtmDataLayer: state.gtmDataLayer
});

const withConnect = connect(
  mapStateToProps,
  {}
);
const ConnectedComponent = withConnect(Accordion);

if (ExecutionEnvironment.canUseDOM) {
  [...document.querySelectorAll(`[data-component='${NODE_TO_MOUNT}']`)].forEach(el => {
    ReactDOM.hydrate(
      <Provider store={window.store}>
        <ConnectedComponent {...window.ASOData[el.getAttribute(`${DATA_COMP_ID}`)]} />
      </Provider>,
      el
    );
  });
}

export default ConnectedComponent;
