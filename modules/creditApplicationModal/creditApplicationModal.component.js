import ExecutionEnvironment from 'fbjs/lib/ExecutionEnvironment';
import PropTypes from 'prop-types';
import React from 'react';
import ReactDOM from 'react-dom';
import Modal from 'react-modal';
import { Provider, connect } from 'react-redux';
import { compose } from 'redux';
import { reducer as form } from 'redux-form';
import reducer from './reducer';
import saga from './saga';
import { NODE_TO_MOUNT, DATA_COMP_ID } from './constants';
import CreditApplicationModalHeader from './Components/CreditApplicationModalHeader';
import CreditAppicationStep1 from './creditApplicationStep1';
import CreditAppicationStep2 from './creditApplicationStep2';
import CreditApplicationFormSubmitBtn from './creditApplicationFormSubmitBtn';
import { modalClosePart, modalContentContainer, cancelPart, continueBut, buttonWrapper } from './styles';

import injectReducer from '../../utils/injectReducer';
import injectSaga from '../../utils/injectSaga';


class CreditApplicationModal extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      formPart: 1,
      agreeTerms: true
    };
    this.onSubmitHandler = this.onSubmitHandler.bind(this);
    this.backPart = this.backPart.bind(this);
    this.termsConditions = this.termsConditions.bind(this);
  }

  componentWillMount() {
    Modal.setAppElement('body');
  }

  onSubmitHandler(data) {
   if (this.state.formPart === 1) {
    this.setState({ formPart: 2, agreeTerms: true });
  }
   console.log(data, 'daii');
  }

  backPart() {
    this.setState({ formPart: 1 });
  }

  termsConditions(data) {
    this.setState({ agreeTerms: data });
  }

  render() {
    return (
      <div>
        <Provider store={window.store}>
          <Modal
            overlayClassName="modalOverlay"
            className="modalContent"
            isOpen={this.props.modalIsOpen}
            onAfterOpen={this.afterOpenModal}
            onRequestClose={this.props.closeModal}
            contentLabel="Credit Application Modal"
            shouldCloseOnOverlayClick
          >
            <div>
              <button
                onClick={this.props.closeModal}
                className={`${modalClosePart}`}
                aria-label="Close Application Modal"
                data-auid="credit_application_modal_close"
              >
                <span className="academyicon icon-close" />
                <span className="sr-only">Close</span>
              </button>
              <div className={`container px-2 px-md-3 pb-1 ${modalContentContainer}`}>
                <div>
                  <div className="pb-2">
                    <CreditApplicationModalHeader formState={this.state.formPart} />
                    {this.state.formPart === 1 ? (<CreditAppicationStep1 initialVals={this.props.formInitialData} onSubmitForm={this.onSubmitHandler} layout={this.props.layout} />) : null }
                    {this.state.formPart === 2 ? (<CreditAppicationStep2 {...this.props} onSubmitForm={this.onSubmitHandler} termCondition={this.termsConditions} />) : null }
                    <div className={`${buttonWrapper}`}>
                      <div className={`${continueBut}`}>
                        <CreditApplicationFormSubmitBtn
                          onSubmitForm={this.onSubmitHandler}
                          btnText={this.state.formPart === 1 ? 'Continue' : 'Submit'}
                          disableButton={this.state.formPart === 2 && this.state.agreeTerms}
                        />
                      </div>
                      {this.state.formPart === 2 ? (<button className={`${cancelPart}`} onClick={this.backPart} >Back</button>) : null }

                      <button className={`${cancelPart}`} onClick={this.props.closeModal} >Cancel</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Modal>
        </Provider>
      </div>
    );
  }
}

CreditApplicationModal.propTypes = {
  modalIsOpen: PropTypes.bool,
  closeModal: PropTypes.isRequired
};

const mapStateToProps = state => ({});
const mapDispatchToProps = dispatch => ({});
const withConnect = connect(mapStateToProps, mapDispatchToProps);
if (ExecutionEnvironment.canUseDOM) {
  const withReducer = injectReducer({ key: NODE_TO_MOUNT, reducer });
  const withSaga = injectSaga({ key: NODE_TO_MOUNT, saga });
  const formReducer = injectReducer({ key: 'form', reducer: form });
  const CreditApplicationModalContainer = compose(
    withReducer,
    formReducer,
    withSaga,
    withConnect
  )(CreditApplicationModal);
  [...document.querySelectorAll(`[data-component="${NODE_TO_MOUNT}"]`)].forEach(el => {
    ReactDOM.hydrate(
      <Provider store={window.store}>
        <CreditApplicationModalContainer {...window.ASOData[el.getAttribute(`${DATA_COMP_ID}`)]} />
      </Provider>,
      el
    );
  });
}

export default withConnect(CreditApplicationModal);
