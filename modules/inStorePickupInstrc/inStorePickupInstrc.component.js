import ExecutionEnvironment from 'fbjs/lib/ExecutionEnvironment';
import PropTypes from 'prop-types';
import React from 'react';
import ReactDOM from 'react-dom';
import classNames from 'classnames';
import { instrucContainer, horizontalLine } from './style';
import { NODE_TO_MOUNT, DATA_COMP_ID } from './constants';

class InStorePickupInstrc extends React.PureComponent {
  render() {
    const { cms } = this.props;
    return (
      <div className="pt-half pt-md-3">
        <div className={`${instrucContainer}`}>
          <div className="o-copy__16bold pt-2 pb-half pb-md-1 pl-1 pl-md-3">{cms.inStorePickupLabel.inStorePickupInstructionsLabel}</div>
          <hr className={classNames('mx-1 mx-md-3', horizontalLine)} />
          <div className="px-1 px-md-3 o-copy__14reg">
            <span className="o-copy__14reg px-1" dangerouslySetInnerHTML={{ __html: cms.inStorePickupLabel.inStorePickupInstructionsForBopis }}></span>
          </div>
        </div>
      </div>
    );
  }
}

InStorePickupInstrc.propTypes = {
  cms: PropTypes.object.isRequired
};

if (ExecutionEnvironment.canUseDOM) {
  [...document.querySelectorAll(`[data-component="${NODE_TO_MOUNT}"]`)].forEach(el => {
    ReactDOM.hydrate(<InStorePickupInstrc {...window.ASOData[el.getAttribute(`${DATA_COMP_ID}`)]} />, el);
  });
}

export default InStorePickupInstrc;
