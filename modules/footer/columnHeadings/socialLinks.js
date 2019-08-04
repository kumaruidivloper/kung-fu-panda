import React from 'react';
import PropTypes from 'prop-types';
import ColumnHeader from './columnHeaders';
// import '../footer.component.scss';
import { detailList } from '../styles';

const SocialLinks = props => {
    const {
 footerLinks, name, colClass, fontClass, marginBot, showSignupModal
} = props;
    const flexDirection = (name === 'detail-link') ? 'flex-column' : 'flex-row';
  return (
    <div className={`${name}-container ${detailList} ${marginBot || ''}  d-flex ${colClass || ''} ${flexDirection}`}>
      <ColumnHeader showSignupModalfn={showSignupModal} fontCls={fontClass} className="social-item" name={name} links={footerLinks} />
    </div>);
};

SocialLinks.propTypes = {
    footerLinks: PropTypes.array,
    name: PropTypes.string,
    colClass: PropTypes.string,
    fontClass: PropTypes.string,
    marginBot: PropTypes.string,
    showSignupModal: PropTypes.func
};
export default SocialLinks;
