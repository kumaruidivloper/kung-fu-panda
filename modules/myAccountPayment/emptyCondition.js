import PropTypes from 'prop-types';
import React from 'react';
import Button from '@academysports/fusion-components/dist/Button';
import * as styles from './styles';


class EmptyCondition extends React.PureComponent {
  constructor(props) {
    super(props);
    this.handleAddNewGiftCard = this.handleAddNewGiftCard.bind(this);
    this.renderCreditOrGift = this.renderCreditOrGift.bind(this);
  }
  handleAddNewGiftCard() {
    if (this.props.creditCardOpen) {
      this.props.showFormOnEmptyClick();
    }
    if (this.props.giftCardOpen) {
      this.props.showGiftFormOnEmptyClick();
    }
  }
  renderCreditOrGift(heading, button) {
    return (
      <React.Fragment>
        <div className="text-center">
          <div className="o-copy__14reg pb-2">{heading}</div>
          <Button auid="addNew-giftCard-btn" className={`${styles.button}`} onClick={this.handleAddNewGiftCard}>
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
        { this.renderCreditOrGift(heading, button)}
      </div>
    );
  }
}

EmptyCondition.propTypes = {
  heading: PropTypes.string,
  button: PropTypes.string,
  creditCardOpen: PropTypes.bool,
  giftCardOpen: PropTypes.bool,
  // fnaddGiftCardsProp: PropTypes.func,
  // toggleGiftCard: PropTypes.func,
  // cms: PropTypes.object,
  // creditCardForm: PropTypes.func
  // onSubmitForm: PropTypes.func,
  showFormOnEmptyClick: PropTypes.func,
  showGiftFormOnEmptyClick: PropTypes.func
};


export default EmptyCondition;
