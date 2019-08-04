import ExecutionEnvironment from 'fbjs/lib/ExecutionEnvironment';
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import styled, { css } from 'react-emotion';
import Link from '@academysports/fusion-components/dist/Link';
import media from '../../../utils/media';
import { enhancedAnalyticsPromoClick } from '../../../utils/analytics';

const Wrapper = styled('div')`
  position: absolute;
  top: 98px;
  border-radius: 4px;
  ${props =>
    props.position === 'left' &&
    css`
      right: 44.5%;
      width: 598px;
    `};
  ${props =>
    props.position === 'right' &&
    css`
      left: 44.5%;
      width: 650px;
    `};
  height: 540px;
  box-shadow: 0 14px 36px 8px rgba(0, 0, 0, 0.08), 0 12px 32px 6px rgba(0, 0, 0, 0.04), 0 5px 12px 0 rgba(0, 0, 0, 0.06),
    0 6px 16px 0 rgba(0, 0, 0, 0.1);
  background: ${props => props.bgColor};
  transform-origin: 100% 100%;
  ${media.sm`
    top:360px;
    width:90%;
    height:334px;
    left:0;
  `} @media (min-width: 577px) and (max-width: 767px) {
    width: 345px;
    height: 360px;

    ${props =>
      props.position === 'left' &&
      css`
        right: 40%;
      `};
    ${props =>
      props.position === 'right' &&
      css`
        left: 40%;
      `};
  }

  @media (min-width: 768px) and (max-width: 1200px) {
    width: 410px;
    height: 360px;
  }

  ${props =>
    props.position === 'right' &&
    media.sm`
    left: initial;
    right: 0;
  `};
`;

const Content = styled('div')`
  position: absolute;
  word-break: break-word;
  top: 18%;
  margin-top: 0;
  margin-bottom: 40px;
  margin-left: ${props => (props.position === 'left' ? `${40}px` : `${40}%`)};
  margin-right: ${props => (props.position === 'right' ? `${0}%` : `${40}%`)};
  ${media.sm`
    top: 30%;
    width: 90%;
    margin: 0 0 40px 16px;
    text-align: center;
  `} @media (min-width: 577px) and (max-width: 767px) {
    margin-right: ${props => (props.position === 'right' ? '16px' : `${25}%`)};
    margin-left: ${props => (props.position === 'left' ? '16px' : `${25}%`)};
  }
  @media (min-width: 768px){
    margin-right: ${props => (props.position === 'right' ? '16px' : '175px')};
    margin-left: ${props => (props.position === 'left' ? '16px' : '145px')};
  }
  @media (min-width: 850px){
    margin-right: ${props => (props.position === 'right' ? '32px' : '175px')};
    margin-left: ${props => (props.position === 'left' ? '32px' : '145px')};
  }
  @media (min-width: 900px){
    margin-right: ${props => (props.position === 'right' ? '16px' : '200px')};
    margin-left: ${props => (props.position === 'left' ? '16px' : '165px')};
  }
  @media (min-width: 1024px){
    margin-right: ${props => (props.position === 'right' ? '32px' : '175px')};
    margin-left: ${props => (props.position === 'left' ? '32px' : '145px')};
  }
  @media (min-width: 1050px){
    margin-right: ${props => (props.position === 'right' ? '16px' : '175px')};
    margin-left: ${props => (props.position === 'left' ? '32px' : '165px')};
  }
  @media (min-width: 1150px){
    margin-left: ${props => (props.position === 'left' ? '32px' : '175px')};
  }
  @media (min-width: 1201px){
    margin-right: ${props => (props.position === 'right' ? '32px' : '175px')};
    margin-left: ${props => (props.position === 'left' ? '32px' : '195px')};
  }
  @media (min-width: 1280px){
    margin-right: ${props => (props.position === 'right' ? '32px' : '200px')};
    margin-left: ${props => (props.position === 'left' ? '32px' : '195px')};
  }
  @media (min-width: 1350px){
    margin-left: ${props => (props.position === 'left' ? `${40}px` : `${40}%`)};
    margin-right: ${props => (props.position === 'right' ? `${40}px` : `${40}%`)};
  }
`;
Content.displayName = 'BoxWithTextContent';
const baseTextStyle = css`
  font-family: 'Mallory-Book';
  margin-bottom: 10px;
`;

const Eyebrow = styled('div')`
  ${baseTextStyle} color:${props => props.textColor || '#ffffff'};
    color:${props => props.textColor || '#ffffff'};
  text-transform: uppercase;
  font-size: 1.125rem;
  letter-spacing: 2px;
  line-height: 1.22;
  word-wrap: break-word;
  ${media.xl`
    font-size:0.75rem;
    letter-spacing: 1px;
    line-height: 1.33;
  `};
`;

