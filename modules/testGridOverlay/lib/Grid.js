import React from 'react';
import { cx } from 'react-emotion';
import { GridWrapper, gridContainer, gridRow, gridCol, gridColContent } from '../testGridOverlay.component.emotion';

const renderColumns = () => {
  const arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  const col = 'col-1';
  return arr.map((nul, idx) => {
    return <div className={cx(col, gridCol)} key={`${col}-${idx}`}><div className={gridColContent}>&nbsp;</div></div>; { /* eslint-disable-line */ }
  });
};

const Grid = () => (
  <GridWrapper>
    <div className={cx('container', gridContainer)}>
      <div className={cx('row', gridRow)} >{ renderColumns() }</div>
    </div>
  </GridWrapper>
);

export default Grid;
