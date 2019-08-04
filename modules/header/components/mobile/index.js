import ExecutionEnvironment from 'fbjs/lib/ExecutionEnvironment';
import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import Modal from 'react-modal';
import Accordion from '../../accordion';
import { getTitleAndSEOURL, updateAnalytics } from '../../helpers';
import ListItem from '../../listItem';
import { ModalStyles, normalizeStyles } from '../../header.styles';
import { WeeklyAds, FindAStore, AccountInfo } from '../../common';
import { scrollIntoView } from '../../../../utils/scroll';
class MobileMenu extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      idx: 0
    };
    this.mobileMenuContainerRef = React.createRef();
    this.toggleAccordion = this.toggleAccordion.bind(this);
    this.setAnalytics = this.setAnalytics.bind(this);
  }
  componentWillMount() {
    this.props.fnGetMobileMenuItems({});
    this.setState({ idx: 0 });
    if (ExecutionEnvironment.canUseDOM && this.props.isMobile) {
      window.addEventListener('resize', this.props.fnToggleHamburger);
    }
  }
  componentWillUnmount() {
    if (ExecutionEnvironment.canUseDOM && this.props.isMobile) {
      window.removeEventListener('resize', this.props.fnToggleHamburger);
      this.props.fnSetSearchInputFocus({ searchShouldBeFocused: false });
    }
  }
  /* ****** Set the Analytics in the following order l0 -> l1 -> l2 -> l3 ***** */
  setAnalytics(e, value, selectedItem, url) {
    const { gtmDataLayer, breadList } = this.props;
    let analyticsLbl;
    let label;
    const analyticsURL = url ? getTitleAndSEOURL(selectedItem) : null;
    const level1LabelURL = value.level1 && getTitleAndSEOURL(value.level1);
    const level2LabelURL = value.level2 && getTitleAndSEOURL(value.level2);
    let level3LabelURL = value.level3 && getTitleAndSEOURL(value.level3);
    analyticsLbl = `tn_${level1LabelURL.label}_${level2LabelURL.label}`;
    label = `${level2LabelURL.label} || ${level1LabelURL.label}`;
    if (level3LabelURL || selectedItem) {
      if (selectedItem) {
        level3LabelURL = getTitleAndSEOURL(selectedItem);
      }
      analyticsLbl = `${analyticsLbl}_${level3LabelURL.label}`;
      label = `${level3LabelURL.label}`;
    }
    updateAnalytics(
      e,
      gtmDataLayer,
      'globalNavigationLinks',
      'navigation',
      `${analyticsLbl}`,
      breadList,
      `${analyticsURL && analyticsURL.seoURL}`,
      `${label}`,
      'top navigation'
    );
  }
  /* ***** Menu back navigation Links ***** */
  backToLinks(e, label, url, identifier, resetStore) {
    const { gtmDataLayer, breadList, fnGetMobileMenuItems, fnToggleHamburger } = this.props;
    if (resetStore) {
      fnGetMobileMenuItems(resetStore);
    } else {
      fnToggleHamburger();
    }
    updateAnalytics(e, gtmDataLayer, 'globalNavigationLinks', 'navigation', `${label}`, breadList, `${url}`, `${label}`, 'top navigation');
  }
  /* ***** Toggle Hamburger Menu ***** */
  toggleAccordion(idx) {
    this.setState({ idx: idx !== this.state.idx ? idx : null });
    if (this.mobileMenuContainerRef.current) {
      const container = this.mobileMenuContainerRef.current;
      const element = container.firstChild;
      scrollIntoView(element, { quickMode: true, easing: 'easeOutExpo', offset: 0 }, container);
    }
  }
  /* ***** Navigate to child categories if present **** */
  handleClick(e, filteredListItem, selectedItem, url) {
    if (!ExecutionEnvironment.canUseDOM) return;
    const { list, mobileMenu, fnToggleHamburger } = this.props;
    const { idx } = this.state;
    const setIdx = { level1: list[idx], level2: mobileMenu.level2 || selectedItem, level3: selectedItem.level4Items ? selectedItem : null };
    if (!filteredListItem.hasChildren && !selectedItem.cDeals && !selectedItem.dDeals && !selectedItem.level4Items) {
      this.setAnalytics(e, setIdx, selectedItem, url);
      fnToggleHamburger();
      return;
    }
    this.setAnalytics(e, setIdx);
    this.props.fnGetMobileMenuItems(setIdx);
  }
  /* **** Check Items Length **** */
  checkItemsLength(item) {
    if (item && item.length > 0) {
      return true;
    }
    return false;
  }
  /* ***** Check Child Level Presence ***** */
  checkChildLevelCategoryPresence(item = {}) {
    const { subMenuItems, features, cDeals, dDeals, featuredBrands, brandsList } = item;
    if (this.checkItemsLength(subMenuItems || features || cDeals || dDeals)) {
      return true;
    } else if (featuredBrands || brandsList) {
      const list = [...featuredBrands, ...brandsList];
      return list;
    }
    return false;
  }
  /* ***** Render Level 1 and level 2 categories ***** */
  renderL1Categories(list) {
    return list.map((item, idx) => (
      <Accordion key={idx.toString()} title={item.sectionLabel} isOpen={this.state.idx === idx} toggleAccordion={() => this.toggleAccordion(idx)}>
        {this.state.idx === idx && this.renderL2Categories(item)}
      </Accordion>
    ));
  }
  /* ***** Render Level2 Categories ***** */
  renderL2Categories(selectedItem) {
    let items;
    const filteredListItem = {
      depthLevel: 2,
      className: ''
    };
    if (selectedItem.menuItems && selectedItem.menuItems.length > 0) {
      items = selectedItem.menuItems.map((item, idx) => {
        const newItem = item;
        filteredListItem.hasChildren = this.checkChildLevelCategoryPresence(item);
        return this.renderListItems(filteredListItem, newItem, idx);
      });
    } else if (selectedItem.dealsList && selectedItem.dealsList.length > 0) {
      items = selectedItem.dealsList.map((item, idx) => {
        const newItem = item;
        filteredListItem.hasChildren = this.checkChildLevelCategoryPresence(item);
        return this.renderListItems(filteredListItem, newItem, idx);
      });
    }
    return <ul className="d-inline-block w-100">{items}</ul>;
  }
  /* ***** Render Level 3 Categories ***** */
  renderL3Categories(selectedItem = {}) {
    const { subMenuItems, features, cDeals, dDeals, featuredBrands, brandsList } = selectedItem;
    let categories = subMenuItems || features || cDeals || dDeals;
    if (featuredBrands || brandsList) {
      categories = [...featuredBrands, ...brandsList];
    }
    if (categories && categories.length > 0) {
      const { isHamburgerActive, fnToggleHamburger, mobileMenu } = this.props;
      const title1 = getTitleAndSEOURL(this.props.list[this.state.idx]);
      const title2 = getTitleAndSEOURL(mobileMenu.level2);
      return (
        <Modal
          ariaHideApp={false}
          className={`${ModalStyles.container} ${normalizeStyles}`}
          onRequestClose={() => fnToggleHamburger()}
          overlayClassName={`${ModalStyles.transparentBackdrop}`}
          isOpen={isHamburgerActive}
          htmlOpenClassName="ReactModal__Html--open"
          shouldFocusAfterRender
          shouldCloseOnOverlayClick
          shouldCloseOnEsc
          shouldReturnFocusAfterClose
        >
          <ul className="d-inline-block w-100">
            {
              <Fragment>
                <li className="o-copy__14reg box-shadow-inset">
                  <button
                    data-auid={`back-to-${title1.label}_m`}
                    aria-label={`back to ${title1.label}`}
                    onClick={e => this.backToLinks(e, `tn_${title1.label}_back`, null, title1.seoURL, {})}
                    className="mh-62 text-left padding-18 w-100"
                  >
                    <span className="academyicon icon-chevron-left pr-1 c-0055a6" />
                    {title1.label}
                  </button>
                </li>
                <li data-auid={`go-to-${title2.label}_m`} className="box-shadow-inset">
                  <a
                    onClick={e => this.backToLinks(e, `tn_${title1.label}_${title2.label}`, title2.seoURL, title2.seoURL)}
                    aria-label={`navigate to ${title2.label}`}
                    className="o-copy__16bold mh-62 d-flex align-items-center justify-content-space-between padding-18"
                    href={title2.seoURL}
                  >
                    {title2.label}
                  </a>
                </li>
              </Fragment>
            }
            {categories.map((item, idx) => (
              <Fragment key={idx.toString()}>
                {this.renderListItems({ depthLevel: 3, listclass: 'm-0', hasChildren: item.level4Items }, item, idx, item.level4Items)}
              </Fragment>
            ))}
          </ul>
        </Modal>
      );
    }
    return null;
  }
  /* ***** Render Level 4 Categories ***** */
  renderL4Categories(selectedItem) {
    const filteredListItem = {
      depthLevel: 4,
      listclass: 'm-0'
    };
    const { isHamburgerActive, fnToggleHamburger, mobileMenu, list } = this.props;
    const { idx } = this.state;
    const title1 = getTitleAndSEOURL(mobileMenu.level2);
    const title2 = getTitleAndSEOURL(mobileMenu.level3);
    return (
      <Modal
        ariaHideApp={false}
        className={`${ModalStyles.container} ${normalizeStyles}`}
        onRequestClose={() => fnToggleHamburger()}
        overlayClassName={`${ModalStyles.transparentBackdrop}`}
        isOpen={isHamburgerActive}
        htmlOpenClassName="ReactModal__Html--open"
        shouldFocusAfterRender
        shouldCloseOnOverlayClick
        shouldCloseOnEsc
        shouldReturnFocusAfterClose
      >
        <ul className="d-inline-block w-100">
          {
            <Fragment>
              <li className="o-copy__14reg box-shadow-inset">
                <button
                  className="mh-62 text-left padding-18 w-100"
                  data-auid={`back-to-${title1.label}_m`}
                  aria-label={`back to ${title1.label}`}
                  onClick={e =>
                    this.backToLinks(e, `tn_${title1.label}_back`, null, title1.seoURL, {
                      level1: list[idx],
                      level2: mobileMenu.level2,
                      level3: null
                    })
                  }
                >
                  <span className="academyicon icon-chevron-left pr-1 c-0055a6" />
                  {title1.label}
                </button>
              </li>
              <li data-auid={`go-to-${title2.label}_m`} className="box-shadow-inset">
                <a
                  onClick={e => this.backToLinks(e, `tn_${title1.label}_${title2.label}`, title2.seoURL, title2.seoURL)}
                  aria-label={`navigate to ${title2.label}`}
                  className="o-copy__16bold mh-62 d-flex align-items-center justify-content-space-between padding-18"
                  href={title2.seoURL}
                >
                  {title2.label}
                </a>
              </li>
            </Fragment>
          }
          {selectedItem &&
            selectedItem.level4Items &&
            selectedItem.level4Items.subCategories &&
            selectedItem.level4Items.subCategories.length > 0 &&
            selectedItem.level4Items.subCategories.map((item, i) => (
              <Fragment key={i.toString()}>
                {item.displayStatus && item.displayStatus.toLowerCase() === 'show' && this.renderListItems(filteredListItem, item, idx)}
              </Fragment>
            ))}
        </ul>
      </Modal>
    );
  }
  /* ******* Render Sub Categories for shop level 2 ******* */
  renderSubCategories(itemsList) {
    const items = itemsList.map((item, idx) => {
      const obj = getTitleAndSEOURL(item);
      return (
        <li className="col-3 pb-1" key={idx.toString()} data-auid={`level3Category-${obj.label}_m`}>
          <a href={obj.seoURL || '#'} aria-label={obj.label} className="o-copy__14bold d-inline-block">
            {obj.label}
          </a>
        </li>
      );
    });
    return <ul className="row no-gutter">{items}</ul>;
  }
  /* ******* Render List Categories ******* */
  renderListItems(filteredListItem, item, idx, hasLevel4Items) {
    const obj = getTitleAndSEOURL(item);
    if (obj.label) {
      return (
        <ListItem
          auid={`level${filteredListItem.depthLevel}Category-${obj.label}_m`}
          click={e => this.handleClick(e, filteredListItem, item, obj.seoURL)}
          href={obj.seoURL || '#'}
          arialabel={obj.label}
          cname={`mh-62 d-flex align-items-center justify-content-between w-100 py-half padding-18 o-copy__16reg ${filteredListItem.className || ''}`}
          listclass={`d-flex align-items-center justify-content-space-between margin-18 box-shadow-inset ${filteredListItem.listclass || ''}`}
          key={idx.toString()}
          childHasAnchor={hasLevel4Items}
        >
          {obj.label}
          {filteredListItem.hasChildren && <span className="academyicon icon-chevron-right" />}
        </ListItem>
      );
    }
    return null;
  }
  render() {
    const { list, mobileMenu, cms, myStoreDetails, fnToggleFindAStore, fnToggleHamburger, gtmDataLayer, toggleLoader } = this.props;
    return (
      <div ref={this.mobileMenuContainerRef} className={ModalStyles.scrollable}>
        {this.renderL1Categories(list)}
        <div data-auid="weeklyAds_m" className="font-16 box-shadow-inset">
          <WeeklyAds
            cssClass="mh-62 d-flex align-items-center padding-18"
            gtmDataLayer={gtmDataLayer}
            label={cms.weeklyAdsLabel}
            url={cms.weeklyAdsLink}
          />
        </div>
        <div className="font-16 box-shadow-inset">
          <AccountInfo
            cssClass="mh-62 d-flex align-items-center padding-18 flex-wrap"
            gtmDataLayer={gtmDataLayer}
            fnToggleHamburger={fnToggleHamburger}
            isMobile
            label={cms.myAccountLabel}
            url={cms.signInLink}
            myAccDropDown={cms.myAccDropDown}
            containerRef={this.mobileMenuContainerRef}
            toggleLoader={toggleLoader}
          />
        </div>
        <div data-auid="findAStore_m" className="font-16 box-shadow-inset">
          <div className="d-flex flex-wrap">
            <FindAStore
              isMobile
              label={cms.findStoreLabel}
              url="#"
              myStoreDetails={myStoreDetails}
              fnToggleHamburger={fnToggleHamburger}
              fnToggleFindAStore={fnToggleFindAStore}
              gtmDataLayer={gtmDataLayer}
              cssClass="mh-62 d-flex align-items-center padding-18 flex-wrap w-100"
            />
          </div>
        </div>
        {mobileMenu && mobileMenu.level2 && this.renderL3Categories(mobileMenu.level2)}
        {mobileMenu && mobileMenu.level3 && this.renderL4Categories(mobileMenu.level3)}
      </div>
    );
  }
}

MobileMenu.propTypes = {
  cms: PropTypes.object,
  list: PropTypes.array,
  fnGetMobileMenuItems: PropTypes.func,
  mobileMenu: PropTypes.object,
  isHamburgerActive: PropTypes.bool,
  fnToggleHamburger: PropTypes.func,
  myStoreDetails: PropTypes.object,
  fnToggleFindAStore: PropTypes.func,
  isMobile: PropTypes.bool,
  fnSetSearchInputFocus: PropTypes.func,
  gtmDataLayer: PropTypes.array,
  breadList: PropTypes.string,
  toggleLoader: PropTypes.func
};

export default MobileMenu;
