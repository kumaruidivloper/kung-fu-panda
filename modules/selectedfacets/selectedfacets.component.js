import ExecutionEnvironment from 'fbjs/lib/ExecutionEnvironment';
import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import './selectedfacets.component.scss';
import { NODE_TO_MOUNT, DATA_COMP_ID } from './constants';
import PubSub from '../../utils/PubSub';

class Selectedfacets extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      selectedFacets: this.props.selectedFacets || [],
      isDesktop: ExecutionEnvironment.canUseDOM ? window.innerWidth > 420 : false
    };
    this.onRemoveItem = this.onRemoveItem.bind(this);
    this.facetChangeListener = this.facetChangeListener.bind(this);
    this.selectedFacetChangeListener = this.selectedFacetChangeListener.bind(this);
    this.mobileFacetChangeListener = this.mobileFacetChangeListener.bind(this);
    this.onClearAll = this.onClearAll.bind(this);
    PubSub.subscribe('selectedfacets.onchange', this.facetChangeListener);
    PubSub.subscribe('selectedfacets.onproductchange', this.selectedFacetChangeListener);
    PubSub.subscribe('selectedfacets.onmobilechange', this.mobileFacetChangeListener);
    PubSub.subscribe('facet.onclearall', this.onClearAll);
    // if(ExecutionEnvironment.canUseDOM) {
    //   const queryParams = window.location.search;
    //   console.log('queryParams', queryParams);
    //   console.log('stateVariables', this.state);
    // }
  }

  componentWillUnmount() {
    PubSub.unsubscribe('selectedfacets.onchange');
  }

  onRemoveItem({ ...data }) {
    if (this.state.isDesktop) {
      this.facetChangeListener(undefined, { ...data });
    } else {
      // PubSub.publish('selectedfacetchange.onchange', this.state.selectedFacets);
      this.mobileFacetChangeListener(undefined, { ...data });
    }
    // PubSub.publish('facets.onfacetremove', { ...data });
    // PubSub.publish('productgrid.onfacetchange', { ...data });
  }

  onClearAll(msg, data) {
    const selectedFacetsList = this.state.selectedFacets.filter(item => item.selectedLabelParentDrawer !== data.name);
    this.setState({
      selectedFacets: selectedFacetsList
    });
    PubSub.publish('productgrid.onfacetchange', data);
  }

  mobileFacetChangeListener(msg, data) {
    const { selectedLabelId } = data;
    if (selectedLabelId === 0) {
      this.setState(
        {
          selectedFacets: []
        },
        () => {
          //  PubSub.publish('productgrid.onfacetchange', this.state.selectedFacets)
          PubSub.publish('facets.mobileFacetsList', {
            selectedFacets: this.state.selectedFacets
          });
        }
      );
    } else {
      const { selectedFacets } = this.state;
      const filteredFacets = selectedFacets.filter(item => item.selectedLabelId === selectedLabelId);
      if (filteredFacets.length !== 0) {
        const tempFilteredFacets = selectedFacets.filter(item => item.selectedLabelId !== selectedLabelId);
        this.setState({ selectedFacets: tempFilteredFacets }, () => {
          // PubSub.publish('productgrid.onfacetchange', this.state.selectedFacets)
          PubSub.publish('facets.mobileFacetsList', {
            selectedFacets: this.state.selectedFacets
          });
        });
      } else {
        const updatedFacets = selectedFacets.concat(data);
        this.setState({ selectedFacets: updatedFacets }, () => {
          //   PubSub.publish('productgrid.onfacetchange', this.state.selectedFacets);
          PubSub.publish('facets.mobileFacetsList', {
            selectedFacets: this.state.selectedFacets
          });
        });
      }
    }
  }

  facetChangeListener(msg, data) {
    const { selectedLabelId } = data;
    console.log('facetChangeListener', selectedLabelId);
    if (selectedLabelId === 0) {
      if (data && data.populateToGrid) {
        this.setState({
          selectedFacets: data.selectedFacets
        });
      } else {
        this.setState(
          {
            selectedFacets: []
          },
          () => PubSub.publish('productgrid.onfacetchange', this.state.selectedFacets)
        );
      }
    } else {
      const { selectedFacets } = this.state;
      const filteredFacets = selectedFacets.filter(item => item.selectedLabelId === selectedLabelId);
      if (filteredFacets.length !== 0) {
        const tempFilteredFacets = selectedFacets.filter(item => item.selectedLabelId !== selectedLabelId);
        this.setState({ selectedFacets: tempFilteredFacets }, () => PubSub.publish('productgrid.onfacetchange', this.state.selectedFacets));
      } else {
        const updatedFacets = selectedFacets.concat(data);
        this.setState({ selectedFacets: updatedFacets }, () => PubSub.publish('productgrid.onfacetchange', this.state.selectedFacets));
      }
    }
  }

  selectedFacetChangeListener(msg, data) {
    this.setState({
      selectedFacets: data.selectedFacets
    });
  }

  render() {
    const { selectedFacets } = this.state;
    console.log('SelectedFacets', selectedFacets);
    return (
      <div className="selectedfacet-container mt-1">
        {selectedFacets && selectedFacets.map(index => (
          <div
            className="selectedfacet-item"
            key={index.selectedLabelId}
            tabIndex={0}
            role="button"
            onClick={() =>
              this.onRemoveItem({
                selectedLabelName: index.selectedLabelName,
                selectedLabelId: index.selectedLabelId
              })
            }
            onKeyPress={() =>
              this.onRemoveItem({
                selectedLabelName: index.selectedLabelName,
                selectedLabelId: index.selectedLabelId
              })
            }
          >
            <i className="academyicon icon-close mx-2 cross-icon" />
            {<span>{index.selectedLabelName}</span> /*eslint-disable-line*/}
          </div>
        ))}
        {selectedFacets && selectedFacets.length > 0 && (
          <div
            className="selectedfacet-item d-none d-sm-block"
            tabIndex={0}
            role="button"
            onClick={() =>
              this.onRemoveItem({
                selectedLabelName: 0,
                selectedLabelId: 0
              })
            }
            onKeyPress={() =>
              this.onRemoveItem({
                selectedLabelName: 0,
                selectedLabelId: 0
              })
            }
          >
            {<span>Clear All</span> /*eslint-disable-line*/}
          </div>
        )}
      </div>
    );
  }
}

Selectedfacets.propTypes = {
  selectedFacets: PropTypes.array
};

if (ExecutionEnvironment.canUseDOM) {
  [...document.querySelectorAll(`[data-component="${NODE_TO_MOUNT}"]`)].forEach(el => {
    ReactDOM.hydrate(<Selectedfacets {...window.ASOData[el.getAttribute(`${DATA_COMP_ID}`)]} />, el);
  });
}

export default Selectedfacets;
