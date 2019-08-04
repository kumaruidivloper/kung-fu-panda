/* eslint complexity:1 */
import ExecutionEnvironment from 'fbjs/lib/ExecutionEnvironment';
import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import Modal from 'react-modal';
import { getSpecification } from './helpers';
import { Price, header, product, videoStyles } from './style';
import { OUT_OF_STOCK_LABEL } from './constants';
import ProductVideoViewer from '../../productVideoViewer';

const PriceComp = ({ amount }) => {
  const price = amount.split('.');
  return (
    <Price>
      {price[0]}
      <small>{price[1]}</small>
    </Price>
  );
};

class Header extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      isModalOpen: false
    };

    this.openVideo = this.openVideo.bind(this);
    this.closeVideo = this.closeVideo.bind(this);
    this.getVideoWidget = this.getVideoWidget.bind(this);
    this.getDescription = this.getDescription.bind(this);
  }

  getVideoWidget(video) {
    return (
      <div className="row h-100">
        <header.PlayButton
          className="play-button"
          role="button"
          tabIndex="0"
          onClick={this.openVideo}
          onKeyDown={this.openVideo}
          data-auid="HVB_heroVideoComponent"
        >
          <header.PlayIcon>
            <svg width="24px" height="24px" viewBox="0 0 160 160" version="1.1" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <path
                  d="M61.5777973,37.8267406 L122.085709,79.1978208 C122.541615,79.5095379 122.658504,80.1318199 122.346787,80.5877266 C122.276718,80.6902071 122.188179,80.7787446 122.085698,80.8488123 L61.5792769,122.217713 C61.1233662,122.529424 60.5010857,122.412527 60.1893746,121.956616 C60.075699,121.790354 60.0148776,121.59364 60.014874,121.392231 L60.0133836,38.6522507 C60.0133736,38.0999659 60.4610808,37.6522426 61.0133656,37.6522326 C61.2147908,37.652229 61.4115223,37.7130534 61.5777973,37.8267406 Z M80,149.333333 C41.7706667,149.333333 10.6666667,118.229333 10.6666667,80 C10.6666667,41.7706667 41.7706667,10.6666667 80,10.6666667 C118.229333,10.6666667 149.333333,41.7706667 149.333333,80 C149.333333,118.229333 118.229333,149.333333 80,149.333333 M80,0 C35.8186667,0 0,35.8186667 0,80 C0,124.181333 35.8186667,160 80,160 C124.192,160 160,124.181333 160,80 C160,35.8186667 124.192,0 80,0"
                  id="path-1"
                />
              </defs>
              <g id="Page-1" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                <g id="Icon/UI/Video/Outlined">
                  <g id="color/gray">
                    <mask id="mask-2" fill="white">
                      <use xlinkHref="#path-1" />
                    </mask>
                    <use id="Mask" fill="#0055a6" xlinkHref="#path-1" />
                    <g id="color/white/white" mask="url(#mask-2)" fill="#0055a6">
                      <g transform="translate(-86.666667, -86.666667)" id="BG">
                        <rect x="0" y="0" width="333" height="333" />
                      </g>
                    </g>
                  </g>
                </g>
              </g>
            </svg>
          </header.PlayIcon>
          <span>{video.label}</span>
        </header.PlayButton>
        {ExecutionEnvironment.canUseDOM &&
          video.url && (
            <Modal
              isOpen={this.state.isModalOpen}
              overlayClassName={videoStyles.backdrop}
              className={videoStyles.container}
              onRequestClose={this.closeVideo}
              shouldCloseOnOverlayClick
            >
              <div className="close-icon">
                <button className="close-modal-button" onClick={this.closeVideo} aria-label="close video overlay">
                  <span className="academyicon icon-close icon a-close-icon" aria-hidden="true" />
                </button>
              </div>
              <ProductVideoViewer autoPlay videoUrl={video.url} />
            </Modal>
          )}
      </div>
    );
  }

  getDescription(disclaimer, style) {
    return (
      <section className={style}>
        {this.props.productinfo.productSpecifications.map(feature => {
          if (Object.values(feature)[0]) {
            return (
              <div key={Object.values(feature)[0].key} className="o-copy__14reg mt-1">
                <span> {Object.values(feature)[0].value}</span>
              </div>
            );
          }
          return '';
        })}
        {this.props.inventoryAPIDone && (
          <Fragment>
            {disclaimer && <span className="o-copy__12bold d-block py-1">{disclaimer.value}</span>}
            <div className={product.showDesktop}>
              {this.props.noStock ? (
                <div className="mt-2 o-copy__14bold">{OUT_OF_STOCK_LABEL}</div>
              ) : (
                <Fragment>
                  <PriceComp amount={this.props.productinfo.productPrice.salePrice} />
                  {this.props.productinfo.promoMessage && (
                    <div className={`o-copy__14bold ${header.promo}`}>{this.props.productinfo.promoMessage}</div>
                  )}
                </Fragment>
              )}
            </div>
          </Fragment>
        )}
      </section>
    );
  }

  openVideo() {
    this.setState({
      isModalOpen: true
    });
    const { gtmDataLayer, s } = this.props;
    gtmDataLayer.push({
      event: 'pdpDetailClick',
      eventCategory: 'pdp interactions',
      eventAction: 'pdp|mixed media|thumbnail video',
      eventLabel: s.bundleClickLabel && s.bundleClickLabel.toLowerCase()
    });
  }

  closeVideo() {
    this.setState({
      isModalOpen: false
    });
  }

  render() {
    const { bundletype } = this.props.productinfo;
    const { customStyles } = product;

    const disclaimer = getSpecification(this.props.productinfo.bundleSpecifications, 'bundleProductDisclaimer');
    const video = {
      labelObj: getSpecification(this.props.productinfo.bundleSpecifications, 'bundleVideoLabel'),
      urlObj: getSpecification(this.props.productinfo.bundleSpecifications, 'bundleVideoURL')
    };

    const isDynamicKit = bundletype && bundletype.toLowerCase() === 'dynamickit';

    if (video.labelObj && video.urlObj) {
      video.label = video.labelObj.value;
      video.url = video.urlObj.value;
    }

    return (
      <Fragment>
        <div className={header.main}>
          <div className="container full-width pdy-31 pdx-16">
            {this.props.productinfo.adBug &&
              this.props.productinfo.adBug.length && (
                <div className="row">
                  <div className="col-12">
                    <header.Ad>{this.props.productinfo.adBug[0]}</header.Ad>
                  </div>
                </div>
              )}
            <div className="row">
              <div className="col-lg-6 full-width product-specifications">
                <h2 className={`mt-4 ${header.h2}`}>{this.props.productinfo.name}</h2>
                {this.getDescription(disclaimer, isDynamicKit ? customStyles.type_bundle : customStyles.type_default)}
              </div>
              <div className="col-lg-2 full-width video-link">{video.url && video.label ? this.getVideoWidget(video) : ''} &#160;</div>
              <div className="col-lg-4 full-width product-img-thumbnail">
                <img className={header.img} src={`${this.props.productinfo.thumbnail}?wid=325&hei=325`} alt="" />
              </div>
              {isDynamicKit && this.getDescription(disclaimer, customStyles.type_kit)}
            </div>
          </div>
        </div>
        {this.props.inventoryAPIDone && (
          <div className={`${product.showMobile} pl-1 mb-1`}>
            {this.props.noStock ? (
              <div className="mt-2 o-copy__14bold">{OUT_OF_STOCK_LABEL}</div>
            ) : (
              <Fragment>
                <PriceComp amount={this.props.productinfo.productPrice.salePrice} />
                {this.props.productinfo.promoMessage && <div className={`o-copy__14bold ${header.promo}`}>{this.props.productinfo.promoMessage}</div>}
              </Fragment>
            )}
          </div>
        )}
      </Fragment>
    );
  }
}

PriceComp.propTypes = {
  amount: PropTypes.string
};

PriceComp.defaultProps = {
  amount: '0.00'
};

Header.propTypes = {
  productinfo: PropTypes.object,
  noStock: PropTypes.bool,
  bundletype: PropTypes.string,
  s: PropTypes.object,
  inventoryAPIDone: PropTypes.bool,
  gtmDataLayer: PropTypes.array
};

export default Header;
