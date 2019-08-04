import PropTypes from 'prop-types';
import React from 'react';
import QuantityCard from './components/quantityCard';
import { QuantityCardContainer } from './baitVariantStyles';
import { COLOR } from './constants';
import Tabs from './tabs';

class BaitVariant extends React.PureComponent {
  constructor(props) {
    super(props);
    this.getProductDetails = this.getProductDetails.bind(this);
    this.updateQuantity = this.updateQuantity.bind(this);
  }

  getProductDetails(tabIndex, products) {
    const { getSelectedImage } = this.props;
    const selectedProduct = products[tabIndex];
    getSelectedImage(selectedProduct);
  }

  /**
   * This method to filter item details to get quantity cards by color
   */
  getFilteredQuantityCardsByColor = (selectedColor, itemDetails) => (itemDetails && itemDetails.filter(({ color }) => color === selectedColor));

  /**
   * Method to identify end column
   * this is used to add padding styles to quantity cards
   */
  isEndColumn = index => (index + 1) % 3 !== 0;

  /**
   * Method to update choosen quantity to item details object.
   * this itemDetails will get added to list of items which will be later passed to Add to cart
   */
  updateQuantity = (qty, itemDetails) => {
    const { handleUpdateQuantity } = this.props;
    handleUpdateQuantity(itemDetails);
  };

  render() {
    const { productItem, selectedProduct, products, selectedIndex, itemDetails, messages, gtmDataLayer, shippingSLA } = this.props;
    let selectedColor = '';
    if (selectedProduct) {
      const { color } = selectedProduct;
      selectedColor = color;
    }
    const filteredCardsByColor = this.getFilteredQuantityCardsByColor(selectedColor, itemDetails);
    return (
      <div className="pb-1 pb-md-1 order-2 order-md-2">
        <Tabs
          gtmDataLayer={gtmDataLayer}
          productItem={productItem}
          onTabChange={index => this.getProductDetails(index, products)}
          selectedIndex={selectedIndex}
          products={products}
        />
        <div className="pb-2" tabIndex="-1">
          <span className="pr-half o-copy__14bold">{COLOR}:</span>
          <span className="o-copy__14reg">{selectedColor}</span>
        </div>
        {filteredCardsByColor && (
          <QuantityCardContainer className="row">
            {filteredCardsByColor.map((item, index) => (
              <QuantityCard
                endColumn={this.isEndColumn(index)}
                productItem={productItem}
                data={item}
                selectedQty={item.totalQty}
                updateQuantity={this.updateQuantity}
                messages={messages}
                shippingSLA={shippingSLA}
              />
            ))}
          </QuantityCardContainer>
        )}
      </div>
    );
  }
}

BaitVariant.propTypes = {
  productItem: PropTypes.object,
  getSelectedImage: PropTypes.func,
  handleUpdateQuantity: PropTypes.func,
  selectedProduct: PropTypes.object,
  products: PropTypes.object,
  selectedIndex: PropTypes.number,
  itemDetails: PropTypes.object,
  messages: PropTypes.object,
  shippingSLA: PropTypes.object,
  gtmDataLayer: PropTypes.array
};

export default BaitVariant;
