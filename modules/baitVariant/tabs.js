import React from 'react';
import PropTypes from 'prop-types';
import ExecutionEnvironment from 'fbjs/lib/ExecutionEnvironment';
import {
  TabsContainer,
  ScrollableContent,
  ScrollContainer,
  Tab,
  LeftIconStyle,
  RightIconStyle,
  FlexedItem,
  alignArrows,
  ArrowButton
} from './tabsStyles';
import { sizesMax } from '../../utils/media';
import { TAB_ENABLE_MIN, ITEM_WIDTH } from './constants';
import { printBreadCrumb } from '../../utils/breadCrumb';

const { smMax } = sizesMax;

class Tabs extends React.PureComponent {
  static propTypes = {
    onTabChange: PropTypes.func,
    selectedIndex: PropTypes.number,
    products: PropTypes.array,
    productItem: PropTypes.object,
    gtmDataLayer: PropTypes.array
  };
  constructor(props) {
    super(props);
    this.slideLeft = this.slideLeft.bind(this);
    this.slideRight = this.slideRight.bind(this);
  }
  state = {
    scrollEnabled: false,
    tabIndex: this.props.selectedIndex
  };

  componentDidMount() {
    const { products } = this.props;
    this.initTabs(products);
    if (ExecutionEnvironment.canUseDOM) {
      if (window.innerWidth < smMax && this.scrollContainer && this.selected.offsetLeft) {
        setTimeout(() => {
          this.scrollContainer.scrollLeft = this.selected.offsetLeft;
        }, 100);
      }
      window.addEventListener('resize', this.onResize);
    }
  }
  componentDidUpdate(prevProps) {
    const { selectedIndex } = prevProps;
    if (ExecutionEnvironment.canUseDOM && selectedIndex !== this.props.selectedIndex) {
      if (this.scrollContainer) {
        this.selected.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }

  onResize = () => this.setState({ resizing: true }, () => this.initTabs(this.props.products));
  /**
   Functionality to determine to calculate the width and  setting the position of the tab relative to tabindex
   */
  setPositions = (tabIndex, direction) => {
    const { productItem, gtmDataLayer, products } = this.props;
    if (ExecutionEnvironment.canUseDOM) {
      this.setState(
        {
          tabIndex,
          direction
        },
        () => {
          const selectedProduct = products[tabIndex];
          gtmDataLayer.push({
            event: 'pdpDetailClick',
            eventCategory: 'pdp interactions',
            eventAction: `pdp|attribute|color|${selectedProduct.color || ''}`.toLowerCase(),
            eventLabel: `${printBreadCrumb(productItem.breadCrumb)} > ${productItem.name}`.toLowerCase()
          });
        }
      );
      if (this.props.onTabChange) {
        this.props.onTabChange(tabIndex);
      }
    }
  };
  /**
   Functionality to get the position of the tab from the container when scrollable for left and right
   */
  getPosition() {
    let { scrollPosition } = 0;
    let index;
    if (ExecutionEnvironment.canUseDOM) {
      const { scrollEnabled, tabIndex, direction = 'tab' } = this.state;
      if (!scrollEnabled) return {};
      const { products } = this.props;
      const allItemsWidth = products.length * ITEM_WIDTH;
      const containerWidth = this.scrollContainer.clientWidth;
      const tempWidth = allItemsWidth / ITEM_WIDTH;
      const MAX_IMAGE = tempWidth - Math.ceil((allItemsWidth - containerWidth) / ITEM_WIDTH) - 1;

      if (direction === 'right') {
        index = tabIndex > MAX_IMAGE ? tabIndex - MAX_IMAGE : 0;
        const nextLeft = index * ITEM_WIDTH;
        scrollPosition = nextLeft * -1;
      } else if (direction === 'tab') {
        const nextLeft = tabIndex > MAX_IMAGE ? -(tabIndex - MAX_IMAGE) : 0;
        scrollPosition = nextLeft * ITEM_WIDTH * 1;
      } else if (direction === 'left') {
        index = tabIndex > MAX_IMAGE ? -(tabIndex - MAX_IMAGE) : 0;
        scrollPosition = index * ITEM_WIDTH;
      }
    }
    return scrollPosition;
  }

  getPositionByMedia = () => (ExecutionEnvironment.canUseDOM && window.innerWidth < smMax ? {} : { transform: this.getPosition() });

  slideLeft = e => {
    if (ExecutionEnvironment.canUseDOM) {
      if (e && e.nativeEvent.keyCode === 13) {
        return false;
      }
      if (!this.state.scrollEnabled) return true;
      let { tabIndex } = this.state;
      if (tabIndex > 0) {
        tabIndex -= 1;
      } else {
        tabIndex = 0;
      }
      this.setPositions(tabIndex, 'left');
    }
    return true;
  };
  slideRight = e => {
    if (ExecutionEnvironment.canUseDOM) {
      if (e && e.nativeEvent.keyCode === 13) {
        return false;
      }
      if (!this.state.scrollEnabled) return true;
      const { products } = this.props;
      let { tabIndex } = this.state;
      const productLength = products.length;
      if (tabIndex < productLength - 1) {
        tabIndex += 1;
      } else {
        tabIndex = productLength - 1;
      }
      this.setPositions(tabIndex, 'right');
    }
    return true;
  };

  initTabs = products => {
    const totalWidth = products.length * ITEM_WIDTH;
    const scrollableWidth = this.scrollContainer.clientWidth;
    let state;
    if (products) {
      if (totalWidth > scrollableWidth) {
        state = { scrollEnabled: true };
      } else {
        state = { scrollEnabled: false };
      }
    }
    this.setState({ ...state, resizing: false });
  };

  renderLeft = () => {
    const { scrollEnabled, tabIndex } = this.state;
    return (
      scrollEnabled && (
        <ArrowButton
          className={`btn-left px-1 ${alignArrows.leftAligned}`}
          onClick={this.slideLeft}
          onKeyDown={this.slideLeft}
          disabled={tabIndex === TAB_ENABLE_MIN}
        >
          <LeftIconStyle className="academyicon icon-chevron-left" />
        </ArrowButton>
      )
    );
  };

  renderRight = () => {
    const { scrollEnabled, tabIndex } = this.state;
    const { products } = this.props;
    return (
      scrollEnabled && (
        <ArrowButton
          className={`btn-right px-1 ${alignArrows.rightAligned}`}
          onClick={this.slideRight}
          onKeyDown={this.slideRight}
          disabled={tabIndex === products.length - 1}
        >
          <RightIconStyle className="academyicon icon-chevron-right" />
        </ArrowButton>
      )
    );
  };

  render() {
    const { products } = this.props;
    return (
      <TabsContainer className="mb-2 pl-1 pr-1 pl-md-3 pr-md-2">
        {this.renderLeft()}
        <ScrollContainer
          resizing={this.state.resizing}
          innerRef={node => {
            this.scrollContainer = node;
          }}
        >
          <ScrollableContent
            scrollable={this.state.scrollEnabled}
            {...this.getPositionByMedia()}
            innerRef={node => {
              this.scrollableContent = node;
            }}
          >
            {products.map((item, index) => (
              <Tab
                imageURL={item.imageURL}
                className={`scrollableTab${index}`}
                aria-label={item.color}
                onFocus={() => {
                  this.setPositions(index, 'tab');
                }}
                onClick={() => {
                  this.setPositions(index, 'tab');
                }}
                selected={index === this.state.tabIndex}
                innerRef={node => {
                  if (index === this.state.tabIndex) {
                    this.selected = node;
                  }
                }}
              >
                <input type="radio" value={index} name="baitTab" />
              </Tab>
            ))}
            <FlexedItem />
          </ScrollableContent>
        </ScrollContainer>
        {this.renderRight()}
      </TabsContainer>
    );
  }
}
export default Tabs;
