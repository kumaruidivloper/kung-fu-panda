import React from 'react';
import classNames from 'classnames';
import Button from '@academysports/fusion-components/dist/Button';
import { reduxForm } from 'redux-form';
import PropTypes from 'prop-types';
import Responsive from 'react-responsive';
import { bgNone, lineOnHover } from './style';
import { MOBILE_MAX_WIDTH, DESKTOP_MIN_WIDTH, PROFILE_EDIT_FORM, ANALYTICS_ERR_EVENT_NAME, ANALYTICS_ERR_EVENT_CATEGORY, ANALYTICS_ERR_EVENT_ACTION } from './constants';
import { analyticsErrorTracker } from './../../utils/analyticsUtils';

export class UpdateCancelButton extends React.PureComponent {
  propTypes = {
    cms: PropTypes.object.isRequired,
    func: PropTypes.func,
    onEmailSubmit: PropTypes.func,
    handleSubmit: PropTypes.isRequired
  };
  render() {
    const { cms, onEmailSubmit, handleSubmit } = this.props;
    return (
      <React.Fragment>
        <Responsive minWidth={DESKTOP_MIN_WIDTH}>
          <div className="d-flex flex-row justify-content-center py-3 align-items-center">
            <div className="col-6 d-flex justify-content-end">
              <button className={classNames('o-copy__14reg mr-0 mr-md-2', bgNone, lineOnHover)} onClick={this.props.func(false)}>
                {cms.commonLabels.cancelLabel}
              </button>
            </div>
            <Button
              onClick={handleSubmit(data => {
                onEmailSubmit(data);
              })}
              size="S"
              className="col-6"
            >
              {cms.commonLabels.updateLabel}
            </Button>
          </div>
        </Responsive>
        <Responsive maxWidth={MOBILE_MAX_WIDTH}>
          <div className="d-flex flex-column py-3">
            <Button
              onClick={handleSubmit(data => {
                onEmailSubmit(data);
              })}
              size="S"
            >
              {cms.commonLabels.updateLabel}
            </Button>
            <button className={classNames('o-copy__14reg mt-3', bgNone, lineOnHover)} onClick={this.props.func(false)}>
              {cms.commonLabels.cancelLabel}
            </button>
          </div>
        </Responsive>
      </React.Fragment>
    );
  }
}
export default reduxForm({
  form: PROFILE_EDIT_FORM,
  onSubmitFail: (errors, dispatch, submitError, props) =>
    analyticsErrorTracker(ANALYTICS_ERR_EVENT_NAME, ANALYTICS_ERR_EVENT_CATEGORY, ANALYTICS_ERR_EVENT_ACTION, errors, dispatch, submitError, props)
})(UpdateCancelButton);
