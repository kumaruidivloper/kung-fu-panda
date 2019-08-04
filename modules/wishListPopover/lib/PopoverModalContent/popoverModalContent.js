import React from 'react';
import PropTypes from 'prop-types';
import WishListForm from '../WishListForm/wishListForm';
import WishListSuccess from '../WishListSuccess/wishListSuccess';
import { viewStates } from '../util';

class PopoverModalContent extends React.PureComponent {
  render() {
    const { viewState } = this.props; // eslint-disable-line object-curly-newline
    switch (viewState) {
      case viewStates.form:
        return (
          <WishListForm
            wishLists={this.props.wishLists}
            onSelect={this.props.onSelectWishList}
            onClickCreate={this.props.onClickCreate}
            onInputChange={this.props.onNewWishListNameChange}
            inputValue={this.props.newWishListNameValue}
            inputError={this.props.newWishListNameError}
            data-auid="PDP_AddNewWishList"
            errorMessageOnAdd={this.props.errorMessageOnAdd}
            errorMessageOnCreate={this.props.errorMessageOnCreate}
          />
        );
      case viewStates.success:
        return (
          <WishListSuccess
            wishListName={this.props.selectedWishListName}
            itemImageUrl={this.props.itemImageUrl}
            successScrollIntoView={this.props.successScrollIntoView}
          />
        );
      default:
        return (
          <WishListForm
            wishLists={this.props.wishLists}
            onSelect={this.props.onSelectWishList}
            onClickCreate={this.props.onClickCreate}
            onInputChange={this.props.onNewWishListNameChange}
            inputValue={this.props.newWishListNameValue}
            inputError={this.props.newWishListNameError}
            errorMessageOnAdd={this.props.errorMessageOnAdd}
            errorMessageOnCreate={this.props.errorMessageOnCreate}
          />
        );
    }
  }
}

PopoverModalContent.propTypes = {
  viewState: PropTypes.string,
  wishLists: PropTypes.array,
  onSelectWishList: PropTypes.func,
  onClickCreate: PropTypes.func,
  onNewWishListNameChange: PropTypes.func,
  newWishListNameValue: PropTypes.string,
  newWishListNameError: PropTypes.string,
  selectedWishListName: PropTypes.string,
  itemImageUrl: PropTypes.string,
  successScrollIntoView: PropTypes.bool,
  errorMessageOnAdd: PropTypes.string,
  errorMessageOnCreate: PropTypes.string
};

export default PopoverModalContent;
