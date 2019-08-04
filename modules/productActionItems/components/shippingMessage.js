import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import Tooltip from '@academysports/fusion-components/dist/Tooltip';
import { css } from 'react-emotion';
import axios from 'axios';
import { getCityState } from '@academysports/aso-env';
import { get } from '@react-nitro/error-boundary';
import CalculateShippingModal from '../../orderSummary/calculateShippingModal';
import { GET_SUCCESS_CODE, CART_USER_CHANGED_ZIP, SHIPPING_MSG } from '../../../apps/cart/cart.constants';
import Storage from '../../../utils/StorageManager';

import {
  LABEL_ZIP_CODE,
  LABEL_SUBMIT,
  LABEL_ENTER_ZIP_CODE_SUBMIT,
  LABEL_CALCULATE_SHIPPING,
  LABEL_CHANGE_ZIP_CODE,
  SHIP_TO,
  ESTIMATED_SHIPPING,
  SHIPPING_NOT_AVAILABLE
} from '../constants';
import { isMobile } from '../../../utils/userAgent';
import { printBreadCrumb } from '../../../utils/breadCrumb';
import BopisMessage from './BopisMessage';
import { GEO_LOCATED_ZIP_CODE } from '../../findAStoreModalRTwo/constants';

const fontStyle = css`
  margin-top: 8px;
  font-weight: bold;
`;
const link = css`
  color: #0055a6;
  cursor: pointer;
  margin-top: 0.1rem;
  outline: none;
  border: none;
  background: none;
  padding: 0;
  text-align: left;

  :hover {
    text-decoration: underline;
  }
`;
const flex = css`
  display: flex;
`;
const Icons = css`
  display: block;
  height: 24px;
  width: 26px;
  margin-top: 5px;
`;
const ShippingIcon = css`
  background: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCI+CiAgICA8ZGVmcz4KICAgICAgICA8cGF0aCBpZD0iYSIgZD0iTTIzLjk5OCAzLjg2NGMwIC4wMDQuMDAzLjAwNi4wMDMuMDF2MTMuMTAzYS43MTEuNzExIDAgMCAxLS40NC42NTdsLTkgMy43MzVjLS4wMDguMDA1LS4wMTguMDAzLS4wMjguMDA2YS43My43MyAwIDAgMS0uMjQ0LjA0OS43My43MyAwIDAgMS0uMjQ0LS4wNDljLS4wMS0uMDAzLS4wMi0uMDAyLS4wMy0uMDA2bC05LTMuNzM1YS43MTIuNzEyIDAgMCAxLS40MzgtLjY1N3YtMS4zNjNINnYuODg5bDcuNTc2IDMuMTQzVjguMDgzTDYgNC45NHYxLjc1OEg0LjU3N1YzLjg3M2wuMDAzLS4wMS0uMDAyLS4wMTFhLjcwNC43MDQgMCAwIDEgLjEwMy0uMzM1LjcuNyAwIDAgMSAuMjA2LS4yMjhjLjAwMy0uMDAyLjAwMy0uMDA2LjAwNi0uMDA4LjAwNy0uMDA0LjAxNS0uMDAyLjAyMi0uMDA4LjA0NC0uMDI2LjA4OC0uMDU0LjEzOS0uMDczbDktMy4xNmEuNzAyLjcwMiAwIDAgMSAuNDcgMGw5IDMuMTZhLjY4NC42ODQgMCAwIDEgLjEzOS4wNzVjLjAwNy4wMDQuMDE1LjAwMi4wMi4wMDYuMDA0LjAwMi4wMDUuMDA2LjAwOC4wMDhhLjcuNyAwIDAgMSAuMjM0LjI4LjcwNC43MDQgMCAwIDEgLjA3NS4yODNsLS4wMDIuMDEyem0tMS40MjEgMTIuNjM5VjQuOTM5TDE1IDguMDg0djExLjU2M2w3LjU3Ni0zLjE0NHptLTguMjg4LTkuNjY1bDcuMDEtMi45MS03LjAxLTIuNDYyLTcuMDExIDIuNDYyIDcuMDEgMi45MXptLTUuNTYzLjcyOWEuNzI3LjcyNyAwIDAgMSAwIDEuNDVoLThhLjcyNi43MjYgMCAwIDEgMC0xLjQ1aDh6bS4wNDcgMi45MWEuNjc5LjY3OSAwIDAgMSAwIDEuMzU4aC03YS42NzguNjc4IDAgMSAxIDAtMS4zNTdoN3ptLS4wNDQgMi44MTRhLjcyMy43MjMgMCAwIDEgMCAxLjQ0NWgtNmEuNzIzLjcyMyAwIDEgMSAwLTEuNDQ1aDZ6Ii8+CiAgICA8L2RlZnM+CiAgICA8ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDAgMSkiPgogICAgICAgIDxtYXNrIGlkPSJiIiBmaWxsPSIjZmZmIj4KICAgICAgICAgICAgPHVzZSB4bGluazpocmVmPSIjYSIvPgogICAgICAgIDwvbWFzaz4KICAgICAgICA8dXNlIGZpbGw9IiMyMzFGMjAiIHhsaW5rOmhyZWY9IiNhIi8+CiAgICAgICAgPGcgZmlsbD0iIzBCMSIgbWFzaz0idXJsKCNiKSI+CiAgICAgICAgICAgIDxwYXRoIGQ9Ik0tMTMtMTRoNTB2NTBoLTUweiIvPgogICAgICAgIDwvZz4KICAgIDwvZz4KPC9zdmc+Cg==')
    no-repeat;
`;
const ShippingIconFail = css`
  background: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCI+CiAgICA8ZGVmcz4KICAgICAgICA8cGF0aCBpZD0iYSIgZD0iTTIyLjU3NyAxNi41MDNMMTUgMTkuNjQ2VjguMDgzbDcuNTc2LTMuMTQ0djExLjU2NHptLTguMjg4LTkuNjY1bC03LjAxMS0yLjkxIDcuMDEtMi40NjJMMjEuMyAzLjkyOGwtNy4wMTEgMi45MXptOS43MDktMi45NzRjMCAuMDA0LjAwMy4wMDYuMDAzLjAxdjEzLjEwM2EuNzExLjcxMSAwIDAgMS0uNDQuNjU3bC05IDMuNzM1Yy0uMDA4LjAwNS0uMDE4LjAwMy0uMDI4LjAwNmEuNzMuNzMgMCAwIDEtLjI0NC4wNDkuNzMuNzMgMCAwIDEtLjI0NC0uMDQ5Yy0uMDEtLjAwMy0uMDItLjAwMi0uMDMtLjAwNmwtOS0zLjczNWEuNzEyLjcxMiAwIDAgMS0uNDM4LS42NTd2LTEuMzYzSDZ2Ljg4OWw3LjU3NiAzLjE0M1Y4LjA4M0w2IDQuOTR2MS43NThINC41NzdWMy44NzNsLjAwMy0uMDEtLjAwMi0uMDExYS43MDQuNzA0IDAgMCAxIC4xMDMtLjMzNS43LjcgMCAwIDEgLjIwNi0uMjI4Yy4wMDMtLjAwMi4wMDMtLjAwNi4wMDYtLjAwOC4wMDctLjAwNC4wMTUtLjAwMi4wMjItLjAwOC4wNDQtLjAyNi4wODgtLjA1NC4xMzktLjA3M2w5LTMuMTZhLjcwMi43MDIgMCAwIDEgLjQ3IDBsOSAzLjE2YS42ODQuNjg0IDAgMCAxIC4xMzkuMDc1Yy4wMDcuMDA0LjAxNS4wMDIuMDIuMDA2LjAwNC4wMDIuMDA1LjAwNi4wMDguMDA4YS43LjcgMCAwIDEgLjIzNC4yOC43MDQuNzA0IDAgMCAxIC4wNzUuMjgzbC0uMDAyLjAxMnpNOC43MjYgNy41NjZhLjcyNy43MjcgMCAwIDEgMCAxLjQ1aC04YS43MjYuNzI2IDAgMCAxIDAtMS40NWg4em0uMDQ3IDIuOTFhLjY3OS42NzkgMCAwIDEgMCAxLjM1OGgtN2EuNjc4LjY3OCAwIDEgMSAwLTEuMzU3aDd6bS0uMDQ0IDIuODE0YS43MjMuNzIzIDAgMCAxIDAgMS40NDVoLTZhLjcyMy43MjMgMCAxIDEgMC0xLjQ0NWg2eiIvPgogICAgPC9kZWZzPgogICAgPGcgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgwIDEpIj4KICAgICAgICA8bWFzayBpZD0iYiIgZmlsbD0iI2ZmZiI+CiAgICAgICAgICAgIDx1c2UgeGxpbms6aHJlZj0iI2EiLz4KICAgICAgICA8L21hc2s+CiAgICAgICAgPHVzZSBmaWxsPSIjMjMxRjIwIiB4bGluazpocmVmPSIjYSIvPgogICAgICAgIDxnIGZpbGw9IiM5QjlCOUIiIG1hc2s9InVybCgjYikiPgogICAgICAgICAgICA8cGF0aCBkPSJNLTEzLTE0aDUwdjUwaC01MHoiLz4KICAgICAgICA8L2c+CiAgICAgICAgPHBhdGggc3Ryb2tlPSIjQzAwMDAwIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS13aWR0aD0iMS41IiBkPSJNMS41IDIxLjVsMjEtMjEiLz4KICAgIDwvZz4KPC9zdmc+Cg==')
    no-repeat;
`;
const toolTipContainer = css`
  width: 250px;
  fontsize: 12px;
  fontfamily: Mallory-Book;
  margin: 0px;
`;
const tooltipStyle = css`
  margin: 0;
  padding: 0;
  background: transparent;
  color: #333;
  border: none;
`;
const disableClicks = css`
  pointer-events: none;
`;

