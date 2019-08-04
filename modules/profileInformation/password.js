import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { borderBottom, bgNone, changePassword } from './style';

export class Password extends React.PureComponent {
  propTypes = {
    cms: PropTypes.object.isRequired,
    editPasswordClick: PropTypes.func
  };
  render() {
    const { cms } = this.props;
    const { commonLabels } = cms;
    return (
      <React.Fragment>
        <div className="d-flex flex-row justify-content-between px-0 px-sm-1 px-md-2 pt-2 pt-md-3 pb-1">
          <span className="o-copy__16bold">{commonLabels.passwordLabel}</span>
          <button data-auid="edit_password_btn" onClick={this.props.editPasswordClick(true)} className={classNames('d-flex flex-row align-items-center', bgNone)}>
            <i className={classNames('academyicon icon-lock pr-half')} />
            <span className={`${changePassword} o-copy__14reg`}>{cms.changeYourPasswordLabel}</span>
          </button>
        </div>
        <hr className={`${borderBottom} mx-0 mx-sm-1 mx-md-2`} />
        <div className="px-0 px-sm-1 px-md-2 pl-0 pl-md-2">
          <div className="o-copy__14bold pt-1">{cms.yourPasswordLabel}</div>
          <div className="pb-1">************</div>
        </div>
      </React.Fragment>
    );
  }
}
