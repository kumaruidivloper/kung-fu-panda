import ExecutionEnvironment from 'fbjs/lib/ExecutionEnvironment';
import PropTypes from 'prop-types';
import React from 'react';
import ReactDOM from 'react-dom';
import { cx } from 'react-emotion';
import Input from '@academysports/fusion-components/dist/InputField';
import Button from '@academysports/fusion-components/dist/Button';

import axios from 'axios';
import { Provider, connect } from 'react-redux';
import { compose } from 'redux';
import reducer from './reducer';
import saga from './saga';
import { NODE_TO_MOUNT, DATA_COMP_ID } from './constants';
import { preScreenCallRequest } from './actions';

import injectReducer from '../../utils/injectReducer';
import injectSaga from '../../utils/injectSaga';
import CreditApplicationModal from '../creditApplicationModal';
import {
  WrapperDiv,
  myLabel,
  btn,
  errorRedColor
} from './styles';

const formData = {
  title: 'Mr',
  firstName: 'Mohan',
  lastName: 'Raj'
};

class Prescreen extends React.PureComponent {
  static getInitialProps() {
    return axios.get('');
  }

  constructor(props) {
  super(props);
  this.state = {
    preCode: '',
    validPrecode: false,
    invalidPreCode: '',
    modalIsOpen: false,
    originalCode: ''
  };
  this.normalize = this.normalize.bind(this);
  this.handleSubmit = this.handleSubmit.bind(this);
  this.closeModal = this.closeModal.bind(this);
  }

   handleSubmit = e => {
    e.preventDefault();
    const myPreCode = this.state.preCode.replace('-', '');
    if (myPreCode.length < 1) {
          this.setState({
            invalidPreCode: 'Prescreen code cannot be empty!!',
            validPrecode: false
          });
        } else if (myPreCode.length < 13) {
          this.setState({
            invalidPreCode: 'Prescreen code is not less than 12 digits!!',
            validPrecode: false
          });
        } else if (myPreCode.length > 13) {
          this.setState({
            invalidPreCode: 'Prescreen code cannot be more than 12 digits!!',
            validPrecode: false
          });
        } else {
           // this.setState({ modalIsOpen: true });
           // this.props.fnPreScreenCode(this.state.originalCode);
          //  this.props.fnPreScreenFeatureCall(this.state.originalCode);
          this.setState({
            invalidPreCode: '',
            validPrecode: true
          });
          this.setState({ modalIsOpen: true });
        }
   }

   closeModal() {
    this.setState({ modalIsOpen: false });
  }

   normalize = e => {
    const re = /^[0-9\b]+$/;
    const hyp = /^[0-9-]*$/;

    if (!hyp.test(e.target.value)) {
        return false;
      } else if (hyp.test(e.target.value)) {
      const val = e.target.value.replace(/(\d{4})(\d{4})(\d{4})/, '$1-$2-$3');
        this.setState({ preCode: val, originalCode: e.target.value });
      }
   }

   render() {
    return (
      <WrapperDiv>
        <Provider store={window.store}>
          <div className="container">
            {this.state.modalIsOpen && (
            <CreditApplicationModal
              modalIsOpen={this.state.modalIsOpen}
              closeModal={this.closeModal}
              formInitialData={formData}
              layout="Prefill"
            />
              )}
            <div className="d-flex flex-wrap">
              <form className="row w-100" name="prescreen" onSubmit={this.handleSubmit}>
                <div className="col-12 col-md-4">
                  <center>
                    <div className={cx('o-copy__16bold mt-3')}>
                      <label className={`${myLabel}`} htmlFor="prescreeninput">HAVE A PRESCREEN CODE?</label>
                    </div>
                  </center>
                </div>
                <div className="col-12 col-md-4 py-md-half mt-1">
                  <center>
                    <Input
                      id="preCode"
                      value={this.state.preCode}
                      classname="w-100"
                      maxLength="16"
                      onChange={this.normalize}
                      placeholder="XXXX-XXXX-XXXX"
                    />
                    {!this.state.validPrecode ? (
                      <span className={cx('o-copy__12reg', errorRedColor)} role="alert">
                        {this.state.invalidPreCode}
                      </span>
                    ) : null}
                  </center>
                </div>
                <div className="col-12 col-md-3 py-md-half">
                  <center>
                    <Button type="submit" className={`${btn}`}>
                      ACCEPT OFFER
                    </Button>
                  </center>
                </div>
              </form>
            </div>
          </div>
        </Provider>
      </WrapperDiv>
    );
  }
}

Prescreen.propTypes = {
  fnPreScreenFeatureCall: PropTypes.func.isRequired
};

const mapStateToProps = state => ({});
const mapDispatchToProps = dispatch => ({ fnPreScreenCode: data => dispatch(preScreenCallRequest(data)) });
const withConnect = connect(mapStateToProps, mapDispatchToProps);
if (ExecutionEnvironment.canUseDOM) {
  const withReducer = injectReducer({ key: NODE_TO_MOUNT, reducer });
  const withSaga = injectSaga({ key: NODE_TO_MOUNT, saga });
  const PrescreenContainer = compose(
    withReducer,
    withSaga,
    withConnect
  )(Prescreen);
  [...document.querySelectorAll(`[data-component="${NODE_TO_MOUNT}"]`)].forEach(el => {
    ReactDOM.hydrate(
      <Provider store={window.store}>
        <PrescreenContainer {...window.ASOData[el.getAttribute(`${DATA_COMP_ID}`)]} />
      </Provider>,
      el
    );
  });
}

export default withConnect(Prescreen);
