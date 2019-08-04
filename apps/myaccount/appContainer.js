import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { Component } from 'react';
import PropTypes from 'prop-types';

class AppContainer extends Component {
  constructor(props) {
    super(props);

    this.props.history.block(() => {
      if (!this.sessionAlive() && !this.isOrdersPage()) {
        window.location.href = '/shop/LogonForm?timeout=true';
        return false;
      }
      return true;
    });
  }

  sessionAlive() {
    return document.cookie.indexOf('WC_USERACTIVITY_') > -1 && document.cookie.indexOf('WC_AUTHENTICATION_') > -1;
  }

  isOrdersPage() {
    return window.location.href.match(/(\/myaccount\/order(s|Search))/);
  }

  render() {
    const { children } = this.props;
    return children;
  }
}

AppContainer.propTypes = {
  history: PropTypes.object,
  children: PropTypes.any
};

export default withRouter(connect()(AppContainer));
