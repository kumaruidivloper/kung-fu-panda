import styled, { css } from 'react-emotion';

const ReactToolTip = {
  toolTip: css`
    width: 200px;
    background-color: #ffffff;
    box-shadow: 0 6px 16px 0 rgba(0, 0, 0, 0.1), 0 6px 12px 0 rgba(0, 0, 0, 0.04), 0 2px 5px 0 rgba(0, 0, 0, 0.08);
    font-family: Mallory-Book;
    font-size: 12px;
    font-weight: normal;
    font-style: normal;
    font-stretch: normal;
    line-height: 1.33;
    letter-spacing: normal;
    color: #333333;
  `
};

const titleText = props => css`
  font-family: Mallory-Condensed-Black;
  font-weight: bold;
  font-size: ${props.fontSize ? props.fontSize : '1.875rem'};
  color: ${props.color ? props.color : ''};
  padding-bottom: 0.5rem;
`;

const contentText = props => css`
  font-family: Mallory-Book;
  font-size: 0.875rem;
  color: #585858;
  font-weight: normal;
  font-style: normal;
  font-stretch: normal;
  line-height: normal;
  letter-spacing: normal;
  color: ${props.color ? props.color : ''} !important;
`;

const Hyphen = styled.span(
  props => css`
    margin: 0 0.5rem;
    color: ${props.color ? props.color : '#ee0000'};
  `
);

const DroppedPrice = styled.span`
  font-size: 0.75em;
  display: inline-block;
  margin: 0 1rem;
`;

const IconStyles = styled.span(
  props => css`
    font-size: ${props.baitToolTip ? props.baitToolTip : '20px'};
    color: grey;
    padding-left: 5px;
  `
);

const LiveChatWrapper = styled.div(css`
  display: flex;
  align-items: center;

  a {
    color: #333333;

    i {
      color: #0055a6;
    }
  }
`);

const ChatNow = styled.a(css`
  margin-left: 1rem;
  color: #333333;
  font-size: 0.875rem;
  font-weight: normal;
  font-style: normal;
  font-stretch: normal;
  line-height: normal;
  letter-spacing: normal;

  i {
    color: #0055a6;
    padding-right: 0.5rem;
  }
`);

const TitleText = styled.div(titleText);
const ContentText = styled.div(contentText);
const ContentTextInline = styled.span(contentText);

export {
  titleText,
  contentText,
  TitleText,
  ContentText,
  ContentTextInline,
  Hyphen,
  DroppedPrice,
  LiveChatWrapper,
  ChatNow,
  IconStyles,
  ReactToolTip
};
