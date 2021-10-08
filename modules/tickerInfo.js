import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TextInput, Modal} from 'react-native';
import Chart from './chart';


export default function TickerInfo(props) {
  const [name, setName] = useState("Apple");
  const [currency, setCurrency] = useState("$");
  const [modalVisible, setModalVisible] = useState(false);

  const changeTickers = async (text) => {
    try {
      props.object.changeTicker(text);
      const tickerName = await props.object.getFigi();
      setName(tickerName.name);
      if (tickerName.currency === "USD") 
        {setCurrency("$")} else if (tickerName.currency === "EUR") {setCurrency("€");} 
        else {setCurrency("₽");}
    } catch (error) {
      console.error(error);}
  }

  useEffect(() => {changeTickers(props.object.ticker)},[props.object.ticker]);

  const [price, setPrice] = useState([["1.0","-0.05"]]);
  
  const getPrice = async () =>{
    try {
      const result = [];
      const prices = await props.object.getOrderbook();
      result.push([prices.lastPrice,((prices.lastPrice-prices.closePrice)/prices.closePrice*100).toFixed(2)]);
      setPrice(result);
    } catch (error) {
      console.error(error);}
  }

  useEffect(() => {
    const timer = setTimeout(() => getPrice(), 500);
    return () => clearTimeout(timer);  
  },[price]);

  const [lots, setLots] = useState([]);

  const getLots = async () =>{
    try {
      const result = [[]];
      const lots = await props.object.portfolio();
      const lot = lots.filter((lotss) => lotss.figi === props.object.figi);
      if (typeof lot[0] === 'undefined') {
        result[0].push(0,0,0,"$",0);
      } else {
        if(typeof lot[0].blocked === 'undefined'){result[0].push(lot[0].balance);} else {result[0].push(lot[0].balance-lot[0].blocked)}
        if (lot[0].averagePositionPrice.currency === "USD") 
        {result[0].push(lot[0].expectedYield.value,lot[0].averagePositionPrice.value,"$");} else if (lot[0].averagePositionPrice.currency === "EUR") {result[0].push(lot[0].expectedYield.value,lot[0].averagePositionPrice.value,"€");} 
        else {result[0].push(lot[0].expectedYield.value,lot[0].averagePositionPrice.value,"₽");}
        const lastPrice = (lot[0].averagePositionPrice.value*lot[0].balance)-lot[0].expectedYield.value;
        const buyPrice = lot[0].averagePositionPrice.value*lot[0].balance;
        result[0].push(((buyPrice-lastPrice)/lastPrice*100).toFixed(2));}
      setLots(result);
    } catch {
        setLots([[0,0,0,"$",0]]);  
      }
  }

  useEffect(() => {
    const timer = setTimeout(() => getLots(), 1000);
    return () => clearTimeout(timer);  
  },[lots]);



  return (
        <View style={styles.ticker}>
          <Modal animationType="slide" visible={modalVisible} 
              onRequestClose={() => {setModalVisible(!modalVisible);}}>
              <Chart object={props.object}/>
           </Modal>
          <View>
            <TextInput style={{color:"#d8e1e8"}} maxLength={8} autoCapitalize="characters"  onEndEditing={(e) => props.object.changeTicker(e.nativeEvent.text)} defaultValue={props.object.ticker}/>
            <Text style={{fontSize: 10,color: '#8a9ba8'}}>{name}</Text>
          </View>
          {lots.map((lot,index) => {if (lot[2] !== 0) {if((lot[1]) < 0) { return(
            <View key={index}>
              <Text style={{color:"#d8e1e8"}}>{lot[0]} lot <Text style={{fontSize:10,color:"#d8e1e8"}}>({lot[2]}{lot[3]})</Text></Text>
              <Text style={{fontSize: 10,color:"#db3737"}}>{lot[1]}{lot[3]}  {lot[4]}%</Text>
            </View>)} else { return(
            <View key={index}>
              <Text style={{color:"#d8e1e8"}}>{lot[0]} lot <Text style={{fontSize:10,color:"#d8e1e8"}}>({lot[2]}{lot[3]})</Text></Text>
              <Text style={{fontSize: 10,color:"#3dcc91"}}>{lot[1]}{lot[3]} {lot[4]}%</Text>
            </View>
            )}}})}
          {price.map((pric,index) => {if(pric[1] < 0) {return(
            <View key={index}>
              <Text style={{color:"#d8e1e8"}} onPress={() => {setModalVisible(!modalVisible)}}>{pric[0]}{currency}</Text>
              <Text style={{fontSize: 10,color:"#db3737"}}>{pric[1]}%</Text>
            </View>)} else {return(
            <View key={index}>
              <Text style={{color:"#d8e1e8"}} onPress={() => {setModalVisible(!modalVisible)}}>{pric[0]}{currency}</Text>
              <Text style={{fontSize: 10,color:"#3dcc91"}}>+{pric[1]}%</Text>
            </View>
            )}})}
        </View>
  );
}

const styles = StyleSheet.create({
  ticker: {
    width: '95%',
    flexDirection: 'row',
    backgroundColor: "#323e4a",
    borderRadius: 5,
    color: "#323e4a",
    padding : 1,
    justifyContent: "space-between",
    alignItems: 'center'
  }
});