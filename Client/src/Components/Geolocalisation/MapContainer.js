import React, { Component, Fragment } from 'react';
import GoogleMap from './GoogleMap';
import AutoComplete from './AutoComplete';
import axios from 'axios';
import Geocode from "react-geocode";
import { UserContext } from '../../Contexts/UserContext';


Geocode.setApiKey(process.env.REACT_APP_MAP_KEY);

class NewCompo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      mapApiLoaded: false,
      mapInstance: null,
      mapApi: null,
      markers: [],
      places: [],
      locations: [],
      customCenter: [48.896704899999996, 1.3184218],
    };
  }

  static contextType = UserContext;

  getCity = ( addressArray ) => {
    let city = '';
    for( let i = 0; i < addressArray.length; i++ ) {
     if ( addressArray[ i ].types[0] && 'administrative_area_level_2' === addressArray[ i ].types[0] ) {
      city = addressArray[ i ].long_name;
      return city;
     }
    }
   };

   getArea = ( addressArray ) => {
    let area = '';
    for( let i = 0; i < addressArray.length; i++ ) {
     if ( addressArray[ i ].types[0]  ) {
      for ( let j = 0; j < addressArray[ i ].types.length; j++ ) {
       if ( 'sublocality_level_1' === addressArray[ i ].types[j] || 'locality' === addressArray[ i ].types[j] ) {
        area = addressArray[ i ].long_name;
        return area;
       }
      }
     }
    }
   };

   getState = ( addressArray ) => {
    let state = '';
    for( let i = 0; i < addressArray.length; i++ ) {
     for( let i = 0; i < addressArray.length; i++ ) {
      if ( addressArray[ i ].types[0] && 'administrative_area_level_1' === addressArray[ i ].types[0] ) {
       state = addressArray[ i ].long_name;
       return state;
      }
     }
    }
   };

  apiHasLoaded = (map, maps, locations, suggestions) => {
    const markers = [];
    if (navigator && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(pos => {
        // console.log(pos);
        const customCenter = [pos.coords.latitude, pos.coords.longitude];
        this.setState({ customCenter })
        const icon = {
          url: 'https://uinames.com/api/photos/female/16.jpg', // url
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
        map.setCenter({ lat: this.state.customCenter[0], lng: this.state.customCenter[1] })
        // console.log({ lat: this.state.customCenter[0], lng: this.state.customCenter[1] });
        this.setState({
        mapApiLoaded: true,
        mapInstance: map,
        mapApi: maps,
        locations,
        markers,
        });
        axios.put(`http://localhost:4000/API/users/update/${this.context.JWT.data.username}`, { lat: this.state.customCenter[0], lon: this.state.customCenter[1]} , {headers: {"x-auth-token": this.context.JWT.token}})
          .then((res) => {
            this.context.toggleUser(res.data.payload.result.token);
          })
          .catch((err) => console.log(err))
        Geocode.fromLatLng( this.state.customCenter[0] , this.state.customCenter[1] ).then(
          response => {
           const address = response.results[0].formatted_address,
            addressArray =  response.results[0].address_components,
            city = this.getCity( addressArray ),
            area = this.getArea( addressArray ),
            state = this.getState( addressArray );
         
          //  console.log( 'city', city, area, state );
         
           this.setState( {
            address: ( address ) ? address : '',
            area: ( area ) ? area : '',
            city: ( city ) ? city : '',
            state: ( state ) ? state : '',
           } )
          },
          error => {
           console.error(error);
          }
         );
      }, (error) => {
      if (error.code === error.PERMISSION_DENIED) {
        console.log('geoloc denied');
        axios.get('http://localhost:4000/API/locate/geocode')
            .then((position) => {
              this.setState({
                customCenter: [position.data.payload.localisation.latitude,position.data.payload.localisation.longitude],
              })
              const icon = {
                shape:{coords:[17,17,18],type:'circle'},
                optimized: false,
                url: 'https://uinames.com/api/photos/female/16.jpg', // url
                scaledSize: new maps.Size(34, 34), // scaled size
                origin: new maps.Point(0,0), // origin
                anchor: new maps.Point(0, 0) // anchor
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
              map.setCenter({ lat: this.state.customCenter[0], lng: this.state.customCenter[1] })
              // console.log({ lat: this.state.customCenter[0], lng: this.state.customCenter[1] });
              this.setState({
              mapApiLoaded: true,
              mapInstance: map,
              mapApi: maps,
              locations,
              markers,
              });
              axios.put(`http://localhost:4000/API/users/update/${this.context.JWT.data.username}`, { lat: this.state.customCenter[0], lon: this.state.customCenter[1]} , {headers: {"x-auth-token": this.context.JWT.token}})
                .then((res) => {
                  this.context.toggleUser(res.data.payload.result.token);
                })
                .catch((err) => console.log(err))
              Geocode.fromLatLng( this.state.customCenter[0] , this.state.customCenter[1] ).then(
                response => {
                 const address = response.results[0].formatted_address,
                  addressArray =  response.results[0].address_components,
                  city = this.getCity( addressArray ),
                  area = this.getArea( addressArray ),
                  state = this.getState( addressArray );
               
                //  console.log( 'city', city, area, state );
               
                 this.setState( {
                  address: ( address ) ? address : '',
                  area: ( area ) ? area : '',
                  city: ( city ) ? city : '',
                  state: ( state ) ? state : '',
                 } )
                },
                error => {
                 console.error(error);
                }
               );
            })
      }})
    }
    console.log(suggestions);
    suggestions.forEach((user) => {
      const icon = {
        shape:{coords:[17,17,18],type:'circle'},
        optimized: false,
        url: user.photos[0], // url
        scaledSize: new maps.Size(34, 34), // scaled size
        origin: new maps.Point(0,0), // origin
        anchor: new maps.Point(0, 0) // anchor
      };
      markers.push(new maps.Marker({
        icon,
        animation: maps.Animation.DROP,
        position: {
          lat: user.lat,
          lng: user.lon,
        },
        map,
      }));
    });
  };

  addPlace = (place) => {
    let { markers } = this.state;
    const maps = this.state.mapApi;
    const map = this.state.mapInstance;
    markers[0].setMap(null);

    const icon = {
      shape:{coords:[17,17,18],type:'circle'},
      optimized: false,
      url: 'https://uinames.com/api/photos/female/16.jpg', // url
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
    this.setState({
      mapApiLoaded: true,
      mapInstance: map,
      mapApi: maps,
      places: [place],
      markers,
    });
    Geocode.fromLatLng( place.geometry.location.lat() , place.geometry.location.lng() ).then(
      response => {
       const address = response.results[0].formatted_address,
        addressArray =  response.results[0].address_components,
        city = this.getCity( addressArray ),
        area = this.getArea( addressArray ),
        state = this.getState( addressArray );
     
      //  console.log( 'city', city, area, state );
        axios.put(`http://localhost:4000/API/users/update/${this.context.JWT.data.username}`, {lat: place.geometry.location.lat(), lon: place.geometry.location.lng()} , {headers: {"x-auth-token": this.context.JWT.token}})
          .then((res) => {
            this.context.toggleUser(res.data.payload.result.token);
          })
          .catch((err) => console.log(err))
       this.setState( {
        address: ( address ) ? address : '',
        area: ( area ) ? area : '',
        city: ( city ) ? city : '',
        state: ( state ) ? state : '',
       } )
      },
      error => {
       console.error(error);
      }
     );
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
          onGoogleApiLoaded={({ map, maps }) => this.apiHasLoaded(map, maps, locations, this.props.suggestions)}
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
