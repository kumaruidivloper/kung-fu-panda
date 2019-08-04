import ExecutionEnvironment from 'fbjs/lib/ExecutionEnvironment';
import React from 'react';
import PropTypes from 'prop-types';
import getFirstDefined from '../utils/getFirstDefined';
import { isMobile } from '../utils/navigator';
import { scrollIntoView } from '../utils/scroll';

const DEFAULT_PAGE_TOP_OFFSET = -120;

const withScroll = WrappedComponent => {
  class WithScroll extends React.PureComponent {
    getPageTopOffset() {
      return isMobile() ? this.getMobilePageTopOffset() : this.getDesktopPageTopOffset();
    }

    getMobilePageTopOffset() {
      const { pageTopOffset, pageTopOffsetMobile, pageTopOffsetDesktop } = this.props;
      return getFirstDefined([pageTopOffsetMobile, pageTopOffset, pageTopOffsetDesktop, DEFAULT_PAGE_TOP_OFFSET]);
    }

    getDesktopPageTopOffset() {
      const { pageTopOffset, pageTopOffsetMobile, pageTopOffsetDesktop } = this.props;
      return getFirstDefined([pageTopOffsetDesktop, pageTopOffset, pageTopOffsetMobile, DEFAULT_PAGE_TOP_OFFSET]);
    }

    scrollPageToTop = () => {
      if (ExecutionEnvironment.canUseDOM) {
        const { pageTopElementQuerySelector } = this.props;
        const el = document.querySelector(pageTopElementQuerySelector);
        this.scrollToTop(el);
      }
    };

    scrollToTop = el => {
      scrollIntoView(el, { offset: this.getPageTopOffset() });
    };

    render() {
      const { pageTopOffset, pageTopOffsetMobile, pageTopOffsetDesktop, ...remainingProps } = this.props;
      return <WrappedComponent scrollPageToTop={this.scrollPageToTop} scrollToTop={this.scrollToTop} {...remainingProps} />;
    }
  }

  WithScroll.propTypes = {
    pageTopElementQuerySelector: PropTypes.string, // used to find the top most element on the DOM to be used by scrollToTop
    pageTopOffset: PropTypes.number, // optional - the fall back pageTopOffset ignoring mobile/desktop
    pageTopOffsetDesktop: PropTypes.number, // optional - the pageTopOffset to be used if user is on Desktop browser
    pageTopOffsetMobile: PropTypes.number // optional - the pageTopOffset to be used if user is on
  };

  return WithScroll;
};

export default withScroll;
