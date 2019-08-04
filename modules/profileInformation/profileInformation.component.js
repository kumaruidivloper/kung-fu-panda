import ExecutionEnvironment from 'fbjs/lib/ExecutionEnvironment';
import PropTypes from 'prop-types';
import React from 'react';
import ReactDOM from 'react-dom';
import classNames from 'classnames';
import { Provider } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { EditPasswordView } from './editPasswordView';
import { Password } from './password';
import {
  NODE_TO_MOUNT,
  DATA_COMP_ID,
  BACK_TO_PROFILE_LABEL,
  STORE_ID,
  EDIT_PASS,
  TIME_OUT_SEC,
  ANALYTICS_EVENT_IN,
  ANALYTICS_EVENT_CATEGORY,
  analyticsEventAction,
  analyticsEventLabel
} from './constants';
import NameEmailEditable from './nameEmailEditable';
import { NameEmail } from './nameEmail';
import { Notification } from './notification';
import { block, backProfileBtn, lineOnHover, Message, displayMobileNone } from './style';
import StorageManager from './../../utils/StorageManager';
import withScroll from '../../hoc/withScroll';
import { myAccountClicksAnalyticsData } from '../../utils/analyticsUtils';
class ProfileInformation extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      editPassSuccess: false,
      timeout: false
    };
    this.onEmailSubmit = this.onEmailSubmit.bind(this);
    this.editInfo = this.editInfo.bind(this);
    this.editPasswordClick = this.editPasswordClick.bind(this);
    this.nameEmailRenderableFunction = this.nameEmailRenderableFunction.bind(this);
    this.onUpdatePassword = this.onUpdatePassword.bind(this);
    this.notificationChange = this.notificationChange.bind(this);
    this.callTimeOut = this.callTimeOut.bind(this);
    this.analyticsOnEdit = this.analyticsOnEdit.bind(this);
  }

  componentDidMount() {
    const { breadCrumbAction, cms, location, scrollPageToTop, analyticsContent } = this.props;
    breadCrumbAction(cms.profileLabel);
    this.checkAuthUser();
    if (location.search.match(/\?password-reset=success/)) {
      this.props.passwordChanged();
    }
    scrollPageToTop();
    myAccountClicksAnalyticsData(cms.profileLabel, analyticsContent);
  }

  componentDidUpdate(prevProps) {
    /** if edit Password succeeded is present and true, password has been updated successfully, so pushing analytics data */
    const { analyticsContent, editPasswordSucceeded, editProfileSucceeded } = this.props;
    if (!prevProps.editPasswordSucceeded) {
      if (editPasswordSucceeded) {
        const analyticsData = {
          event: ANALYTICS_EVENT_IN,
          eventCategory: ANALYTICS_EVENT_CATEGORY,
          eventAction: analyticsEventAction.CHANGE_PERSONAL_INFO,
          eventLabel: analyticsEventLabel.PASSWORD_CHANGED
        };
        analyticsContent(analyticsData);
      }
    }
    /* if edit profile info succeeds, push analytics data. */
    if (!prevProps.editProfileSucceeded) {
      if (editProfileSucceeded) {
        const analyticsData = {
          event: ANALYTICS_EVENT_IN,
          eventCategory: ANALYTICS_EVENT_CATEGORY,
          eventAction: analyticsEventAction.CHANGE_PERSONAL_INFO,
          eventLabel: analyticsEventLabel.EDIT_PERSONAL_INFO
        };
        analyticsContent(analyticsData);
      }
    }
  }

  onEmailSubmit(data) {
    const dataToAPI = { ...data };
    delete dataToAPI.confirmEmail;
    const { fnUpdateProfileInormationCall, profileId, scrollPageToTop } = this.props;
    fnUpdateProfileInormationCall(profileId, dataToAPI);
    scrollPageToTop();
  }
  onUpdatePassword(data) {
    const { profileId, email, scrollPageToTop } = this.props;
    this.props.fnUpdatePassword(data, profileId, email);
    scrollPageToTop();
  }
  /**
   * the function checks if the user is logged in or not and redirects to logon form if user is not logged in
   */
  checkAuthUser() {
    if (this.props.profileId === null) {
      this.props.redirectLogin();
    }
  }
  editInfo = flag => () => {
    this.props.setEditInfo(flag);
  };
  editPasswordClick = flag => () => {
    window.scrollTo(0, 0);
    this.props.setPassword(flag);
  };
  notificationChange(emailOpt) {
    const receiveEmailPreference = [];
    const obj = {};
    obj.value = emailOpt;
    obj.storeID = StorageManager.getSessionStorage(STORE_ID);
    receiveEmailPreference.push(obj);
    const profile = { ...this.props.profile, receiveEmailPreference };
    this.props.fnUpdateProfileInormationCall(this.props.profileId, profile);
  }

  nameEmailRenderableFunction = (cms, errorMsg) => {
    const initialVal = {
      firstName: this.props.profile.firstName,
      lastName: this.props.profile.lastName
    };
    const { analyticsContent } = this.props;
    return (
      <NameEmailEditable
        cms={cms}
        initialValues={initialVal}
        errorMsg={errorMsg}
        editInfo={this.editInfo}
        profile={this.props.profile}
        updateInfo={this.onEmailSubmit}
        analyticsContent={analyticsContent}
      />
    );
  };
  /**
   * FUNCTION checks if password has been edited, then stores the valye in state to
   * manage alert hide
   * @param {string} val
   * if the user has created his own password through forgot pass then
   * val wiil be equal to EDIT_PASS
   */
  checkPassResetDiv = val => {
    const { editPasswordSucceeded } = this.props;
    if (val === EDIT_PASS) {
      this.setState({ editPassSuccess: editPasswordSucceeded });
    } else {
      this.setState({ editPassSuccess: false, timeout: true });
    }
  };
  analyticsOnEdit(data) {
    const { analyticsContent } = this.props;
    const analyticsData = {
      event: ANALYTICS_EVENT_IN,
      eventCategory: ANALYTICS_EVENT_CATEGORY,
      eventAction: analyticsEventAction.CHANGE_PERSONAL_INFO,
      eventLabel: data
    };
    analyticsContent(analyticsData);
  }
  /**
   * FUNCTION if new password has been created then it call setTimeout
   * to make disappear the alert box in 5sec
   */
  callTimeOut() {
    const { editPassSuccess } = this.state;
    if (editPassSuccess) {
      setTimeout(this.checkPassResetDiv, TIME_OUT_SEC);
    }
  }
  renderSections = func => <div className={classNames('mb-half', block)}>{func}</div>;

  /**
   * Function handles the link to show the edit for profile
   * @param  {Object} cms The cms data
   * @param  {String} profileId The profile id
   * @param  {String} errorMsg Error message to display (if any)
   */
  renderEdit = (cms, profileId, errorMsg) => {
    const { editProfile, updatePasswordErrorCode, updatePasswordError, analyticsContent, email } = this.props;
    if (editProfile) {
      return <div>{this.renderSections(this.nameEmailRenderableFunction(cms, errorMsg))}</div>;
    }
    return (
      <div>
        {this.renderSections(
          <EditPasswordView
            profileId={profileId}
            cms={cms}
            email={email}
            errorMsg={errorMsg}
            editPasswordClick={this.editPasswordClick}
            onUpdatePassword={this.onUpdatePassword}
            updatePasswordError={updatePasswordError}
            updatePasswordErrorCode={updatePasswordErrorCode}
            analyticsContent={analyticsContent}
          />
        )}
      </div>
    );
  };
  renderProfile = cms => (
    <button
      data-auid="edit_profile_btn"
      className={classNames('d-flex flex-row align-items-center mb-2 mb-md-3', backProfileBtn, displayMobileNone)}
      onClick={this.props.editProfile ? this.editInfo(false) : this.editPasswordClick(false)}
    >
      <i className="academyicon icon-chevron-left pr-half" />
      <span className={`o-copy__14reg d-none d-sm-block ${lineOnHover}`}>{cms.backToProfileLabel || BACK_TO_PROFILE_LABEL}</span>
      <span className="o-copy__12reg d-block d-sm-none">{cms.profileLabel}</span>
    </button>
  );
  render() {
    const { cms, profileId, errorMsg, editPasswordSucceeded } = this.props;
    const { successfullyResetPasswordText } = cms;
    const { editPassSuccess, timeout } = this.state;
    if (editPasswordSucceeded && !editPassSuccess && !timeout) {
      this.checkPassResetDiv(EDIT_PASS);
    }
    return this.props.profile.firstName ? (
      <div className="col-12">
        {editPasswordSucceeded &&
          editPassSuccess && (
            <Message className="mb-1">
              <span className="message o-copy__14reg">{successfullyResetPasswordText}</span>
              <button onClick={this.props.closeMessage} className="closeButton">
                <span className="academyicon icon-close float-right" />
              </button>
            </Message>
          )}
        {this.callTimeOut()}
        {this.props.editProfile || this.props.editPassword ? this.renderProfile(cms) : null}
        <div className="pb-2 pb-md-3">
          {this.props.editProfile || !(this.props.editProfile || this.props.editPassword) ? (
            <h5> {cms.profileLabel}</h5>
          ) : (
            <h5 className="mb-0">{cms.changePasswordLabel}</h5>
          )}
        </div>

        {this.props.editProfile || this.props.editPassword ? (
          this.renderEdit(cms, profileId, errorMsg)
        ) : (
          <div>
            {this.props.profile && this.renderSections(<NameEmail cms={cms} editInfo={this.editInfo} profile={this.props.profile} />)}
            {this.renderSections(<Password cms={cms} editPasswordClick={this.editPasswordClick} />)}
            {this.renderSections(<Notification cms={cms} profile={this.props.profile} notificationChange={this.notificationChange} />)}
          </div>
        )}
      </div>
    ) : null;
  }
}

