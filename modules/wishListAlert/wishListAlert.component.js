import ExecutionEnvironment from 'fbjs/lib/ExecutionEnvironment';
import PropTypes from 'prop-types';
import React from 'react';
import ReactDOM from 'react-dom';
import classNames from 'classnames';
import { NODE_TO_MOUNT, DATA_COMP_ID, REMOVE_TEXT, SHARE_ITEM } from './constants';
import { wishListAlertRed, undoBtn, closeBtn, greenCloseBtn, Btn, wishListAlertSuccess, redColor } from './wishListAlert.styles';

class WishListAlert extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      showAlert: true,
      isCloseCLicked: false,
      isRemoved: true
    };
    this.handleAlertClose = this.handleAlertClose.bind(this);
    this.closeAlertBox = this.closeAlertBox.bind(this);
    this.handleUndoClick = this.handleUndoClick.bind(this);
    this.checkAlertType = this.checkAlertType.bind(this);
    this.renderShareAlert = this.renderShareAlert.bind(this);
    this.renderDeleteAlert = this.renderDeleteAlert.bind(this);
  }
  handleAlertClose() {
    this.setState({ isCloseCLicked: true });
    this.setState({ showAlert: false });
  }
  closeAlertBox() {
    if (!this.state.isCloseCLicked) {
      setTimeout(() => {
        if (this.state.showAlert && this.props.callback) {
          this.props.callback(true);
        }
        this.setState({ showAlert: false });
      }, 5000);
    }
  }
  handleUndoClick() {
    this.setState({ showAlert: false });
    this.props.callback(false);
  }
  checkAlertType(alertType) {
    if (alertType !== REMOVE_TEXT) {
      this.setState({ isRemoved: false });
    }
  }
  /**
   * It return the Alert box after sharing wishlist to emails.
   * @param {Object} cms - CMS Json
   */
  renderShareAlert() {
    const { cms } = this.props;
    return (
      <div className={` row ${wishListAlertSuccess}`}>
        <div className={classNames('col-10 col-md-11', 'py-1 pl-1')}>
          <span className="o-copy__14bold">{cms.yourWishlistSharedText}</span>
        </div>
        <div className={classNames('col-2 col-md-1', 'py-1')}>
          <button data-auid="alert_close_btn" onClick={this.handleAlertClose} className={classNames('pl-half', greenCloseBtn)}>
            <span className={classNames('academyicon icon-close')} />
          </button>
        </div>
      </div>
    );
  }
  /**
   * It return the alert for the deleting any item from wishlist.
   * @param {*} cms - CMS Json
   * @param {*} removedItem -item which are removed
   * @param {*} successMsg - text message for sccess.
   */
  renderDeleteAlert() {
    const { cms, removedItem, successMsg, showRemoveAlert } = this.props;
    return (
      <div>
        {this.state.showAlert ? (
          <div className={classNames('row', this.state.isRemoved ? wishListAlertRed : wishListAlertSuccess)}>
            {this.state.isRemoved ? (
              <div className={classNames('col-10 col-md-11', 'py-1 pl-1')}>
                {showRemoveAlert ? (
                  <span className="o-copy__14bold">{cms.commonLabels.removedLabel.replace('{{}}', removedItem)}</span>
                ) : (
                  <span className="o-copy__14bold">{removedItem}</span>
                )}
                <button data-auid="undo_click_btn" className={Btn} onClick={this.handleUndoClick}>
                  <span className={classNames('o-copy__14bold', 'pl-half', undoBtn)}>{cms.commonLabels.undoLabel}</span>
                </button>
              </div>
            ) : (
              <div className={classNames('col-10 col-md-11', 'py-1 pl-1')}>
                <span className={classNames('o-copy__14bold', redColor)}>{successMsg}</span>
              </div>
            )}
            <div className={classNames('col-2 col-md-1', 'py-1')}>
              <button data-auid="alert_close_btn" onClick={this.handleAlertClose} className={classNames('pl-half', closeBtn)}>
                <span className={classNames('academyicon icon-close', redColor)} />
              </button>
            </div>
          </div>
        ) : (
          <div />
        )}
      </div>
    );
  }
  render() {
    const { alertType } = this.props;
    this.checkAlertType(alertType);
    this.closeAlertBox();
    return (
      <div className="container-fluid">{this.state.showAlert && alertType === SHARE_ITEM ? this.renderShareAlert() : this.renderDeleteAlert()}</div>
    );
  }
}

WishListAlert.propTypes = {
  cms: PropTypes.object.isRequired,
  removedItem: PropTypes.string,
  alertType: PropTypes.string.isRequired,
  successMsg: PropTypes.string,
  callback: PropTypes.func,
  showRemoveAlert: PropTypes.bool
};

if (ExecutionEnvironment.canUseDOM) {
  [...document.querySelectorAll(`[data-component="${NODE_TO_MOUNT}"]`)].forEach(el => {
    ReactDOM.hydrate(<WishListAlert {...window.ASOData[el.getAttribute(`${DATA_COMP_ID}`)]} />, el);
  });
}

export default WishListAlert;
