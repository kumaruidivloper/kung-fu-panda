import React from 'react';
import PropTypes from 'prop-types';
import { cx } from 'react-emotion';
import Dropdown from '@academysports/fusion-components/dist/Dropdown';
import * as emo from './DropDown.styles';

class dropDownSelectState extends React.PureComponent {
  render() {
    const {
      input: { name, id, onChange, value },
      label,
      initiallySelectedOption,
      DropdownOptions,
      meta: { touched, error },
      ...rest
    } = this.props;
    const labelClassName = cx(emo.label, 'o-copy__14bold', { ['form-scroll-to-error']: touched && error }); // eslint-disable-line no-useless-computed-key
    const selectedOption = Math.max(DropdownOptions.findIndex((item = {}) => item.title === value), 0);
    return (
      <div className={`${emo.stateDropdown}`}>
        <label className={labelClassName}>{label}</label>
        <div className={cx({ [emo.hasError]: touched && error })}>
          <Dropdown
            value={value}
            onSelectOption={(_, title) => onChange(title)}
            DropdownOptions={DropdownOptions}
            initiallySelectedOption={selectedOption || initiallySelectedOption}
            className="w-100"
            name={name}
            id={id}
            {...rest}
          />
          {touched && error && <span className="body-12-regular text-danger">{error}</span>}
        </div>
      </div>
    );
  }
}

dropDownSelectState.propTypes = {
  input: PropTypes.object.isRequired,
  label: PropTypes.string,
  meta: PropTypes.object,
  DropdownOptions: PropTypes.array.isRequired,
  initiallySelectedOption: PropTypes.number
};

export default dropDownSelectState;
