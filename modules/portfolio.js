import React, { useEffect, useState } from 'react';
import { Text, View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';



export default function Portfolio(props) {
  const [portfolio, setPortfolio] = useState([
    {
      "figi": "BBG000B9XRY4",
      "ticker": "AAPL",
      "isin": "US0378331005",
      "instrumentType": "Stock",
      "balance": 1,
      "blocked": 1,
      "lots": 1,
      "expectedYield": {
        "currency": "USD",
        "value": 0.08
      },
      "averagePositionPrice": {
        "currency": "USD",
        "value": 143.43
      },
      "name": "Apple"
    }]);

  const getPortfolio = async () => {
    try {
      const portf = await props.object.portfolio();
      setPortfolio(portf.reverse());
    } catch (error) {
      console.log(error);}
  }

  useEffect(() => {
    getPortfolio();
  },[]);

  const currency = (cur) => {
    if (cur === "USD") {return "$"} else if (cur === "EUR") {return "€"} 
    else {return "₽"}
  }

  const color = (price) => {
    if(price > 0) {return "#008000"} else {return "#f00000"}
  }

  return (
    <View style={styles.modal}>
        <Text style={{color:"#d8e1e8",fontSize: 20,}}>Портфель</Text>
        <Text></Text>
        <View>
          <View style={styles.head}>
            <View style={[styles.sections,{width: '20%',backgroundColor: "#323e4a"}]}><Text style={{color:"#d8e1e8"}}>Тикер</Text></View>
            <View style={[styles.sections,{width: '17.5%',backgroundColor: "#323e4a"}]}><Text style={{color:"#d8e1e8"}}>Баланс</Text></View>
            <View style={[styles.sections,{width: '15%',backgroundColor: "#323e4a"}]}><Text style={{color:"#d8e1e8"}}>Цена</Text></View>
            <View style={[styles.sections,{width: '15%',backgroundColor: "#323e4a"}]}><Text style={{color:"#d8e1e8"}}>Средняя</Text></View>
            <View style={[styles.sections,{width: '20%',backgroundColor: "#323e4a"}]}><Text style={{color:"#d8e1e8"}}>Стоимость</Text></View>
            <View style={[styles.sections,{width: '20%',backgroundColor: "#323e4a"}]}><Text style={{color:"#d8e1e8"}}>Доход</Text></View>
            <View style={[styles.sections,{width: '10%',backgroundColor: "#323e4a"}]}><Text style={{color:"#d8e1e8"}}>Доход, %</Text></View>
          </View>
          <Text></Text>
          <ScrollView >
            {portfolio.map((item)=>
              <View style={styles.item} key={item.figi}>
                <TouchableOpacity style={[styles.sections,{width: '20%'}]} onPress={() => props.object.changeTicker(item.ticker)}><Text style={{color:"#d8e1e8"}}>{item.ticker}</Text></TouchableOpacity>
                <View style={[styles.sections,{width: '17.5%'}]}><Text style={{color:"#d8e1e8"}}>{item.balance}</Text></View>
                <View style={[styles.sections,{width: '15%'}]}><Text style={{color:"#d8e1e8"}}>{(Number(item.averagePositionPrice.value) + Number(item.expectedYield.value/item.balance)).toFixed(2)}{currency(item.averagePositionPrice.currency)}</Text></View>
                <View style={[styles.sections,{width: '15%'}]}><Text style={{color:"#d8e1e8"}}>{item.averagePositionPrice.value}{currency(item.averagePositionPrice.currency)}</Text></View>
                <View style={[styles.sections,{width: '20%'}]}><Text style={{color:"#d8e1e8"}}>{((Number(item.averagePositionPrice.value) + Number(item.expectedYield.value/item.balance))*item.balance).toFixed(2)}{currency(item.averagePositionPrice.currency)}</Text></View>
                <View style={[styles.sections,{width: '20%'}]}><Text style={{color: color(item.expectedYield.value)}}>{item.expectedYield.value}{currency(item.expectedYield.currency)}</Text></View>
                <View style={[styles.sections,{width: '10%'}]}><Text style={{color: color(item.expectedYield.value)}}>{(((item.averagePositionPrice.value*item.balance)-((item.averagePositionPrice.value*item.balance)-item.expectedYield.value))/((item.averagePositionPrice.value*item.balance)-item.expectedYield.value)*100).toFixed(2)}%</Text></View>
              </View>
            )}
          </ScrollView>
        </View>
    </View>);
}


const styles = StyleSheet.create({
    modal: {
      backgroundColor: '#182026',
      alignItems: 'center'
    },
    head: {
      height: '6%',
      width: '83%',
      flexDirection: "row",
    },
    item: {
      width: '84.05%',
      flexDirection: "row",
      justifyContent: "space-between",
      padding: 2
    },
    sections: {
      borderWidth: 1,
      alignItems: "center",
      backgroundColor: "#293742",
    }
  });