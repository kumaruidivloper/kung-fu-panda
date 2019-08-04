import ExecutionEnvironment from 'fbjs/lib/ExecutionEnvironment';
import PropTypes from 'prop-types';
import React from 'react';
import ReactDOM from 'react-dom';
import Button from '@academysports/fusion-components/dist/Button';
import { emptyContainer } from './style';
import { NODE_TO_MOUNT, DATA_COMP_ID } from './constants';

class WishlistEmptyState extends React.PureComponent {
  browseProduct() {
    window.location.href = '/';
  }
  render() {
    const { cms } = this.props;
    return (
      <div className="col-12 px-0">
        <h5 className="mb-1 mb-md-2">{cms.title}</h5>
        <div className="pb-1 d-none d-sm-block o-copy__16bold">{cms.commonLabels.zeroItemsLabel}</div>
        <div className="pb-3 d-block d-sm-none o-copy__14bold">{cms.commonLabels.zeroItemsLabel}</div>
        <div className={`${emptyContainer}`}>
          <div className="pt-4 pb-4">
            <div className="pt-4 pt-md-6 pb-3 pb-md-2 text-center o-copy__14reg"> {cms.yourWishlistEmptyLabel} </div>
            <div className="o-copy__14bold text-center pb-4 pb-md-6">
              <Button auid="browse_product_button" type="submit" size="S" btntype="primary" onClick={this.browseProduct}>
                {cms.browseProductsLabel}
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

WishlistEmptyState.propTypes = {
  cms: PropTypes.object.isRequired
};

if (ExecutionEnvironment.canUseDOM) {
  [...document.querySelectorAll(`[data-component="${NODE_TO_MOUNT}"]`)].forEach(el => {
    ReactDOM.hydrate(<WishlistEmptyState {...window.ASOData[el.getAttribute(`${DATA_COMP_ID}`)]} />, el);
  });
}

export default WishlistEmptyState;
