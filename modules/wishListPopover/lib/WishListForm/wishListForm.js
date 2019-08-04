import React from 'react';
import PropTypes from 'prop-types';
import styled from 'react-emotion';
import WishListAdd from './lib/WishListAdd/wishListAdd';
import WishListChoose from './lib/WishListChoose/wishListChoose';
import { scrollIntoView } from '../../../../utils/scroll';
// import AnimationWrapper from '../../../../apps/productDetailsGeneric/animationWrapper';

const Hr = styled('hr')`
  border: none;
  height: 1px;
  background-color: #e8e8e8;
  margin-top: 22px;
  margin-bottom: 24px;
`;

class WishListForm extends React.PureComponent {
  constructor(props) {
    super(props);
    this.wrapperRef = React.createRef();
    this.scrollIntoView = this.scrollIntoView.bind(this);
  }

  componentDidMount() {
    setTimeout(this.scrollIntoView, 30);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.wishLists.length !== this.props.wishLists.length) {
      setTimeout(this.scrollIntoView, 30);
    }
  }

  scrollIntoView() {
    const el = this.wrapperRef.current;
    if (el) {
      scrollIntoView(el, true);
    }
  }

  render() {
    const { wishLists, onSelect, onClickCreate, onInputChange, inputValue, inputError, errorMessageOnAdd, errorMessageOnCreate } = this.props;

    return (
      <div ref={this.wrapperRef}>
        {wishLists && wishLists.length > 0 && <WishListChoose wishLists={wishLists} onSelect={onSelect} apiErrorMessage={errorMessageOnAdd} />}
        {wishLists && wishLists.length > 0 && <Hr />}
        <WishListAdd
          wishLists={wishLists}
          onClickCreate={onClickCreate}
          onInputChange={onInputChange}
          inputValue={inputValue}
          inputError={errorMessageOnCreate || inputError}
        />
      </div>
    );
  }
}

WishListForm.propTypes = {
  wishLists: PropTypes.array,
  onSelect: PropTypes.func,
  onClickCreate: PropTypes.func,
  onInputChange: PropTypes.func,
  inputValue: PropTypes.string,
  inputError: PropTypes.string,
  errorMessageOnAdd: PropTypes.string,
  errorMessageOnCreate: PropTypes.string
};

WishListForm.defaultProps = {
  wishLists: []
};

export default WishListForm;
