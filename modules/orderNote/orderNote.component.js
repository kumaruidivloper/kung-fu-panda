import ExecutionEnvironment from 'fbjs/lib/ExecutionEnvironment';
import PropTypes from 'prop-types';
import React from 'react';
import ReactDOM from 'react-dom';
import classNames from 'classnames';

import { noteContainer, horizontalLine } from './style';
import { NODE_TO_MOUNT, DATA_COMP_ID } from './constants';

class OrderNote extends React.PureComponent {
  render() {
    const { cms } = this.props;
    return (
      <div className="pt-half pt-md-3">
        <div className={`${noteContainer}`}>
          <div className="pl-1 pl-md-3 pt-2 pb-quarter o-copy__16bold">{cms.commonLabels.noteLabel}:</div>
          <hr className={classNames('d-md-none mx-1', horizontalLine)} />
          <div className="pl-1 pl-md-3 pb-2 pb-md-1 o-copy__14reg">{cms.noteText}</div>
        </div>
      </div>
    );
  }
}

OrderNote.propTypes = {
  cms: PropTypes.object.isRequired
};

if (ExecutionEnvironment.canUseDOM) {
  [...document.querySelectorAll(`[data-component="${NODE_TO_MOUNT}"]`)].forEach(el => {
    ReactDOM.hydrate(<OrderNote {...window.ASOData[el.getAttribute(`${DATA_COMP_ID}`)]} />, el);
  });
}

export default OrderNote;