const H1 = styled('h1')`
  color: ${props => props.textColor || '#ffffff'};
  margin-bottom: 0.625rem;
  font-size: 3.375rem;
  font-weight: 900;
  line-height: 1;
  text-transform: uppercase;
  word-wrap: break-word;
  ${media.sm`
    font-size: 2rem;
    margin-bottom: 0.4375rem;
  `} @media (min-width: 577px) and (max-width: 1200px) {
    font-size: 1.5rem;
  }
`;
const H2 = styled('h2')`
  color: ${props => props.textColor || '#ffffff'};
  margin-bottom: 0.625rem;
  font-size: 3.375rem;
  font-weight: 900;
  line-height: 1;
  text-transform: uppercase;
  word-wrap: break-word;
  ${media.sm`
    font-size: 2rem;
    margin-bottom: 0.4375rem;
  `} @media (min-width: 577px) and (max-width: 1200px) {
    font-size: 1.5rem;
  }
`;

const Messaging = styled('p')`
  ${baseTextStyle}
  color:${props => props.textColor || '#ffffff'};
  font-size: 1rem;
  line-height:1.25;
  word-wrap: break-word;
  ${media.xl`
    font-size: 0.875rem;
    line-height: 1.29;
  `}
  }
`;

const ctaButton = css`
  margin-top: 1rem;
  line-height: 1.38;
  background-color: rgba(0, 0, 0, 0);
  ${media.xl`
    min-height: 3.125rem;
    font-size: 0.875rem;
    margin-top: 0.625rem;
    line-height: 1.29;
    letter-spacing: 0.4px;
  `};
`;
const Dash = styled('div')`
  width: 60px;
  border-style: solid;
  border-width: 3px;
  border-color: ${props => props.textColor || '#ffffff'};
  margin: 16px 0;
  ${media.sm`
    width: 30px;
    margin: 14px auto;
    border-style: solid;
    border-width: 2px;
  `};
`;
class BoxWithText extends React.PureComponent {
  handleClick(ctaTarget, ctaLabel) {
    const { gtmDataLayer, enhancedEcomm } = this.props;
    const eventAction = ctaLabel && ctaLabel.toLowerCase();
    const eventURL = ctaTarget && ctaTarget.toLowerCase();

    if (gtmDataLayer) {
      enhancedAnalyticsPromoClick(gtmDataLayer, enhancedEcomm, eventURL);
      gtmDataLayer.push({
        event: 'heroImageVariantActions',
        eventCategory: 'Hero Image Variant Actions',
        eventAction: `click - ${eventAction}`,
        eventLabel: eventURL
      });
    }
    /* istanbul ignore else */
    if (ExecutionEnvironment.canUseDOM) {
      window.location = ctaTarget;
    }
  }
  render() {
    const { eyebrow, headline, isH1, messaging, ctaLabel, ctaTarget, bgColor, position, textColor } = this.props;
    return (
      <Wrapper bgColor={bgColor} position={position}>
        <Content position={position}>
          <Eyebrow textColor={textColor}>{eyebrow}</Eyebrow>
          <Dash textColor={textColor} />
          {isH1 ? (
            <H1 aria-level="1" textColor={textColor}>
              {headline}
            </H1>
          ) : (
            <H2 aria-level="2" textColor={textColor}>
              {headline}
            </H2>
          )}
          <Messaging textColor={textColor}>{messaging}</Messaging>
          <Link
            auid="HP_HIV_BUTTON"
            btntype="secondary"
            btnvariant="tertiary"
            size="M"
            onClick={() => this.handleClick(ctaTarget, ctaLabel)}
            href={ctaTarget}
            className={`${ctaButton} d-flex align-items-center justify-content-center`}
          >
            {ctaLabel}
          </Link>
        </Content>
      </Wrapper>
    );
  }
}

BoxWithText.propTypes = {
  eyebrow: PropTypes.string,
  headline: PropTypes.string,
  messaging: PropTypes.string,
  isH1: PropTypes.bool,
  ctaLabel: PropTypes.string,
  ctaTarget: PropTypes.string,
  bgColor: PropTypes.string,
  textColor: PropTypes.string,
  position: PropTypes.string,
  gtmDataLayer: PropTypes.array,
  enhancedEcomm: PropTypes.object
};

const mapStateToProps = state => ({
  gtmDataLayer: state.gtmDataLayer
});

const withConnect = connect(mapStateToProps);

export default withConnect(BoxWithText);
