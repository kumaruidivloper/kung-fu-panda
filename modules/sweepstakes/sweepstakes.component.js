import ExecutionEnvironment from 'fbjs/lib/ExecutionEnvironment';
import PropTypes from 'prop-types';
import React from 'react';
import ReactDOM from 'react-dom';
import { reducer as form, reset } from 'redux-form';
import { Provider, connect } from 'react-redux';
import { compose } from 'redux';
import Modal from '@academysports/fusion-components/dist/Modal';
import injectReducer from '../../utils/injectReducer';
import injectSaga from '../../utils/injectSaga';
import saga from './store/saga';
import reducer from './store/reducers';
import { putSweepstakesData } from './store/actions';
import SweepstakesForm from './sweepstakesForm/sweepstakesForm';
import { NODE_TO_MOUNT, DATA_COMP_ID, SWEEPSTAKESFORM } from './constants';
import RenderButton from './renderButton/renderButton';
import { modalStyles, successIconStyles, failureIconStyles } from './sweepstakes.styles';
import AnalyticsWrapper from '../analyticsWrapper/analyticsWrapper.component';

class Sweepstakes extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      modalStatus: true
    };
    this.onSubmit = this.onSubmit.bind(this);
    this.renderSuccessModal = this.renderSuccessModal.bind(this);
    this.renderFailureModal = this.renderFailureModal.bind(this);
  }
  /**
   * it handle data submit
   * @param {object} postdata - form data
   */
  onSubmit(postdata) {
    const { cms, analyticsContent } = this.props;
    const postUrl = cms.selligentUrl ? cms.selligentUrl.replace('{{id}}', cms.selligentid) : '';
    const data = {
      data: [[postdata.firstName, postdata.lastName, postdata.email, postdata.zipCode, cms.campaigncode]],
      header: ['first_name', 'last_name', 'email_address', 'postal_code', 'campaigncode'],
      postUrl
    };
    this.props.fnSweepstakesRequest(data);
    this.props.fnResetForm();
    const leadStatus = (postdata.email !== '' && (postdata.firstName !== '' && postdata.lastName !== '' && postdata.zipCode !== '')) ? 'fully qualified' : 'partial qualified';
    const analyticsData = {
      event: 'sweepstakes',
      eventCategory: 'customer lead',
      eventAction: 'sweepstakes entry',
      eventLabel: cms.sweepstakesTitle.toLowerCase(),
      customerleadlevel: leadStatus,
      customerleadtype: 'sweepstakes entry',
      leadsubmitted: 1,
      sweepstakesentrycomplete: 1
    };
    analyticsContent(analyticsData);
  }
  /**
   * it return failure modal
   * @param {object} cms - data from AEM
   */
  renderFailureModal() {
    const { cms } = this.props;
    return (
      <Modal isOpen={this.state.modalStatus} modalContentClassName={`${modalStyles}`}>
        <div className={`${failureIconStyles} pb-5`}>
          <span className="academyicon icon-x-circle" />
        </div>
        <div className="pb-half">
          <h5>{cms.errorMsg.weFumbled}</h5>
        </div>
        <p className="o-copy__16reg">{cms.errorMsg.tryAgainLater}</p>
      </Modal>
    );
  }
  /**
   * it return success modal
   * @param {object} cms - data from AEM
   */
  renderSuccessModal() {
    const { cms } = this.props;
    return (
      <Modal isOpen={this.state.modalStatus} modalContentClassName={`${modalStyles}`}>
        <div className={`${successIconStyles} pb-5`}>
          <span className="academyicon icon-check-circle" />
        </div>
        <div className="pb-half">
          <h5>{cms.successMsg.youreSet}</h5>
        </div>
        <p className="o-copy__16reg">{cms.successMsg.yourFirstDealMessage}</p>
      </Modal>
    );
  }
  render() {
    const { cms, sweepStakesResponse } = this.props;
    return (
      <div className="container">
        {(sweepStakesResponse.error || !sweepStakesResponse.data) && this.renderFailureModal()}
        {!sweepStakesResponse.error && sweepStakesResponse.data && Object.keys(sweepStakesResponse.data).length > 0 && this.renderSuccessModal()}
        <div className="row">
          <h5 className="col-12">{cms.sweepstakesTitle}</h5>
          <p className="col-12">{cms.sweepstakesDescription}</p>
          <div className="col-12 pb-half">
            <SweepstakesForm cms={cms} />
          </div>
          <div className="col-12 col-md-3 pb-1">
            <RenderButton cms={cms} buttonClickAction={data => this.onSubmit(data)} />
          </div>
          <p className="col-12">{cms.sweepstakesDisclaimer}</p>
        </div>
      </div>
    );
  }
}

Sweepstakes.propTypes = {
  cms: PropTypes.object.isRequired,
  fnSweepstakesRequest: PropTypes.func,
  sweepStakesResponse: PropTypes.object,
  fnResetForm: PropTypes.func,
  analyticsContent: PropTypes.func
};
const mapDispatchToProps = dispatch => ({
  fnSweepstakesRequest: data => dispatch(putSweepstakesData(data)),
  fnResetForm: () => dispatch(reset(SWEEPSTAKESFORM))
});
const mapStateToProps = state => ({
  sweepStakesResponse: state.sweepstakes.sweepstakesData
});
const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps
);

if (ExecutionEnvironment.canUseDOM) {
  const formReducer = injectReducer({ key: 'form', reducer: form });
  const withReducer = injectReducer({ key: NODE_TO_MOUNT, reducer });
  const withSaga = injectSaga({ key: NODE_TO_MOUNT, saga });
  const SweepstakesContainer = compose(
    formReducer,
    withReducer,
    withSaga,
    withConnect
  )(Sweepstakes);
  const SweepstakesAnalyticsWrapper = AnalyticsWrapper(SweepstakesContainer);
  [...document.querySelectorAll(`[data-component="${NODE_TO_MOUNT}"]`)].forEach(el => {
    ReactDOM.hydrate(
      <Provider store={window.store}>
        <SweepstakesAnalyticsWrapper {...window.ASOData[el.getAttribute(`${DATA_COMP_ID}`)]} />
      </Provider>,
      el
    );
  });
}

export default withConnect(AnalyticsWrapper(Sweepstakes));
