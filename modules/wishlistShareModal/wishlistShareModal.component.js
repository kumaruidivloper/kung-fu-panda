import ExecutionEnvironment from 'fbjs/lib/ExecutionEnvironment';
import PropTypes from 'prop-types';
import React from 'react';
import ReactDOM from 'react-dom';
import { cx } from 'react-emotion';
import classNames from 'classnames';
import Modal from 'react-modal';
// import Input from '@academysports/fusion-components/dist/InputField';
import EmailField from '@academysports/fusion-components/dist/EmailField';
import Button from '@academysports/fusion-components/dist/Button';
import { domainsList } from './../../utils/constants';
import { NODE_TO_MOUNT, DATA_COMP_ID, analyticsErrorEvent, analyticsErrorEventCategory, analyticsErrorEventAction } from './constants';
import {
  header,
  hasError,
  suggestion,
  textArea,
  buttonContainer,
  Btn,
  iconStyle,
  redColor,
  cancelColor,
  linkStyle,
  modalStyles,
  OverLay,
  fontBtn,
  centerAlign
} from './styles';
import { getErrorMessagesFromDOM, analyticsErrorTracker } from './../../utils/analyticsUtils';
let emailListArr = '';
class WishlistShareModal extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isModalOpen: false,
      valid: true,
      message: '',
      errorMsg: '' // state to track error message to be shown.
    };
    this.handleMessageChange = this.handleMessageChange.bind(this);
  }
  componentDidUpdate(prevProps, prevState) {
    // If previous state is valid and present one is invalid - error has occurred.
    if (prevState.valid && !this.state.valid) {
      this.pushAnalyticsErrorData();
    }
  }
  closeModal = () => {
    this.setState({ isModalOpen: false });
    if (this.props.mobile) {
      this.props.popOverHide();
    }
    this.shareList.focus();
  };
  openModal = () => {
    this.setState({ isModalOpen: true });
  };
  /**
   * Tests email value for validity and sets state with appropriate error message.
   * @param { string } email.
   */
  validEmail = email => {
    const { cms } = this.props;
    if (email.trim() === '') {
      this.setState({ errorMsg: cms.errorMsg.enterRecipientEmailAddress });
      return false;
    }
    if (email.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i)) {
      return true;
    }
    this.setState({ errorMsg: cms.commonLabels.invalidEmailAddress });
    return false;
  };
  validEmailList = emailList => {
    let flag = true;
    emailList.map(email => {
      if (!this.validEmail(email.trim())) {
        flag = false;
      }
      return null;
    });
    return flag;
  };
  /**
   * pushes client side error tracking details to GTM Layer.
   */
  pushAnalyticsErrorData() {
    const forms = document.querySelectorAll('#wishlist-share-modal');
    getErrorMessagesFromDOM(forms, '.text-error').then(data => {
      analyticsErrorTracker(analyticsErrorEvent, analyticsErrorEventCategory, analyticsErrorEventAction, data, {}, {}, this.props);
    });
  }
  handleShareClick = () => {
    const { checkAlert, analyticsContent } = this.props;
    const list = emailListArr.split(',');
    if (this.validEmailList(list)) {
      this.setState({ valid: true });
      const dataToAPI = {
        giftListId: this.props.clickedWishListID,
        message: this.state.message,
        recipientEmail: emailListArr,
        senderEmail: this.props.email,
        senderName: this.props.firstName
      };
      checkAlert();
      this.props.shareWishlist(dataToAPI, this.props.profileID, this.props.clickedWishListID);
      const analyticsData = {
        event: 'wishlistmyaccount',
        eventCategory: 'wish list',
        eventAction: 'email wish list',
        eventLabel: 'myaccount > wishlist',
        viewwishlist: 0,
        createwishlist: 0,
        deletewishlist: 0,
        emailwishlist: 1,
        removefromwishlist: 0
      };
      analyticsContent(analyticsData);
      this.closeModal();
    } else {
      this.setState({ valid: false });
    }
  };
  emailList = val => {
    emailListArr = val;
  };
  handleMessageChange(e) {
    this.setState({ message: e.target.value });
  }
  render() {
    const { cms } = this.props;
    return (
      <div>
        <button
          ref={input => {
            this.shareList = input;
          }}
          data-auid="share_list_btn"
          onClick={this.openModal}
          className={Btn}
        >
          <i className={cx('academyicon icon-share pr-half pr-md-half', iconStyle)} />
          <span className={classNames('o-copy__14reg', linkStyle)}>{cms.shareListLabel}</span>
        </button>
        <Modal
          overlayClassName={OverLay}
          isOpen={this.state.isModalOpen}
          className={modalStyles}
          onRequestClose={this.closeModal}
          shouldCloseOnOverlayClick
        >
          <button data-auid="close_modal_btn" onClick={this.closeModal} className={classNames('float-right pr-2 pt-2', fontBtn)} aria-label="close">
            <span className="academyicon icon-close" />
          </button>
          <div className={classNames('mt-6', header)}>
            <h4 className={centerAlign}>{cms.shareYourWishlistLabel}</h4>
            <div className={classNames('my-2 o-copy__16reg mx-4', centerAlign)}>{cms.enterEmailToShareLabel}</div>
            <div className={classNames('o-copy__12reg', centerAlign)}>{cms.allFieldRequiredLabel}</div>
          </div>
          <div className="my-3 mx-4">
            <label htmlFor="wishlist-recipientEmail">
              <div className="o-copy__14bold d-flex">{cms.recipientEmailLabel}</div>
            </label>
            <EmailField
              data-auid="email_list_input"
              id="wishlist-recipientEmail"
              className={hasError(!this.state.valid)}
              onChange={evt => this.emailList(evt)}
              domainsList={domainsList}
              width="100%"
              aria-label={cms.recipientEmailLabel}
            />
            <div id="wishlist-share-modal" className={this.state.valid ? 'd-none' : 'd-block'}>
              <span className={cx('o-copy__12reg', redColor, 'text-error')}>{this.state.errorMsg}</span>
            </div>
            <div className={cx('mt-1', 'o-copy__14reg', 'd-flex', suggestion)}>{cms.youCanSeperateText}</div>
          </div>
          <div className="o-copy__14bold', 'mb-3 mb-md-2 mx-4">
            <label htmlFor="wishlist-messageTextarea"><div className="d-flex">{cms.messageLabel}</div></label>
            <div className="form-group mb-3 mb-md-2">
              <textarea id="wishlist-messageTextarea" data-auid="comment_input" className={textArea} onChange={this.handleMessageChange} aria-label={cms.messageLabel} />
            </div>
          </div>
          <div className={cx(buttonContainer, 'o-copy__14reg', 'mb-6 mx-4')}>
            <Button auid="share_whish_list_btn" className="w-100 mb-3" onClick={this.handleShareClick} aria-label={cms.shareWishlistLabel}>
              {cms.shareWishlistLabel}
            </Button>
            <button data-auid="close_modal_btn" onClick={this.closeModal} className={Btn} aria-label={cms.commonLabels.cancelLabel}>
              <span className={cx('o-copy__14reg', cancelColor)}>{cms.commonLabels.cancelLabel}</span>
            </button>
          </div>
        </Modal>
      </div>
    );
  }
}

WishlistShareModal.propTypes = {
  cms: PropTypes.object.isRequired,
  shareWishlist: PropTypes.func,
  popOverHide: PropTypes.func,
  mobile: PropTypes.bool,
  clickedWishListID: PropTypes.string,
  profileID: PropTypes.string,
  email: PropTypes.string,
  firstName: PropTypes.string,
  checkAlert: PropTypes.func,
  analyticsContent: PropTypes.func
};

if (ExecutionEnvironment.canUseDOM) {
  [...document.querySelectorAll(`[data-component="${NODE_TO_MOUNT}"]`)].forEach(el => {
    ReactDOM.hydrate(<WishlistShareModal {...window.ASOData[el.getAttribute(`${DATA_COMP_ID}`)]} />, el);
  });
}

export default WishlistShareModal;
