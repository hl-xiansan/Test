import React,{ Component } from 'react';
import { PickerView } from '@ant-design/react-native';
import AsyncStorage from "@react-native-community/async-storage";
export default class SelectPickerView extends Component<Props, State> {
  constructor( props ) {
    super( props );
    this.state = {
      value: undefined,
      seasons:[]
    };
  }
  componentDidMount(){  
      let arr = [];
      arr.push( this.props.ReferencesList );
      this.setState({
        seasons:arr
      })
  }
  onChange = ( value ) => {
    this.setState({
      value,
    });
    
    AsyncStorage.setItem("selectore", `${ value[0] }`);
    
  };
  render() {
    return (
      <PickerView
        onChange={this.onChange}
        value={this.state.value}
        data={this.state.seasons}
        cascade={false}
      />
    );
  }
}