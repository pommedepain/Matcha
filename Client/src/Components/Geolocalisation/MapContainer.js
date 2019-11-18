import React, { Component, Fragment } from 'react';
import GoogleMap from './GoogleMap';
import AutoComplete from './AutoComplete';
import axios from 'axios';
import Geocode from "react-geocode";
import { UserContext } from '../../Contexts/UserContext';
import { shallowEqual } from 'fast-equals';


Geocode.setApiKey(process.env.REACT_APP_MAP_KEY);

class NewCompo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      mapApiLoaded: false,
      mapInstance: null,
      mapApi: null,
      markers: [],
      // places: [],
      locations: [],
      customCenter: [48.896704899999996, 1.3184218],
      suggestions: [],
      rerender: false,
    };
  }

  static contextType = UserContext;

  componentDidUpdate() {
    if (!shallowEqual(this.state.suggestions, this.props.suggestions)) {
      console.log(this.props.suggestions);
      const maps = this.state.mapApi;
      const map = this.state.mapInstance;
      let { markers } = this.state;
      if (this.props.suggestions && this.props.suggestions.length && maps && map) {
        for (let i = 0; i < markers.length; i += 1) {
          if (i !== 0) {
            markers[i].setMap(null);
          }
        }
        this.props.suggestions.reduce(async (prev, next) => {
          await prev;
          if (next.user.photos && next.user.photos.length) {
            return new Promise((resolve) => {
              const icon = {
                optimized: false,
                url: next.user.photos[0],
                scaledSize: new maps.Size(34, 34),
                origin: new maps.Point(0, 0),
                anchor: new maps.Point(0, 0),
              };
              // console.log(parseFloat(next.user.lat))
              // console.log(parseFloat(next.user.lon))

              markers.push(new maps.Marker({
                icon,
                animation: maps.Animation.DROP,
                position: new maps.LatLng(parseFloat(next.user.lat), parseFloat(next.user.lon)),
                
                map,
              }));
              resolve();
            })
          } return new Promise(resolve => resolve());
        }, Promise.resolve())
          .then(() => {
            this.setState({
              mapApiLoaded: true,
              mapInstance: map,
              mapApi: maps,
              markers,
              suggestions: this.props.suggestions,
            }, function() { console.log(this.state.markers); });
          })
      }
    } if (this.props.rerender) {
      let { markers } = this.state;
      const maps = this.state.mapApi;
      const map = this.state.mapInstance;
      markers[0].setMap(null);

      const icon = {
        shape:{coords:[17,17,18],type:'circle'},
        optimized: false,
        url: this.context.JWT.data.photos[0], // url
        scaledSize: new maps.Size(34, 34), // scaled size
        origin: new maps.Point(0,0), // origin
        anchor: new maps.Point(0, 0) // anchor
      };
      markers[0] = new maps.Marker({
        icon,
        animation: maps.Animation.DROP,
        position: {
          lat: this.props.currentLocation.lat,
          lng: this.props.currentLocation.lng,
        },
        map,
      })
      map.setCenter({ lat: parseFloat(this.props.currentLocation.lat), lng: parseFloat(this.props.currentLocation.lng) })
      this.setState({
        mapApiLoaded: true,
        mapInstance: map,
        mapApi: maps,
        markers,
      });
      // this.setState({rerender: !this.state.rerender});
    }
  }

  apiHasLoaded = (map, maps, locations) => {
    const markers = [];
    let customCenter = null;
    if (!this.context.JWT.data.forcedLat.length) {
     customCenter = [parseFloat(this.context.JWT.data.lat), parseFloat(this.context.JWT.data.lon)];
    } else {
      customCenter = [parseFloat(this.context.JWT.data.forcedLat), parseFloat(this.context.JWT.data.forcedLon)];
      axios.put(`http://localhost:4000/API/users/update/${this.context.JWT.data.username}`, { forcedLat: null, forcedLon:null} , {headers: {"x-auth-token": this.context.JWT.token}})
    }
    this.setState({ customCenter })
    let icon = {}
    if (this.context.JWT.data.photos[0]){
      icon = {
        url: this.context.JWT.data.photos[0], // url
        scaledSize: new maps.Size(34, 34), // scaled size
        origin: new maps.Point(0,0), // origin
        anchor: new maps.Point(0, 0), // anchor
        shape:{coords:[17,17,18],type:'circle'},
        optimized: false,
      };
      markers.push(new maps.Marker({
        icon,
        animation: maps.Animation.DROP,
        position: {
          lat: this.state.customCenter[0],
          lng: this.state.customCenter[1],
        },
        map,
      }));
    } else {
      markers.push(new maps.Marker({
        animation: maps.Animation.DROP,
        position: {
          lat: this.state.customCenter[0],
          lng: this.state.customCenter[1],
        },
        map,
      }));
    }
    map.setCenter({ lat: parseFloat(this.state.customCenter[0]), lng: parseFloat(this.state.customCenter[1]) })
    this.setState({
    mapApiLoaded: true,
    mapInstance: map,
    mapApi: maps,
    locations,
    markers,
    });
  };

  addPlace = (place) => {
    let { markers } = this.state;
    const maps = this.state.mapApi;
    const map = this.state.mapInstance;
    markers[0].setMap(null);
    let icon = {};
    if (this.context.JWT.data.photos[0]) {
      icon = {
        shape:{coords:[17,17,18],type:'circle'},
        optimized: false,
        url: this.context.JWT.data.photos[0], // url
        scaledSize: new maps.Size(34, 34), // scaled size
        origin: new maps.Point(0,0), // origin
        anchor: new maps.Point(0, 0) // anchor
      };
      markers[0] = new maps.Marker({
        icon,
        animation: maps.Animation.DROP,
        position: {
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng(),
        },
        map,
      })
    } else {
      markers[0] = new maps.Marker({
        animation: maps.Animation.DROP,
        position: {
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng(),
        },
        map,
      })
    }
    this.setState({
      mapApiLoaded: true,
      mapInstance: map,
      mapApi: maps,
      places: [place],
      markers,
    });
    axios.put(`http://localhost:4000/API/users/update/${this.context.JWT.data.username}`, {forcedLat: place.geometry.location.lat(), forcedLon: place.geometry.location.lng(), lat: place.geometry.location.lat(), lon: place.geometry.location.lng()} , {headers: {"x-auth-token": this.context.JWT.token}})
      .then((res) => {
        this.context.toggleUser(res.data.payload.result.token);
      })
      .catch((err) => console.log(err))
  };

  render() {
    const {
      locations, mapApiLoaded, mapInstance, mapApi, customCenter
    } = this.state;
    return (
      <Fragment>
        <GoogleMap
          defaultZoom={15}
          defaultCenter={[48.896704899999996, 1.3184218]}
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
        {mapApiLoaded && (
          <AutoComplete map={mapInstance} mapApi={mapApi} customCenter={customCenter} addplace={this.addPlace} displayInput={this.props.displayInput} />
        )}
      </Fragment>
    );
  }
}

export default NewCompo;
