import ExecutionEnvironment from 'fbjs/lib/ExecutionEnvironment';
import React from 'react';
import styled, { css } from 'react-emotion';
import classNames from 'classnames';
import media from '../../../utils/media';
// import { StyledList, contentStyle, infoStyle, StyledHeader, mainContainer } from './style';
/* istanbul ignore next */
const headerStyle = props => css`
  justify-content: ${props.alignment};
`;

const ModalContentHolder = css`
  position: absolute;
  top: 0;
  z-index: 98;
`;

const StyledHeader = styled('h4')`
  text-transform: uppercase;
  display: flex;
  ${media.sm`
    font-size: 2rem;
  `} ${headerStyle};
`;

class promotionalModal extends React.PureComponent {
  // componentWillMount() {
  //     this.setState({ isModalOpen: true });
  // }
  constructor(props) {
    super(props);
    /* istanbul ignore next */
    this.state = {
      cms: this.props
      // isModalOpen: true
    };
    this.renderPoints = this.renderPoints.bind(this);
    this.redirectTo = this.redirectTo.bind(this);
  }
  /**
   *
   *@description reDirecting page to the prvided targetLocation
   * @param {event} e - OnClick Event parameter
   * @param {string} targetLocation
   * @memberof promotionalModal
   */
  redirectTo(e, targetLocation) {
    e.preventDefault();
    if (ExecutionEnvironment.canUseDOM) {
      window.location.href = targetLocation;
    }
  }

  /**
   *
   *@description redering links according to data which we are getting from cms
   * @param {array} data
   * @returns react element
   * @memberof promotionalModal
   */
  renderPoints(data) {
    const x = data && data.map((item, index) => <li key={index.toString()}>{item.text}</li>);
    return x;
  }

  render() {
    const { cms } = this.state;
    return (
      <div className={classNames(`${ModalContentHolder}`, 'col-12 col-md-6 offset-md-3 text-center')}>
        <div className="row d-flex mx-3 mx-md-0">
          <StyledHeader alignment={cms.bannerAlignment} className="align-items-center my-4 mx-3 mx-md-0">
            {cms.heading}
          </StyledHeader>
          <h6 aria-level="6" className="o-copy__16bold">
            {cms.title}
          </h6>
          <ul className="o-copy__14reg m-0 pl-1 text-left">{this.renderPoints(cms.items || [])}</ul>
          <h6 aria-level="6" className="o-copy__16bold my-4">
            {cms.description}
          </h6>
          <p className="o-copy__14bold mb-4">
            {cms.disclaimerURL ? (
              <a onClick={e => this.redirectTo(e, cms.disclaimerURL)} href={cms.disclaimerURL}>
                {cms.disclaimer}
              </a>
            ) : (
              cms.disclaimer
            )}
          </p>
        </div>
      </div>
    );
  }
}

export default promotionalModal;
