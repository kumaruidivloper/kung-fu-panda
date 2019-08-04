import ExecutionEnvironment from 'fbjs/lib/ExecutionEnvironment';
import PropTypes from 'prop-types';
import React from 'react';
import Modal from 'react-modal';
import Button from '@academysports/fusion-components/dist/Button';
import * as styles from './styles';
import * as constants from './constants';

class UnavailableItemsModal extends React.PureComponent {
  constructor(props) {
    super(props);
    this.handleClickOfEditInCart = this.handleClickOfEditInCart.bind(this);
    this.handleClickOfCloseButton = this.handleClickOfCloseButton.bind(this);
  }

  /**
   * Push analytics data on modal load.
   */
  componentDidMount() {
    const { cms, analyticsContent } = this.props;
    const pageName = ExecutionEnvironment.canUseDOM ? document.location.pathname : constants.CART_PAGE_URL_PATHNAME;
    const analyticsDataLoadModal = {
      event: 'errormessage',
      eventCategory: 'error message',
      eventAction: `cart error|${pageName}`,
      eventLabel: `${cms.notEnoughItemsText}`
    };
    analyticsContent(analyticsDataLoadModal);
  }

  /**
   * Method to handle click of edit button. Pushes analytics data and then calls toggle function from props.
   */
  handleClickOfEditInCart() {
    const { analyticsContent, toggleModal } = this.props;
    const analyticsDataEditInCart = {
      event: 'shoppingcart',
      eventCategory: 'shopping cart',
      eventAction: 'cart error modal action',
      eventLabel: 'edit in cart'
    };
    analyticsContent(analyticsDataEditInCart);
    toggleModal();
  }

  /**
   * Method to handle clicking X button. Pushes analytics data and calls toggle modal function from props.
   */
  handleClickOfCloseButton() {
    const { analyticsContent, toggleModal } = this.props;
    const analyticsDataCloseBtn = {
      event: 'shoppingcart',
      eventCategory: 'shopping cart',
      eventAction: 'cart error modal action',
      eventLabel: 'close modal'
    };
    analyticsContent(analyticsDataCloseBtn);
    toggleModal();
  }

  constructModalContent() {
    return (
      <React.Fragment>
        <button onClick={this.handleClickOfCloseButton} className={styles.closeBtnModal}>
          X
        </button>
        <div className={`${styles.unavailableModal} my-6 mx-3 mx-lg-4`}>
          <h4 className="mb-1 header">{this.props.cms.commonLabels.weAreSorryText}</h4>
          <span className="o-copy__16reg subHeader">{this.props.cms.notEnoughItemsText}</span>

          {this.props.items.map(item => (
            <div className="py-3 item" key={item.orderItemId}>
              <div className={`${styles.modalErrMsg} o-copy__14reg p-1 mb-2`}>
                {item.errorType === constants.outOfStock && this.props.cms.errorMsg.outOfStock}
                {item.errorType === constants.limitedStock && this.props.cms.errorMsg.limitedStock}
              </div>

              <div className="productInfo col-12 px-0 d-flex flex-wrap itemInfo">
                <div className="imageBlock col-2 col-md-2 col-lg-2 pr-half">
                  <img src={item.skuDetails.skuInfo.fullImage} alt="Product" className="mr-quarter mr-md-3" />
                </div>
                <div className="productInfoBlock col-10 col-md-5 px-1 px-lg-0">
                  <div className="o-copy__14reg">{item.skuDetails.skuInfo.name}</div>
                  {item.skuDetails.skuInfo.skuAttributes &&
                    item.skuDetails.skuInfo.skuAttributes.length > 0 && (
                      <div className="mt-1">
                        <span className="o-copy__14bold">{item.skuDetails.skuInfo.skuAttributes[0].name}:</span>
                        <span className="o-copy__14reg ml-1">{item.skuDetails.skuInfo.skuAttributes[0].value}</span>
                      </div>
                    )}
                </div>
                <div className="qtyInfo offset-2 offset-md-0 col-10 col-md-5 px-1 pl-md-1">
                  <span className="o-copy__14bold">{this.props.cms.commonLabels.quantityLabel}: </span>
                  <span className="o-copy__14reg ml-half">{item.quantity}</span>
                  <span className="o-copy__14reg price">${item.orderItemDiscountedPrice || item.orderItemPrice}</span>
                </div>
              </div>
            </div>
          ))}
          <div className="submit">
            <Button className="mt-2" size="M" auid="crt_editInCartbtn" onClick={this.handleClickOfEditInCart}>
              {this.props.cms.editInCartLabel}
            </Button>
          </div>
        </div>
      </React.Fragment>
    );
  }

  render() {
    return (
      <Modal
        overlayClassName={styles.overlay}
        className={`${styles.modal} col-md-9 col-lg-7`}
        isOpen={this.props.modalStatus}
        onRequestClose={this.handleClickOfCloseButton}
        shouldCloseOnOverlayClick={false}
      >
        {this.constructModalContent()}
      </Modal>
    );
  }
}

UnavailableItemsModal.propTypes = {
  cms: PropTypes.object,
  items: PropTypes.array,
  modalStatus: PropTypes.bool,
  toggleModal: PropTypes.func,
  analyticsContent: PropTypes.func
};

export default UnavailableItemsModal;
