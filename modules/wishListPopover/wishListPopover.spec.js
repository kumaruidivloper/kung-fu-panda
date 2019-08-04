import React from 'react';
import { expect } from 'chai';
import { shallow, mount } from 'enzyme';
import axios from 'axios';
import sinon from 'sinon';
import PopoverStateless from '@academysports/fusion-components/dist/PopoverStateless';
// import Button from '@academysports/fusion-components/dist/Button';

import Storage from '../../utils/StorageManager';
import wishListPopoverJson from './wishListPopover.component.json';
import * as util from './testUtil';

import WishListPopover from './wishListPopover.component';
import Popover from './lib/Popover';
// import WishListAdd from './lib/WishListForm/lib/WishListAdd';
import WishListChoose from './lib/WishListForm/lib/WishListChoose';
// import WishListSuccess from './lib/WishListSuccess';

import * as emoPopover from './lib/Popover/popover.emotion';
import * as emoPopoverModal from './lib/PopoverModal/popoverModal.emotion';
// import * as emoWishListAdd from './lib/WishListForm/lib/WishListAdd/wishListAdd.emotion';

import resultsForFetchWishListsJson from './fauxAPI/get.response.json';
// import resultsForPostWishListsJson from './fauxAPI/post.response.json';

const testProductId = '3794314';
const store = util.createMockStore({ gtmDataLayer: [] });
util.modifyStorageAPI();
Storage.setLoggedIn(false);

const initialProps = {
  cms: wishListPopoverJson.context.data.cms,
  productItem: util.getProductItem(testProductId),
  store
};

describe('<WishListPopover />', () => {
  // TEST LOGGED OUT
  const loggedOutWrapper = shallow(<WishListPopover {...initialProps} />).dive();

  it('renders <WishListPopover /> wrapper - when not logged in', () => {
    expect(loggedOutWrapper.name()).to.equal('div');
    expect(loggedOutWrapper.find(Popover).find('div')).to.have.length(2);
  });

  it('renders WishListPopover icon - when not logged in', () => {
    expect(loggedOutWrapper
        .find(Popover)
        .children()
        .at(0)
        .name()).to.equal('div');
  });

  // TEST LOGGED IN
  Storage.setLoggedIn(true);
  const loggedInWrapper = shallow(<WishListPopover {...initialProps} />).dive();

  it('renders <WishListPopover /> wrapper - when logged in', () => {
    expect(loggedInWrapper.name()).to.equal('div');
  });

  it('<WishListPopover /> opens/closes Popover on click', () => {
    const mountedWrapper = mount(<WishListPopover {...initialProps} />);

    // open on click
    mountedWrapper.find(emoPopover.ContentWrapper).simulate('click');
    expect(mountedWrapper.find(PopoverStateless.Modal).children().length).to.be.greaterThan(0);

    // close on click
    expect(mountedWrapper.find(emoPopoverModal.Close)).to.have.length(1);
    mountedWrapper.find(emoPopoverModal.Close).simulate('click');
    expect(mountedWrapper.find(PopoverStateless.Modal).children().length).to.be.equal(0);
  });

  // TEST AXIOS
  let sandbox;
  beforeEach(() => {
    sandbox = sinon.createSandbox();
  });
  afterEach(() => sandbox.restore());
  it('<WishListPopover /> - fetchWishLists - recieves empty wish list array and does not render <WishListChoose /> on open.', () => {
    const resolved = new Promise(r => r({ data: { queryWishlist: { GiftList: [] } } }));
    sandbox.stub(axios, 'get').returns(resolved);

    const mountedWrapper = mount(<WishListPopover {...initialProps} />);
    mountedWrapper.find(emoPopover.ContentWrapper).simulate('click');
    expect(mountedWrapper.find(WishListChoose)).to.have.length(0);
    mountedWrapper.find(emoPopover.ContentWrapper).simulate('click');
  });

  it('<WishListPopover /> - fetchWishLists -  recieves wish list array of length 3 and renders <WishListChoose /> on open.', () => {
    const resolved = new Promise(r => r({ data: resultsForFetchWishListsJson }));
    sandbox.stub(axios, 'get').returns(resolved);

    const mountedWrapper = mount(<WishListPopover {...initialProps} />);
    setTimeout(() => {
      mountedWrapper.find(emoPopover.ContentWrapper).simulate('click');
      expect(mountedWrapper.find(WishListChoose)).to.have.length(1);
      // util.consoleLogDebug(mountedWrapper);
      mountedWrapper.find(emoPopover.ContentWrapper).simulate('click');
    }, 1);
  });

  // it('<WishListPopover /> - postWishList ', () => {
  //   const resolvedGet = new Promise(r => r({ data: resultsForFetchWishListsJson }));
  //   sandbox.stub(axios, 'get').returns(resolvedGet);
  //   const resolvedPost = new Promise(r => r({ data: resultsForPostWishListsJson }));
  //   sandbox.stub(axios, 'post').returns(resolvedPost);

  //   const mountedWrapper = mount(<WishListPopover {...initialProps} />);
  //   expect(mountedWrapper.find(WishListAdd)).to.have.length(1);
  // expect(mountedWrapper.find(emoWishListAdd.Input)).to.have.length(1);
  // mountedWrapper.find(emoWishListAdd.Input).get(0).value = 'some new name';

  // setTimeout(() => {
  //   mountedWrapper.find(emoPopover.ContentWrapper).simulate('click');
  //   expect(mountedWrapper.find(WishListSuccess)).to.have.length(1);
  // }, 1);
  // });
});
