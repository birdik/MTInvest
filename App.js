import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, SafeAreaView, View, StatusBar, TextInput} from 'react-native';
import Balance from './modules/balance';
import Cups from './modules/cup';
import ActivOrders from './modules/activOrders';
import TickerInfo from './modules/tickerInfo';
import News from './modules/news';
import API from './modules/API';
import Futures from './modules/futures';
import Order from './modules/order';
import { useAsyncStorage } from '@react-native-async-storage/async-storage';




StatusBar.setHidden(true);


export default function App () {
  const [apiToken, setApiToken] = useState(null);
  const { getItem, setItem } = useAsyncStorage('@api_key');

  const readAPIFromStorage = async () => {
    const item = await getItem();
    setApiToken(item);
  };

  
  const writeAPIToStorage = async (newValue) => {
    await setItem(newValue);
    setApiToken(newValue);
  };

  useEffect(() => {
    readAPIFromStorage();
  }, []);

  if (apiToken === null) {
    return (
      <SafeAreaView style={styles.hello}>
        <Text style={{color:"#d8e1e8",fontSize: 30}}>Добро пожаловать в терминал</Text>
        <Text style={{color:"#d8e1e8",fontSize: 30}}>MTInvest</Text>
        <Text></Text>
        <TextInput style={{color:"#d8e1e8"}} placeholder="Нажмите и вставьте сюда ключ API" placeholderTextColor="#d8e1e8" onEndEditing={(e) => writeAPIToStorage(e.nativeEvent.text)}/>
      </SafeAreaView>
    );
  } else {
    const apiUrl = 'https://api-invest.tinkoff.ru/openapi';
    const api = new API(apiUrl, apiToken);
    return (
      <SafeAreaView style={styles.container}>
        <View style={[styles.head, {alignItems: 'center',flexDirection: "row",justifyContent: "space-between"}]}>
          <Balance object={api}/>
          <Futures/>
        </View>
        <View style={styles.body}> 
          <View style={styles.bids}>
            <View style={[styles.order, {alignItems: 'center'}]}>    
              <Text style={{color: '#8a9ba8'}}>Заявка</Text>
              <TickerInfo object={api}/>
              <Order object={api}/>
            </View>
            <View style={[styles.orderActiv, {alignItems: 'center'}]}> 
              <Text style={{color: '#8a9ba8',height: '14%'}}>Активные заявки</Text>
              <ActivOrders object={api}/> 
            </View>   
          </View>
          <Cups object={api}/>  
          <News object={api}/>   
        </View>
      </SafeAreaView>
    );
  }
}


const styles = StyleSheet.create({
  container: {
    height: '100%',
    width: '100%',
    backgroundColor: '#182026',
  },
  body: {
    height: '95%',
    width: '100%',
    flexDirection: 'row',
  },
  bids: {
    height: '100%',
    width: '35%',
    flexDirection: 'column'
  }, 
  head: {
    height:'5%',
    width: '98%',
    shadowColor: "#000",
    shadowOffset: {
	    width: 0,
	    height: 5,
    },
    shadowOpacity: 0.34,
    shadowRadius: 6.27,
    elevation: 10,
    borderWidth: 0.5
  },
  order: {
    height: '67%',
    width: '100%',
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
  orderActiv: {
    height: '33%',
    width: '100%',
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
  hello: {
    height: '100%',
    width: '100%',
    backgroundColor: '#182026',
    alignItems: 'center',
  }
});

