// It renders the Dropdown which is using to manage state.

import React from 'react';
import PropTypes from 'prop-types';
import Dropdown from '@academysports/fusion-components/dist/Dropdown';
import { labelStyle, errorStyles, stateDropdown } from '../../styles';

class renderSelectField extends React.PureComponent {
  render() {
    const { input: { name, onChange, value }, id, label, initiallySelectedOption, DropdownOptions, meta: { touched, error }, ...rest } = this.props;
    return (
      <div className={`${stateDropdown}`}>
        <label htmlFor={id} className={`${labelStyle} o-copy__14bold`}>{label}</label>
        <div>
          <Dropdown
            bordercolor={touched && error ? '#c00000' : 'rgba(0, 0, 0, 0.3)'}
            value={value}
            onSelectOption={(index, title) => onChange(title)}
            DropdownOptions={DropdownOptions}
            initiallySelectedOption={initiallySelectedOption}
            name={name}
            id={id}
            {...rest}
          />
          {touched && error && <span className={`${errorStyles} o-copy__12reg text-danger`}>{error}</span>}
        </div>
      </div>
    );
  }
}

renderSelectField.propTypes = {
  input: PropTypes.object.isRequired,
  label: PropTypes.string,
  meta: PropTypes.object,
  DropdownOptions: PropTypes.array.isRequired,
  initiallySelectedOption: PropTypes.number
};
export default renderSelectField;
