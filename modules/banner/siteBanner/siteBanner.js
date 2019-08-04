// It fetches the data from CMS as props and display the sitebanner.
// It uses the Bootstraps classes and emotionjs for styling.

import ExecutionEnvironment from 'fbjs/lib/ExecutionEnvironment';
import PropTypes from 'prop-types';
import React from 'react';
import classNames from 'classnames';
import { connect } from 'react-redux';
import { cx } from 'react-emotion';
import Modal from 'react-modal';
import PromotionalModal from '../promotionalModal/promotionalModal';
import { enhancedAnalyticsPromoClick } from '../../../utils/analytics';
import {
  SiteBannerButton,
  SiteBannerAnchor,
  CloseBtn,
  SiteBannerContent,
  closeIcon,
  colorBanner,
  alignmentResolverClass,
  OverLay,
  StyledModal,
  StyledButton,
  SiteBannerDetailStyle,
  textAlignmentClass,
  ArrowIcon,
  TitleStyle,
  getTextColor,
  ButtonContainer
} from '../styles';
import Storage from '../../../utils/StorageManager';

class SiteBanner extends React.PureComponent {
  constructor(props) {
    super(props);
    /* istanbul ignore next */
    this.state = {
      displayBanner: false,
      isModalOpen: false
    };
    this.routeToOffer = this.routeToOffer.bind(this);
    this.toggleModal = this.toggleModal.bind(this);
    this.renderSiteBanner = this.renderSiteBanner.bind(this);
  }
  /**
   *@description setting displayBanner according to session storage
   *
   * @memberof SiteBanner
   */
  componentWillMount() {
    const hasBanner = Storage.getSessionStorage('displayBanner');
    /* istanbul ignore else */
    if (hasBanner === null) {
      this.setState({
        displayBanner: true,
        isModalOpen: false
      });
    }
  }

  /**
   * @description used to push analytics to gtmDataLayer and redirecting page according taget
   * @param {Object} e - OnClick Event parameter
   * @param {String} bannerCopy - Passing Text to show as a parameter
   * @param {String} bannerLinkTextURL - on Click "View Details" link is passing as parameter
   */
  analyticsData(e, bannerCopy, bannerLinkTextURL) {
    e.preventDefault();
    const { cms, gtmDataLayer } = this.props;
    const { target, name, id } = cms;
    if (name || id) {
      enhancedAnalyticsPromoClick(gtmDataLayer, cms, bannerLinkTextURL);
    }
    gtmDataLayer.push({
      event: 'siteBanner',
      eventCategory: 'site banner click',
      eventAction: 'click',
      eventLabel: `${bannerCopy && bannerCopy.toLowerCase()}`
    });

    if (target === '_modal') {
      this.setState(previousState => ({
        isModalOpen: !previousState.isModalOpen
      }));
    } else if (ExecutionEnvironment.canUseDOM && target && bannerLinkTextURL) {
      const newWin = window.open(bannerLinkTextURL, target);
      newWin.opener = null;
    }
  }

  // openModal() {
  //   this.setState({ isModalOpen: true });
  /**
   *@description used to to close the modal
   *
   * @memberof SiteBanner
   */
  toggleModal() {
    this.setState({
      isModalOpen: false
    });
  }
  /**
   *@description used to close the banner and setting displayBanner flase in session storage
   *
   * @memberof SiteBanner
   */
  routeToOffer() {
    Storage.setSessionStorage('displayBanner', false);
    this.setState({ displayBanner: false });
  }
  /**
   *
   * @description function is used to generate sitebanner child component
   * @param {String} bannerLinkText
   * @param {String} bannerCopy
   * @param {String} bannerAlignment
   * @returns react element
   * @memberof SiteBanner
   */
  renderSiteBanner(bannerLinkText, bannerCopy, bannerAlignment, textColor) {
    const isMobile = navigator.userAgent.match(/Android/i);

    return (
      <div className={`${SiteBannerContent} d-flex align-items-center ${alignmentResolverClass(bannerAlignment)}`}>
        <div
          className={cx(
            { 'o-copy__14reg': !isMobile },
            { 'o-copy__12reg': isMobile },
            `${getTextColor(textColor)}`,
            TitleStyle,
            textAlignmentClass(bannerAlignment)
          )}
        >
          {bannerCopy}
        </div>
        {bannerLinkText && (
          <div className={`o-copy__14reg ${SiteBannerDetailStyle} ${getTextColor(textColor)}`}>
            {bannerLinkText}
            <span className={`${ArrowIcon} academyicon icon-chevron-right`} />
          </div>
        )}
      </div>
    );
  }

  render() {
    const { cms } = this.props;
    const { displayBanner } = this.state;
    const {
      cms: { bannerCopy, closeCta, bannerColor, bannerLinkTextURL, target, bannerType, bannerLinkText, bannerAlignment }
    } = this.props;
    return (
      displayBanner && (
        <div className={`${colorBanner(bannerColor)} d-flex flex-nowrap siteBanner c-promo-impression-tracking`}>
          {cms && cms.target === '_modal' ? (
            <SiteBannerButton
              tabIndex="0"
              data-auid={bannerType}
              onClick={e => this.analyticsData(e, bannerCopy, bannerLinkTextURL)}
              bannerColor={bannerColor}
              bannerAlignment={bannerAlignment}
            >
              {this.renderSiteBanner(bannerLinkText, bannerCopy, bannerAlignment, cms.textColor)}
            </SiteBannerButton>
          ) : (
            <SiteBannerAnchor
              href={bannerLinkTextURL}
              tabIndex="0"
              data-auid={bannerType}
              target={target}
              onClick={e => this.analyticsData(e, bannerCopy, bannerLinkTextURL)}
              bannerColor={bannerColor}
              bannerAlignment={bannerAlignment}
            >
              {this.renderSiteBanner(bannerLinkText, bannerCopy, bannerAlignment, cms.textColor)}
            </SiteBannerAnchor>
          )}

          <button
            className={`${CloseBtn} ${colorBanner(bannerColor)}`}
            onClick={this.routeToOffer}
            aria-label={closeCta || 'close'}
            data-auid="sitebanner_btn"
          >
            <span className={`${closeIcon} academyicon icon-close mr-1 mr-sm-2`} />
          </button>
          {cms &&
            cms.target !== '_self' && (
              <Modal
                overlayClassName={OverLay}
                className={StyledModal}
                isOpen={this.state.isModalOpen}
                onRequestClose={this.toggleModal}
                shouldCloseOnOverlayClick
              >
                <div className={classNames(`${ButtonContainer}`, 'float-right')}>
                  <button className={`float-right ${StyledButton}`} data-auid="sitebanner_btn" aria-label="close" onClick={this.toggleModal}>
                    <span className="academyicon icon-close mr-2 float-right" />
                  </button>
                </div>
                <PromotionalModal {...cms} />
              </Modal>
            )}
        </div>
      )
    );
  }
}

const mapStateToProps = state => ({
  gtmDataLayer: state.gtmDataLayer
});

SiteBanner.propTypes = {
  cms: PropTypes.object.isRequired,
  gtmDataLayer: PropTypes.array,
  pageInfo: PropTypes.object
};

export default connect(mapStateToProps)(SiteBanner);
