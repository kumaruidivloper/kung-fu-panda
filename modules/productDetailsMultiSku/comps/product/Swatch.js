import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { swatch } from '../style';

const getItemValue = (isOutOfStock, item) => {
  if (isOutOfStock) {
    return (
      <Fragment>
        <span style={{ minWidth: '75px', display: 'inline-block' }}>{item.value}</span>
        <svg
          style={{
            width: '100%',
            height: '100%',
            position: 'absolute',
            left: '0px',
            right: '0px',
            top: '0px'
          }}
        >
          <line x1="0" y1="100%" x2="100%" y2="0" style={{ stroke: 'rgb(204, 204, 204)', strokeWidth: '1' }} />
        </svg>
      </Fragment>
    );
  }
  return <span style={{ minWidth: '75px', display: 'inline-block' }}>{item.value}</span>;
};

const Swatch = props => (
  <div className={`row ${swatch.row}`}>
    {props.items.map(item => {
      const itemInventory = props.inventory[item.id];
      const isOutOfStock = itemInventory ? itemInventory.inventory && itemInventory.inventory.inventoryStatus === 'OUT_OF_STOCK' : true;
      const type = item.hasOwnProperty('imageURL') ? 'img' : 'size'; // eslint-disable-line

      return (
        <Fragment key={item.id}>
          <button
            role="radio"
            aria-checked={props.selected ? props.selected[props.itemName] === item.id : false}
            className={`col-3 col-sm-2 ${swatch.btn} ${props.selected && props.selected[props.itemName] === item.id ? 'selected' : ''} ${
              isOutOfStock && type !== 'img' ? swatch.oos : ''
            }`}
            data-auid="swatchButton-image-3782"
            aria-label={item.value}
            onClick={() => props.updateSelection(props.itemName, item, isOutOfStock)}
          >
            {type === 'img' ? <img src={`${item.imageURL}?wid=150&hei=150`} alt="" /> : getItemValue(isOutOfStock, item)}
          </button>
        </Fragment>
      );
    })}
  </div>
);

Swatch.propTypes = {
  inventory: PropTypes.object,
  selected: PropTypes.object,
  itemName: PropTypes.string,
  items: PropTypes.array,
  updateSelection: PropTypes.func // eslint-disable-line
};

Swatch.defaultProps = {
  inventory: {}
};

export default Swatch;
