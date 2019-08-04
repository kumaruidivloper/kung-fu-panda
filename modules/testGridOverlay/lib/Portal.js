import React from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import { canUseDOM } from 'fbjs/lib/ExecutionEnvironment';

class Portal extends React.PureComponent {
  componentDidMount() {
    if (!canUseDOM) return;

    this.defaultNode.className = this.props.portalClassName;
  }

  componentDidUpdate(prevProps) {
    const { portalClassName } = this.props;
    if (!canUseDOM) return;

    if (prevProps.portalClassName !== portalClassName) {
      this.defaultNode.className = portalClassName;
    }
  }

  componentWillUnmount() {
    if (this.defaultNode) {
      document.body.removeChild(this.defaultNode);
    }
    this.defaultNode = null;
  }

  render() {
    if (!canUseDOM) {
      return null;
    }
    if (!this.defaultNode) {
      this.defaultNode = document.createElement('div');
      document.body.appendChild(this.defaultNode);
    }
    return ReactDOM.createPortal(this.props.children, this.defaultNode);
  }
}

Portal.propTypes = {
  children: PropTypes.node.isRequired,
  portalClassName: PropTypes.string
};

export default Portal;
