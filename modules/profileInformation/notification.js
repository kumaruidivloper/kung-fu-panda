import React from 'react';
import PropTypes from 'prop-types';
import Checkbox from '@academysports/fusion-components/dist/Checkbox';
import { borderBottom, unsubscribe, checkboxWrapper } from './style';

export class Notification extends React.PureComponent {
  propTypes = {
    cms: PropTypes.object.isRequired,
    notificationChange: PropTypes.func,
    profile: PropTypes.object
  };
  constructor(props) {
    super(props);
    this.checkboxChange = this.checkboxChange.bind(this);
  }

  /**
   * change the status of checkbox and call notificationChange prop function
   */
  checkboxChange(evt) {
    this.props.notificationChange(evt);
  }

  render() {
    const { cms } = this.props;
    const { recieveEmail } = this.props.profile;
    return (
      <React.Fragment>
        <div className="pt-2 pt-md-3 pb-1 o-copy__16bold px-0 px-sm-1 px-md-2">{cms.notificationLabel}</div>
        <hr className={`${borderBottom} mx-0 mx-sm-1 mx-md-2`} />
        <div className="d-flex flex-row pt-1 px-0 px-sm-1 px-md-2">
          <div className={checkboxWrapper}>
            <Checkbox checked={recieveEmail} onChange={this.checkboxChange} id="profile-notification-check">
              <div className="d-flex flex-column pl-half">
                <div className="o-copy__14reg">{cms.emailNotifiationAlertLabel}</div>
                <div className={`${unsubscribe} o-copy__12reg pb-2`}> {cms.unsubscribeLabel}</div>
              </div>
            </Checkbox>
          </div>
        </div>
      </React.Fragment>
    );
  }
}
