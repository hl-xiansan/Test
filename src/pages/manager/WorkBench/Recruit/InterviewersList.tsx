import React,{ Component } from 'react'
import {
    View
} from 'react-native'

import { WebView } from 'react-native-webview';

class InterviewersList extends Component{
    constructor(){
        super();
    }
    componentDidMount(){
        console.log(this.props);
        
    }
    render(){
        return(
            <View style={{ flex:1 }}>
                <WebView source={{ uri: 'http://tongtu.juyunfuwu.cn/dist/page/index.html' }} />
            </View>
        )
    }
}
export default InterviewersList