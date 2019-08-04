import React from 'react';
import PropTypes from 'prop-types';
import Modal from 'react-modal';
import { connect } from 'react-redux';
import axios from 'axios';
import BisModalContent from './BisModalContent';
import BisSuccessContent from './BisSuccessContent';
import * as style from '../styles';
import { OUT_OF_STOCK, LINK, EXTRA_TEXT, OUT_OF_STOCK_BAIT } from '../constants';
import { printBreadCrumb } from '../../../utils/breadCrumb';

class BackInStock extends React.PureComponent {
  constructor(props) {
    super(props);

    this.elRref = React.createRef();

    this.state = {
      isModalOpen: false,
      emailError: false,
      emailId: '',
      mobile: '',
      submitted: false
    };

    this.onChangeinput = this.onChangeinput.bind(this);
    this.onClickGetNotified = this.onClickGetNotified.bind(this);
    this.onClickSubmitNotified = this.onClickSubmitNotified.bind(this);
    this.toggleModal = this.toggleModal.bind(this);
    this.validateForm = this.validateForm.bind(this);
    this.getModalContent = this.getModalContent.bind(this);
    this.responseHandler = this.responseHandler.bind(this);
    this.errorHandler = this.errorHandler.bind(this);
  }

  onChangeinput(e) {
    this.setState({ emailId: e.target.value });
  }

  onClickNotifiedGA(product) {
    if (product && product.breadCrumb && product.name) {
      this.props.gtmDataLayer.push({
        event: 'shoppingcart',
        eventCategory: 'shopping cart',
        eventAction: 'notify me when in stock',
        eventLabel: `${printBreadCrumb(product.breadCrumb)} > ${product.name}`.toLowerCase()
      });
    }
  }

  onClickSubmitNotified(e) {
    e.preventDefault();

    const isFormValid = this.validateForm();
    const { isBait = null, productDetailsBait = null, productData = null, productItem = null } = this.props;
    const { emailId, mobile } = this.state;

    let notifyobj = {};
    let skuArray = [];

    if (this.props.isNoDiffBundle) {
      skuArray = this.props.productItem.SKUs.map(sku => sku.skuId);

      notifyobj = {
        bundleProductId: productItem.id,
        components: skuArray,
        email: emailId,
        mobile
      };
    } else {
      notifyobj = {
        productId: isBait ? productDetailsBait['product-info'].productinfo.id : productData.id,
        skuId: isBait ? productDetailsBait['product-info'].productinfo.defaultSku : productData.skuId,
        email: emailId,
        mobile
      };
    }

    if (isFormValid) {
      axios
        .post(`/api/inventory/notify${this.checkIfBundle()}`, notifyobj)
        .then(this.responseHandler)
        .catch(this.errorHandler);
    }
  }

  onClickGetNotified() {
    this.toggleModal();
    this.onClickNotifiedGA(this.props.productItem);
  }

  getModalContent() {
    if (this.state.submitted) {
      return <BisSuccessContent {...this.props} s={{ ...this.state }} toggleModal={this.toggleModal} />;
    }
    return (
      <BisModalContent
        {...this.props}
        onClickSubmitNotified={this.onClickSubmitNotified}
        s={this.state}
        toggleModal={this.toggleModal}
        onChangeinput={this.onChangeinput}
      />
    );
  }

  getLabelfromAEM(labels, key) {
    return labels.key || key;
  }

  errorHandler() {
    console.error('Something went wrong');
    this.setState({
      isModalOpen: false
    });
  }

  responseHandler(response) {
    if (response.status === 200) {
      this.setState({
        submitted: true
      });
    } else {
      this.errorHandler();
    }
  }

  checkIfBundle() {
    return this.props.isNoDiffBundle ? '?isBundle=true' : '';
  }

  validateForm() {
    const { emailId } = this.state;
    const invalidEmail = !emailId.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i);

    this.setState({
      emailError: invalidEmail
    });

    return !invalidEmail;
  }

  toggleModal() {
    this.setState(previousState => ({
      isModalOpen: !previousState.isModalOpen,
      emailError: false,
      emailId: '',
      mobile: '',
      submitted: false
    }));
  }

  render() {
    const { labels = {}, isBait, showBis } = this.props;
    return (
      <div className="row" ref={this.elRref}>
        {!isBait && <div className={`${style.msg} col-12`}>{this.getLabelfromAEM(labels, OUT_OF_STOCK)}</div>}
        {isBait && <div className={`${style.msg} col-12 o-copy__14bold pb-half pr-0`}>{labels.OUT_OF_STOCK_BAIT || OUT_OF_STOCK_BAIT}</div>}
        {showBis && (
          <div className="col-12">
            <span
              className={style.link}
              role="button"
              onClick={this.onClickGetNotified}
              data-auid="PDP_getNotifiedBackInStock"
              tabIndex={0}
              onKeyPress={this.onClickGetNotified}
            >
              {labels.LINK || LINK}
            </span>
            <span> {labels.EXTRA_TEXT || EXTRA_TEXT} </span>
          </div>
        )}
        {this.state.isModalOpen && (
          <Modal
            appElement={this.elRref && this.elRref.current ? this.elRref.current : ''}
            overlayClassName={style.OverLay}
            className={style.modal}
            isOpen={this.state.isModalOpen}
            onRequestClose={this.toggleModal}
            shouldCloseOnOverlayClick
          >
            {this.getModalContent()}
          </Modal>
        )}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  gtmDataLayer: state.gtmDataLayer,
  productDetailsBait: state.productDetailsBait
});

BackInStock.propTypes = {
  productData: PropTypes.object,
  productItem: PropTypes.object,
  gtmDataLayer: PropTypes.array,
  labels: PropTypes.object,
  isNoDiffBundle: PropTypes.bool,
  isBait: PropTypes.bool,
  productDetailsBait: PropTypes.object,
  showBis: PropTypes.bool
};

export default connect(mapStateToProps)(BackInStock);
