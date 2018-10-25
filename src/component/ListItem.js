import React, {
    Component
  } from 'react';
  import {
    View,
    Text, 
    Image
  } from 'react-native';
  
  
  class ListItem extends Component {
    render() {
      return (
        <View >
         
          <Image source={{uri:this.props.task.url}}
          
          style={{resizeMode: 'contain', height: 300}} />
        </View>
      );
    }
  }
  
export default ListItem;