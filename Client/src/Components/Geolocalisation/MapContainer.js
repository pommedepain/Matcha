import React, { Component } from 'react';

import Map from './CurrentLocation';

class NewCompo extends Component {
  render() {
    return(
        <Map
     google={this.props.google}
     center={{lat: 47.371310, lng: -3.221410}}
     height='300px'
     zoom={15}
    />
      )
  }
}

export default NewCompo;