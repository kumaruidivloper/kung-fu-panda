import ExecutionEnvironment from 'fbjs/lib/ExecutionEnvironment';
import PropTypes from 'prop-types';
import React from 'react';
import ReactDOM from 'react-dom';
import { NODE_TO_MOUNT, DATA_COMP_ID } from './constants';
// import SkeletonBox from '../skeletonBox/skeletonBox.component';

class ProductSuggestions extends React.PureComponent {
  render() {
    const { cms } = this.props;
    return (
      <div className="productSuggestions">
        {cms.title}
        {/* <SkeletonBox boxName={cms ? cms.title : 'Product Suggestions'} height={300} /> */}
      </div>
    );
  }
}
ProductSuggestions.propTypes = {
  cms: PropTypes.object.isRequired
};

if (ExecutionEnvironment.canUseDOM) {
  [...document.querySelectorAll(`[data-component="${NODE_TO_MOUNT}"]`)].forEach(el => {
    ReactDOM.hydrate(<ProductSuggestions {...window.ASOData[el.getAttribute(`${DATA_COMP_ID}`)]} />, el);
  });
}

export default ProductSuggestions;
