import React from 'react';
import PropTypes from 'prop-types';
import { cx, css } from 'react-emotion';

const emo = {
  wrapper: css``,
  item: css`
    display: inline-block;
    opacity: 0.3;
    background-color: #000;
    height: 10px;
    width: 10px;
    border-radius: 50%;
  `,
  currentItem: css`
    opacity: 1;
  `
};

const renderPageItems = (pageCount, currentPage) => {
  const pageItems = [];
  for (let x = 0; x < pageCount; x += 1) {
    const clazzName = x + 1 === currentPage ? cx(emo.item, emo.currentItem) : emo.item;
    const itemKey = `pageination-page-${x}`;
    pageItems.push(<div key={itemKey} className={cx(clazzName, 'mx-half')} />);
  }
  return pageItems;
};

const Pagination = props => {
  const { pageCount, currentPage, className } = props;
  return !!pageCount && pageCount > 1 && <div className={cx(emo.wrapper, className)}>{renderPageItems(pageCount, currentPage)}</div>;
};

Pagination.propTypes = {
  className: PropTypes.string,
  pageCount: PropTypes.number,
  currentPage: PropTypes.number
};

export default Pagination;
