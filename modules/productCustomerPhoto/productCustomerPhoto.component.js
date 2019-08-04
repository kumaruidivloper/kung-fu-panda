/* globals process */
import ExecutionEnvironment from 'fbjs/lib/ExecutionEnvironment';
import PropTypes from 'prop-types';
import React from 'react';
import { envScriptURL } from '@academysports/aso-env';
import loadScript from '../../utils/loadScriptTag';

class ProductCustomerPhoto extends React.PureComponent {
  componentDidMount() {
    const { partNumber } = this.props;
    const script = `${envScriptURL.customerPhotos}`;
    loadScript(script).then(() => {
      if (ExecutionEnvironment.canUseDOM && partNumber) {
        window.BVWidgets.display(
          {
            productId: partNumber // their doc requires both key and value to be strings
          },
          () => {}
        );
      }
    });
  }

  render() {
    const { partNumber } = this.props;
    if (!partNumber) {
      return null;
    }
    return (
      <div>
        <div id="bv-gallery" role="listbox" aria-label="Customer Photos" />
        <div data-bv-show="curations" data-bv-widget="bv-carousel" />
      </div>
    );
  }
}

ProductCustomerPhoto.propTypes = {
  partNumber: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
};

export default ProductCustomerPhoto;
