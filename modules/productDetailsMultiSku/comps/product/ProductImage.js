import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { product } from '../style';

class ProductImage extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      selected: this.props.defaultSku.thumbnail,
      altImages: this.props.defaultSku.alternateImages
    };

    this.getAlternateImages = this.getAlternateImages.bind(this);
  }

  // static getDerivedStateFromProps(nextProps, state) {
  //   if (state.selected !== nextProps.defaultSku.thumbnail) {
  //     return {
  //       selected: nextProps.defaultSku.thumbnail,
  //       altImages: nextProps.defaultSku.alternateImages
  //     };
  //   }
  //   return null;
  // }

  componentDidUpdate(prevProps) {
    if (prevProps.defaultSku.skuId !== this.props.defaultSku.skuId) {
      this.setSelectedAttr(this.props);
    } else if ((prevProps.defaultSku.skuId && this.props.defaultSku.skuId) === 'N/A') {
      this.setSelectedAttr(this.props);
    }
  }

  setSelectedAttr = props => {
    this.setState({
      selected: props.defaultSku.thumbnail || props.defaultSku.imageURL,
      altImages: props.defaultSku.alternateImages
    });
  };

  getAlternateImages() {
    const { selected, altImages } = this.state;
    return (
      <div className={product.thumbnails}>
        {altImages.map(url => (
          <button key={url} className={`product-thumbnail ${selected === url ? 'selected' : ''}`} onClick={() => this.updateDisplayImage(url)}>
            <img className="product-thumb-img" src={`${url}?wid=150&hei=150`} alt="" />
          </button>
        ))}
      </div>
    );
  }

  updateDisplayImage(img) {
    this.setState({
      selected: img
    });
  }

  render() {
    const { selected, altImages } = this.state;
    return (
      <Fragment>
        <div className={`product-image ${product.productImage}`}>
          <img src={`${selected}?wid=325&hei=325`} className="" alt="" />
        </div>
        {altImages && altImages.length > 1 && this.getAlternateImages()}
      </Fragment>
    );
  }
}

ProductImage.propTypes = {
  defaultSku: PropTypes.object
};

ProductImage.defaultProps = {
  defaultSku: {}
};

export default ProductImage;
