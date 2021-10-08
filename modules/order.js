import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity} from 'react-native';


export default function Order(props) {
  const [lot, setLot] = useState(0);
  const [sum,setSum] = useState(0);
  const [price, setPrice] = useState("");

  const getSum = async () => {
      if (lot*price === 0){setSum("");} 
      else {setSum((lot*price).toFixed(2));}
  }



  useEffect(() => {
    const interval = setInterval(async () => setPrice(props.object.price), 1000);
    return (() => clearInterval(interval) )
  },[price]);

  useEffect(() => {getSum();
  },[lot,price]);

  

  return (
    <View style={styles.orders}>
      <View style={styles.orderss}>
        <TextInput style={styles.textInput} textAlign="center" onEndEditing={async (e) => {props.object.price = e.nativeEvent.text; setPrice(e.nativeEvent.text)}} defaultValue={`${props.object.price}`}/>
        <Text style={{color: '#8a9ba8'}}>{sum}</Text>
        <TextInput style={styles.textInput} textAlign="center" onEndEditing={async (e) => setLot(e.nativeEvent.text)} defaultValue="0"/>
      </View>
      <View style={styles.buttonOrders}>
        <TouchableOpacity style={[styles.buttonLim,{backgroundColor:"#0a6640"}]} onPress={async () => props.object.sendLimitOrder(Number(lot), "Buy", Number(props.object.price))}>
          <Text style={{color:"#d8e1e8"}}>Лим. покупка</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.buttonLim,{backgroundColor:"#a82a2a"}]} onPress={async () => props.object.sendLimitOrder(Number(lot), "Sell", Number(props.object.price))}>
          <Text style={{color:"#d8e1e8"}}>Лим. продажа</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.buttonOrders}>
        <TouchableOpacity style={[styles.buttonLim,{backgroundColor:"#0a6640"}]} onPress={async () => props.object.sendMarketOrder(Number(lot), "Buy")}>
          <Text style={{color:"#d8e1e8"}}>Рын. покупка</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.buttonLim,{backgroundColor:"#a82a2a"}]} onPress={async () => props.object.sendMarketOrder(Number(lot), "Sell")}>
          <Text style={{color:"#d8e1e8"}}>Рын. продажа</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.fastOrder}>
        <TouchableOpacity style={[styles.buttonFast,{backgroundColor:"#0a6640"}]} onPress={async () => props.object.buy(Number(0.01), "Sell")}>
          <Text style={{color:"#d8e1e8"}}>+1</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.buttonFast,{backgroundColor:"#0a6640"}]} onPress={async () => props.object.buy(Number(0.05), "Sell")}>
          <Text style={{color:"#d8e1e8"}}>+5</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.buttonFast,{backgroundColor:"#0a6640"}]} onPress={async () => props.object.buy(Number(0.1), "Sell")}>
          <Text style={{color:"#d8e1e8"}}>+10</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.buttonFast,{backgroundColor:"#a82a2a"}]} onPress={async () => props.object.sell(Number(0.01), "Sell")}>
          <Text style={{color:"#d8e1e8"}}>+1</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.buttonFast,{backgroundColor:"#a82a2a"}]} onPress={async () => props.object.sell(Number(0.05), "Sell")}>
          <Text style={{color:"#d8e1e8"}}>+5</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.buttonFast,{backgroundColor:"#a82a2a"}]} onPress={async () => props.object.sell(Number(0.1), "Sell")}>
          <Text style={{color:"#d8e1e8"}}>+10</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.fastOrder}>
        <TouchableOpacity style={[styles.buttonFast,{backgroundColor:"#0a6640"}]} onPress={async () => props.object.buy(Number(-0.01), "Sell")}>
          <Text style={{color:"#d8e1e8"}}>-1</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.buttonFast,{backgroundColor:"#0a6640"}]} onPress={async () => props.object.buy(Number(-0.05), "Sell")}>
          <Text style={{color:"#d8e1e8"}}>-5</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.buttonFast,{backgroundColor:"#0a6640"}]} onPress={async () => props.object.buy(Number(-0.1), "Sell")}>
          <Text style={{color:"#d8e1e8"}}>-10</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.buttonFast,{backgroundColor:"#a82a2a"}]} onPress={async () => props.object.sell(Number(-0.01), "Sell")}>
          <Text style={{color:"#d8e1e8"}}>-1</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.buttonFast,{backgroundColor:"#a82a2a"}]} onPress={async () => props.object.sell(Number(-0.05), "Sell")}>
          <Text style={{color:"#d8e1e8"}}>-5</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.buttonFast,{backgroundColor:"#a82a2a"}]} onPress={async () => props.object.sell(Number(-0.1), "Sell")}>
          <Text style={{color:"#d8e1e8"}}>-10</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
    orders: {
        height: '72%',
        width: '95%',
    },
    textInput:{
        borderWidth: 1,
        color:"#d8e1e8",
        width: '30%',
        backgroundColor: "#10151a",
        borderRadius: 5,
    },
    orderss: {
        height: '25%',
        width: '100%',
        alignItems: 'center',
        flexDirection: "row",
        justifyContent: "space-between",
    },
    buttonOrders:{
        height: '20%',
        width: '100%',
        shadowColor: "#000",
        flexDirection: 'row',
        justifyContent: "space-between",
        padding:2,
        
    },
    fastOrder:{
        height: '17%',
        width: '100%',
        shadowColor: "#000",
        flexDirection: 'row',
        justifyContent: "space-between",
        padding:2,
    },
    buttonLim:{
      height: '100%',
      width: '49%',
      alignItems: "center",
      borderRadius: 5,
      padding:4,
    },
    buttonFast:{
      height: '100%',
      width: '15%',
      alignItems: "center",
      borderRadius: 5,
      padding:2,
    }
});