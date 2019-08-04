import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import ExecutionEnvironment from 'fbjs/lib/ExecutionEnvironment';
import CardCommonMyAccount from '../cardCommonMyAccount';
import AddNewGiftCard from './addNewGiftCard';
import * as styles from './styles';
import { internalGiftDivision, removeDisplay } from './myAccountPaymentDisplay';
import EmptyCondition from './emptyCondition';
import { iconColor } from '../cardCommonMyAccount/styles';
import { scrollIntoView } from './../../utils/scroll';
import { LIVE_CHAT } from '../checkoutPaymentOptions/constants';
import { CUSTOMER_CARE_NO, analyticsErrorEvent, analyticsErrorEventCategory, analyticsGCErrorEventAction } from './constants';
import { getErrorMessagesFromDOM, analyticsErrorTracker } from './../../utils/analyticsUtils';
class GiftCardDisplay extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      showGiftCard: false,
      showGiftFormOnEmpty: false,
      giftCardRemoveItemID: '',
      undoClick: false
    };
    this.renderEmptyGiftCardOrForm = this.renderEmptyGiftCardOrForm.bind(this);
    this.showGiftFormOnEmptyClick = this.showGiftFormOnEmptyClick.bind(this);
    this.toggleGiftCard = this.toggleGiftCard.bind(this);
    this.handleGiftCardRemove = this.handleGiftCardRemove.bind(this);
    this.callAddGiftCard = this.callAddGiftCard.bind(this);
    this.handleUndoClick = this.handleUndoClick.bind(this);
    this.handleCloseClick = this.handleCloseClick.bind(this);
    this.removeGiftCardDisplayOrCommon = this.removeGiftCardDisplayOrCommon.bind(this);
    this.addNewGiftCard = React.createRef();
    this.giftCard = React.createRef();
  }

  componentDidUpdate(prevProps) {
    // This is to bring Gift card section to focus whenever add new gift card initiated
    // isFetching conditions added only to make sure add gift card call in initiated and start focus on Gift card section
    const { userGiftCards: { data = [] } = {} } = prevProps;
    const { userGiftCards: { data: currentData = [] } = {}, addGiftCardData: { isFetching } = {} } = this.props;
    if (currentData.length > data.length && isFetching) {
      scrollIntoView(document.getElementById('gift-card-container'), { offset: -60 });
    }
  }

  callAddGiftCard(data) {
    this.props.fnaddGiftCard(this.props.profileID, data);
    scrollIntoView(document.getElementById('gift-card-container'), { offset: -60 });
  }
  handleUndoClick() {
    this.setState({ undoClick: true });
    this.setState({ giftCardRemoveItemID: '' });
  }
  handleCloseClick() {
    this.setState({ undoClick: true });
    this.props.fnRemoveGiftCard(this.props.profileID, this.state.giftCardRemoveItemID);
    this.setState({ giftCardRemoveItemID: '' });
  }
  toggleGiftCard(flag) {
    this.setState({ showGiftCard: flag });
  }
  showGiftFormOnEmptyClick() {
    this.setState({ showGiftFormOnEmpty: !this.state.showGiftFormOnEmpty });
  }
  /**
   * extracts server side erros from DOM and pushes analytics data to GTM layer.
   */
  pushServerSideErrors() {
    const giftCardContainer = document.querySelectorAll('#gift-card-container');
    getErrorMessagesFromDOM(giftCardContainer, '.gift-card-error').then(data => {
      analyticsErrorTracker(analyticsErrorEvent, analyticsErrorEventCategory, analyticsGCErrorEventAction, data, {}, {}, this.props);
    });
  }
  handleGiftCardRemove(itemID) {
    this.setState({ giftCardRemoveItemID: itemID });
    this.setState({ undoClick: false });
    scrollIntoView(document.getElementById('gift-card-container'), { offset: -60 });
    setTimeout(() => {
      this.setState({ giftCardRemoveItemID: '' });
      if (!this.state.undoClick) {
        this.props.fnRemoveGiftCard(this.props.profileID, itemID);
      }
    }, 5000);
  }
  removeGiftCardDisplayOrCommon(item, cms) {
    const displayText = cms.endingHasBeenDeletedLabel.replace('{{giftCardNo}}', '-'.concat(item.giftCardNumber.slice(-4)));
    return (
      <React.Fragment>
        {this.state.giftCardRemoveItemID && this.state.giftCardRemoveItemID === item.xwalletId ? (
          removeDisplay(this.handleUndoClick, this.handleCloseClick, cms, displayText)
        ) : (
          <CardCommonMyAccount
            render={internalGiftDivision(cms, item)}
            showRemove
            RemoveHandler={this.handleGiftCardRemove}
            deleteItem={item.xwalletId}
            cms={cms}
          />
        )}
      </React.Fragment>
    );
  }

  /**
   * Method to scroll up to error block if any errors
   */
  scrollToErrorBlock() {
    if (ExecutionEnvironment.canUseDOM) {
      scrollIntoView(document.getElementById('gift-card-container'), { offset: -60 });
    }
    this.pushServerSideErrors();
  }

  renderEmptyGiftCardOrForm(cms) {
    const { analyticsContent } = this.props;
    return (
      <React.Fragment>
        {this.state.showGiftFormOnEmpty ? (
          <AddNewGiftCard
            toggleGiftCard={this.toggleGiftCard}
            fnaddGiftCardsProp={this.callAddGiftCard}
            cms={cms}
            emptyCondition
            showGiftFormOnEmptyClick={this.showGiftFormOnEmptyClick}
            analyticsContent={analyticsContent}
          />
        ) : (
          <EmptyCondition
            heading={cms.youHaveNoGiftCardListedLabel}
            button={cms.addNewGiftCardLabel}
            giftCardOpen
            cms={cms}
            fnaddGiftCardsProp={this.callAddGiftCard}
            toggleGiftCard={this.toggleGiftCard}
            showGiftFormOnEmptyClick={this.showGiftFormOnEmptyClick}
          />
        )}
      </React.Fragment>
    );
  }
  render() {
    const { cms, userGiftCards, addGiftCardData, analyticsContent } = this.props;
    const { showGiftCard } = this.state;
    if (userGiftCards.error || addGiftCardData.error) {
      this.scrollToErrorBlock();
    }
    const errorHandler = userGiftCards.error ? userGiftCards : addGiftCardData;
    const { commonLabels: { liveChatUrl, customerCareNumber, liveChatLabel } = '' } = cms || {};
    const error = cms.errorMsg[errorHandler.errorCode]
      ? cms.errorMsg[errorHandler.errorCode].replace(
          LIVE_CHAT,
          `<a href=${liveChatUrl} class="text-link-14" rel="noopener noreferrer" target="_blank">${liveChatLabel || 'Live Chat'}</a>`
        )
      : '';
    const apierror = error.replace(CUSTOMER_CARE_NO, customerCareNumber);
    return (
      <div id="gift-card-container">
        <div className="d-flex flex-sm-row flex-column justify-content-between pb-2 pb-md-2 pt-3 pt-md-6">
          <div className="o-copy__16bold">{cms.checkoutLabels.orderSummaryGiftCardText}</div>
          {!showGiftCard && userGiftCards && userGiftCards.data && userGiftCards.data.length > 0 ? (
            <button className={`${styles.bgNone} o-copy__14reg pt-2 pt-sm-0`} onClick={() => this.toggleGiftCard(true)}>
              <span className={classNames('academyicon icon-plus', 'pr-half', iconColor)} />
              <span className={styles.textLink}>{cms.addNewGiftCardLabel}</span>
            </button>
          ) : null}
        </div>
        <div role="textbox" tabIndex="0" className="w-100 d-block" ref={this.addNewGiftCard}>
          {userGiftCards && errorHandler.error ? (
            <section className={`${styles.errorWrapper} d-flex flex-column p-1 mb-2 gift-card-error`}>
              <span dangerouslySetInnerHTML={{ __html: apierror }} />
            </section>
          ) : (
            ''
          )}
        </div>
        {showGiftCard ? (
          <AddNewGiftCard
            toggleGiftCard={this.toggleGiftCard}
            fnaddGiftCardsProp={this.callAddGiftCard}
            cms={cms}
            emptyCondition={false}
            analyticsContent={analyticsContent}
          />
        ) : null}
        <div ref={this.giftCard}>
          {userGiftCards && userGiftCards.data && userGiftCards.data.length > 0
            ? userGiftCards.data.map(item => this.removeGiftCardDisplayOrCommon(item, cms))
            : this.renderEmptyGiftCardOrForm(cms)}
        </div>
      </div>
    );
  }
}

GiftCardDisplay.propTypes = {
  cms: PropTypes.object.isRequired,
  userGiftCards: PropTypes.object,
  addGiftCardData: PropTypes.object,
  fnRemoveGiftCard: PropTypes.func,
  profileID: PropTypes.string,
  fnaddGiftCard: PropTypes.func,
  analyticsContent: PropTypes.func
};

export default GiftCardDisplay;
