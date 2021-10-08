import React, {useState, useEffect} from 'react';
import { StyleSheet, Text, View, ScrollView, Modal} from 'react-native';


export default function News(props) {
  const [news, setNews] = useState([])
  const [modalVisible, setModalVisible] = useState(false);
  const [bodyNews, setBodyNews] = useState({body: "", head: ""})

  const getNews = async () =>{
    const answer = await fetch("http://140.238.218.100:3000/news30");
    const news = await answer.json();
    setNews(news.result);
  }

  useEffect(() => {
    getNews();
  },[]);

  useEffect(() => {
    const timer = setTimeout(() => getNews(), 30000);
    return () => clearTimeout(timer);  
  },[news]);


  return (
    <View style={[styles.news, {alignItems: 'center'}]}>    
        <Text style={{color: '#8a9ba8'}}>Новости</Text>
        <Modal animationType="slide" visible={modalVisible} 
        onRequestClose={() => {setModalVisible(!modalVisible);}}>
          <View style={styles.modal}>
            <Text style={{color:"#d8e1e8",fontSize: 20}}>{bodyNews.head}</Text>
            <ScrollView style={{padding: 20}}>
              <Text style={{color:"#d8e1e8",fontSize: 15}}>{bodyNews.body}</Text>
            </ScrollView>
          </View>
        </Modal>
        <ScrollView style={styles.new}>
          {news.map((ne,index)=> {return(
            <View key={index}>
              <Text style={{color:"#42aaff"}} onPress={() => props.object.changeTicker(ne.tickers)}>{ne.tickers}</Text>
              <Text style={{color:"#d8e1e8"}} onPress={() => {setModalVisible(!modalVisible); setBodyNews(ne)}}>{ne.head}</Text>
              <Text style={{color:"#d8e1e8"}}>{ne.release_date}</Text>
              <Text>        </Text>
            </View>)})}
        </ScrollView>
    </View>   
  );
}

const styles = StyleSheet.create({
  news: {
    height: '100%',
    width: '32.5%',
    shadowColor: "#000",
    shadowOffset: {
	    width: 0,
	    height: 5,
    },
    shadowOpacity: 0.34,
    shadowRadius: 6.27,
    elevation: 1,
    borderWidth: 0.5
  },
  new: {
    height: '100%',
    width: '95%',
    shadowColor: "#000",
    shadowOffset: {
	    width: 0,
	    height: 5,
    },
    shadowOpacity: 0.34,
    shadowRadius: 6.27,
    elevation: 1,
    borderWidth: 0.5
  },
  modal: {
    height: '100%',
    width: '100%',
    backgroundColor: '#182026',
    alignItems: 'center'
  },
});