ProfileInformation.propTypes = {
  cms: PropTypes.object.isRequired,
  fnUpdateProfileInormationCall: PropTypes.func,
  fnUpdatePassword: PropTypes.func,
  profile: PropTypes.object,
  profileId: PropTypes.string,
  editProfile: PropTypes.bool,
  editPassword: PropTypes.bool,
  editPasswordSucceeded: PropTypes.bool,
  editProfileSucceeded: PropTypes.bool,
  setEditInfo: PropTypes.func,
  setPassword: PropTypes.func,
  closeMessage: PropTypes.func,
  errorMsg: PropTypes.object,
  email: PropTypes.string,
  redirectLogin: PropTypes.func,
  updatePasswordErrorCode: PropTypes.any,
  updatePasswordError: PropTypes.any,
  breadCrumbAction: PropTypes.func,
  passwordChanged: PropTypes.func,
  location: PropTypes.object,
  analyticsContent: PropTypes.func,
  scrollPageToTop: PropTypes.func
};

const WrappedProfileInformation = withScroll(ProfileInformation);

if (ExecutionEnvironment.canUseDOM) {
  [...document.querySelectorAll(`[data-component='${NODE_TO_MOUNT}']`)].forEach(el => {
    ReactDOM.hydrate(
      <Provider store={window.store}>
        <WrappedProfileInformation {...window.ASOData[el.getAttribute(`${DATA_COMP_ID}`)]} />
      </Provider>,
      el
    );
  });
}

export default withRouter(WrappedProfileInformation);
