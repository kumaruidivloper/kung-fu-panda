import ExecutionEnvironment from 'fbjs/lib/ExecutionEnvironment';
import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import PriceDetails from '@academysports/fusion-components/dist/PriceDetails';
import ListItem from '../listItem';
import { bodyOverrides } from '../header.styles';
import {
  updateAnalytics,
  hasVisualGuidedSuggestion,
  hasAutoSuggestions,
  ellipsesText,
  hasCategoryAutoSuggestions,
  hasBrandAutoSuggestions
} from '../helpers';
import { SEARCH_TERM_URL, SEARCH_ACTION_REGEX } from '../constants';
import Storage from '../../../utils/StorageManager';

const recentSearchCookie = 'recentSearches';

class Search extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isFocused: false,
      searchTerm: '',
      showInputValueByDefault: false,
      keyboardEvtTriggered: false
    };
    this.handleFocus = this.handleFocus.bind(this);
    this.handleBlur = this.handleBlur.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.clearSearch = this.clearSearch.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.setInputValue = this.setInputValue.bind(this);
    this.focusInputField = this.focusInputField.bind(this);
    this.inputRef = React.createRef();
    this.submitButtonRef = React.createRef();
    this.searchResultsContainerRef = React.createRef();
  }
  componentDidMount() {
    if (this.props.isMobile) {
      this.focusInputField();
    }
  }
  componentDidUpdate() {
    if (this.props.isMobile) {
      const { searchResults, isMobile, searchBarToggled } = this.props;
      const { isFocused } = this.state;
      this.setBodyClass(false);
      const hasCategories = hasCategoryAutoSuggestions(searchResults);
      const hasBrands = hasBrandAutoSuggestions(searchResults);
      const hasSuggestions = hasAutoSuggestions(searchResults);
      const hasRecentResults = this.checkCookiePresenceAndResults();
      if (isMobile && isFocused && (hasCategories || hasBrands || hasSuggestions || hasRecentResults)) {
        this.setBodyClass(searchBarToggled);
      }
      this.focusInputField();
    }
  }
  /* ***** ADD overflow hidden to the body if the search suggestions are opened ***** */
  setBodyClass = hasClass => {
    if (ExecutionEnvironment.canUseDOM) {
      document.body.classList.remove('search-fixed', `${bodyOverrides}`);
      if (hasClass) {
        document.body.classList.add('search-fixed', `${bodyOverrides}`);
      }
    }
  };
  /* ****** set input value by default ****** */
  setInputValue() {
    if (!ExecutionEnvironment.canUseDOM) return '';
    const { searchTerm, showInputValueByDefault } = this.state;
    if (window.location.href.indexOf(SEARCH_TERM_URL) > -1 && !showInputValueByDefault) {
      if (this.checkCookiePresenceAndResults()) {
        const keyword = this.checkCookiePresenceAndResults().split('|')[0];
        if (keyword) {
          return decodeURIComponent(keyword);
        }
        return '';
      }
    }
    return searchTerm;
  }
  /* ***** Focus Input Field By Default ***** */
  focusInputField() {
    const { mobileMenu, fnSetSearchInputFocus } = this.props;
    if (mobileMenu && mobileMenu.searchShouldBeFocused && this.inputRef && this.inputRef.current) {
      fnSetSearchInputFocus({ searchShouldBeFocused: false });
      this.inputRef.current.focus();
    }
  }
  /* ****** Handle Focus Evt ****** */
  handleFocus(e) {
    const { gtmDataLayer, breadList } = this.props;
    const { searchTerm } = this.state;
    updateAnalytics(e, gtmDataLayer, 'headerLinks', 'header', 'search initiate', searchTerm || breadList);
    this.setState({
      isFocused: true,
      showInputValueByDefault: true
    });
  }
  /* ****** Handle Blur Evt ****** */
  handleBlur(e) {
    e.preventDefault();
    const { keyboardEvtTriggered } = this.state;
    if (!keyboardEvtTriggered) {
      setTimeout(() => this.setState({ isFocused: false }), 200);
    }
  }
  /* ****** Handle Submit ****** */
  handleSubmit(e, url, name, taKeyword) {
    e.preventDefault();
    if (!ExecutionEnvironment.canUseDOM) return;
    const { searchTerm } = this.state;
    const { gtmDataLayer } = this.props;
    const keyword = name || searchTerm || this.inputRef.current.value;
    let trimmedKeyword = encodeURIComponent(keyword);
    /**
     * To handle the issue of smart Punctuator on ios11 specific devices
     * for apostrophe
     */
    let updatedTrimmedKeyword = '';
    const splitTerm = '%E2%80%99';
    if (trimmedKeyword.indexOf(splitTerm) !== -1) {
      const splittedKeyWord = trimmedKeyword.split(splitTerm);
      updatedTrimmedKeyword = `${splittedKeyWord[0]}'${splittedKeyWord[1]}`;
    }
    trimmedKeyword = updatedTrimmedKeyword !== '' ? updatedTrimmedKeyword : trimmedKeyword;
    const newURL = url || `${SEARCH_TERM_URL}${trimmedKeyword}`;
    if (trimmedKeyword && trimmedKeyword.length > 0) {
      this.storeResultInCookie(trimmedKeyword);
      const updateTaKeyword = taKeyword || 'reg';
      updateAnalytics(e, gtmDataLayer, 'search', 'internal search', updateTaKeyword, keyword, newURL, '', '', true);
    }
  }
  /* ******* Check recent search cookie and results ****** */
  checkCookiePresenceAndResults() {
    return Storage.getCookie(recentSearchCookie, 'restrictDecoding');
  }
  /* ***** Remove the Duplicate entries if we have same keyword case insensitive **** */
  removeDuplicateCaseInsesitiveEntries(hasRecentResults, caseInsenstiveKeyword) {
    let idx;
    for (let i = 0; i < hasRecentResults.length; i += 1) {
      if (hasRecentResults[i].toLowerCase() === encodeURIComponent(caseInsenstiveKeyword)) {
        idx = i;
        break;
      }
    }
    return idx;
  }
  /* ******* Store Search Keyword in Cookie ******* */
  storeResultInCookie(keyword) {
    let newKeyword = keyword;
    const cookiePresenceAndResults = this.checkCookiePresenceAndResults();
    const hasRecentResults = cookiePresenceAndResults ? cookiePresenceAndResults.split('|') : [];
    if (hasRecentResults && hasRecentResults.length === 0) {
      hasRecentResults.unshift(newKeyword);
    } else if (hasRecentResults && hasRecentResults.length > 0) {
      newKeyword = newKeyword && decodeURIComponent(newKeyword);
      const caseInsenstiveKeyword = newKeyword.toLowerCase();
      const keywordIdx = this.removeDuplicateCaseInsesitiveEntries(hasRecentResults, caseInsenstiveKeyword);
      if (keywordIdx >= 0) {
        hasRecentResults.splice(0, 0, hasRecentResults.splice(keywordIdx, 1)[0]);
      } else {
        if (hasRecentResults.length === 4) {
          hasRecentResults.pop();
        }
        hasRecentResults.unshift(encodeURIComponent(newKeyword));
      }
    }
    Storage.setCookie(recentSearchCookie, hasRecentResults.join('|'));
    return hasRecentResults;
  }
  /* ******* Handle Change Evt ********* */
  handleChange() {
    const { limit, isMobile, fnFetchAutoSuggestions, fnSaveAutoSuggestions, fnSaveVisualGuidedCategoriesBrands } = this.props;
    const { current } = this.inputRef;
    fnSaveAutoSuggestions(null);
    fnSaveVisualGuidedCategoriesBrands(null);
    this.setState({
      searchTerm: current.value,
      showInputValueByDefault: true
    });
    const trimmedValue = current.value.replace(SEARCH_ACTION_REGEX, '');
    if (trimmedValue && trimmedValue.length >= limit) {
      const { value } = current;
      fnFetchAutoSuggestions({ value, isMobile });
    }
  }
  /* ******* HighLight Text ******** */
  highlightText(result) {
    const { searchTerm } = this.state;
    const searchKeywordIdx = result && result.toLowerCase().indexOf(searchTerm.toLowerCase());
    let textHighlighter;
    if (searchKeywordIdx > -1) {
      textHighlighter = [
        result.substring(0, searchKeywordIdx),
        <strong className="o-copy__14reg" key={result}>
          {result.substring(searchKeywordIdx, searchKeywordIdx + searchTerm.length)}
        </strong>,
        result.substring(searchKeywordIdx + searchTerm.length)
      ];
    }
    return textHighlighter || result;
  }
  /* ******* Handle clear search ******** */
  clearSearch(e, clearCookie) {
    const { gtmDataLayer, breadList } = this.props;
    const { searchTerm } = this.state;
    updateAnalytics(e, gtmDataLayer, 'headerLinks', 'header', 'closed', searchTerm || breadList);
    if (clearCookie) {
      Storage.setCookie(recentSearchCookie, '');
    }
    this.setState({ searchTerm: '' });
  }
  /* ******* Handle key Evts ********* */
  handleKeyDown = e => {
    if (ExecutionEnvironment.canUseDOM) {
      const eleCount = document.querySelectorAll('.search-flyout li a');
      if (eleCount && eleCount.length > 0) {
        const lastEleIdx = eleCount.length - 1;
        const lastEle = eleCount[lastEleIdx];
        lastEle.onblur = () =>
          this.setState({ keyboardEvtTriggered: false }, () => {
            this.handleBlur(e);
            this.submitButtonRef.current.focus();
          });
        switch (e.which || e.keyCode) {
          case 27:
            e.preventDefault();
            this.setState({ keyboardEvtTriggered: false }, () => {
              this.handleBlur(e);
              this.submitButtonRef.current.focus();
            });
            return true;
          case 40:
            e.preventDefault();
            this.setState({ keyboardEvtTriggered: true }, () => {
              this.handleFocus(e);
              document.querySelector('.search-flyout a').focus();
            });
            return true;
          default:
            return true;
        }
      }
    }
    return true;
  };
  /* ******* Set Sale Price Details ******** */
  showPriceDetails = (product, price = {}) => {
    if (price.priceMessage) {
      if (price.priceMessage.indexOf('priceInCart') >= 0) {
        return <PriceDetails productSchema="productInfo" product={product} />;
      } else if (price.priceMessage.indexOf('wasNowPrice') >= 0) {
        return <PriceDetails listPrice={price.listPrice} salePrice={price.salePrice} />;
      }
    }
    return <PriceDetails listPrice={price.salePrice || price.listPrice} />;
  };

  /* ********* Render smaller Flyout for only auto suggestions and recent searches ********* */
  renderSmallFlyout(suggestions, hasClasses, hasTitle, hasClearAllLink, decodeString, taKeyword) {
    const { isFocused } = this.state;
    if (isFocused && suggestions && suggestions.length > 0) {
      const suggestionsListItems = suggestions.slice(0, 4).map((suggestion, idx) => {
        let suggestionName = suggestion.name || suggestion;
        if (decodeString) {
          suggestionName = decodeURIComponent(suggestion.name || suggestion);
        }
        return (
          <ListItem
            listclass="col-12"
            key={idx.toString()}
            cname="o-copy__14reg"
            auid={`autoSuggestions_${suggestionName}`}
            arialabel={suggestionName}
            href={suggestion && (suggestion.url || `${SEARCH_TERM_URL}${suggestionName}`)}
            click={e => this.handleSubmit(e, suggestion && suggestion.url, suggestionName, taKeyword)}
            keydown={e => this.handleKeyDown(e)}
          >
            {suggestion && this.highlightText(suggestionName)}
          </ListItem>
        );
      });
      return (
        <ul className={`w-100 search-term-wrap row no-gutter ${!hasClasses ? 'pt-1 search-small-flyout search-flyout' : ''}`}>
          {hasTitle && <li className="search-suggestion-title o-copy__14bold py-1">{hasTitle}</li>}
          {suggestionsListItems}
          {hasClearAllLink && (
            <li className="search-suggestion-title py-1">
              <a href="clearAll" className="o-copy__14bold" aria-label="Clear All Link" onClick={e => this.clearSearch(e, true)}>
                <span className="academyicon icon-close d-inline-block" aria-hidden="true" />
                <span className="pl-half d-inline-block">Clear All</span>
              </a>
            </li>
          )}
        </ul>
      );
    }
    return null;
  }
  /* ********* Render Mega Flyout ********* */
  renderMegaFlyout() {
    const { searchResults, limit, isMobile, gtmDataLayer, breadList } = this.props;
    const { isFocused, searchTerm } = this.state;
    if (isFocused && searchTerm.length >= limit) {
      return (
        <div className="position-absolute search-flyout search-mega-flyout">
          <div ref={this.searchResultsContainerRef} className="container-1052 m-auto pt-half box-shadow bg-white py-half">
            <ul className="row no-gutter">
              {!isMobile && (
                <li className="ml-auto search-left-column pt-half">
                  <ul className="row justify-content-center search-visual-guided-suggestions">
                    {searchResults.visualCategoriesBrands.productinfo.slice(0, 6).map((suggestion, idx) => (
                      <ListItem
                        arialabel={suggestion.name}
                        href={suggestion.seoURL}
                        auid={`visual_guided_${suggestion.name}`}
                        listclass="text-center mb-1 mr-1 py-half box-shadow"
                        key={idx.toString()}
                        cname="text-decoration-none o-copy__12reg px-half d-block"
                        keydown={e => this.handleKeyDown(e)}
                        click={e =>
                          updateAnalytics(
                            e,
                            gtmDataLayer,
                            'search',
                            'internal search',
                            'redirect|ta:product',
                            searchTerm || breadList,
                            suggestion.seoURL,
                            '',
                            '',
                            true
                          )
                        }
                      >
                        <figure>
                          <div className="mh-80">
                            <img src={suggestion.imageURL} alt={suggestion.imageAltDescription} />
                          </div>
                          <figcaption className="pt-half">{ellipsesText(suggestion.name, 30)}</figcaption>
                          {suggestion.isGiftCard !== 'Y' && (
                            <figcaption className="pt-half search-price">{this.showPriceDetails(suggestion, suggestion.defaultSkuPrice)}</figcaption>
                          )}
                        </figure>
                      </ListItem>
                    ))}
                  </ul>
                </li>
              )}
              <li className={`mr-auto search-right-column ${isMobile ? 'addBorder' : ''}`}>
                <Fragment>
                  {this.state.searchTerm.length >= this.props.limit && (
                    <Fragment>
                      {this.renderSmallFlyout(searchResults.autoSuggestions, true, undefined, undefined, undefined, 'ta:keyword')}
                      {this.renderSmallFlyout(
                        searchResults.visualCategoriesBrands.categorysuggestion,
                        true,
                        'CATEGORY',
                        undefined,
                        undefined,
                        'ta:category'
                      )}
                      {this.renderSmallFlyout(searchResults.visualCategoriesBrands.brandsuggestion, true, 'BRAND', undefined, undefined, 'ta:brand')}
                    </Fragment>
                  )}
                </Fragment>
              </li>
            </ul>
          </div>
        </div>
      );
    }
    return null;
  }
  /* ****** Render Flyouts as per conditions ****** */
  renderFlyouts(megaFlyout, hasSuggestions) {
    const { searchResults, limit } = this.props;
    const hasCategories = hasCategoryAutoSuggestions(searchResults);
    const hasBrands = hasBrandAutoSuggestions(searchResults);
    if (megaFlyout) {
      return this.renderMegaFlyout();
    }
    if (hasSuggestions || hasCategories || hasBrands) {
      return (
        <Fragment>
          {this.state.searchTerm.length >= limit && (
            <div className="pt-1 search-small-flyout search-flyout">
              {this.renderSmallFlyout(searchResults.autoSuggestions, true, undefined, undefined, undefined, 'ta:keyword')}
              {hasCategories &&
                this.renderSmallFlyout(
                  searchResults.visualCategoriesBrands.categorysuggestion,
                  true,
                  'CATEGORY',
                  undefined,
                  undefined,
                  'ta:category'
                )}
              {hasBrands &&
                this.renderSmallFlyout(searchResults.visualCategoriesBrands.brandsuggestion, true, 'BRAND', undefined, undefined, 'ta:brand')}
            </div>
          )}
        </Fragment>
      );
    }
    return null;
  }
  render() {
    const { placeholder, searchResults, limit, auid } = this.props;
    const { isFocused, searchTerm } = this.state;
    const hasSuggestions = hasAutoSuggestions(searchResults);
    const megaFlyout = hasVisualGuidedSuggestion(searchResults);
    const trimmedValue = searchTerm.replace(SEARCH_ACTION_REGEX, '');
    const cookiePresenceAndResults = this.checkCookiePresenceAndResults();
    const hasRecentResults = cookiePresenceAndResults ? cookiePresenceAndResults.split('|') : [];
    return (
      <div className={`search-bar-container ${!megaFlyout && isFocused ? 'position-relative' : 'position-static'} ${isFocused ? 'focused' : ''}`}>
        <form action="." onSubmit={e => this.handleSubmit(e)} className="d-flex position-relative w-100">
          <input
            id="search"
            name="searchField"
            className="o-copy__14reg"
            autoComplete="off"
            type="search"
            title="search"
            placeholder={placeholder}
            value={this.setInputValue()}
            onFocus={e => this.handleFocus(e)}
            onBlur={e => this.handleBlur(e)}
            onChange={this.handleChange}
            onKeyDown={e => this.handleKeyDown(e)}
            ref={this.inputRef}
            aria-label="Search"
            data-auid={`search-input${auid}`}
          />
          {searchTerm.length > 0 && (
            <button
              data-auid={`search-submit-button${auid}`}
              onClick={e => this.clearSearch(e)}
              type="button"
              className="search-button search-clear"
              aria-label="clear search"
            >
              <span className="academyicon icon-close" aria-hidden="true" />
            </button>
          )}
          <button
            ref={this.submitButtonRef}
            data-auid={`search-clear-button${auid}`}
            className="search-button search-submit"
            aria-label="click to search"
          >
            <span className="academyicon icon-search" aria-hidden="true" />
          </button>
        </form>
        <Fragment>
          {isFocused && (
            <Fragment>
              {trimmedValue.length >= limit && this.renderFlyouts(megaFlyout, hasSuggestions)}
              {hasRecentResults.length > 0 &&
                searchTerm.length === 0 &&
                this.renderSmallFlyout(hasRecentResults, false, 'RECENT SEARCHES', true, 'decodeString', 'ta:history')}
            </Fragment>
          )}
        </Fragment>
      </div>
    );
  }
}

Search.propTypes = {
  placeholder: PropTypes.string,
  limit: PropTypes.string,
  fnFetchAutoSuggestions: PropTypes.func,
  searchResults: PropTypes.object,
  fnSetSearchInputFocus: PropTypes.func,
  mobileMenu: PropTypes.object,
  auid: PropTypes.string,
  fnSaveAutoSuggestions: PropTypes.func,
  fnSaveVisualGuidedCategoriesBrands: PropTypes.func,
  isMobile: PropTypes.bool,
  gtmDataLayer: PropTypes.array,
  searchBarToggled: PropTypes.bool,
  breadList: PropTypes.string
};

export default Search;
