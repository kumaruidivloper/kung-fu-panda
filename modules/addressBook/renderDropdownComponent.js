import React from 'react';
import PropTypes from 'prop-types';
import { cx } from 'react-emotion';
import Dropdown from '@academysports/fusion-components/dist/Dropdown';
import { labelStyle, errorBorder, stateDropdown } from './styles';

class renderSelectField extends React.PureComponent {
  render() {
    const {
      input: { onChange, value },
      label,
      initiallySelectedOption,
      DropdownOptions,
      id,
      meta: { touched, error },
      ...rest
    } = this.props;
    return (
      <div className={`${stateDropdown}`}>
        {/* eslint-disable-next-line no-useless-computed-key */}
        <label className={cx(labelStyle, 'o-copy__14bold', { ['form-scroll-to-error']: touched && error })} htmlFor={id}>{label}</label>
        <div>
          <Dropdown
            auid={`${label}-dropdown`}
            value={value}
            id={id}
            onSelectOption={(index, title) => onChange(title)}
            {...rest}
            DropdownOptions={DropdownOptions}
            initiallySelectedOption={initiallySelectedOption}
            className={touched && error && errorBorder}
          />
          {touched && error && <span className="o-copy__12reg text-danger">{error}</span>}
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
