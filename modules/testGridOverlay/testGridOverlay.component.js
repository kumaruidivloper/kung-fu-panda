import ExecutionEnvironment from 'fbjs/lib/ExecutionEnvironment';
import React from 'react';
import ReactDOM from 'react-dom';
import Portal from './lib/Portal';
import Grid from './lib/Grid';
import { portalWrapper, Toggle } from './testGridOverlay.component.emotion';

import { NODE_TO_MOUNT, DATA_COMP_ID } from './constants';

class TestGridOverlay extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      open: false
    };

    this.toggleGrid = this.toggleGrid.bind(this);
  }

  toggleGrid() {
    this.setState({ open: !this.state.open });
  }

  render() {
    return (
      <div>
        <Portal portalClassName={portalWrapper}>
          <Toggle onClick={this.toggleGrid}>Toggle Grid</Toggle>
          {this.state.open && <Grid />}
        </Portal>
      </div>
    );
  }
}

if (ExecutionEnvironment.canUseDOM) {
  [...document.querySelectorAll(`[data-component="${NODE_TO_MOUNT}"]`)].forEach(el => {
    ReactDOM.hydrate(<TestGridOverlay {...window.ASOData[el.getAttribute(`${DATA_COMP_ID}`)]} />, el);
  });
}

export default TestGridOverlay;
