import ExecutionEnvironment from 'fbjs/lib/ExecutionEnvironment';
import PropTypes from 'prop-types';
import React from 'react';
import ReactDOM from 'react-dom';

import axios from 'axios';
import { Provider, connect } from 'react-redux';
import { compose } from 'redux';
import reducer from './reducer';
import saga from './saga';
import { NODE_TO_MOUNT, DATA_COMP_ID } from './constants';

import injectReducer from '../../utils/injectReducer';
import injectSaga from '../../utils/injectSaga';
import {
  WrapperDiv,
  avatar,
  align
} from './styles';

class BenefitSection extends React.PureComponent {
  static getInitialProps() {
    return axios.get('');
  }
  render() {
    const { cms, api } = this.props;
    return (
      <WrapperDiv>
        <div className="container">
          <div className="row">
            <div className="col-md-4">
              <center>
                <div className={`${avatar}`}>
                </div>
              </center>
              <h5 className={`${align}`}>CARD BENEFIT 1</h5>
              <p className={`${align}`}>Credit cards can make it easier to buy things. If you dont like to carry large amounts of cash with you or if a company doesn't accept cash purchases (for example most airlines, hotels, and car rental agencies), putting purchases on a credit card can make buying things easier.Credit cards can make it easier to buy things</p>
            </div>
            <div className="col-md-4">
              <center>
                <div className={`${avatar}`}>
                </div>
              </center>
              <h5 className={`${align}`}>CARD BENEFIT 2</h5>
              <p className={`${align}`}>Credit cards can make it easier to buy things. If you dont like to carry large amounts of cash with you or if a company doesn't accept cash purchases (for example most airlines, hotels, and car rental agencies), putting purchases on a credit card can make buying things easier.</p>
            </div>
            <div className="col-md-4">
              <center>
                <div className={`${avatar}`}>
                </div>
              </center>
              <h5 className={`${align}`}>CARD BENEFIT 3</h5>
              <p className={`${align}`}>Credit cards can make it easier to buy things. If you dont like to carry large amounts of cash with you or if a company doesn't accept cash purchases (for example most airlines, hotels, and car rental agencies), putting purchases on a credit card can make buying things easier.Credit cards can make it easier to buy things.Credit cards can make it easier to buy things</p>
            </div>
          </div>
        </div>
      </WrapperDiv>
    );
  }
}

BenefitSection.propTypes = {
  cms: PropTypes.object.isRequired,
  api: PropTypes.object
};

const mapStateToProps = state => ({});
const mapDispatchToProps = dispatch => ({});
const withConnect = connect(mapStateToProps, mapDispatchToProps);
if (ExecutionEnvironment.canUseDOM) {
  const withReducer = injectReducer({ key: NODE_TO_MOUNT, reducer });
  const withSaga = injectSaga({ key: NODE_TO_MOUNT, saga });
  const BenefitSectionContainer = compose(
    withReducer,
    withSaga,
    withConnect
  )(BenefitSection);
  [...document.querySelectorAll(`[data-component="${NODE_TO_MOUNT}"]`)].forEach(el => {
    ReactDOM.hydrate(
      <Provider store={window.store}>
        <BenefitSectionContainer {...window.ASOData[el.getAttribute(`${DATA_COMP_ID}`)]} />
      </Provider>,
      el
    );
  });
}

export default withConnect(BenefitSection);