class ShippingMessage extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      calculateShippingModalStatus: false,
      estimatedShipping: '',
      myZipCode: this.props.myZipCode,
      zipCodeAPIInfo: {}
    };
  }

  componentWillReceiveProps(nextProps) {
    const { estimatedShipping } = this.props;
    if (estimatedShipping !== nextProps.estimatedShipping) {
      this.setState({ estimatedShipping: nextProps.estimatedShipping });
    }
  }
  /**
   * Method to get default zip code from different sources
   * Zip code from state takes priority over prop or session stored (by user selection) zip code
   */
  getDefaultZipCode = (myZipCodeFromProp, myZipCodeFromState) =>
    Storage.getSessionStorage(CART_USER_CHANGED_ZIP) || myZipCodeFromState || myZipCodeFromProp || Storage.getSessionStorage(GEO_LOCATED_ZIP_CODE);

  /**
   * Method to set the zipcode displayed with estimated shipping label
   * @param {number} zip : Zipcode entered by user in calculate shipping modal.
   */
  setZipCode(zip) {
    axios
      .get(getCityState(zip))
      .then(response => {
        if (response.status === GET_SUCCESS_CODE) {
          Storage.setSessionStorage(CART_USER_CHANGED_ZIP, zip);
          this.toggleModal(zip);
        }
      })
      .catch(error => {
        this.setState({
          zipCodeAPIInfo: {
            error: true,
            errorInfo: error.data
          }
        });
      });
  }

  /**
   * Method to check if shipping is available for the selected sku
   * Return false if display only products, out of stock, sku N/A
   *
   * @param  {} onlineMessage = inventory response for the selected sku
   * @returns Boolean
   */
  checkShipping(onlineMessage) {
    const deliverySof = get(onlineMessage, 'deliveryMessage.onlineDeliveryMessage', {});
    let result = true;

    if (!onlineMessage.skuId) {
      return false;
    }

    switch (deliverySof.key) {
      case 'STORE_DISABLED_SOF':
        result = false;
        break;
      case 'NOT_SOLD_ONLINE':
        result = false;
        break;
      case 'OUT_OF_STOCK_ONLINE':
        result = false;
        break;
      case 'NOT_AVAILABLE_IN_STORE_SOF':
        result = false;
        break;
      case 'IN_STOCK_ONLINE':
        result = true;
        break;
      default:
        result = true;
    }
    return result;
  }

  /**
   * Method to toggle zipcode modalbox
   */
  toggleModal(zipCode) {
    const { updateAnalytics, productItem } = this.props;
    const { breadCrumb = [] } = productItem;
    this.setState({ calculateShippingModalStatus: !this.state.calculateShippingModalStatus, myZipCode: zipCode });
    if (updateAnalytics) {
      const eventaction = `${LABEL_CHANGE_ZIP_CODE.toLowerCase()}`;
      const removeAcademyLabel = {
        removeAcademyLabel: true
      };
      updateAnalytics({
        analyticsObject: {
          event: 'pdpDetailClick',
          eventCategory: 'pdp interactions',
          eventAction: `pdp|${eventaction}`,
          eventLabel: `${printBreadCrumb([...breadCrumb, productItem.name], removeAcademyLabel)}`.toLowerCase()
        }
      });
    }
  }

  createOnlineMessage(message) {
    const { deliveryMessage: { onlineDeliveryMessage = {} } = {} } = message;

    return { ...onlineDeliveryMessage, ...message };
  }

  renderShipToHome(myZipCode, estimatedShipping = []) {
    const { authMsgs = {} } = this.props;
    return (
      <div>
        <div className={`o-copy__14bold ${fontStyle}`} data-auid="PDP_OnlineMessage">
          {SHIP_TO} {myZipCode}
        </div>
        {estimatedShipping.length > 0 && (
          <div className="mt-quarter o-copy__14reg">
            {ESTIMATED_SHIPPING} {estimatedShipping}
            <Tooltip
              auid="productShippingMsg"
              direction="top"
              align="C"
              lineHeightFix={1.5}
              className="body-12-normal"
              content={
                <div className={`${toolTipContainer}`}>
                  <div id="descriptionTooltipShippingMsg" role="alert" className="o-copy__12reg">
                    {SHIPPING_MSG}
                  </div>
                </div>
              }
              showOnClick={isMobile()}
              ariaLabel={`Est. Arrival ${estimatedShipping}`}
            >
              &nbsp;
              <span>
                <button
                  className={`academyicon icon-information ${tooltipStyle}`}
                  role="tooltip" //eslint-disable-line
                  aria-describedby="descriptionTooltipShippingMsg"
                />
              </span>
            </Tooltip>
          </div>
        )}
        <button
          className={`${link} o-copy__14reg ${(authMsgs.isStoreLocatorEnabled === 'false' && disableClicks) || ''}`}
          onClick={() => this.toggleModal(myZipCode)}
        >
          {`${LABEL_CHANGE_ZIP_CODE}`}
        </button>
      </div>
    );
  }

  renderShippingNotAvailable() {
    return (
      <div className={`o-copy__14bold ${fontStyle}`} data-auid="PDP_OnlineMessage">
        {SHIPPING_NOT_AVAILABLE}
      </div>
    );
  }

  renderNonSOFShipping(shippingAvailable, myZipCode, estimatedShipping) {
    return shippingAvailable ? this.renderShipToHome(myZipCode, estimatedShipping) : this.renderShippingNotAvailable();
  }

  renderSOFShipping(props, estimatedShipping) {
    const message = this.createOnlineMessage(props.message);
    return (
      <BopisMessage
        message={message}
        isSof={props.isSof}
        findAStoreModal={props.findAStoreModal}
        updateAnalytics={props.updateAnalytics}
        toggleFindAStore={props.toggleFindAStore}
        fnGetProductItemId={props.fnGetProductItemId}
        productItem={props.productItem}
        authMsgs={props.authMsgs}
        myStore={props.myStore}
        selectedQuantity={props.selectedQuantity}
        shipping
        estimatedShipping={estimatedShipping}
      />
    );
  }

  render() {
    const { message, isSof, myZipCode: myZipCodeFromProp, labels = {} } = this.props;
    const { estimatedShipping, myZipCode: myZipCodeFromState, zipCodeAPIInfo = {} } = this.state;

    const shippingAvailable = this.checkShipping(message);

    const myZipCode = this.getDefaultZipCode(myZipCodeFromProp, myZipCodeFromState);

    const { ZIP_CODE, SUBMIT, ENTER_ZIP_CODE_SUBMIT, CALCULATE_SHIPPING } = labels;

    const zipLabels = {
      checkoutLabels: { zipCodeLabel: ZIP_CODE || LABEL_ZIP_CODE },
      commonLabels: { submitLabel: SUBMIT || LABEL_SUBMIT },
      enterZipcodeLabel: ENTER_ZIP_CODE_SUBMIT || LABEL_ENTER_ZIP_CODE_SUBMIT,
      calculateShippingLabel: CALCULATE_SHIPPING || LABEL_CALCULATE_SHIPPING
    };

    return (
      <Fragment>
        <CalculateShippingModal
          cms={zipLabels}
          labels={labels}
          zipCodeAPIInfo={zipCodeAPIInfo}
          zipcode={myZipCode}
          openModal={this.state.calculateShippingModalStatus}
          toggleModal={() => this.toggleModal(myZipCode)}
          onSetZipCode={zip => this.setZipCode(zip)}
          clearZipcode={() => null}
        />
        <div className={`${flex}`}>
          <div className="mr-1">
            {shippingAvailable ? <span className={`${Icons} ${ShippingIcon}`} /> : <span className={`${Icons} ${ShippingIconFail}`} />}
          </div>
          <div>
            {isSof
              ? this.renderSOFShipping(this.props, estimatedShipping)
              : this.renderNonSOFShipping(shippingAvailable, myZipCode, estimatedShipping)}
          </div>
        </div>
      </Fragment>
    );
  }
}
ShippingMessage.propTypes = {
  myZipCode: PropTypes.string,
  productItem: PropTypes.object,
  message: PropTypes.object,
  isSof: PropTypes.bool,
  labels: PropTypes.object,
  updateAnalytics: PropTypes.func,
  estimatedShipping: PropTypes.string,
  authMsgs: PropTypes.object
};
export default ShippingMessage;
