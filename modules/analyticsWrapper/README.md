**analyticsWrapper**
### 1. Intoduction
The purpose of this higher order component is to wrap any component and push the analytics of the wrapped component to window dataLayer.

The component takes a react component as input. The react component creates an action that is listened by reducer as 'updateAnalytics'. Reducer looks for a particular action type, if the action type matches the required one, the reducaer would update it's store with action data.

Meanwhile, saga keeps a watch at 'updateAnalytics' state of reducer's store, and if any updates done, updates the GTM Datalyer with the same.

### 2. How to wrap any component?

Please follow the steps given below to wrap the particular component.

Following is the example for wrapping **SignUpComponent** component reciding in `src/modules/SignUp` and pushing the analytics on **SignUp** button click.

---
```javascript
import ExecutionEnvironment from 'fbjs/lib/ExecutionEnvironment';
import PropTypes from 'prop-types';
import React from 'react';
import ReactDOM from 'react-dom';
import AnalyticsWrapper from '../analyticsWrapper/analyticsWrapper.component';

class SignUpComponent extends React.PureComponent {
    /*example use case being done in componentDidMount.*/
    /*invoked on clicking signUp button*/
    handleClick() {
        /*pushAnalytics is the function which we get as a prop to push the analytics data as an object*/
        const {pushAnalytics} = this.props;
        const analyticsdata = {
        /* data to be pushed to window dataLayer*/
        }
        pushAnalytics(analyticsdata);
    }
    render() {
        /*....RENDER CODE GOES HERE*/
    }
}
if (ExecutionEnvironment.canUseDOM) {
    /* wrap the  SignUp component in Analyticswrapper*/
  const SignUpComponentWrapper = AnalyticsWrapper(SignUpComponent);
  /* Replace the SignUpComponent with SignUpComponentWrapper */
  [...document.querySelectorAll(`[data-component="${NODE_TO_MOUNT}"]`)].forEach(el => {
    ReactDOM.hydrate(
      <Provider store={window.store}>
        <SignUpComponentWrapper {...window.ASOData[el.getAttribute(`${DATA_COMP_ID}`)]} />
      </Provider>,
      el
    );
  });
}
/*export the wrapped component */
export default AnalyticsWrapper(SignUpComponent);
```
---
