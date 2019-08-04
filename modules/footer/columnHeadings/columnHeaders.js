import ExecutionEnvironment from 'fbjs/lib/ExecutionEnvironment';
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { subItems, LinkWithIcon } from '../styles';
import { isMobile } from '../../../utils/navigator';

class ColumnHeaders extends React.PureComponent {
  constructor(props) {
    super(props);
    this.analyticsData = this.analyticsData.bind(this);
    this.openChatWindow = this.openChatWindow.bind(this);
    this.getSocialLink = this.getSocialLink.bind(this);
  }

  /**
   * Retruns app compatible link based on user agent
   * @param {string} link - Original http(s) link
   */
  getSocialLink(link) {
    let agentProto = '';
    if (/facebook/i.test(link)) {
      const fbPage = link
        .replace(/\/$/, '')
        .split('/')
        .pop();
      agentProto = `fb://page/${fbPage}`;
    }
    if (/twitter/i.test(link)) {
      const twUname = link
        .replace(/\/$/, '')
        .split('/')
        .pop();
      agentProto = `twitter://user?screen_name=${twUname}`;
    }
    if (/pinterest/i.test(link)) {
      const pinUname = link
        .replace(/(m?\/?)+$/g, '')
        .split('/')
        .pop();
      agentProto = `pinterest://user/${pinUname}`;
    }
    if (/youtube/i.test(link)) {
      agentProto = link;
    }
    if (/instagram/i.test(link)) {
      const instUname = link
        .replace(/\/$/, '')
        .split('/')
        .pop();
      agentProto = `instagram://user?username=${instUname}`;
    }
    if (isMobile() && agentProto) {
      return agentProto;
    }
    return link;
  }
  /**
   * Triggers analytics data method call
   * @param  {} e - event
   * @param  {} column - footer column being clicked upon
   */
  openChatWindow(e, column) {
    e.preventDefault();
    this.analyticsData(e, column);
  }

  /**
   * Handles analytics events
   * @param {Object} e - Event object
   * @param {Object} column  - Link data
   */
  analyticsData(e, column) {
    this.props.gtmDataLayer.push({
      event: 'footerClicks',
      eventCategory: 'footer',
      eventAction: column.label ? column.label.toLowerCase() : `${column.url}`,
      eventLabel: `${decodeURIComponent(window.location.pathname)}`
    });
    if (isMobile() && /facebook|twitter|pinterest|youtube|instagram/i.test(column.url)) {
      return true;
    }
    e.preventDefault();

    if (ExecutionEnvironment.canUseDOM) {
      if (column.modalname && column.modalname === 'email-signup') {
        this.props.showSignupModalfn();
      } else if (column.label && column.label.toLowerCase() !== 'chat now') {
        window.location = `${column.url}`;
      } else if (column.url && column.url.toLowerCase().indexOf('//academy.custhelp.com/app/chat/chat_launch/') === -1) {
        const newWin = window.open(column.url, '_blank');
        newWin.opener = null;
      } else {
        const newWin = window.open(column.url, '_blank', 'resizable=yes, scrollbars=yes, titlebar=yes, width=650, height=650, top=10, left=10');
        newWin.opener = null;
      }
    }
    return false;
  }

  render() {
    const { links, className, fontCls } = this.props;
    return links.map((column, index) => (
      <LinkWithIcon key={column.label ? column.label : column.url} className={className !== 'social-item' ? `${subItems}` : 'social-item'}>
        {column.icon && column.label && <span className={`academyicon text-center ${column.icon || ''}`} />}
        {column.icon &&
          !column.label && (
            <a
              title={column.url.split('.com')[0]}
              href={column.url}
              data-auid={`FOOTER_LINK_${index}${column.url}`}
              onClick={e => this.analyticsData(e, column)}
            >
              <span className={`academyicon text-center d-block ${column.icon}`} />
            </a>
          )}
        {column.label ? (
          <a
            href={column.url}
            className={`${fontCls} d-inline-block pl-0 w-100`}
            data-auid={`FOOTER_LINK_${column.label}`}
            onClick={e => this.openChatWindow(e, column)}
          >
            {column.label}
          </a>
        ) : null}
      </LinkWithIcon>
    ));
  }
}
const mapStateToProps = state => ({
  gtmDataLayer: state.gtmDataLayer
});

ColumnHeaders.propTypes = {
  className: PropTypes.string,
  links: PropTypes.array,
  fontCls: PropTypes.string,
  showSignupModalfn: PropTypes.func,
  gtmDataLayer: PropTypes.array
};
export default connect(mapStateToProps)(ColumnHeaders);
