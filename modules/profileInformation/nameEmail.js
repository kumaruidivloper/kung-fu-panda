import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { borderBottom, bgNone, editStyle } from './style';

export class NameEmail extends React.PureComponent {
  propTypes = {
    cms: PropTypes.object.isRequired,
    editInfo: PropTypes.func,
    profile: PropTypes.object
  };
  render() {
    const { cms, profile } = this.props;
    const { commonLabels, nameLabel, emailLabel } = cms;
    return (
      <React.Fragment>
        <div className="d-flex flex-row justify-content-between px-0 px-sm-1 px-md-2 pt-2 pt-md-3 pb-1">
          <span className="o-copy__16bold">{cms.profileInformationLabel}</span>
          <button data-auid="edit_info_btn" onClick={this.props.editInfo(true)} className={classNames('d-flex flex-row align-items-center', bgNone)}>
            <i className={classNames('academyicon icon-pencil pr-half')} />
            <span className={`${editStyle} o-copy__14reg`}> {commonLabels.editLabel} </span>
          </button>
        </div>
        <hr className={`${borderBottom} mx-0 mx-sm-1 mx-md-2`} />
        <div className="pl-0 pl-md-2 px-0 px-sm-1 px-md-2 ">
          <div className="o-copy__14bold pt-1">{nameLabel}</div>
          <div className="o-copy__14reg">{profile.firstName} {profile.lastName} </div>
        </div>
        <div className="pl-0 pl-md-2 px-0 px-sm-1 px-md-2">
          <div className="o-copy__14bold pt-2">{emailLabel}</div>
          <div className="o-copy__14reg pb-3">{profile.email}</div>
        </div>
      </React.Fragment>
    );
  }
}
