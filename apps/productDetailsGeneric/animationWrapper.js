import React from 'react';
import PropTypes from 'prop-types';
import { CSSTransition, TransitionGroup } from 'react-transition-group';

class AnimationWrapper extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      in: false
    };
    this.uid = Math.floor(Math.random() * 1e16);
  }

  componentDidMount() {
    const { delay } = this.props;
    this.animateAfter(delay || 1);
  }

  animateAfter(delay) {
    setTimeout(() => {
      this.setState({ in: true });
    }, delay);
  }

  render() {
    const { children, className, timeout = 500, show: propsShow, classNames: propsClassNames, handleEntered = () => {}, handleExited = () => {} } = this.props;
    const classNames = propsClassNames || `fade-${timeout}ms`;
    const show = propsShow !== undefined && propsShow !== null ? propsShow : this.state.in;
    return (
      <TransitionGroup key={`trans-group-${this.uid}`} component={null}>
        {show && (
          <CSSTransition key={`trans-${this.uid}`} classNames={classNames} timeout={timeout} onEntered={handleEntered} onExited={handleExited}>
            <div key={`trans-cont-wrapper-${this.uid}`} className={className}>
              {children}
            </div>
          </CSSTransition>
        )}
      </TransitionGroup>
    );
  }
}

AnimationWrapper.propTypes = {
  children: PropTypes.any,
  className: PropTypes.string, // applies to wrapping div
  delay: PropTypes.number,
  timeout: PropTypes.oneOf([200, 300, 400, 500]),
  show: PropTypes.bool,
  classNames: PropTypes.string, // applies to animation for CSSTransition
  handleEntered: PropTypes.func,
  handleExited: PropTypes.func
};

export default AnimationWrapper;
