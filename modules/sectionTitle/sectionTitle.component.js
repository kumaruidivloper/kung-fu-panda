import ExecutionEnvironment from 'fbjs/lib/ExecutionEnvironment';
import PropTypes from 'prop-types';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider, connect } from 'react-redux';
import { NODE_TO_MOUNT, DATA_COMP_ID } from './constants';
import * as styles from './styles';
class SectionTitle extends React.Component {
  constructor() {
    super();
    this.state = {
      visibile: 'd-none'
    };
    this.displaySectionTitle = this.displaySectionTitle.bind(this);
  }
  componentDidMount() {
    this.displaySectionTitle();
  }
  /**
   * Having should component here as the section title should not update whenever store changes
   * Bug : seoComponent updates the `sectiontitle` piece of our store and consequently shows an empty title on L3 and search pages
   * TOOD: Remove should component update.
   */
  shouldComponentUpdate(nextProps, nextState) {
    console.log(nextState !== this.state);
    if (nextState.visibile !== this.state.visibile) {
      return true;
    }
    return false;
  }
  displaySectionTitle() {
    this.setState({
      visibile: 'd-block'
    });
  }
  renderTitle(title, isHeading, alignment) {
    return (
      <div className={`container ${styles.sectionTitle} ${this.state.visibile}`}>
        {isHeading ? (
          <h1 aria-level="1" data-auid="sectionTitle" className={`text-${alignment} mt-1 mb-2 o-copy__20bold`}>
            {title}
          </h1>
        ) : (
          <h2 data-auid="sectionTitle" aria-level="1" className={`text-${alignment} mt-1 mb-2 o-copy__16bold`}>
            {title}
          </h2>
        )}
      </div>
    );
  }

  render() {
    const { cms, sectionTitle } = this.props;
    if (sectionTitle !== '') {
      return this.renderTitle(sectionTitle, true, 'left');
    }
    return this.renderTitle(cms.title, cms.h1 === true, cms.textAlignment);
  }
}

SectionTitle.propTypes = {
  cms: PropTypes.shape({
    title: PropTypes.string.isRequired,
    textAlignment: PropTypes.string.isRequired,
    h1: PropTypes.bool.isRequired
  }),
  sectionTitle: PropTypes.string
};

/**
 * method returns section title for L1,L2,L3 pages from API data , i.e shopbycategory and productgrid
 * @param {*} state  current state tree of app
 */
const getSectionTitleForListing = state => {
  let sectionTitle = '';
  if (state.shopByCategory) {
    // TODO : Refactor the below code with API help
    sectionTitle =
      state.shopByCategory.categories && state.shopByCategory.categories[0].sectionTitle ? state.shopByCategory.categories[0].sectionTitle : '';
  } else if (state.productGrid) {
    sectionTitle = state.productGrid.sectionTitle; //eslint-disable-line
  } else {
    sectionTitle = '';
  }
  return sectionTitle;
};

/**
 * section title is fetched from store in case of L3 and SRP , for other pages it is authored.
 * @param {*} state
 */
const mapStateToProps = state => ({
  sectionTitle: getSectionTitleForListing(state)
});

const ConnectSectionTitle = connect(mapStateToProps)(SectionTitle);
if (ExecutionEnvironment.canUseDOM) {
  [...document.querySelectorAll(`[data-component="${NODE_TO_MOUNT}"]`)].forEach(el => {
    ReactDOM.hydrate(
      <Provider store={window.store}>
        <ConnectSectionTitle {...window.ASOData[el.getAttribute(`${DATA_COMP_ID}`)]} />
      </Provider>,
      el
    );
  });
}

export default ConnectSectionTitle;
