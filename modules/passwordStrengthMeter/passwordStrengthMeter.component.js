import ExecutionEnvironment from 'fbjs/lib/ExecutionEnvironment';
import PropTypes from 'prop-types';
import React, { Component, Fragment } from 'react';
import ReactDOM from 'react-dom';
// import zxcvbn from 'zxcvbn';
import classNames from 'classnames';
import Tooltip from '@academysports/fusion-components/dist/Tooltip';
import { NODE_TO_MOUNT, DATA_COMP_ID, MIN_PASSWORD_LEN } from './constants';
import { meterYellow, meterGreen, meterBackground, tooltipStyle, tranlateFuntion, insideMeter, labelError, labelGreen, meterRed } from './style';
import { isMobile } from '../../utils/userAgent';
class PasswordStrengthMeter extends Component {
  static // Password regexes for validations
  // Note: commented regexes as per need
  passwordRulesDefination = [
    // { paswordLabelCms: 'passwordMustContainOneLowerCaseLabel', regex: '^(?=.*[a-z])', text: '', status: false },
    // { paswordLabelCms: 'passwordMustContainOneUpperCaseLabel', regex: '^(?=.*[A-Z])', text: '', status: false },
    // { paswordLabelCms: 'passwordMustContainOneNumberLabel', regex: '^(?=.*[0-9])', text: '', status: false },
    { paswordLabelCms: 'passwordMustContainMinEightCharLabel', regex: '^(?=.*.{8})', text: '', status: false }
    // { paswordLabelCms: 'passwordMustContainOneSpecialCharLabel', regex: '^(?=.*[!-/:-@])', text: '', status: false }
  ];
  constructor(props) {
    super(props);
    this.state = {
      passwordStrengthLib: false,
      passwordStrength: '0',
      passwordRulesDefination: []
    };
  }

  componentDidMount() {
    import('zxcvbn')
      .then(module => {
        const { cms, password } = this.props;
        const passwordRulesDefination = [...this.constructor.passwordRulesDefination];

        passwordRulesDefination.forEach((element, index) => {
          const expressionValidator = JSON.parse(JSON.stringify(element));
          expressionValidator.text = cms.commonLabels[expressionValidator.paswordLabelCms];
          passwordRulesDefination[index] = expressionValidator;
        });
        this.setState({ passwordRulesDefination, passwordStrengthLib: module.default }, () => {
          this.handlePasswordChange(password);
        });
      })
      .catch(err => {
        console.log(err.toString());
      });
  }
  componentWillReceiveProps(nextProps) {
    this.handlePasswordChange(nextProps.password);
  }
  /**
   * password strength checker
   */
  handlePasswordChange = password => {
    const { passwordStrengthLib } = this.state;
    if (password !== '' && passwordStrengthLib) {
      const result = passwordStrengthLib(password, []);
      const passwordStrength = result.score === 0 ? MIN_PASSWORD_LEN : ((result.score / 4) * 100).toString();
      this.setState({ passwordStrength });
      this.strengthLabelsChecker(password);
    } else {
      this.setState({ passwordStrength: '0' });
    }
  };
  /**
   * Password length checker
   */
  strengthLabelsChecker = password => {
    const passwordRulesDefinatioLocal = this.state.passwordRulesDefination;
    passwordRulesDefinatioLocal.forEach((element, index) => {
      const expressionValidator = JSON.parse(JSON.stringify(element));
      if (RegExp(element.regex).test(password)) {
        expressionValidator.status = true;
      } else {
        expressionValidator.status = false;
      }
      passwordRulesDefinatioLocal[index] = expressionValidator;
    });
    this.setState({ passwordRulesDefination: passwordRulesDefinatioLocal });
    this.callback();
  };
  /**
   * returns password status
   */
  callback() {
    let i = 0;
    this.state.passwordRulesDefination.forEach(ele => {
      if (ele.status) {
        i = +1;
      }
    });
    if (i === 1) {
      this.props.callbackValidator(true);
    } else {
      this.props.callbackValidator(false);
    }
  }
  /**
   * strength Label Return
   */
  strengthLabels = cms => (
    <div>
      {cms.commonLabels.passwordMustContainLabel}
      <div className="row">
        {this.state.passwordRulesDefination.map((ele, idx) => (
          <div className="col-12 pt-1" key={`${labelError + idx}`}>
            {ele.status ? (
              <i className={classNames('academyicon', 'icon-check-mark', `${labelGreen}`, 'pr-half')} />
            ) : (
              <i className={classNames('academyicon', 'icon-close', `${labelError}`, 'pr-half')} />
            )}{' '}
            {cms.commonLabels[ele.paswordLabelCms]}
          </div>
        ))}
      </div>
    </div>
  );
  /**
   * Strength metre returns status green or yellow
   */
  strengthMeter = () => (
    <div className={classNames('d-flex', 'pt-1')}>
      <div className="mr-half">Weak</div>
      <div className={classNames('w-100 p-0', `${meterBackground}`, `${tranlateFuntion(50)}`)}>
        {this.state.passwordStrength < 30 ? (
          <div className={(`${insideMeter}`, classNames(`${meterRed}`))} style={{ width: `${this.state.passwordStrength}%` }} />
        ) : (
          <div
            className={(`${insideMeter}`, this.state.passwordStrength < 51 ? classNames(`${meterYellow}`) : classNames(`${meterGreen}`))}
            style={{ width: `${this.state.passwordStrength}%` }}
          />
        )}
      </div>
      <div className="ml-half">Strong</div>
    </div>
  );

  render() {
    const { cms } = this.props;
    const { passwordStrengthLib } = this.state;
    return (
      <Fragment>
        {passwordStrengthLib ? (
          <div className={classNames(' o-copy__12reg', 'pt-1', 'pb-3')}>
            {this.strengthLabels(cms)}
            <div className={classNames('pt-3')}>
              {cms.commonLabels.passwordStrengthLabel}
              <Tooltip
                auid="myAct_passwordStrengthMeter"
                direction="top"
                align="C"
                lineHeightFix={1.5}
                className="body-12-normal"
                content={
                  <div id="descriptionTooltipPassStr" role="alert" style={{ width: '250px', fontSize: '12px', fontFamily: 'Mallory-Book', margin: '0px' }}>
                    <div style={{ fontWeight: '700' }}>{cms.commonLabels.passwordStrengthTooltipHeader}</div>
                    <div style={{ fontWeight: 'normal' }}>{cms.commonLabels.passwordStrengthTooltipMessage}</div>
                  </div>
                }
                showOnClick={isMobile()}
                ariaLabel={cms.commonLabels.passwordStrengthTooltipHeader}
              >
                <span>
                  <button
                    className={`academyicon icon-information ${tooltipStyle}`}
                    role="tooltip" //eslint-disable-line
                    aria-describedby="descriptionTooltipPassStr"
                  />
                </span>
              </Tooltip>
            </div>
            {this.strengthMeter()}
          </div>
        ) : null}
      </Fragment>
    );
  }
}

PasswordStrengthMeter.propTypes = {
  cms: PropTypes.object.isRequired,
  password: PropTypes.string,
  callbackValidator: PropTypes.func
};

if (ExecutionEnvironment.canUseDOM) {
  [...document.querySelectorAll(`[data-component="${NODE_TO_MOUNT}"]`)].forEach(el => {
    ReactDOM.hydrate(<PasswordStrengthMeter {...window.ASOData[el.getAttribute(`${DATA_COMP_ID}`)]} />, el);
  });
}

export default PasswordStrengthMeter;
