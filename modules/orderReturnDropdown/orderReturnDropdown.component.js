import ExecutionEnvironment from 'fbjs/lib/ExecutionEnvironment';
import PropTypes from 'prop-types';
import React from 'react';
import ReactDOM from 'react-dom';
import Dropdown from '@academysports/fusion-components/dist/Dropdown';
import QuantityCounter from '../baitVariant/components/QuantityCounter';
import { NODE_TO_MOUNT, DATA_COMP_ID, returnKey, dropdownList } from './constants';

class OrderReturnDropdown extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      quantity: this.props.quantity,
      modalIsOpen: false,
      exceptionOccured: false,
      selectedOption: 0,
      selectedCode: ''
    };
    this.ddMapping = returnKey;
    this.updateQuantity = this.updateQuantity.bind(this);
    this.updateItems = this.updateItems.bind(this);
  }

  getSelectedOption(index, ddOptions) {
    const value = ddOptions[index];
    this.setState(
      {
        selectedOption: index,
        selectedCode: this.ddMapping[value.code]
      },
      this.updateItems
    );
  }

  getDropdownOption() {
    const { cms } = this.props;
    const options = cms.selectReasonDropdownOptions[0].code ? cms.selectReasonDropdownOptions : dropdownList;
    const optionsValue = [];
    optionsValue.push({ title: 'Select' });
    options.map(data => optionsValue.push({ title: data.text, ...data }));
    return optionsValue;
  }

  updateItems = () => {
    this.updateQuantity(this.state.quantity);
  };
  /**
   * func to update list of quantities to be returned
   * @param {integer} qty, quantity for item to be returned
   */
  updateQuantity(qty) {
    const { itemId, returnEligible, skuId, orderItemsId, invNum, updateItemQuantity } = this.props;
    const { selectedOption, selectedCode } = this.state;
    if (qty <= this.props.quantity) {
      this.setState(
        {
          quantity: qty
        },
        () => {
          if (selectedOption !== 0) {
            updateItemQuantity(itemId, qty, selectedOption, returnEligible, skuId, orderItemsId, invNum, selectedCode);
          }
        }
      );
    }
  }

  render() {
    const { cms } = this.props;
    const ddOptions = this.getDropdownOption();
    return (
      <div className="col-12 d-flex flex-column flex-md-row">
        <div className="offset-md-2 col-12 col-md-5 pl-md-4">
          <div className="o-copy__14bold pb-half">{cms.selectReasonDropdownText}</div>
          <div className="pl-0">
            <Dropdown
              DropdownOptions={ddOptions}
              onSelectOption={index => {
                this.getSelectedOption(index, ddOptions);
              }}
              initiallySelectedOption={0}
              disabled={false}
              borderWidth="1px"
              borderRadius="4px"
              titleClass="o-copy__14reg"
            />
          </div>
        </div>
        {this.state.selectedOption > 0 && (
          <div className="pt-1 pt-md-0 col-12 col-md-5">
            <div className="o-copy__14bold pb-half">{cms.quantityToReturnText}</div>
            <div className="pl-0">
              <QuantityCounter {...this.state} lowerBoundary={1} upperBoundary={this.props.quantity} updateQuantity={this.updateQuantity} />
            </div>
          </div>
        )}
      </div>
    );
  }
}

OrderReturnDropdown.propTypes = {
  cms: PropTypes.object.isRequired
};

if (ExecutionEnvironment.canUseDOM) {
  [...document.querySelectorAll(`[data-component="${NODE_TO_MOUNT}"]`)].forEach(el => {
    ReactDOM.hydrate(<OrderReturnDropdown {...window.ASOData[el.getAttribute(`${DATA_COMP_ID}`)]} />, el);
  });
}

export default OrderReturnDropdown;
