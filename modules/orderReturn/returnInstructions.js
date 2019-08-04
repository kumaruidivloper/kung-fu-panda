import ExecutionEnvironment from 'fbjs/lib/ExecutionEnvironment';
import PropTypes from 'prop-types';
import React from 'react';
import ReactDOM from 'react-dom';
import classNames from 'classnames';
import { instrucContainer, horizontalLine } from './style';
import { NODE_TO_MOUNT, DATA_COMP_ID } from './constants';

class ReturnInstructions extends React.PureComponent {
  render() {
    const { cms } = this.props;
    return (
      <div className="pt-2">
        <div className={`${instrucContainer}`}>
          <div className="o-copy__16bold pt-1 pt-md-2 pb-half pb-md-1 pl-1 pl-md-3">{cms.returnInstructionsLabelUpper}</div>
          <hr className={classNames('mx-1 mx-md-3', horizontalLine)} />
          <div className="p-1 o-copy__14reg">
            {cms.returnInstructionDropdownOptions.map((instruction, key) => (
              <p className="o-copy__14reg px-1">{key + 1}. {instruction.text}</p>
            ))}
          </div>
        </div>
      </div>
    );
  }
}

ReturnInstructions.propTypes = {
  cms: PropTypes.object.isRequired
};

if (ExecutionEnvironment.canUseDOM) {
  [...document.querySelectorAll(`[data-component="${NODE_TO_MOUNT}"]`)].forEach(el => {
    ReactDOM.hydrate(<ReturnInstructions {...window.ASOData[el.getAttribute(`${DATA_COMP_ID}`)]} />, el);
  });
}

export default ReturnInstructions;
