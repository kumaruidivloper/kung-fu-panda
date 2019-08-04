import React from 'react';
import PropTypes from 'prop-types';
import { css } from 'react-emotion';

const listStyle = css`
  font-size: 0.875rem;
  margin-left: 1.25rem;
  padding-bottom: 0.5rem;
`;

const features = css`
  display: flex;
  width: 100%;
  flex-flow: row wrap;
  padding-left: 1rem;
  margin-bottom: 0;
`;

const align = css`
  padding-left: 0;
`;
const itemStyle = css`
  font-size: 0.875rem;
  position: relative;
  padding: 0 1.5rem 0.5rem 0;
  width: 33%;
`;

const SpecItem = ({ title, classes, list }) => {
  let keyCounter = 0;
  const renderItem = item => {
    if (item && typeof item === 'object') {
      const { url, value } = item;
      return (
        <a data-auid={`PRODUCT_DETAILS_${value}`} href={url} target="_blank" rel="noopener noreferrer">
          {value}
        </a>
      );
    }

    return <span>{item}</span>;
  };
  return (
    <div className="mt-1 mt-md-1" data-auid={title}>
      <p className="o-copy__14bold mb-1"> {title} </p>
      <div>
        <ul className={classes ? features : align}>
          {list.map(item => {
            keyCounter += 1;
            return (
              <li key={`SPEC_ITEM-${keyCounter}`} className={classes ? itemStyle : listStyle}>
                <span>{renderItem(item)}</span>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

SpecItem.propTypes = {
  title: PropTypes.string.isRequired,
  classes: PropTypes.string,
  list: PropTypes.array.isRequired
};

export default SpecItem;
