import ExecutionEnvironment from 'fbjs/lib/ExecutionEnvironment';
import PropTypes from 'prop-types';
import React from 'react';
import ReactDOM from 'react-dom';
import classNames from 'classnames';
import Button from '@academysports/fusion-components/dist/Button';
import { NODE_TO_MOUNT, DATA_COMP_ID } from './constants';
import { boxBlock, bgNone, defaultBanner, iconColor, buttonHover, setDefaultBtn } from './styles';

class CardCommonMyAccount extends React.PureComponent {
  onSubmitHandler = (data, editCreditCard, deleteItemId) => {
    this.props.submitHandlerEdit(data, editCreditCard, deleteItemId);
  };
  setAsDefault(event) {
    event.preventDefault();
    this.props.setAsDefaultHandler(this.props.profileID, this.props.deleteItem, this.props.id);
    if (ExecutionEnvironment.canUseDOM) {
      window.scrollTo(0, 0);
    }
  }
  setAsDefaultButton = cms => (
    <div className="mt-2 mt-md-0 mb-1">
      <Button className={buttonHover} aria-label="Set as default" data-auid="setAsDefault_btn" onClick={event => this.setAsDefault(event)} btntype="secondary" size="M">
        {cms.commonLabels.setAsDefault}
      </Button>
    </div>
  );
  handleGiftCardItemRemove = () => {
    this.props.RemoveHandler(this.props.deleteItemID);
  };
  handleEditClick = () => {
    this.props.EditHandler(this.props.deleteItemID);
  };
  editRemoveSection = (showEdit, showRemove, cms) => (
    <div className={classNames('o-copy__14reg', 'w-100')}>
      {showEdit ? (
        <button className={classNames(`${bgNone}`)} tabIndex={0} onClick={this.handleEditClick}>
          <i className={classNames('academyicon', 'icon-pencil', 'pr-half', `${iconColor}`)} />
          <span className="linkStyle">{cms.commonLabels.editLabel}</span>
        </button>
      ) : null}
      {showRemove ? (
        <button className={classNames(`${bgNone}`, 'pl-1')} tabIndex={0} onClick={() => this.props.RemoveHandler(this.props.deleteItem)}>
          <i className={classNames('academyicon', 'icon-x-circle', 'pr-half', `${iconColor}`)} />
          <span className="linkStyle">{cms.commonLabels.removeLabel}</span>
        </button>
      ) : null}
    </div>
  );
  defaultBanner = () => <div className={classNames(`${defaultBanner}`, 'd-inline', 'px-half', 'text-white', 'pt-0')}>DEFAULT</div>;
  render() {
    const { render, showEdit, showRemove, showDefaultBanner, showSetAsDefaultButton, cms } = this.props;
    return (
      <div>
        <div className={classNames(`${boxBlock}`, 'mb-half', 'px-3')}>
          {showDefaultBanner ? this.defaultBanner() : <div className={classNames('pb-2')} />}
          <div className={classNames('pb-md-3', 'pb-2', 'pt-half')}>
            <div className={classNames('row')}>
              <div className={classNames('col-12', 'col-md-8')}>{render}</div>
              <div className={classNames('mt-2', 'mt-md-0', 'col-12', 'col-md-4', 'text-md-right', 'w-100')}>
                {this.editRemoveSection(showEdit, showRemove, cms)}
              </div>
              {showSetAsDefaultButton && <div className={`col-12 ${setDefaultBtn}`}>{this.setAsDefaultButton(cms)}</div>}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

CardCommonMyAccount.propTypes = {
  deleteItemID: PropTypes.any,
  cms: PropTypes.object,
  render: PropTypes.object,
  showEdit: PropTypes.bool,
  showRemove: PropTypes.bool,
  showDefaultBanner: PropTypes.bool,
  showSetAsDefaultButton: PropTypes.bool,
  setAsDefaultHandler: PropTypes.func,
  RemoveHandler: PropTypes.func,
  EditHandler: PropTypes.func,
  id: PropTypes.number,
  submitHandlerEdit: PropTypes.func,
  profileID: PropTypes.string,
  deleteItem: PropTypes.object
};

if (ExecutionEnvironment.canUseDOM) {
  [...document.querySelectorAll(`[data-component="${NODE_TO_MOUNT}"]`)].forEach(el => {
    ReactDOM.hydrate(<CardCommonMyAccount {...window.ASOData[el.getAttribute(`${DATA_COMP_ID}`)]} />, el);
  });
}

export default CardCommonMyAccount;
