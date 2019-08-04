import { searchDexFooter } from '@academysports/aso-env';
import axios from 'axios';
import ExecutionEnvironment from 'fbjs/lib/ExecutionEnvironment';
import * as HTML from 'html-parse-stringify';
import PropTypes from 'prop-types';
import React from 'react';
import ReactDOM from 'react-dom';
import { connect, Provider } from 'react-redux';
import Responsive from 'react-responsive';
import Safe from 'react-safe';
import { compose } from 'redux';

import injectReducer from '../../utils/injectReducer';
import ScrollTop from '../header/scrollTop';
import { showSignupModal } from './actions';
import HeaderList from './columnHeadings/headerList';
import LegalLinks from './columnHeadings/legalLinks';
import SocialLinks from './columnHeadings/socialLinks';
import { DATA_COMP_ID, DESKTOP_MIN_WIDTH, MOBILE_MAX_WIDTH, NODE_TO_MOUNT } from './constants';
import Accordian from './footer.accordian';
import reducer from './reducer';
import {
  containerPadding,
  desktopContainer,
  footerContainer,
  FooterLinks,
  headerListContainer,
  mobileContainer,
  searchDexOverride
} from './styles';

// import { footerAPI } from '@academysports/aso-env';
class Footer extends React.PureComponent {
  constructor() {
    super();
    this.state = {
      academyTab: false,
      helpTab: false,
      servicesTab: false
    };
    this.toggleAccordian = this.toggleAccordian.bind(this);
  }

  static getInitialProps(params) {
    let path = `${searchDexFooter}default.html`;
    let categoryId = '';
    let page = '';
    const { pageInfo, cmsPageInfo } = params;
    if (pageInfo) {
      ({ categoryId, page } = pageInfo);
    } else if (cmsPageInfo) {
      categoryId = cmsPageInfo.previewId;
    }
    if (page === 'homepage') {
      path = `${searchDexFooter}home.html`;
    } else if (categoryId) {
      path = `${searchDexFooter}c${categoryId}.html`;
    }

    return new Promise((resolve, reject) => {
      axios
        .get(path)
        .then(resp => {
          const parsed = HTML.parse(resp.data);
          resolve({ data: parsed });
        })
        .catch(() => {
          axios
            .get(`${searchDexFooter}default.html`, {
              headers: {
                'Content-Type': 'text/html'
              }
            })
            .then(resp => {
              const parsed = HTML.parse(resp.data);
              resolve({ data: parsed });
            })
            .catch(error => reject(error));
        });
    });
  }
  /**
   * This function renturns two of the object being prepared and used by footer from state and props
   */
  getFooterLinkData() {
    const {
      cms: {
        findStore,
        findStoreUrl,
        dealsSignUp,
        dealsSignUpUrl,
        chatLabel,
        chatUrl,
        fbLink,
        twLink,
        ptLink,
        ytLink,
        instaLink,
        findStoreTarget,
        chatTarget
      }
    } = this.props;

    const footerLink4 = [
      {
        label: findStore,
        url: findStoreUrl,
        icon: 'icon-location-pin-filled',
        target: findStoreTarget
      },
      {
        label: dealsSignUp,
        url: dealsSignUpUrl,
        icon: 'icon-email-filled',
        modalname: 'email-signup'
      },
      {
        label: chatLabel,
        url: chatUrl,
        icon: 'icon-chat-filled',
        target: chatTarget
      }
    ];

    const footerLink5 = [
      {
        url: fbLink,
        icon: 'icon-group social-link'
      },
      {
        url: twLink,
        icon: 'icon-group-2 social-link'
      },
      {
        url: ptLink,
        icon: 'icon-group-3 social-link'
      },
      {
        url: ytLink,
        icon: 'icon-group-4 social-link'
      },
      {
        url: instaLink,
        icon: 'icon-group-10 social-link'
      }
    ];

    return {
      footerLink4,
      footerLink5
    };
  }

  /**
   * Sets accordian states
   * @param {string} accordianName - Name of the accordion
   * @param {bool} isOpen - State of the accordion
   */
  toggleAccordian(accordianName, isOpen) {
    if (accordianName === 'academy') {
      this.setState({ academyTab: isOpen, helpTab: false, servicesTab: false });
    } else if (accordianName === 'help') {
      this.setState({ academyTab: false, helpTab: isOpen, servicesTab: false });
    } else if (accordianName === 'services') {
      this.setState({ academyTab: false, helpTab: false, servicesTab: isOpen });
    }
  }

  /**
   * Returns stringified HTML after removing  unnecessary comments and script tags
   * @param {object} api - Parsed HTML object
   */
  cleanSearchDex(api) {
    const searchDexLinks = HTML.stringify(api);
    // Remove the unnecessary comments and script tags to avoid console errors
    return searchDexLinks
      .replace(/[\r\n]+/g, '')
      .replace(/<!?[/]?--.*?[--]?>/g, '')
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
  }

