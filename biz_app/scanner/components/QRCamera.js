import React, { Component } from 'react';
import {
  AppRegistry,
  Dimensions,
  StyleSheet,
  Text,
  TouchableHighlight,
  View
} from 'react-native';
import Camera from 'react-native-camera';
import _ from 'underscore';
import Button from './Button';
const URL = 'https://lit-brushlands-36263.herokuapp.com/';
// const URL = 'http://127.0.0.1:4569/';

class QRCamera extends Component {
  constructor(props) {
    super(props);
    this.state = { throttled: null, cache: '' };
  }

  useCoupon(user_qrcode) {
    var request = new Request(URL + `business/${user_qrcode}`, {
      method: 'PUT',
      headers: new Headers({
        'Content-Type': 'application/json'
      })
    });

    return fetch(request)
      .then(response => response.json())
      .then(json => {
          this.props.cancelCamera();
        })
      .catch((err) => {
        console.error('Error! in updating user coupon in QRCamera.js', err.message);
      })
  }

  componentDidMount() {
    // setTimeout(() => {this.useCoupon('qrcode1:1');}, 5000);
    this.setState({ throttled: _.throttle(
      (e) => { this.useCoupon(e.data); console.log('e in throttle', e.data) },
      3000)
    });
  }

  onBarCodeRead(e) {
    if (this.state.cache === e.data) {
      return;
    } else {
      this.setState({ cache: e.data });
      this.state.throttled(e);
    }

    console.log(
      "Barcode Found!",
      "Type: " + e.type + "\nData: " + e.data
    );
  }

  takePicture() {
    this.camera.capture()
      .then((data) => console.log(data))
      .catch(err => console.error(err));
  }

  render() {
    return (
      <View style={styles.container}>
        <Camera
          ref={(cam) => {
            this.camera = cam;
          }}
          onBarCodeRead={this.onBarCodeRead.bind(this)}
          style={styles.preview}
          aspect={Camera.constants.Aspect.fill}>
          <View style={{ marginBottom: 10 }}>
            <Button label="Capture" onPress={this.takePicture.bind(this)} />
          </View>
        </Camera>
      </View>
    );
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    height: Dimensions.get('window').height,
    width: Dimensions.get('window').width
  },
});

export default QRCamera;
