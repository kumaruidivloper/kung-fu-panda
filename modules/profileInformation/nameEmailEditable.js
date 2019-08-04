import React from 'react';
import PropTypes from 'prop-types';
import { Field, reduxForm } from 'redux-form';
import { connect } from 'react-redux';
import validationRules from './validationRules';
import RenderTextField from './components/renderInputField/renderInputFieldCompoent';
import RenderEmailField from './components/renderEmailField/renderEmailField';
import { PROFILE_EDIT_FORM } from './constants';
import { domainsList } from './../../utils/constants';
import UpdateCancelButton from './updateCancelButton';
import { hrLine } from './style';

export class NameEmailEditable extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    const { cms, errorMsg, profile, analyticsContent } = this.props;
    return (
      <React.Fragment>
        <div className="px-0 px-sm-1 px-md-2">
          <div className="pt-2 pt-md-3 o-copy__16bold">{cms.editProfileLabel}</div>
          <hr className={`my-2 ${hrLine}`} />
          <div className="col-12 col-md-8 p-0">
            <Field
              name="firstName"
              id="profile-firstName"
              type="text"
              label={cms.checkoutLabels.firstNameLabel}
              component={RenderTextField}
              maxLength="50"
            />
            <div className="pt-2">
              <Field
                name="lastName"
                id="profile-lastName"
                type="text"
                label={cms.checkoutLabels.lastNameLabel}
                component={RenderTextField}
                maxLength="50"
              />
            </div>
          </div>
        </div>
        <hr className={`my-2 my-md-3 ml-0 ml-md-2 mr-0 mr-md-2 ${hrLine}`} />
        <div className="px-0 px-sm-1 px-md-2">
          <div className="pb-2 o-copy__14reg">{cms.changeEmailLabel}</div>
          <div className="pb-2 o-copy__12reg col-12 col-md-8 pl-0">{cms.changeEmailAlertText}</div>
          <div className="o-copy__14bold pb-half pb-md-0">{cms.currentEmailLabel}</div>
          <div className="o-copy__14reg pb-2">{profile.email}</div>
          <div className="col-12 col-md-8 p-0">
            <Field
              name="logonId"
              type="text"
              id="profile-newEmail"
              label={cms.newEmailLabel}
              component={RenderEmailField}
              domainsList={domainsList}
              maxLength="255"
            />
            <div className="pt-1">
              <Field
                name="confirmEmail"
                type="text"
                id="profile-confirmEmail"
                label={cms.confirmEmailLabel}
                component={RenderEmailField}
                domainsList={domainsList}
                maxLength="255"
              />
            </div>
          </div>
        </div>
        <div className="col-12 col-md-8 px-0 px-sm-1 pl-md-2 pr-md-half">
          <UpdateCancelButton
            cms={cms}
            errorMsg={errorMsg}
            analyticsContent={analyticsContent}
            func={this.props.editInfo}
            onEmailSubmit={this.props.updateInfo}
          />
        </div>
      </React.Fragment>
    );
  }
}
NameEmailEditable.propTypes = {
  cms: PropTypes.object.isRequired,
  errorMsg: PropTypes.object,
  editInfo: PropTypes.func,
  profile: PropTypes.object,
  updateInfo: PropTypes.func,
  analyticsContent: PropTypes.func
};

const NameEmailEditableContainer = reduxForm({
  form: PROFILE_EDIT_FORM,
  enableReinitialize: true,
  destroyOnUnmount: false,
  keepDirtyOnReinitialize: true,
  validate: validationRules
})(NameEmailEditable);

export default connect(
  null,
  null
)(NameEmailEditableContainer);
