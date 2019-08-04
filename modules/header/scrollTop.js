import ExecutionEnvironment from 'fbjs/lib/ExecutionEnvironment';
import React from 'react';
import styled, { css } from 'react-emotion';
import { HEADER_CONTAINER_ID } from './constants';
import { isIphone } from '../../utils/navigator';
import media from '../../utils/media';

export const StyledButton = styled('button')`
  position: fixed;
  border: none;
  outline: none;
  cursor: pointer;
  width: 60px;
  padding: 0;
  margin-bottom: 5rem;
  right: 0;
  bottom: ${`${isIphone() ? 36 : 0}px`};
  z-index: 2;
  background: transparent;
  ${media.sm`
    width: 48px;
  `};
`;
const iconDiv = css`
  background-color: #0055a6;
  color: #fff;
  border-bottom-left-radius: 8px;
  border-top-left-radius: 8px;
  > span {
    line-height: 3;
  }
`;
class ScrollTop extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      displayButton: 'd-none'
    };
    this.scrollFunction = this.scrollFunction.bind(this);
    this.scrollToTop = this.scrollToTop.bind(this);
  }
  componentDidMount() {
    if (ExecutionEnvironment.canUseDOM) {
      window.addEventListener('scroll', this.scrollFunction);
    }
  }
  componentWillUnmount() {
    if (ExecutionEnvironment.canUseDOM) {
      window.removeEventListener('scroll', this.scrollFunction);
    }
  }

  /**
   *
   * @description function is used to handle visibility of the scroll-top button (updates state of the component accordingly)
   * @memberof ScrollTop
   */
  scrollFunction() {
    let className = 'd-none';
    if (
      document.body.scrollTop > (ExecutionEnvironment.canUseDOM && window.innerHeight) ||
      document.documentElement.scrollTop > (ExecutionEnvironment.canUseDOM && window.innerHeight)
    ) {
      className = 'd-block';
    }
    this.setState({ displayButton: className });
  }
  /**
   *
   * @description function is used to handle smoothness with which page scrolls to top
   * @memberof ScrollTop
   */
  scrollToTop() {
    if (ExecutionEnvironment.canUseDOM) {
      const scrollTopBtnWrap = document.getElementById(`${HEADER_CONTAINER_ID}`);
      scrollTopBtnWrap.scrollIntoView({ behavior: 'smooth' });
    }
  }
  render() {
    return (
      <StyledButton
        tabIndex="0"
        id="scrollTopBtn"
        title="Back to top"
        className={`${this.state.displayButton} d-print-none`}
        onClick={this.scrollToTop}
      >
        <div className={iconDiv}>
          <span className="academyicon icon-chevron-up" />
        </div>
      </StyledButton>
    );
  }
}
export default ScrollTop;