  /**
   * this will render the mobile view of footer comp
   */
  renderForMobile() {
    const { academyTab, helpTab, servicesTab } = this.state;
    const {
      cms: { columnHeading1, columnHeading2, columnHeading3, footerLinks1, footerLinks2, footerLinks3, legalUrl, legalLabels },
      api
    } = this.props;
    let searchDexLinks = '';
    if (api && Object.keys(api).length) {
      searchDexLinks = this.cleanSearchDex(api);
    }
    const searchDexSiteMap = `<a href="/shop/browse/sitemap">Sitemap</a>${searchDexLinks}`;
    const { footerLink4, footerLink5 } = this.getFooterLinkData();
    return (
      <div className={`${FooterLinks} ${mobileContainer} applyColor w-100`}>
        <Accordian title={columnHeading1} isOpen={academyTab} accordianName="academy" toggleAccordian={this.toggleAccordian}>
          <HeaderList linkclassName="academy" fontClass="o-copy__16reg" footerLinks={footerLinks1} />
        </Accordian>
        <Accordian title={columnHeading2} isOpen={helpTab} accordianName="help" toggleAccordian={this.toggleAccordian}>
          <HeaderList linkclassName="help" fontClass="o-copy__16reg" footerLinks={footerLinks2} />
        </Accordian>
        <Accordian title={columnHeading3} isOpen={servicesTab} accordianName="services" toggleAccordian={this.toggleAccordian}>
          <HeaderList linkclassName="services" fontClass="o-copy__16reg" footerLinks={footerLinks3} />
        </Accordian>
        <SocialLinks name="detail-link" fontClass="o-copy__14reg" showSignupModal={this.props.fnshowSignupModal} footerLinks={footerLink4} />
        <SocialLinks name="social-link" marginBot="mb-4" footerLinks={footerLink5} />
        <LegalLinks fontClass="o-copy__12reg" paddingLegal={containerPadding} name="legal-link" legalLinks={legalUrl} />
        <div className={`o-copy__12reg ${containerPadding}`}> {legalLabels}</div>
        <div className="container">
          <div className="row">
            <Safe.div className={`pt-half o-copy__12reg ${searchDexOverride}`}>{searchDexSiteMap}</Safe.div>
          </div>
        </div>
      </div>
    );
  }

  /**
   * this will render the desktop view of footer comp
   */
  renderForDesktop() {
    const {
      cms: { columnHeading1, columnHeading2, columnHeading3, footerLinks1, footerLinks2, footerLinks3, legalUrl, legalLabels },
      api
    } = this.props;
    let searchDexLinks = '';
    if (api && Object.keys(api).length) {
      searchDexLinks = this.cleanSearchDex(api);
    }
    const searchDexSiteMap = `<a href="/shop/browse/sitemap">Sitemap</a>${searchDexLinks}`;
    const { footerLink4, footerLink5 } = this.getFooterLinkData();
    return (
      <div className={`${FooterLinks} ${desktopContainer} applyColor container`}>
        <div className={`${headerListContainer} row d-flex`}>
          <HeaderList
            linkclassName="academy"
            fontClass="o-copy__14reg"
            colClass="col-md-3"
            columnHeading={columnHeading1}
            footerLinks={footerLinks1}
          />
          <HeaderList linkclassName="help" fontClass="o-copy__14reg" colClass="col-md-3" columnHeading={columnHeading2} footerLinks={footerLinks2} />
          <HeaderList
            linkclassName="services"
            fontClass="o-copy__14reg"
            colClass="col-md-3"
            columnHeading={columnHeading3}
            footerLinks={footerLinks3}
          />
          <SocialLinks
            name="detail-link"
            fontClass="o-copy__14reg"
            colClass="col-md-3"
            showSignupModal={this.props.fnshowSignupModal}
            footerLinks={footerLink4}
          />
        </div>
        <div className="container">
          <div className="row flex-column">
            <SocialLinks name="social-link" footerLinks={footerLink5} />
            <LegalLinks fontClass="o-copy__12reg" paddingLegal={containerPadding} name="legal-link" legalLinks={legalUrl} />
            <div className="o-copy__12reg">{legalLabels}</div>
          </div>
        </div>
        <div className="container">
          <div className="row">
            <Safe.div className={`pt-half o-copy__12reg ${searchDexOverride}`}>{searchDexSiteMap}</Safe.div>
          </div>
        </div>
      </div>
    );
  }

  /**
   * Default render method of react.
   * The first if condition for ExecutionEnvironment is added to render the component at server side as fallback
   * because, we are using 'react-responsive' library for client side rendering.
   */
  render() {
    if (!ExecutionEnvironment.canUseDOM) {
      return (
        <div className={`${footerContainer} pb-4 pb-md-6 pt-0 pt-lg-2`}>
          {this.renderForMobile()}
          {this.renderForDesktop()}
        </div>
      );
    }

    return (
      <footer className={`${footerContainer} pb-4 pb-md-6 pt-0 pt-lg-2`}>
        <Responsive maxWidth={MOBILE_MAX_WIDTH}>{this.renderForMobile()}</Responsive>
        <Responsive minWidth={DESKTOP_MIN_WIDTH}>{this.renderForDesktop()}</Responsive>
        <ScrollTop />
      </footer>
    );
  }
}

Footer.propTypes = {
  api: PropTypes.object,
  cms: PropTypes.object.isRequired,
  fnshowSignupModal: PropTypes.func
};

const mapDispatchToProps = dispatch => ({
  fnshowSignupModal: () => dispatch(showSignupModal())
});

const withConnect = connect(
  null,
  mapDispatchToProps
);

if (ExecutionEnvironment.canUseDOM) {
  const withReducer = injectReducer({ key: NODE_TO_MOUNT, reducer });
  const FooterContainer = compose(
    withReducer,
    withConnect
  )(Footer);
  [...document.querySelectorAll(`[data-component='${NODE_TO_MOUNT}']`)].forEach(el => {
    ReactDOM.hydrate(
      <Provider store={window.store}>
        <FooterContainer {...window.ASOData[el.getAttribute(`${DATA_COMP_ID}`)]} />
      </Provider>,
      el
    );
  });
}

export default withConnect(Footer);
