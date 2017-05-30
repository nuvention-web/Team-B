import React, { Component } from 'react';
import { View, Text, TextInput, StyleSheet, Button, ListView, TouchableOpacity, DatePickerIOS, Keyboard } from 'react-native';
import { getFullDate } from '../lib/TimeHelper';
import Colors from '../data/Colors';
import Hr from 'react-native-hr';

export default class Caption extends Component {
  constructor(props) {
    super(props);

    this.updateValue = this.updateValue.bind(this);
    this.renderRow = this.renderRow.bind(this);
    this.onDateChange = this.onDateChange.bind(this);
    this.returnDate = this.returnDate.bind(this);

    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

    this.state = {
      tag: this.props.data,
      text: '',
      ds: ds,
      date: new Date(),
      data: {
        'location': {
          question: 'What location would you like?',
          options: [
            '555 Clark St',
            '555 Clark St. Evanston, IL',
            'Northwestern University'
          ]
        },
        'product': {
          question: 'What product would you like?',
          options: [
            'Frappe',
            'Latte'
          ]
        }
      }
    };

  }

  updateValue(option) {
    // Actions.pop({refresh: {option:option, tagIndex: this.props.tagIndex, id: this.props.id}})
    this.props.updateValue(this.props.tagIndex, option);
  }

  renderRow(rowData) {
    return (
      <View style={styles.listView}>
        <TouchableOpacity
          onPress={()=>{this.updateValue(rowData)}}
          style={styles.listElement}>
          <Text
            style={styles.listText}>
            {rowData}
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  onDateChange(date){
    this.setState({date: date});
  }

  returnDate() {
    var temp;
    if (this.state.date == null) {
      temp = '[time]'
    } else {
      temp = getFullDate(this.state.date);
    }
    this.updateValue(temp);
  }

  render() {
    var render = (() => {
      console.log(this.props.tag);
      if (this.props.tag == null) {
        return null;
      }
      else if (this.props.tag == 'time') {
        return (
          <View style={styles.container}>
            <DatePickerIOS
              date={this.state.date}
              mode="datetime"
              timeZoneOffsetInMinutes={this.state.timeZoneOffsetInHours * 60}
              onDateChange={this.onDateChange}
            />
            <Button
            title="Done"
            onPress={this.returnDate} />
          </View>
        )
      } else {
        return (
          <View>
            <View style={styles.textInputView}>
              <TextInput 
                onChange={(event) => this.setState({
                  text: event.nativeEvent.text,
                })}
                style={styles.textInput}
                multiline={false}
                placeholder='customInput'
                placeholderTextColor={Colors.gray}
                onSubmitEditing={() => {Keyboard.dismiss; this.updateValue(this.state.text)}}
              />
            </View>
            <ListView
              dataSource={this.state.ds.cloneWithRows(this.state.data[this.props.tag].options)}
              renderRow={this.renderRow}
            />
          </View>
        )
      }
    })();

    return (
      <View>
        {render}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 65,
    flex: 1,
  },
  headerRow: {
    flexDirection: 'row',
    margin: 10,
  },
  headerText: {
    fontSize: 20,
    color: Colors.blue,
  },
  listView: {
    marginTop: 10,
  },
  listElement: {
    backgroundColor: Colors.lightBlue,
    marginLeft: 20,
    marginRight: 20,
    borderRadius: 10,
  },
  listText: {
    margin: 10,
  },
  textInputView: {
    flexDirection: 'row',
    backgroundColor: Colors.lightBlue,
    marginTop: 10,
    marginLeft: 20,
    marginRight: 20,
    borderRadius: 10,
  },
  textInput: {
    margin: 10,
    marginTop: 8,
    flex: 1,
    fontSize: 15,
    height: 22,
  },
  postInput: {
    height: 100,
    marginLeft: 20,
    marginRight: 20,
    fontSize: 20,
  },
});
