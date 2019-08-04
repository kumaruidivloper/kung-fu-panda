import ExecutionEnvironment from 'fbjs/lib/ExecutionEnvironment';
import PropTypes from 'prop-types';
import React from 'react';
import ReactDOM from 'react-dom';

import axios from 'axios';
import Button from '@academysports/fusion-components/dist/Button';
import { Provider, connect } from 'react-redux';
import { compose } from 'redux';
import reducer from './reducer';
import saga from './saga';
import { NODE_TO_MOUNT, DATA_COMP_ID } from './constants';

import injectReducer from '../../utils/injectReducer';
import injectSaga from '../../utils/injectSaga';
import CreditApplicationModal from '../creditApplicationModal';
import {
  WrapperDiv,
  anchorLink,
  align
} from './styles';

class ApplyForCard extends React.PureComponent {
  static getInitialProps() {
    return axios.get('');
  }

  constructor(props) {
    super(props);
    this.state = {
      modalIsOpen: false
    };
    this.closeModal = this.closeModal.bind(this);
    this.applyCard = this.applyCard.bind(this);
    }

  closeModal() {
    this.setState({ modalIsOpen: false });
  }

  applyCard() {
    this.setState({ modalIsOpen: true });
  }

  render() {
    const { cms, api } = this.props;
    return (
      <WrapperDiv>
        <div className="container">
          {this.state.modalIsOpen && (
          <CreditApplicationModal
            modalIsOpen={this.state.modalIsOpen}
            closeModal={this.closeModal}
            layout="General"
          />
              )}
          <div className="row">
            <div className="col-md-6">
              <h4 className={`${align}`}>APPLY TODAY</h4>
              <p className={`${align}`}>
                  Credit cards differ in the terms they offer, but most credit cards have the same basic features. Once you understand these basic credit card features, you'll have an easier time choosing and using a credit card wisely.
                  Credit cards differ in the terms they offer, but most credit cards have the same basic features. Once you understand these basic credit card features, you'll have an easier time choosing and using a credit card wisely.
              </p>
              <div>
                <Button type="button" onClick={this.applyCard}>
                  APPLY NOW
                </Button>
                <a className={`${anchorLink}`} href="/dummyLink" >Manage Your Card</a>
              </div>
            </div>
            <div className="col-md-6">
              <img src="https://i.postimg.cc/Y9h0LLxk/imageedit-1-2106158513.png" alt="card" border="0" />
            </div>
          </div>
        </div>
      </WrapperDiv>
    );
  }
}

ApplyForCard.propTypes = {
  cms: PropTypes.object.isRequired,
  api: PropTypes.object
};

const mapStateToProps = state => ({});
const mapDispatchToProps = dispatch => ({});
const withConnect = connect(mapStateToProps, mapDispatchToProps);
if (ExecutionEnvironment.canUseDOM) {
  const withReducer = injectReducer({ key: NODE_TO_MOUNT, reducer });
  const withSaga = injectSaga({ key: NODE_TO_MOUNT, saga });
  const ApplyForCardContainer = compose(
    withReducer,
    withSaga,
    withConnect
  )(ApplyForCard);
  [...document.querySelectorAll(`[data-component="${NODE_TO_MOUNT}"]`)].forEach(el => {
    ReactDOM.hydrate(
      <Provider store={window.store}>
        <ApplyForCardContainer {...window.ASOData[el.getAttribute(`${DATA_COMP_ID}`)]} />
      </Provider>,
      el
    );
  });
}

export default withConnect(ApplyForCard);
