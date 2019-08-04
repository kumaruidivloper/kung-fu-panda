import React from 'react';
import PropTypes from 'prop-types';
// import classNames from 'classnames';
import ColumnHeader from './columnHeaders';
// import '../footer.component.scss';
import { hrStyles } from '../styles';

const HeaderList = props => {
  const { columnHeading, footerLinks, linkclassName, colClass, fontClass } = props;
  const heading = columnHeading ? (
    <h6 aria-level="6" className="o-copy__16bold">
      {columnHeading}
    </h6>
  ) : null;

  return (
    <div className={`header-container-${linkclassName} ${colClass}`}>
      {heading}
      <hr className={`${hrStyles}`} />
      <ColumnHeader fontCls={fontClass} className={linkclassName} links={footerLinks} />
    </div>
  );
};

HeaderList.propTypes = {
  columnHeading: PropTypes.string,
  footerLinks: PropTypes.array,
  linkclassName: PropTypes.string,
  colClass: PropTypes.string,
  fontClass: PropTypes.string
};
export default HeaderList;
