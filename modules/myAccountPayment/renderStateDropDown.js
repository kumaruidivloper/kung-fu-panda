import React from 'react';
import PropTypes from 'prop-types';
import Dropdown from '@academysports/fusion-components/dist/Dropdown';
import { labelStyle, borderRed } from './styles';

class renderSelectField extends React.PureComponent {
  render() {
    const {
      input: { onChange, value },
      label,
      initiallySelectedOption,
      DropdownOptions,
      meta: { touched, error },
      ...rest
    } = this.props;
    return (
      <div>
        <label className={`${labelStyle} o-copy__14bold p-quarter`}>{label}</label>
        <div>
          <Dropdown
            value={value}
            onSelectOption={(index, title) => onChange(title)}
            {...rest}
            DropdownOptions={DropdownOptions}
            initiallySelectedOption={initiallySelectedOption}
            className={touched && error && borderRed}
          />
          {touched && error && <span className="body-12-regular text-danger">{error}</span>}
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
