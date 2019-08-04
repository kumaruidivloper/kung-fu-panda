import React from 'react';
import PropTypes from 'prop-types';
import Dropdown from '@academysports/fusion-components/dist/Dropdown';
// import Dropdown from './../../dropdown';
import { labelStyle, invalidTxt, stateDropdown } from './../../style';

class renderSelectField extends React.PureComponent {
  render() {
    const { input: { name, onChange, value }, id, label, initiallySelectedOption, DropdownOptions, meta: { touched, error }, ...rest } = this.props;
    return (
      <div className={`${stateDropdown}`}>
        <label htmlFor={this.props.id} onClick={this.getFocus} className={`${labelStyle} o-copy__14bold mb-half`}>{label}</label>
        <div>
          <Dropdown
            value={value}
            onSelectOption={(_, title) => onChange(title)}
            DropdownOptions={DropdownOptions}
            initiallySelectedOption={initiallySelectedOption}
            name={name}
            id={id}
            {...rest}
          />
          {touched && error && <div className={`o-copy__12reg ${invalidTxt}`}><span>{error}</span></div>}
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
