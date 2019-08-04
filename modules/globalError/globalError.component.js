import ExecutionEnvironment from 'fbjs/lib/ExecutionEnvironment';
// import PropTypes from 'prop-types';
import React from 'react';
import ReactDOM from 'react-dom';
// import Drawer from '@academysports/fusion-components/dist/Drawer';
import { css, keyframes } from 'react-emotion';
// import { css } from 'emotion';
import { NODE_TO_MOUNT, DATA_COMP_ID } from './constants';

// const globalError = css`
//   background: -webkit-linear-gradient(to right, #8a2387, #e94057, #f27121);
//   background: linear-gradient(to right, #8a2387, #e94057, #f27121);
//   padding: 2rem 2rem 2rem 2rem;
//   .errorMessageHeading {
//     color: white;
//   }
//   .errorMessage {
//     color: white;
//     font-size: 1.2rem;
//   }
// `;

const bladeErrMsg = css`
  display: block;
  > div {
    color: #ee0000;
    border-radius: 4px;
    background-color: rgba(224, 0, 0, 0.03);
    border: solid 1px #e30300;
    position: relative;
  }
`;

const cssAnimation = keyframes`
  to {
    width: 0;
    height: 0;
    overflow: hidden;
    display: none;
    padding: 0;
  }
`;

const hideMsg = css`
  animation: ${cssAnimation} 0s ease-in 5s forwards;
  animation-fill-mode: forwards;
`;

const GENERIC_ERROR_MESSAGE = 'Sorry, Something went wrong. Please try after sometime.';

/* eslint-disable */
class GlobalError extends React.PureComponent {
  render() {
    // const { errorMessages } = this.props;
    // return (
    //   <div className={`${globalError} d-flex flex-column`}>
    //     <h3 className="errorMessageHeading">Following Errors Occurred: </h3>
    //     {errorMessages.map(message => <Drawer title={`❌ ${message.title}`}><div>🛠 {message.description}</div></Drawer>)}
    //   </div>
    // );
    return (
      <div className={`${bladeErrMsg} ${hideMsg} pt-1 px-md-4 px-0`}>
        <div className="o-copy__14reg pl-1 pr-1 py-1" role="alert">
          {GENERIC_ERROR_MESSAGE}
        </div>
      </div>
    );
  }
}

// GlobalError.propTypes = {
//   errorMessages: PropTypes.array.isRequired
// };

if (ExecutionEnvironment.canUseDOM) {
  [...document.querySelectorAll(`[data-component="${NODE_TO_MOUNT}"]`)].forEach(el => {
    ReactDOM.hydrate(<GlobalError {...window.ASOData[el.getAttribute(`${DATA_COMP_ID}`)]} />, el);
  });
}

export default GlobalError;
