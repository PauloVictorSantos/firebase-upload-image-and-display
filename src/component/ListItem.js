import React, {
    Component
  } from 'react';
  import {
    View,
    Text, Image
  } from 'react-native';
  
  
  class ListItem extends Component {
    render() {
      return (
        <View >
         
          <Image source={this.props.task.url} />
        </View>
      );
    }
  }
  
export default ListItem;