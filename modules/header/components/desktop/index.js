import ExecutionEnvironment from 'fbjs/lib/ExecutionEnvironment';
import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import PriceDetails from '@academysports/fusion-components/dist/PriceDetails';
import { getTitleAndSEOURL, ellipsesText, updateAnalytics } from '../../helpers';
import ListItem from '../../listItem';
import SeeAllLink from './seeAllLink';
let onTouch = false;
/* ******* Display Mega Menu ******* */
class MegaMenu extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      idx: null,
      level1Idx: 0
    };
    this.handleMegaMenuClose = this.handleMegaMenuClose.bind(this);
    this.setHeight = this.setHeight.bind(this);
    this.handleL1KeyboardEvt = this.handleL1KeyboardEvt.bind(this);
    this.handleSubElemKeyboardEvt = this.handleSubElemKeyboardEvt.bind(this);
  }
  componentDidMount() {
    if (!ExecutionEnvironment.canUseDOM) return;
    document.addEventListener('click', this.handleMegaMenuClose);
    this.setHeight();
  }
  componentDidUpdate() {
    if (!ExecutionEnvironment.canUseDOM) return;
    this.setHeight();
  }
  componentWillUnmount() {
    if (!ExecutionEnvironment.canUseDOM) return;
    document.removeEventListener('click', this.handleMegaMenuClose);
  }
  /* ***** Set Height of the container ***** */
  setHeight() {
    const megaLayoutContainer = document.querySelectorAll('.mega-menu-flyout');
    if (megaLayoutContainer.length > 0) {
      megaLayoutContainer.forEach(container => {
        const newContainer = container;
        const rightContainer = newContainer.querySelector('.column-right-absolute');
        if (newContainer && rightContainer) {
          newContainer.style.height = 'auto';
          rightContainer.style.height = 'auto';
          if (rightContainer.offsetHeight + 40 >= newContainer.offsetHeight) {
            newContainer.style.height = `${rightContainer.offsetHeight + 40}px`;
          }
        }
      });
    }
  }
  /**
   * @author Mohammed Salman
   * @constructor handleSubElemKeyboardEvt();
   * @param  {object} parentElement -- get the selected item parentElement
   * @param  {object} isL1Category -- gives the L1 category object and apply up and down keyboard events only on L1
   * @description Focus the prev L1 Categories based on keycode if user presses up and down arrows
   * @returns -- take the focus to the previous L1 Cateogory
   */
  setFocusOnPreviousElem = (parentElement = {}, isL1Category = false) => {
    const { previousElementSibling = {} } = parentElement;
    if (previousElementSibling && isL1Category) {
      previousElementSibling.firstChild.focus();
      this.setState({ level1Idx: parseInt(previousElementSibling.getAttribute('idx'), 10) });
    }
  };
  /**
   * @author Mohammed Salman
   *  @constructor handleSubElemKeyboardEvt();
   * @param  {object} parentElement -- get the selected item parentElement
   * @param  {object} isL1Category -- gives the L1 category object and apply up and down keyboard events only on L1
   * @description Focus the next L1 Categories based on keycode if user presses up and down arrows
   * @returns -- take the focus to the next L1 Cateogory
   */
  setFocusOnNextElem = (parentElement = {}, isL1Category = false) => {
    const { nextElementSibling = {} } = parentElement;
    if (nextElementSibling && isL1Category) {
      nextElementSibling.firstChild.focus();
      this.setState({ level1Idx: parseInt(nextElementSibling.getAttribute('idx'), 10) });
    }
  };

  getOrderedList = brandsList => {
    const orderedItems = brandsList.slice(0, 24).sort((a, b) => a.brandName - b.brandName);
    const orderedLength = orderedItems.length;
    const division = Math.floor(orderedLength / 4);
    const reminder = orderedLength % 4;
    const noOfRows = division + reminder;
    const groupedList = [];

    for (let j = 0, counter = 1; j < orderedLength; j += division, counter += 1) {
      const toLength = counter <= reminder ? j + division + reminder : j + division;
      const slicedArray = orderedItems.slice(j, toLength);
      j = counter <= reminder ? j + reminder : j;
      groupedList.push(slicedArray);
    }

    const shuffledArray = [];
    for (let k = 0; k < noOfRows; k += 1) {
      for (let i = 0; i < groupedList.length; i += 1) {
        const groupObject = groupedList[i][k];
        if (groupObject) {
          shuffledArray.push(groupObject);
        }
      }
    }
    return shuffledArray;
  };

  /**
   * @author Mohammed Salman
   * @param  {object} e selected item event
   * @param  {number} index of selected item
   * @param  case 27 handles esc keyboard key.
   * @description if the focus is on L0 Category links, close the opened mega menu flyout on esc.
   * @returns close the mega menu flyout on esc keypress.
   */
  handleL1KeyboardEvt = (e, selIdx) => {
    const { idx } = this.state;
    switch (e.keyCode || e.which) {
      case 27:
        if (idx === selIdx) {
          this.handleMegaMenuShow(e, selIdx);
        }
        break;
      default:
        return true;
    }
    return true;
  };
  /**
   * @author Mohammed Salman
   * @param  {object} e -- event
   * event.prevenDefault() stops the screen scrolling up and down on keypress
   * event.stopPropagation() stops the child event interacting with parent event.
   * @param  {object} isL1Category -- L1 Category Object
   * @description case 27 -- esc, 38 -- up arrow, 40 -- down arrow.
   * Focus the next or prev L1 Categories based on keycode if user presses up and down arrows
   * On esc key press -- see the below points
   * 1. focus the selected L1 category if user is on L2 and L3 categories.
   * 2. close the mega flyout and take back the focus to the selected L0 Category if user is on L1 Category.
   * @returns can close the mega flyout or focus will take to the L1 from L2 and L3.
   */
  handleSubElemKeyboardEvt = (e, isL1Category) => {
    const { parentElement = {} } = e.target;
    switch (e.keyCode || e.which) {
      case 27:
        e.preventDefault();
        e.stopPropagation();
        if (ExecutionEnvironment.canUseDOM) {
          if (isL1Category) {
            document.querySelector('li.level1-items a.active').focus();
            this.handleMegaMenuShow(e, this.state.idx);
          } else {
            document.querySelector('.column-left li a.active').focus();
          }
        }
        break;
      case 38:
        e.preventDefault();
        e.stopPropagation();
        this.setFocusOnPreviousElem(parentElement, isL1Category);
        break;
      case 40:
        e.preventDefault();
        e.stopPropagation();
        this.setFocusOnNextElem(parentElement, isL1Category);
        break;
      default:
        return true;
    }
    return true;
  };
  /* ******* Show Menu Menu Container ******* */
  handleMegaMenuShow = (e, selIdx, label) => {
    e.preventDefault();
    const { gtmDataLayer, breadList } = this.props;
    const { idx } = this.state;
    updateAnalytics(e, gtmDataLayer, 'globalNavigationLinks', 'navigation', `tn_${label}`, breadList, '#', `${label}`, 'top navigation');
    const nextState = idx !== selIdx ? selIdx : null;
    this.setState({ idx: nextState, level1Idx: 0 });
  };
  /* ******* Hide Menu Menu Container ******* */
  handleMegaMenuClose = e => {
    if (onTouch) {
      e.preventDefault();
    }
    const { idx } = this.state;
    const clickedIdx = e.target.getAttribute('data-idx');
    if (!clickedIdx || (!onTouch && idx >= 0 && Number.parseInt(clickedIdx, 10) !== idx)) {
      this.setState({
        idx: null,
        level1Idx: 0
      });
    }
  };
  /* ****** Mouse Enter Evt for L2 Categories ****** */
  handleFocus(e, selectedIdx, mouseEvt) {
    return !mouseEvt ? false : this.setState({ level1Idx: selectedIdx });
  }
  /* ***** Handle Mouse Evt ***** */
  handleMouseEvt = e => {
    e.target.focus();
  };
  /* ***** Don't update analytics object if it is touch event **** */
  touchVsClick(e, obj = {}) {
    e.preventDefault();
    const { label, seoURL } = obj;
    if (e.type && e.type !== 'click') {
      onTouch = true;
      this.L1Analytics(e, label, null);
    } else {
      onTouch = false;
      this.L1Analytics(e, label, seoURL);
    }
    e.target.focus();
  }
  L1Analytics(e, label, seoURL) {
    const { gtmDataLayer, breadList, list } = this.props;
    const { idx } = this.state;
    updateAnalytics(
      e,
      gtmDataLayer,
      'globalNavigationLinks',
      'navigation',
      `tn_${list[idx].sectionLabel}_${label}`,
      breadList,
      `${seoURL}`,
      `${label}`,
      'top navigation'
    );
  }
  /* ******* Render Plain List Categories ******* */
  renderPlainListItems(filteredListItem, item, itemIdx = 0, hasLevel4Items, selIdx) {
    // const { gtmDataLayer, breadList, list } = this.props;
    // const { idx } = this.state;
    const obj = getTitleAndSEOURL(item);
    if (obj.label) {
      const { depthLevel, className = '', col, listclass = '', mouseEvt } = filteredListItem;
      const { label, seoURL } = obj;
      const { level1Idx } = this.state;
      return (
        <ListItem
          idx={itemIdx}
          auid={`level${depthLevel}Category-${label}`}
          mouseEnter={e => this.handleMouseEvt(e)}
          href={obj.seoURL || '#'}
          arialabel={obj.label}
          cname={`d-inline-block pt-half ${className}`}
          listclass={`position-static ${col ? `${`col-${col}`}` : ''}  ${listclass}`}
          key={itemIdx.toString()}
          childHasAnchor={hasLevel4Items}
          focus={e => this.handleFocus(e, itemIdx, mouseEvt)}
          anchorLabel={obj.label}
          click={e => this.touchVsClick(e, obj)}
          touch={e => this.touchVsClick(e, obj)}
          keydown={e => this.handleSubElemKeyboardEvt(e, filteredListItem)}
        >
          {itemIdx === level1Idx && (
            <div className="column-right d-flex flex-column ml-auto">
              <div className="column-right-absolute">
                {!item.features && (
                  <div className="pb-half">
                    <a
                      onClick={e => this.L1Analytics(e, label, seoURL)}
                      href={seoURL}
                      aria-label={label}
                      className="o-copy__14bold active border-0 text-uppercase text-decoration"
                      onKeyDown={this.handleSubElemKeyboardEvt}
                    >
                      {label}
                    </a>
                  </div>
                )}
                <div>{this.renderL3Categories(item, selIdx)}</div>
              </div>
            </div>
          )}
        </ListItem>
      );
    }
    return null;
  }
  /* ******* Render Level1 Menu By Default ******* */
  renderL1Categories(list) {
    const menuList = list.map((item, selIdx) => {
      const obj = getTitleAndSEOURL(item);
      const { label, seoURL } = obj;
      const { idx } = this.state;
      return (
        <li className="position-static level1-items" data-auid={`level1Category-${label}`} data-idx={idx} key={label}>
          <a
            className={`o-copy__16reg ${idx === selIdx ? 'active border-bottom-blue pb-half text-decoration-none' : ''}`}
            onClick={e => this.handleMegaMenuShow(e, selIdx, label)}
            href={seoURL || '#'}
            aria-label={label}
            role="button"
            onKeyDown={e => this.handleL1KeyboardEvt(e, selIdx)}
            data-idx={selIdx}
          >
            {label}
          </a>
          <div aria-hidden={idx === selIdx ? 'false' : 'true'} className={`position-absolute mega-menu-flyout ${idx === selIdx ? '' : 'd-none'}`}>
            <div className="container-1052">
              <div className="flex-row d-flex">
                <div>{this.renderL2Categories(item, selIdx)}</div>
              </div>
            </div>
          </div>
        </li>
      );
    });
    return <Fragment>{menuList}</Fragment>;
  }
  /* ******* Render the Menu List Based on its response object type ******* */
  renderL2Categories(selectedItem = {}, selIdx) {
    let items;
    let filteredListItem = {
      depthLevel: 2,
      mouseEvt: 'mouseEnter'
    };
    const { menuItems = [], dealsList = [] } = selectedItem;
    const { level1Idx } = this.state;
    if (menuItems.length > 0) {
      items = menuItems.map((item, idx) => {
        filteredListItem = {
          ...filteredListItem,
          className: `${level1Idx === idx ? 'o-copy__16bold active' : 'o-copy__16reg'}`
        };
        return this.renderPlainListItems(filteredListItem, item, idx, null, selIdx);
      });
    } else if (dealsList.length > 0) {
      items = dealsList.map((item, idx) => {
        filteredListItem = {
          ...filteredListItem,
          className: `${level1Idx === idx ? 'o-copy__16bold active' : 'o-copy__16reg'}`
        };
        return this.renderPlainListItems(filteredListItem, item, idx, null, selIdx);
      });
    }
    return <ul className="position-relative column-left">{items}</ul>;
  }
  /* ******* Check the category Type Before Rendering ****** */
  renderL3Categories(item = {}, selIdx) {
    const { features, subMenuItems, featuredBrands, brandsList, cDeals, dDeals } = item;
    if (features || subMenuItems || featuredBrands || brandsList) {
      return this.renderItemsWithMenuObj(item, selIdx);
    } else if (cDeals || dDeals) {
      return this.renderBrandsBasedOnType(item, selIdx);
    }
    return null;
  }
  /* ***** Render Items with Menu Items Obj ***** */
  renderItemsWithMenuObj(item = {}, selIdx) {
    const { subMenuItems = [], features = [], featuredBrands, brandsList } = item;
    if (subMenuItems.length > 0) {
      return this.renderSubCategories(subMenuItems, selIdx);
    } else if (features.length > 0) {
      return this.renderTrendingCategories(features, selIdx);
    } else if (featuredBrands || brandsList) {
      return this.renderBrands(featuredBrands, brandsList, selIdx);
    }
    return null;
  }
  /* ****** Render Deals based on its type ***** */
  renderBrandsBasedOnType(item = {}, selIdx) {
    const { cDeals = [], dDeals = [] } = item;
    if (cDeals.length > 0) {
      return this.renderCategoryDeals(cDeals, selIdx);
    } else if (dDeals.length > 0) {
      return this.renderDailyDeals(dDeals, selIdx);
    }
    return null;
  }
  /* ******* Render Sub Categories for shop level 2 ******* */
  renderSubCategories(itemsList = [], selIdx) {
    const { list, gtmDataLayer, breadList } = this.props;
    const { level1Idx } = this.state;
    const analyticsLbl = `tn_${list[selIdx].sectionLabel}_${list[selIdx].menuItems[level1Idx].title}`;
    const items = itemsList.slice(0, 8).map((item, itemIdx) => {
      const obj = getTitleAndSEOURL(item);
      const { label, seoURL } = obj;
      return (
        <li className="col-3 pb-half" idx={itemIdx} key={itemIdx.toString()} data-auid={`level3Category-${label}`}>
          <a
            onClick={e =>
              updateAnalytics(
                e,
                gtmDataLayer,
                'globalNavigationLinks',
                'navigation',
                `${analyticsLbl}_${label}`,
                breadList,
                `${seoURL}`,
                `${label}`,
                'top navigation'
              )
            }
            onKeyDown={this.handleSubElemKeyboardEvt}
            href={seoURL || '#'}
            aria-label={label}
            className="pb-half o-copy__14bold d-inline-block"
          >
            {label}
          </a>
          {item.level4Items &&
            item.level4Items.subCategories &&
            item.level4Items.subCategories.length > 0 && (
              <ul className="row no-gutter">
                {item.level4Items.subCategories.slice(0, 8).map((subItem, subItemIdx) => (
                  <Fragment key={subItemIdx.toString()}>
                    {subItem.displayStatus &&
                      subItem.displayStatus.toLowerCase() === 'show' && (
                        <ListItem
                          auid={`level4Category-${subItem.displayName}`}
                          href={subItem.seoURL || '#'}
                          arialabel={subItem.displayName}
                          cname="pb-half d-inline-block o-copy__14reg font-weight-normal"
                          listclass="col-12"
                          keydown={this.handleSubElemKeyboardEvt}
                          click={e =>
                            updateAnalytics(
                              e,
                              gtmDataLayer,
                              'globalNavigationLinks',
                              'navigation',
                              `${analyticsLbl}_${label}_${subItem.displayName}`,
                              breadList,
                              `${subItem.seoURL}`,
                              `${subItem.displayName}`,
                              'top navigation'
                            )
                          }
                        >
                          {subItem.displayName}
                        </ListItem>
                      )}
                  </Fragment>
                ))}
              </ul>
            )}
        </li>
      );
    });
    return (
      <Fragment>
        <ul className="row no-gutter">{items}</ul>
        {itemsList.length > 8 && (
          <SeeAllLink
            gtmDataLayer={gtmDataLayer}
            breadList={breadList}
            label="See all"
            analyticsLbl={analyticsLbl}
            url={list[selIdx].menuItems[level1Idx].seoURL}
          />
        )}
      </Fragment>
    );
  }
  /* ******* Render Features/Trending Categories ******* */
  renderTrendingCategories(itemList, selIdx) {
    const { gtmDataLayer, list, breadList } = this.props;
    const { level1Idx } = this.state;
    const analyticsLbl = `tn_${list[selIdx].sectionLabel}_${list[selIdx].menuItems[level1Idx].menuLabel}`;
    return (
      <ul className="row no-gutter trending-container">
        {itemList.map((item, selectedIdx) => (
          <ListItem
            auid={`level3Category-${item.imageDescription1}`}
            href={item.ctaTarget || '#'}
            arialabel={item.imageDescription1}
            cname="py-half d-inline-block pr-half"
            listclass="col-3 mh-230"
            key={selectedIdx.toString()}
            keydown={this.handleSubElemKeyboardEvt}
            click={e =>
              updateAnalytics(
                e,
                gtmDataLayer,
                'globalNavigationLinks',
                'navigation',
                `${analyticsLbl}_${item.imageDescription2}`,
                breadList,
                `${item.ctaTarget}`,
                `${item.imageDescription2}`,
                'top navigation'
              )
            }
          >
            <figure>
              <img className="d-block explore-cat-img mb-1" src={item.image} alt={item.imageDescription1} />
              <figcaption className="d-block o-copy__12reg">{item.imageDescription1}</figcaption>
              <figcaption className="d-block o-copy__12reg pt-half">{item.imageDescription2}</figcaption>
            </figure>
          </ListItem>
        ))}
      </ul>
    );
  }
  /* ******* Render Types of Brands ******* */
  renderBrands(featuredBrands = [], brandsList = [], selIdx) {
    return (
      <Fragment>
        {featuredBrands.length > 0 && this.renderFeaturedBrands(featuredBrands, selIdx)}
        {brandsList.length > 0 && this.renderBrandsList(brandsList, selIdx)}
      </Fragment>
    );
  }
  /* ******* Render Features Brands ******* */
  renderFeaturedBrands(featuredBrands, selIdx) {
    const { gtmDataLayer, list, breadList } = this.props;
    const { level1Idx } = this.state;
    const analyticsLbl = `tn_${list[selIdx].sectionLabel}_${list[selIdx].menuItems[level1Idx].title}`;
    return (
      <ul className="row no-gutter featured-brands-container">
        {featuredBrands.map((item, subItemIdx) => (
          <ListItem
            auid={`level3Category-${subItemIdx}`}
            href={item.brandPageURL || '#'}
            arialabel={`brandIcon${subItemIdx}`}
            cname="py-half d-inline-block"
            listclass="col-3 mh-90"
            key={subItemIdx.toString()}
            keydown={this.handleSubElemKeyboardEvt}
            click={e =>
              updateAnalytics(
                e,
                gtmDataLayer,
                'globalNavigationLinks',
                'navigation',
                `${analyticsLbl}_${`brandImage${subItemIdx}`}`,
                breadList,
                `${item.brandPageURL}`,
                `${`brandImage${subItemIdx}`}`,
                'top navigation'
              )
            }
          >
            <figure>
              <img className="d-block brand-img" src={item.imagePath} alt={item.altText} />
            </figure>
          </ListItem>
        ))}
      </ul>
    );
  }
  /* ******* Render Brands List, re-creating brands object to create horizontal alphabetical order ******* */
  renderBrandsList(brandsList, selIdx) {
    const { list, gtmDataLayer, breadList } = this.props;
    const { level1Idx } = this.state;
    const analyticsLbl = `tn_${list[selIdx].sectionLabel}_${list[selIdx].menuItems[level1Idx].title}`;
    const orderedItems = this.getOrderedList(brandsList);
    const rows = orderedItems.map((row, rowIdx) => {
      const column = this.renderOrderedBrandsList(rowIdx, row, gtmDataLayer, breadList, analyticsLbl);
      return column;
    });
    return (
      <Fragment>
        <ul className="row no-gutters pt-2 border-top brands-list-container">{rows}</ul>
        {brandsList.length > 23 && (
          <SeeAllLink
            gtmDataLayer={gtmDataLayer}
            breadList={breadList}
            label="See all"
            analyticsLbl={analyticsLbl}
            url={list[selIdx].menuItems[level1Idx].brandLandingLink}
          />
        )}
      </Fragment>
    );
  }
  /* ******* Render Brands List Items ******* */
  renderOrderedBrandsList(idx, row, gtmDataLayer, breadList, analyticsLbl) {
    return (
      <Fragment key={idx.toString()}>
        {row && (
          <ListItem
            auid={`level3Category-${row.brandName}`}
            href={row.brandURL || '#'}
            arialabel={`${row.brandName}`}
            cname="py-half d-inline-block o-copy__14reg"
            listclass="col-3"
            key={row.brandName}
            keydown={this.handleSubElemKeyboardEvt}
            click={e =>
              updateAnalytics(
                e,
                gtmDataLayer,
                'globalNavigationLinks',
                'navigation',
                `${analyticsLbl}_${row.brandName}`,
                breadList,
                `${row.brandURL}`,
                `${row.brandName}`,
                'top navigation'
              )
            }
          >
            <span>{row.brandName}</span>
          </ListItem>
        )}
      </Fragment>
    );
  }
  /* ****** Render Category Deals ******* */
  renderCategoryDeals(selectedDeal, selIdx) {
    const { gtmDataLayer, list, breadList } = this.props;
    const { level1Idx } = this.state;
    const analyticsLbl = `tn_${list[selIdx].sectionLabel}_${list[selIdx].dealsList[level1Idx].name}`;
    return (
      <ul className="row no-gutter category-deals-container">
        {selectedDeal.slice(0, 6).map((item, subItemIdx) => (
          <ListItem
            auid={`level3Category-${item.name}`}
            href={item.seoURL || '#'}
            arialabel={`categoryDeals_${item.name}`}
            cname="py-half text-decoration-none d-flex box-shadow category-deals h-100 justify-content-around mr-1 text-center o-copy__16bold"
            listclass="col-4 mb-1 mh-230"
            key={subItemIdx.toString()}
            keydown={this.handleSubElemKeyboardEvt}
            click={e =>
              updateAnalytics(
                e,
                gtmDataLayer,
                'globalNavigationLinks',
                'navigation',
                `${analyticsLbl}_${item.name}`,
                breadList,
                `${item.seoURL}`,
                `${item.name}`,
                'top navigation'
              )
            }
          >
            <figure>
              <img className="d-block category-deals-img m-auto" src={item.thumbnail} alt={`${item.imageAltDescription}`} />
              <figcaption className="pt-1">{item.name}</figcaption>
            </figure>
          </ListItem>
        ))}
      </ul>
    );
  }
  /* ****** Render Category Deals ******* */
  renderDailyDeals(selectedDeal, selIdx) {
    const { gtmDataLayer, list, breadList } = this.props;
    const { level1Idx } = this.state;
    const analyticsLbl = `tn_${list[selIdx].sectionLabel}_${list[selIdx].dealsList[level1Idx].name}`;
    return (
      <ul className="row no-gutter daily-deals-container">
        {selectedDeal.slice(0, 6).map((item, subItemIdx) => (
          <ListItem
            auid={`level3Category-${item.name}`}
            href={item.seoURL || '#'}
            arialabel={`categoryDeals_${item.name}`}
            cname="py-half px-1 text-decoration-none d-flex flex-column daily-deals h-100 box-shadow justify-content-around mr-1 o-copy__16bold"
            listclass="col-4 mb-1 mh-180"
            key={subItemIdx.toString()}
            keydown={this.handleSubElemKeyboardEvt}
            click={e =>
              updateAnalytics(
                e,
                gtmDataLayer,
                'globalNavigationLinks',
                'navigation',
                `${analyticsLbl}_${item.name}`,
                breadList,
                `${item.seoURL}`,
                `${item.name}`,
                'top navigation'
              )
            }
          >
            <div className="pb-half d-flex flex-row o-copy__14reg align-items-center">
              <img src={item.imageURL} alt={item.imageAltDescription} />
              <p className="m-0 pl-1">{ellipsesText(item.name, 50)}</p>
            </div>
            <div className="pt-1 border-top pl-1">
              <div className="daily-deals-price">
                <PriceDetails productSchema="productInfo" product={item} />
              </div>
            </div>
          </ListItem>
        ))}
      </ul>
    );
  }
  render() {
    const { list } = this.props;
    return this.renderL1Categories(list);
  }
}
MegaMenu.propTypes = {
  list: PropTypes.array,
  gtmDataLayer: PropTypes.array,
  breadList: PropTypes.string
};

MegaMenu.defaultProps = {
  list: [],
  gtmDataLayer: [],
  breadList: ''
};

export default MegaMenu;
