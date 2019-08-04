import ExecutionEnvironment from 'fbjs/lib/ExecutionEnvironment';
import PropTypes from 'prop-types';
import React from 'react';
import ReactDOM from 'react-dom';
import { cx } from 'react-emotion';
import './select.component.scss';
import { NODE_TO_MOUNT, DATA_COMP_ID, KEY_CODE_ENTER, KEY_CODE_ARROW_UP, KEY_CODE_ARROW_DOWN } from './constants';
import { SelectWrapper, Selection, Options, Option, optionStyle } from './styles';

class Select extends React.PureComponent {
  constructor(props) {
    super(props);
    this.selectRef = React.createRef();
    this.firstSelectionOption = React.createRef();
    this.handleOutsideClick = this.handleOutsideClick.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.handleSelectBlur = this.handleSelectBlur.bind(this);
    this.keyboardTrigger = false;
    this.state = {
      isOpen: false,
      selectedItem: this.props.selectedItem,
      focusIndex: 0
    };
  }

  componentDidMount() {
    if (ExecutionEnvironment.canUseDOM) {
      document.addEventListener('click', this.handleOutsideClick, false);
      document.addEventListener('keydown', this.handleKeyPress);
    }
  }

  componentWillReceiveProps(nextProps) {
    const {
      selectedItem: { value }
    } = nextProps;
    const {
      selectedItem: { value: currentValue }
    } = this.props;
    if (value !== currentValue) {
      this.setState({
        selectedItem: nextProps.selectedItem
      });
    }
  }

  componentDidUpdate() {
    const { isOpen } = this.state;
    if (isOpen && this.firstSelectionOption && this.firstSelectionOption.current) {
      ReactDOM.findDOMNode(this.firstSelectionOption.current).focus(); // eslint-disable-line
    }
  }

  componentWillUnmount() {
    this.mounted = false;
    document.removeEventListener('click', this.handleOutsideClick, false);
    document.removeEventListener('keydown', this.handleKeyPress);
  }

  /**
   * onChange event handler
   * @param {object} e - event object
   */
  handleSelection = e => {
    const { isOpen: current } = this.state;
    if (e.clientX || this.keyboardTrigger) {
      this.setState({
        isOpen: !current
      });
    }
  };

  /**
   * Handles component blur
   * @param {object} e - Event object
   */
  handleSelectBlur(e) {
    const { currentTarget } = e;

    // Wait to complete any react events to complete
    setTimeout(() => {
      if (!currentTarget.contains(document.activeElement)) {
        this.setState({
          isOpen: false
        });
        this.keyboardTrigger = false;
      }
    }, 0);
  }

  /**
   * Click event handler
   * @param {object} item - Option object
   */
  handleOptionClick = item => {
    const { disabled, disabledSelectable } = item;
    const { onSelect } = this.props;
    if (disabledSelectable || !disabled) {
      this.setState({
        selectedItem: item,
        isOpen: false
      });
      this.keyboardTrigger = false;

      if (onSelect) {
        onSelect(item);
      }
    }
  };

  // Set a flag on keyboard evnt
  handleKeyPress(e) {
    if (e.keyCode !== 18) {
      this.keyboardTrigger = true;
    } else {
      this.setState({
        isOpen: false
      });
    }
  }

  /**
   * Document click handler
   * @param {object} event - Event object
   */
  handleOutsideClick(event) {
    const currentDOM = this.selectRef.current && ReactDOM.findDOMNode(this.selectRef.current); // eslint-disable-line
    if (!currentDOM.contains(event.target)) {
      this.setState({
        isOpen: false
      });
      this.keyboardTrigger = false;
    }
  }

  /**
   * Keyboad event handler
   * @param {object} event - Event object
   * @param {object} item - Option object
   */
  handleOnKeyMove = (event, item) => {
    const { keyCode, key } = event;
    const { focusIndex } = this.state;
    const { options } = this.props;
    const optionLength = options.length - 1;
    if (keyCode === KEY_CODE_ARROW_UP || keyCode === KEY_CODE_ARROW_DOWN || keyCode === KEY_CODE_ENTER) {
      event.preventDefault();
    }
    if (keyCode === KEY_CODE_ENTER) {
      event.stopPropagation();
      this.handleOptionClick(item);
    } else if (keyCode === KEY_CODE_ARROW_DOWN) {
      this.setState({
        focusIndex: focusIndex < optionLength ? focusIndex + 1 : 0
      });
    } else if (keyCode === KEY_CODE_ARROW_UP) {
      this.setState({
        focusIndex: focusIndex > 0 ? focusIndex - 1 : optionLength
      });
    } else {
      /* Added for issue KER-9184 : Allow optiosn to be selected based on keyevents other than arrow and tab */
      let targetIndex = 0;
      this.props.options.find((optitem, index) => {
        if (key === optitem.label.charAt(0).toLowerCase()) {
          targetIndex = index;
          return index;
        }
        return false;
      });
      if (targetIndex) {
        this.setState({
          focusIndex: targetIndex
        });
      }
    }
  };
  handleOnMouseMove = event => event.target.focus();

  render() {
    const { isOpen, selectedItem, focusIndex } = this.state;
    const { options, classes } = this.props;
    const selectIcon = isOpen ? 'icon-chevron-up' : 'icon-chevron-down';
    return (
      <SelectWrapper ref={this.selectRef} onBlur={this.handleSelectBlur}>
        <div
          area-owns="academyoptions"
          role="button"
          className={cx(Selection, classes)}
          onFocus={this.handleSelection}
          onMouseUp={this.handleSelection}
          onKeyPress={this.handleSelection}
          tabIndex="0"
        >
          <span>
            {selectedItem.label}
            {selectedItem.secondaryLabel}
          </span>
          <i role="presentation" aria-label="select" className={`academyicon ${selectIcon} filter-icon--blue`} />
        </div>
        {isOpen && (
          <Options id="academyoptions">
            {options.map((option, index) => {
              const { label, disabled, secondaryLabel, className } = option;
              const optionProps = {
                key: label,
                tabIndex: 0,
                onKeyDown: event => this.handleOnKeyMove(event, option),
                onMouseMove: event => this.handleOnMouseMove(event, option),
                selected: option.value === selectedItem.value,
                onClick: () => this.handleOptionClick(option),
                role: 'button'
              };
              if (index === focusIndex) {
                optionProps.ref = this.firstSelectionOption;
              }
              return (
                <Option className={cx(optionStyle(optionProps.selected, disabled), className)} aria-label={label} {...optionProps}>
                  <span>{label}</span>
                  <span>{secondaryLabel}</span>
                </Option>
              );
            })}
          </Options>
        )}
      </SelectWrapper>
    );
  }
}
Select.propTypes = {
  classes: PropTypes.object,
  options: PropTypes.array.isRequired,
  onSelect: PropTypes.func,
  selectedItem: PropTypes.object // pass default or selectedItem from parent
};

Select.defaultProps = {
  selectedItem: { label: 'Choose an option' }
};

if (ExecutionEnvironment.canUseDOM) {
  [...document.querySelectorAll(`[data-component="${NODE_TO_MOUNT}"]`)].forEach(el => {
    ReactDOM.hydrate(<Select {...window.ASOData[el.getAttribute(`${DATA_COMP_ID}`)]} />, el);
  });
}

export default Select;
