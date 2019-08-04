import React from 'react';
import PropTypes from 'prop-types';
import { cx } from 'react-emotion';
import Button from '@academysports/fusion-components/dist/Button';
import Responsive from 'react-responsive';
import * as emo from './wishListAdd.emotion';

class WishListAdd extends React.PureComponent {
  constructor(props) {
    super(props);
    this.desktopInputRef = React.createRef();
  }

  componentDidMount() {
    const { wishLists } = this.props;
    if (this.desktopInputRef.current && wishLists.length < 1) {
      this.desktopInputRef.current.focus();
    }
  }

  render() {
    const { onClickCreate, onInputChange, inputValue, inputError } = this.props;
    const onClickMobileCreate = () => onClickCreate(true);
    const inputCss = emo.input(this.props);
    return (
      <emo.Wrapper>
        <Responsive minWidth={768}>
          <table>
            <tbody>
              <tr>
                <td colSpan={2}>
                  <emo.Title className="o-copy__14bold mb-half" htmlFor="New_Wish_List_Name">
                    Create a New Wish List
                  </emo.Title>
                </td>
              </tr>
              <tr>
                <td>
                  <input
                    className={cx(inputCss, 'o-copy__14reg')}
                    value={inputValue || ''}
                    onChange={onInputChange}
                    ref={this.desktopInputRef}
                    id="New_Wish_List_Name"
                    data-auid="input_newWishListName"
                  />
                </td>
                <td>
                  <Button auid="wishListPopover_createList" className={emo.button} onClick={onClickCreate} aria-label="Create Wish List">
                    Create
                  </Button>
                </td>
              </tr>
              <tr>
                <td>{!!inputError && <emo.Error className="o-copy__12reg" role="alert">{inputError}</emo.Error>}</td>
              </tr>
            </tbody>
          </table>
        </Responsive>
        <Responsive maxWidth={767}>
          <emo.Title className="o-copy__14bold mb-half" htmlFor="New_Wish_List_Name">
            Create a New Wish List
          </emo.Title>
          <input
            className={cx(inputCss, 'o-copy__14reg')}
            value={inputValue || ''}
            onChange={onInputChange}
            id="New_Wish_List_Name"
            data-auid="input_newWishListName"
          />
          {!!inputError && <emo.Error className="o-copy__12reg">{inputError}</emo.Error>}
          <Button auid="wishListPopover_createList_m" className={cx(emo.button, 'mt-1')} onClick={onClickMobileCreate} aria-label="Create Wish List">
            Create
          </Button>
        </Responsive>
      </emo.Wrapper>
    );
  }
}

WishListAdd.propTypes = {
  onClickCreate: PropTypes.func,
  onInputChange: PropTypes.func,
  inputError: PropTypes.string,
  inputValue: PropTypes.string,
  wishLists: PropTypes.array
};

export default WishListAdd;
