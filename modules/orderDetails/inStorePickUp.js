import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { card, editBtn, storeLink } from './orderDetails.styles';

class InStorePickUp extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      bopisStoreHoursOpen: false
    };
    this.toggleStoreHoursDrawer = this.toggleStoreHoursDrawer.bind(this);
  }

  onEnterFireOnClick(onClick) {
    return e => {
      if (e.nativeEvent.keyCode === 13) {
        onClick();
      }
    };
  }

  toggleStoreHoursDrawer() {
    this.setState(previousState => ({
      bopisStoreHoursOpen: !previousState.bopisStoreHoursOpen
    }));
  }

  render() {
    const { cms, details, storeDetails, label } = this.props;
    const { weekHours } = storeDetails;
    return (
      <div className={classNames('mt-half mt-md-2 pt-2 pb-2 pb-md-3', card)}>
        <div className={classNames('px-1 px-md-3')}>
          <span className={classNames('o-copy__16bold')}>{label}</span>
          <hr className="my-1" />
          <span className="o-copy__14reg">{cms.inStorePickupLabel.pickupInformationLabel}</span>
          <div className={classNames('row', 'm-0 pt-1')}>
            {storeDetails && (
              <div className={classNames('col-12 col-md-7', 'p-0')}>
                <span className={classNames('o-copy__14bold', 'd-block')}>{storeDetails.neighborhood}</span>
                <span className={classNames('o-copy__14reg', 'd-block')}>{storeDetails.streetAddress}</span>
                <span className={classNames('o-copy__14reg', 'd-block', 'pb-1')}>
                  {`${storeDetails.city}, ${storeDetails.stateCode} ${storeDetails.zipCode}`}
                </span>
                <span role="button" tabIndex={0} onKeyDown={this.onEnterFireOnClick(this.toggleStoreHoursDrawer)} onClick={this.toggleStoreHoursDrawer}>
                  <p className={`${storeLink} o-copy__14reg`}>
                    <span className="label">{cms.inStorePickupLabel.storeHoursLabel}</span>
                    <i className={`academyicon icon-chevron-${this.state.bopisStoreHoursOpen ? 'up' : 'down'} align-text-bottom pl-half cursorPointer ${editBtn}`} />
                  </p>
                </span>
                {this.state.bopisStoreHoursOpen ? (
                  <div>
                    <p className="o-copy__14reg mb-0">{`Monday - Saturday:${weekHours.weekDayHrs}`}</p>
                    <p className="o-copy__14reg mb-0">{`Sunday: ${weekHours.weekEndHrs}`}</p>
                  </div>
                ) : null}
              </div>
            )}
            {details && (
              <div className={classNames('col-12 col-md-5', 'pl-0 pt-1 pt-md-0')}>
                <span className={classNames('o-copy__14bold', 'd-block')}>
                  {details.firstName} {details.lastName}
                </span>
                <span className={classNames('o-copy__14reg', 'd-block', 'pb-1')}>{details.email}</span>
                {details.alternateFirstName && (
                  <Fragment>
                    <span className={classNames('o-copy__14bold', 'd-block')}>{cms.inStorePickupLabel.alternatePickupPersonLabel}</span>
                    <span className={classNames('o-copy__14reg', 'd-block')}>
                      {details.alternateFirstName} {details.alternateLastName}
                    </span>
                    <span className={classNames('o-copy__14reg', 'd-block')}>{details.alternateEmail}</span>
                    <span className={classNames('o-copy__14reg', 'd-block')}>{details.alternatePhone}</span>
                  </Fragment>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
}

InStorePickUp.propTypes = {
  cms: PropTypes.object.isRequired,
  details: PropTypes.object,
  storeDetails: PropTypes.object,
  label: PropTypes.string
};
export default InStorePickUp;
