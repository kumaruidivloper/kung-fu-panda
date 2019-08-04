import ExecutionEnvironment from 'fbjs/lib/ExecutionEnvironment';
import PropTypes from 'prop-types';
import React, { Fragment } from 'react';
import ReactDOM from 'react-dom';
import { cx } from 'react-emotion';
import Responsive from 'react-responsive';
import Button from '@academysports/fusion-components/dist/Button';
import Modal from '@academysports/fusion-components/dist/Modal';
import { connect } from 'react-redux';
import { NODE_TO_MOUNT, DATA_COMP_ID } from './constants';
import { header, buttonContainer, Btn, iconStyle, modalStyles, linkStyle, CloseIcon, margin } from './styles';
import { isMobile } from '../../utils/navigator';
class WishlistDeleteModal extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isModalOpen: false
    };
  }
  deleteHandler = () => {
    this.props.deleteWishlist(this.props.clickedWishListID, this.props.profileID);
    this.props.showWishListItems(this.props.clickedWishListID);
    this.closeModal();
  };
  closeModal = () => {
    this.setState({ isModalOpen: false }, () => {
      if (isMobile(true)) {
        this.props.popOverHide();
      }
    });
    this.deleteList.focus();
  };
  openModal = () => {
    this.setState({ isModalOpen: true });
  };

  renderModalTitle() {
    const { cms } = this.props;
    return (
      <Fragment>
        <Responsive maxWidth={767}>
          <h5 className={margin}>{cms.deleteWishlistLabel}</h5>
        </Responsive>
        <Responsive minWidth={768}>
          <h4 className={margin}>{cms.deleteWishlistLabel}</h4>
        </Responsive>
      </Fragment>
    );
  }

  render() {
    const { cms } = this.props;
    return (
      <div>
        <button
          ref={input => {
            this.deleteList = input;
          }}
          data-auid="delete_list_btn"
          onClick={() => this.openModal()}
          className={Btn}
        >
          <i className={cx('academyicon icon-garbage pr-half pr-md-half', iconStyle)} />
          <span className={cx('o-copy__14reg', linkStyle)}>{cms.deleteListLabel}</span>
        </button>
        <div>
          <Modal
            modalContentClassName={modalStyles}
            isOpen={this.state.isModalOpen}
            closeIcon={
              <button className={CloseIcon} onClick={() => this.closeModal()}>
                <span className="academyicon icon-close icon a-close-icon" aria-hidden="true" />
              </button>
            }
            handleClose={() => this.closeModal()}
          >
            <div id="1qw" className={`${header}`}>
              {this.renderModalTitle()}
              <div className="my-2 o-copy__16reg">{cms.areYouSureText}</div>
            </div>
            <div className={cx(buttonContainer, 'o-copy__14reg')}>
              <Button auid="keep_wish_list_btn" size="M" className="w-100 mb-2" onClick={() => this.closeModal()}>
                {cms.keepWishlistLabel}
              </Button>
              <Button auid="delete_wish_list_btn" size="M" btntype="secondary" className="w-100 mb-2" onClick={() => this.deleteHandler()}>
                {cms.deleteWishlistLabel}
              </Button>
            </div>
          </Modal>
        </div>
      </div>
    );
  }
}

WishlistDeleteModal.propTypes = {
  cms: PropTypes.object.isRequired,
  popOverHide: PropTypes.func,
  deleteWishlist: PropTypes.func,
  // wishlistId: PropTypes.string,
  profileID: PropTypes.string,
  showWishListItems: PropTypes.func,
  clickedWishListID: PropTypes.string
};

const mapStateToProps = state => ({
  isDeleted: state.isDeleted
});

const withConnect = connect(mapStateToProps);
if (ExecutionEnvironment.canUseDOM) {
  [...document.querySelectorAll(`[data-component="${NODE_TO_MOUNT}"]`)].forEach(el => {
    ReactDOM.hydrate(<WishlistDeleteModal {...window.ASOData[el.getAttribute(`${DATA_COMP_ID}`)]} />, el);
  });
}

export default withConnect(WishlistDeleteModal);
