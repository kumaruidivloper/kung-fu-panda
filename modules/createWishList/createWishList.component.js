import ExecutionEnvironment from 'fbjs/lib/ExecutionEnvironment';
import PropTypes from 'prop-types';
import React from 'react';
import styled from 'react-emotion';
import ReactDOM from 'react-dom';
import classNames from 'classnames';
import Button from '@academysports/fusion-components/dist/Button';
import InputField from '@academysports/fusion-components/dist/InputField';
import PopoverStateless from '@academysports/fusion-components/dist/PopoverStateless';
import { NODE_TO_MOUNT, DATA_COMP_ID } from './constants';
import {
  fullWidth,
  popoverWidth,
  popoverModal,
  iconStyle,
  iconStyleSpan,
  redColor,
  popoverModalWidth,
  centeredContent,
  card,
  WishButton,
  marginFix,
  errorWrapper
} from './createWishList.styles';
import { scrollIntoView } from '../../utils/scroll';

class CreateWishList extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isPopOverOpen: false,
      wishListName: '',
      valid: true
    };
    this.onChangeInput = this.onChangeInput.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.createNewWishList = this.createNewWishList.bind(this);
  }

  onChangeInput(e) {
    this.setState({ wishListName: e.target.value });
    this.setState({ valid: true });
  }
  /**
   * Scroll the element to the view
   */
  scrollIntoView(id) {
    if (ExecutionEnvironment.canUseDOM) {
      const el = document.getElementById(id);
      if (el) {
        scrollIntoView(el);
      }
    }
  }
  /**
   * @param  {} e
   * Method to add items to wish list
   */
  handleSubmit(e) {
    e.preventDefault();
    if (this.state.wishListName.length < 1) {
      this.setState({ valid: false });
    } else if (this.state.wishListName.length && this.state.wishListName.length <= 50) {
      this.setState({ isPopOverOpen: false });
      this.props.fnCreateWishList(this.state.wishListName, this.props.profileID);
    }
    this.setState(
      {
        isPopOverOpen: !this.state.isPopOverOpen
      },
      () => {
        if (ExecutionEnvironment.canUseDOM) {
          window.scrollTo(0, 0);
        }
      }
    );
  }
  /**
+   * Method to create a new wish list
+   */
  createNewWishList() {
    this.setState(
      {
        isPopOverOpen: !this.state.isPopOverOpen
      },
      () => {
        this.scrollIntoView('wishlist-modal-pop');
      }
    );
  }
  /**
   * render API side error messsages
   */
  renderError() {
    const { errorMsg, userCreateWishListError, userCreateWishListErrorKey, cms } = this.props;
    const errorMessage = userCreateWishListErrorKey;
    return userCreateWishListError ? (
      <div>
        <section className={`${errorWrapper} d-flex flex-column p-1 mb-2`}>
          <p className="o-copy__14reg mb-0">{errorMsg[errorMessage] || cms.errorMsg[errorMessage]}</p>
        </section>
      </div>
    ) : null;
  }
  render() {
    const { cms } = this.props;
    const { errorMsg } = cms;
    const WishlistButton = styled(Button)`
      ${WishButton};
    `;
    return (
      <div data-auid="create_wish_list_page" className="container-fluid">
        <div className={classNames('row')}>
          <div className={classNames('col-12 p-md-3')}>
            {this.renderError()}
            <h5 className={classNames('pb-2 pb-md-3 m-0')}>{cms.wishlistLabel}</h5>
            <div className={card}>
              <div className={classNames('col-10 offset-1 col-md-7 offset-md-2 pt-3 pt-md-6 px-0')}>
                <div className={classNames('d-inline mt-2', centeredContent)}>
                  <span className={`o-copy__14reg ${marginFix}`} dangerouslySetInnerHTML={{ __html: cms.wishlistNotCreatedMessage }} />
                </div>
              </div>
              <div className={classNames('col-12 col-md-7 offset-md-2', 'mb-3 mb-md-6', popoverWidth, popoverModal)}>
                <PopoverStateless.Wrapper>
                  <WishlistButton auid="modal_open_btn" className={classNames(fullWidth)} size="S" onClick={this.createNewWishList}>
                    {cms.createFirstWishlistLabel}
                  </WishlistButton>
                  <PopoverStateless.Modal direction="bottom" open={this.state.isPopOverOpen} lineHeightFix={1.5}>
                    <button
                      data-auid="modal_Close_btn"
                      tabIndex={0}
                      id="wishlist-modal-pop"
                      aria-label="close"
                      className={classNames('pt-half', iconStyle)}
                      onClick={() => this.setState({ isPopOverOpen: !this.state.isPopOverOpen })}
                    >
                      <span className={classNames(iconStyleSpan, 'academyicon icon-close', 'd-flex', 'justify-content-end')} />
                    </button>
                    <form>
                      <div className={classNames(popoverModalWidth)}>
                        <label htmlFor="wishlist-createWishlist">
                          <span className="o-copy__14bold">{cms.createNewWishlistLabel}</span>
                        </label>
                        <InputField
                          data-auid="wish_list_name_input"
                          id="wishlist-createWishlist"
                          borderradius="0.25rem"
                          borderwidth="0.0625rem"
                          classname="w-100"
                          onChange={e => this.onChangeInput(e)}
                        />
                        <div className={this.state.valid ? 'd-none' : 'd-block'}>
                          <span className={classNames('o-copy__12reg', redColor)}>{errorMsg.enterNameForWishlist}</span>
                        </div>
                        <Button
                          auid="create_wish_list_btn"
                          size="S"
                          type="submit"
                          className={classNames('mt-2', 'w-100')}
                          onClick={this.handleSubmit}
                        >
                          {cms.createLabel}
                        </Button>
                      </div>
                    </form>
                  </PopoverStateless.Modal>
                </PopoverStateless.Wrapper>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

CreateWishList.propTypes = {
  cms: PropTypes.object.isRequired,
  fnCreateWishList: PropTypes.func,
  profileID: PropTypes.func,
  userCreateWishListErrorKey: PropTypes.string,
  userCreateWishListError: PropTypes.bool,
  errorMsg: PropTypes.object
};

if (ExecutionEnvironment.canUseDOM) {
  [...document.querySelectorAll(`[data-component="${NODE_TO_MOUNT}"]`)].forEach(el => {
    ReactDOM.hydrate(<CreateWishList {...window.ASOData[el.getAttribute(`${DATA_COMP_ID}`)]} />, el);
  });
}

export default CreateWishList;
