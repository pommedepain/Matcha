import React, { Component, Fragment } from 'react';
import isEmpty from 'lodash.isempty';

// components:
import Marker from '../components/Marker';

// examples:
import GoogleMap from '../components/GoogleMap';
import AutoComplete from '../components/AutoComplete';


class MyCustomComponent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      mapApiLoaded: false,
      mapInstance: null,
      mapApi: null,
      markers: [],
      places: [],
      locations: [],
      customCenter: [48, -3],
    };
  }

  apiHasLoaded = (map, maps, locations) => {
    const markers = [];
    markers.push(new maps.Marker({
      position: {
        lat: this.state.customCenter[0],
        lng: this.state.customCenter[1],
      },
      map,
    }));

    this.setState({
      mapApiLoaded: true,
      mapInstance: map,
      mapApi: maps,
      locations,
      markers,
    });
  };

  addPlace = (place) => {
    const { markers } = this.state;
    const maps = this.state.mapApi;
    const map = this.state.mapInstance;
    console.log(place.geometry.location.lat);
    markers[0] = new maps.Marker({
      position: {
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng(),
      },
      map,
    });
    this.setState({
      mapApiLoaded: true,
      mapInstance: map,
      mapApi: maps,
      places: [place],
      markers,
    });
  };


  render() {
    const {
      locations, mapApiLoaded, mapInstance, mapApi,
    } = this.state;
    return (
      <Fragment>
        {mapApiLoaded && (
          <AutoComplete map={mapInstance} mapApi={mapApi} addplace={this.addPlace} />
        )}
        <GoogleMap
          defaultZoom={15}
          defaultCenter={[48, -3]}
          bootstrapURLKeys={{
            key: process.env.REACT_APP_MAP_KEY,
            libraries: ['places', 'geometry'],
          }}
          yesIWantToUseGoogleMapApiInternals
          onGoogleApiLoaded={({ map, maps }) => this.apiHasLoaded(map, maps, locations)}
        >
          {/* {!isEmpty(places) &&
            places.map(place => (
              <Marker
                key={place.id}
                text={place.name}
                lat={place.geometry.location.lat()}
                lng={place.geometry.location.lng()}
              />
            ))} */}
        </GoogleMap>
      </Fragment>
    );
  }
}

export default MyCustomComponent;
