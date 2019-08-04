import React from 'react';
import PropTypes from 'prop-types';
import { cx } from 'react-emotion';
import * as emo from './wishListChoose.emotion';

const renderListItems = (items, onSelect) =>
  items.map((item, idx) => {
    const onClick = () => onSelect(item.uniqueID);
    const focusValue = idx === 0;
    const onEnterFireClick = e => {
      if (onClick && e.nativeEvent.keyCode === 13) {
        onClick();
      }
    };
    return (
      <emo.Li key={`wishListItem-${item.uniqueID}`}>
        <button
          data-auid={`wishListPopover_add_to_wishList_${idx}`}
          className={cx(emo.liButton, 'ada-div', 'o-copy__14reg')}
          onClick={onClick}
          autoFocus={focusValue} // eslint-disable-line
          onKeyPress={onEnterFireClick}
        >
          {item.descriptionName}
        </button>
      </emo.Li>
    );
  });

const renderError = apiErrorMessage => (!apiErrorMessage ? null : <div className={cx(emo.colorRed, 'o-copy__12reg')}>{apiErrorMessage}</div>);

const WishListChoose = props => {
  const { wishLists = [], onSelect, apiErrorMessage } = props;

  if (wishLists.length <= 0) {
    return null;
  }

  return (
    <emo.Wrapper>
      <emo.Title>Choose your list</emo.Title>
      {renderError(apiErrorMessage)}
      <emo.Ul>{renderListItems(wishLists, onSelect)}</emo.Ul>
    </emo.Wrapper>
  );
};

WishListChoose.propTypes = {
  wishLists: PropTypes.arrayOf(PropTypes.shape({ uniqueID: PropTypes.string, descriptionName: PropTypes.string })),
  onSelect: PropTypes.func.isRequired,
  apiErrorMessage: PropTypes.string
};

export default WishListChoose;
