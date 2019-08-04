import React from 'react';
import { GoogleMap, withGoogleMap, withScriptjs, Marker } from 'react-google-maps';
import { compose, withProps, lifecycle } from 'recompose';
import { GOOGLE_MAP_API_URL } from './constants';

const InitMap = compose(
  withProps({
    googleMapURL: GOOGLE_MAP_API_URL,
    loadingElement: <div style={{ height: '100%' }} />,
    containerElement: <div style={{ height: '100%' }} />,
    mapElement: <div style={{ height: '100%' }} />,
    updateMarkers: (markers, map) => {
      const bounds = new window.google.maps.LatLngBounds();
      markers.forEach(marker => {
        bounds.extend(new window.google.maps.LatLng(marker.position.lat, marker.position.lng));
      });
      if (markers.length > 1) {
        map.fitBounds(bounds);
      }
    }
  }),
  lifecycle({
    componentWillMount() {
      this.setState({
        zoomToMarkers: map => {
          if (map) {
            this.map = map;
            this.props.updateMarkers(this.props.markers, this.map);
          }
        }
      });
    },
    componentWillReceiveProps(newProps) {
      if (this.map) {
        this.props.updateMarkers(newProps.markers, this.map);
      }
    }
  }),
  withScriptjs,
  withGoogleMap
)(props => (
  <GoogleMap
    ref={props.zoomToMarkers}
    defaultCenter={props.center}
    defaultZoom={11}
    defaultOptions={{
      draggable: props.draggable,
      fullscreenControl: false,
      zoomControl: false,
      streetViewControl: false,
      mapTypeControl: false
    }}
  >
    {props.markers &&
      props.markers.map(marker => (
        <Marker position={marker.position} key={marker.position.lat} />
      ))}
  </GoogleMap>
));

export default InitMap;
