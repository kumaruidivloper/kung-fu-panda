import PropTypes from 'prop-types';
import React from 'react';

import { cardStyle, cardHead, headerText } from '../../styles';

class Card extends React.PureComponent {
  render() {
    const { title, content, children } = this.props;
    return (
      <div className={`card ${cardStyle}`}>
        <div className="card-body">
          <div className={cardHead}>
            <h5 className={`card-title ${headerText}`}>{title}</h5>
          </div>
          {content}
          {children}
        </div>
      </div>
    );
  }
}

Card.propTypes = {
  title: PropTypes.string.isRequired,
  content: PropTypes.node,
  children: PropTypes.element
};

export default Card;
