import React, { Component } from 'react';
import { Image, View, ListView, Text } from 'react-native';
import firebase from 'firebase';
import _ from 'lodash';
import ListItem from './ListItem';


const config = {
    apiKey: "AIzaSyAFn-kqs3bYBW251w6HrGZBvtuRTOfqzQk",
    authDomain: "whatappclone-ac5c1.firebaseapp.com",
    databaseURL: "https://whatappclone-ac5c1.firebaseio.com",
    projectId: "whatappclone-ac5c1",
    storageBucket: "whatappclone-ac5c1.appspot.com",
    messagingSenderId: "269692871941"
};

firebase.initializeApp(config);

export class Itens extends Component {
    
    constructor(props) {
        super(props);

       

        const dataSource = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
        this.imagens = firebase.database().ref("/images/");

        this.state = {
            dataSource: dataSource
        };
    }

    imagensFor(imagens) {
        imagens.once('value', snapshot => {
            const imgs = _.map(snapshot.val(), (val, uid) => {
                return { ...val, uid };
            });
            this.setState({ dataSource: this.state.dataSource.cloneWithRows(imgs) });
        }).then(() => console.log(this.imgs))
            .catch(error => console.error(error));
    }

    componentDidMount(){
        this.imagensFor(this.imagens);
    }



    _renderItem(task) {
        return (
            <ListItem task={task} />
        );
    }

    render() {
        return (
            <View>
                <ListView
                    enableEmptySections={true}
                    dataSource={this.state.dataSource}
                    renderRow={this._renderItem.bind(this)}
                />
            </View>
        );
    }
}