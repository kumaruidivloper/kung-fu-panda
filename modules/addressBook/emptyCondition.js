import PropTypes from 'prop-types';
import React from 'react';
import Button from '@academysports/fusion-components/dist/Button';
import * as styles from './styles';


class EmptyCondition extends React.PureComponent {
  constructor(props) {
    super(props);
    this.renderAddressEmpty = this.renderAddressEmpty.bind(this);
  }
  renderAddressEmpty(heading, button) {
    return (
      <React.Fragment>
        <div className="text-center">
          <div className="o-copy__14reg pb-2">{heading}</div>
          <Button auid="add_address_empty_btn" className={`${styles.button}`} onClick={() => this.props.onClickHandler(true, 'add')}>
            {button}
          </Button>
        </div>
      </React.Fragment>
    );
  }
  render() {
    const { heading, button } = this.props;
    return (
      <div className={`${styles.card} w-100 py-6`}>
        { this.renderAddressEmpty(heading, button)}
      </div>
    );
  }
}

EmptyCondition.propTypes = {
  heading: PropTypes.string,
  button: PropTypes.string,
  onClickHandler: PropTypes.func
};


export default EmptyCondition;
