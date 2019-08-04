// It fetches the data from CMS as props and display the pagebanner.
// It uses the Bootstraps classes and emotionjs for styling.

import ExecutionEnvironment from 'fbjs/lib/ExecutionEnvironment';
import PropTypes from 'prop-types';
import React from 'react';
import classNames from 'classnames';
import Modal from 'react-modal';
import { connect } from 'react-redux';
import PromotionalModal from '../promotionalModal/promotionalModal';
import {
  PageBannerButton,
  PageBannerAnchor,
  PageBannerDetailStyle,
  ArrowIcon,
  OverLay,
  StyledModal,
  StyledButton,
  PageBannerTitleStyle,
  hiddenDiv,
  getTextColor,
  ButtonContainer,
  alignmentResolverClass,
  textAlignmentClass,
  bannerIconStyles,
  makeItLink
} from '../styles';
import { BANNER_ICON_ALT_TEXT } from './constants';

class PageBanner extends React.PureComponent {
  constructor(props) {
    super(props);
    /* istanbul ignore next */
    this.state = {
      displayBanner: true,
      isModalOpen: false
    };
    this.renderPageBanner = this.renderPageBanner.bind(this);
    this.closeModal = this.closeModal.bind(this);
  }
  // prevent screen readers from seeing main content when modal is opened
  componentDidMount() {
    Modal.setAppElement('body');
  }
  /**
   *
   * @description used to push analytics to gtmDataLayer and redirecting page according taget
   * @param {Object} e - OnClick Event parameter
   * @param {String} bannerCopy - Passing Text to show as a parameter
   * @param {String} bannerLinkTextURL - on Click "View Details" link is passing as parameter
   * @memberof PageBanner
   */
  analyticsData(e, bannerCopy, bannerLinkTextURL) {
    e.preventDefault();
    const { target } = this.props.cms;
    this.props.gtmDataLayer.push({
      event: 'pageBanner',
      eventCategory: 'page banner click',
      eventAction: 'click',
      eventLabel: `${bannerCopy && bannerCopy.toLowerCase()}`
    });
    if (target === '_modal') {
      this.setState(previousState => ({
        isModalOpen: !previousState.isModalOpen
      }));
    }
    if (ExecutionEnvironment.canUseDOM && target === '_blank' && bannerLinkTextURL) {
      const newWnd = window.open(bannerLinkTextURL, target);
      newWnd.opener = null;
    }
  }
  /**
   *
   * @description function is used to close modal (updates component state accordingly)
   * @memberof PageBanner
   */
  closeModal() {
    this.setState({
      isModalOpen: false
    });
  }
  /**
   *
   * @description function is used to generate pagebanner child component
   * @param {String} bannerCopy
   * @param {String} bannerLinkText
   * @returns react element
   * @memberof PageBanner
   */
  renderPageBanner() {
    const {
      cms: { bannerCopy, bannerAlignment, bannerLinkText, textColor, bannerIcon }
    } = this.props;
    return (
      <React.Fragment>
        <div className="d-flex flex-nowrap align-items-center c-promo-impression-tracking">
          {bannerIcon && (
            <div>
              <img src={bannerIcon} alt={bannerLinkText || BANNER_ICON_ALT_TEXT} className={bannerIconStyles} />
            </div>
          )}
          <div className={`o-copy__16reg ${PageBannerTitleStyle} ${textAlignmentClass(bannerAlignment)} ${getTextColor(textColor)}`}>
            {bannerCopy}
          </div>
        </div>
        <div className={`d-flex o-copy__14reg align-items-center ${PageBannerDetailStyle} ${getTextColor(textColor)}`}>
          <span className={makeItLink}>{bannerLinkText}</span>
          <span className={`${ArrowIcon} academyicon icon-chevron-right`} />
        </div>
      </React.Fragment>
    );
  }

  render() {
    const { cms } = this.props;
    const {
      cms: { bannerCopy, bannerLinkTextURL, target, bannerColor, bannerType, bannerAlignment }
    } = this.props;
    const alignmentClassName = alignmentResolverClass(bannerAlignment);
    if (this.state.displayBanner) {
      return (
        <React.Fragment>
          {cms && cms.target === '_modal' ? (
            <PageBannerButton
              tabIndex="0"
              data-auid={bannerType}
              onClick={e => this.analyticsData(e, bannerCopy, bannerLinkTextURL)}
              bannerColor={bannerColor}
              className={alignmentClassName}
            >
              {this.renderPageBanner()}
            </PageBannerButton>
          ) : (
            <PageBannerAnchor
              href={bannerLinkTextURL}
              tabIndex="0"
              data-auid={bannerType}
              target={target}
              onClick={e => this.analyticsData(e, bannerCopy, bannerLinkTextURL)}
              bannerColor={bannerColor}
              className={alignmentClassName}
            >
              {this.renderPageBanner()}
            </PageBannerAnchor>
          )}

          {cms &&
            cms.target !== '_self' && (
              <Modal
                onRequestClose={this.closeModal}
                overlayClassName={OverLay}
                className={StyledModal}
                isOpen={this.state.isModalOpen}
                shouldCloseOnOverlayClick
              >
                <div className={classNames(`${ButtonContainer}`, 'float-right')}>
                  <button className={StyledButton} onClick={this.closeModal} data-auid="sitebanner_btn" aria-label="close">
                    <span className="academyicon icon-close" />
                  </button>
                </div>
                <PromotionalModal {...cms} />
              </Modal>
            )}
        </React.Fragment>
      );
    }
    return <div className={hiddenDiv} />;
  }
}

PageBanner.propTypes = {
  cms: PropTypes.object.isRequired,
  gtmDataLayer: PropTypes.array
};

const mapStateToProps = state => ({
  gtmDataLayer: state.gtmDataLayer
});

export default connect(mapStateToProps)(PageBanner);
