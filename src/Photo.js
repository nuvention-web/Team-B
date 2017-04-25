import React, { Component } from 'react'
import { View, Text, TextInput, StyleSheet, Button, Image, CameraRoll } from 'react-native'
import { Actions } from 'react-native-router-flux';
import ImagePicker from 'react-native-image-picker'
import Suggestions from './Suggestions'
import Swiper from 'react-native-swiper'

export default class Photo extends Component {
  constructor(props) {
    super(props);

    this.goToNext = this.goToNext.bind(this);

    console.log('POST in Photo:', this.props.post);
    const fetchParams: Object = {
      first: 10,
    };
    // const data = await CameraRoll.getPhotos(fetchParams);
    // console.log('data' + data);
    this.state = {

    }
  }

  addImage() {
    console.log('AddImage');
    var options = {
      title: 'Add a photo for your post',
      storageOptions: {
        skipBackup: true,
        path: 'images'
      }
    };

    ImagePicker.showImagePicker(options, (response) => {
      // console.log('Response = ', response);

      if (response.didCancel) {
        console.log('User cancelled image picker');
      }
      else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      }
      else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      }
      else {
        // console.log('IMAGE DATA:')
        // console.log(response.data);
        let source = { uri: response.uri };

        // You can also display the image using data:
        let imageData = { uri: 'data:image/jpeg;base64,' + response.data };

        this.setState({
          postImage: source,
          imageData: imageData
        });
        this.props.uploadPhoto(source);
        this.goToNext();
      }
    });
  }

  goToNext() {
    this.props.nextScreen();
  }

  render() {
    var postImage = (() => {
      if (this.state.postImage==null) return (
        <Button title="Add a photo" onPress={this.addImage.bind(this)}/>
      )
      else return (
        <View>
          <Image source={this.state.postImage} style={styles.postImage}/>
          <Button title="Add a photo" onPress={this.addImage.bind(this)}/>
        </View>
      )
    })();

    return (
      <View style={styles.container}>

        {postImage}
        <Button
          title="No Photo"
          onPress={this.goToNext}/>
      </View> 
    )
  }
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 60
  },
  postImage: {
    height: 180,
    width: 370,
    margin: 3,
    borderRadius: 15
  }
});

async function uploadPhoto() {
  // if (this.state.imageData==null) {
  //   console.log('Empty image');
  //   return;
  // }
  // console.log('data:image/jpeg;base64,' + this.state.imageData.uri);

  console.log(this.state.postImage.uri);
  console.log(this.state.AccessKey);
  console.log(this.state.SecretKey);

  let file = {
    // `uri` can also be a file system path (i.e. file://)
    uri: this.state.postImage.uri,
    name: "image.jpeg",
    type: "image/jpeg"
  }

  let options = {
    bucket: "teamb-photos",
    region: "us-east-1",
    accessKey: "AKIAJQIOU7GJXFIBMVXQ",
    secretKey: "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",
    successActionStatus: 201
  }

  RNS3.put(file, options).then(response => {
    console.log(response);
    if (response.status !== 201) throw new Error("Failed to upload image to S3");
  });

}
