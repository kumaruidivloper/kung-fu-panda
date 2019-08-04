import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { fetchCityStateByZipCode } from '../../../../utils/buyNow/buyNow.api';
import { isValidZipCode } from '../../../../utils/validationRules';

function withCityStateLookup(WrappedComponent) {
  class WithCityStateLookup extends Component {
    constructor(props) {
      super(props);

      this.state = {
        cityStateByZipCodeResponse: undefined
        // , isFetchingCityStateByZipCode: undefined
      };

      this.onZipCodeChange = this.onZipCodeChange.bind(this);
      this.onFetchCityStateByZipCode = this.onFetchCityStateByZipCode.bind(this);
      this.onFetchCityStateByZipCodeSuccess = this.onFetchCityStateByZipCodeSuccess.bind(this);
      this.onFetchCityStateByZipCodeFail = this.onFetchCityStateByZipCodeFail.bind(this);
    }

    /**
     * @description Passed to zip code field to be executed on change.  Expects to recieve the zip code value. This is the entry point which starts the process of making a request to the server for the matching City/State.
     * @param {string} zipCode
     * @returns {undefined}
     */
    onZipCodeChange(zipCode) {
      if (isValidZipCode(zipCode)) {
        this.onFetchCityStateByZipCode(zipCode);
      } else if (this.state.cityStateByZipCodeResponse) {
        this.setState({ cityStateByZipCodeResponse: undefined });
      }
    }

    /**
     * @description Called from onZipCodeChange. Makes a call to API server to get City/State matching the passed in zipCode
     * @param {string} zipCode
     * @returns {undefined}
     */
    onFetchCityStateByZipCode(zipCode) {
      this.setState({
        cityStateByZipCodeResponse: undefined
        // , isFetchingCityStateByZipCode: true
      });
      fetchCityStateByZipCode(zipCode, this.onFetchCityStateByZipCodeSuccess, this.onFetchCityStateByZipCodeFail);
    }

    /**
     * @description Method to be executed on successful request made by onFetchCityStateByZipCode
     * @param {object} response
     * @returns {undefined}
     */
    onFetchCityStateByZipCodeSuccess(response) {
      this.setState({
        cityStateByZipCodeResponse: response
        // , isFetchingCityStateByZipCode: false
      });
    }

    /**
     * @description Method to be executed on failed request made by onFetchCityStateByZipCode
     * @param {object} response
     * @returns {undefined}
     */
    onFetchCityStateByZipCodeFail() {
      this.setState({
        cityStateByZipCodeResponse: undefined
        // , isFetchingCityStateByZipCode: false
      });
    }

    /**
     * @description Helper method to extract City & State from cityAndStateFromZipCode response.
     * @returns {object} { city, state }
     */
    getCityAndStateFromZipCodeResponse() {
      const { cityStateByZipCodeResponse } = this.state;
      const { data } = cityStateByZipCodeResponse || {};
      const { city, state } = data || {};
      return city && state ? { city, state } : {};
    }

    render() {
      const { city, state } = this.getCityAndStateFromZipCodeResponse();
      return <WrappedComponent {...this.props} zipCodeCity={city} zipCodeState={state} onZipCodeChange={this.onZipCodeChange} />;
    }
  }

  WithCityStateLookup.propTypes = {
    initialValues: PropTypes.object
  };

  return WithCityStateLookup;
}

export default withCityStateLookup;
