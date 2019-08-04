import ExecutionEnvironment from 'fbjs/lib/ExecutionEnvironment';
import PropTypes from 'prop-types';
import React from 'react';
import ReactDOM from 'react-dom';
import { cx } from 'react-emotion';
import classNames from 'classnames';
import Button from '@academysports/fusion-components/dist/Button';
import PopoverStateless from '@academysports/fusion-components/dist/PopoverStateless';
import InputField from '@academysports/fusion-components/dist/InputField';

import { NODE_TO_MOUNT, DATA_COMP_ID, CREATE_LIST } from './constants';
import {
  iconStyle,
  iconStyleSpan,
  popoverModal,
  popoverModalCreateList,
  popoverWidth,
  Btn,
  focusText,
  btnMinHeight,
  popStateModal,
  iconPlus,
  renameList,
  fullDivWidthInput,
  redColor,
  linkStyle,
  createPopover,
  renameListPopover
} from './popOverWishList.styles';

class PopOverWishList extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isPopOverOpen: false,
      isCreateList: true,
      wishListName: '',
      valid: true
    };
    this.uid = Math.floor(Math.random() * 1e16);
    this.wrapperId = `wish-list-popover-wrapper-${this.uid}`;
    this.handleSubmit = this.handleSubmit.bind(this);
    this.closeOnWindowBodyClick = this.closeOnWindowBodyClick.bind(this);
  }

  onChangeInput(e) {
    this.setState({ wishListName: e.target.value });
  }
  handleSubmit(e) {
    e.preventDefault();
    const { wishListName, isPopOverOpen } = this.state;
    const { profileID, fnCreateWishList, fnRenameWishList, wishlistId } = this.props;
    if (wishListName.length && wishListName.length <= 50) {
      this.setState({ isPopOverOpen: !isPopOverOpen });
      if (this.state.isCreateList) {
        fnCreateWishList(wishListName, profileID);
      } else {
        fnRenameWishList(profileID, wishlistId, wishListName);
      }
      this.setState({ wishListName: '', valid: true });
    } else {
      this.setState({ valid: false });
    }
    if (ExecutionEnvironment.canUseDOM) {
      window.scrollTo(0, 0);
    }
  }
  closeOnWindowBodyClick() {
    this.setState({ isPopOverOpen: false });
  }
  render() {
    const { cms, popoverType } = this.props;
    const { isPopOverOpen } = this.state;
    if (popoverType !== CREATE_LIST) {
      this.setState({ isCreateList: false });
    }
    return (
      <div className="flex-row">
        <div className={classNames(popoverWidth, this.state.isCreateList ? popoverModalCreateList : popoverModal)}>
          <PopoverStateless.Wrapper id={this.wrapperId}>
            <button
              data-auid="pop_over_toggle_btn"
              onClick={() => this.setState({ isPopOverOpen: !this.state.isPopOverOpen })}
              className={classNames(Btn, 'p-0')}
              tabIndex={0}
            >
              {this.state.isCreateList ? (
                <React.Fragment>
                  <span className={classNames('academyicon icon-plus', 'pr-half', iconPlus)} />
                  <span className={classNames('o-copy__14reg', focusText)}>{cms.createListLabel}</span>
                </React.Fragment>
              ) : (
                <span className={classNames('o-copy__16reg', linkStyle, renameList)}>{cms.renameListLabel}</span>
              )}
            </button>
            <div className={this.state.isCreateList ? cx(createPopover, 'pt-half') : cx(renameListPopover, 'pt-half')}>
              <PopoverStateless.Modal
                direction="bottom"
                open={this.state.isPopOverOpen}
                lineHeightFix={1.5}
                onWindowBodyClick={this.closeOnWindowBodyClick}
                ignoreWindowBodyClickId={this.wrapperId}
              >
                <button
                  data-auid="pop_over_close_btn"
                  className={classNames('mt-half mr-half', iconStyle)}
                  onClick={() => this.setState({ isPopOverOpen: !isPopOverOpen, wishListName: '', valid: true })}
                >
                  <span className={classNames('m-0', 'academyicon icon-close', iconStyleSpan)} />
                </button>
                <form>
                  <div className={classNames(popStateModal, 'p-0')}>
                    <label htmlFor="wishlist-nameInput"><span className="o-copy__14bold">{this.state.isCreateList ? cms.createNewWishlistLabel : cms.renameWishlistLabel}</span></label>
                    <InputField
                      data-auid="Wish_list_name_input"
                      id="wishlist-nameInput"
                      borderradius="0.25rem"
                      bordercolor="#cccccc"
                      width="100%"
                      borderwidth="0.0625rem"
                      classname={this.state.valid ? 'w-100' : fullDivWidthInput}
                      onChange={e => this.onChangeInput(e)}
                    />
                    <div className={this.state.valid ? 'd-none' : 'd-block'}>
                      <span className={classNames('o-copy__12reg', redColor)}>WishList Name is Required</span>
                    </div>
                    <Button auid="submit_btn" type="submit" className={classNames('mt-2', 'w-100', btnMinHeight)} onClick={this.handleSubmit}>
                      {cms.createLabel}
                    </Button>
                  </div>
                </form>
              </PopoverStateless.Modal>
            </div>
          </PopoverStateless.Wrapper>
        </div>
      </div>
    );
  }
}

PopOverWishList.propTypes = {
  cms: PropTypes.object.isRequired,
  popoverType: PropTypes.string.isRequired,
  fnCreateWishList: PropTypes.func,
  fnRenameWishList: PropTypes.func,
  wishlistId: PropTypes.string,
  profileID: PropTypes.string
};

if (ExecutionEnvironment.canUseDOM) {
  [...document.querySelectorAll(`[data-component="${NODE_TO_MOUNT}"]`)].forEach(el => {
    ReactDOM.hydrate(<PopOverWishList {...window.ASOData[el.getAttribute(`${DATA_COMP_ID}`)]} />, el);
  });
}

export default PopOverWishList;
