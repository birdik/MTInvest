import { StyleSheet, Text, View, ScrollView, Alert, TouchableOpacity} from 'react-native';
import React, { useEffect, useState } from 'react';


export default function ActivOrders(props) {
  const [activOrders, setActivOrders] = useState([]);

  const getOrders = async () => {
    try {
      const orders = await props.object.getOrders();
      if (orders.code === "INTERNAL_ERROR") {Alert.alert("API временно не работает, зайдите через 5 минут")} else{
        props.object.orderAsk= [];
        props.object.orderBid= [];
        setActivOrders(orders);}
    } catch (error) {
      console.error(error);}
  }
  
  useEffect(() => {
    const timer = setTimeout(() => getOrders(), 1000);
    return () => clearTimeout(timer);  
  },[activOrders]);

  const cancelOrder = async (orderId) =>{
    await props.object.cancelOrder(orderId);
  }

  return (
    <ScrollView style = {[styles.orders]}>
      {activOrders.map((order, index) => {
      if (order.operation === "Sell" && order.figi === props.object.figi) { props.object.orderAsk.push([order.price,(order.requestedLots-order.executedLots)]); return(
        <View key={index}><View  style={{flexDirection: "row", justifyContent: "space-between"}}>
          <Text style={{color:"#db3737"}}>{order.operation}</Text>
          <Text style={{color:"#d8e1e8"}}>Price: {order.price}</Text>
          <Text style={{color:"#d8e1e8"}}>Vol: {order.requestedLots-order.executedLots} шт.</Text>
        </View>
        <TouchableOpacity style={{backgroundColor:"#293742",alignItems:"center"}} onPress={async () => cancelOrder(order.orderId)}><Text style={{color:"#d8e1e8"}}>Отмена</Text></TouchableOpacity></View>
      )}else if (order.operation === "Buy" && order.figi === props.object.figi) { props.object.orderBid.push([order.price,(order.requestedLots-order.executedLots)]); return(
        <View key={index}><View key={index} style={{flexDirection: "row", justifyContent: "space-between"}}>
          <Text style={{color:"#3dcc91"}}>{order.operation}</Text>
          <Text style={{color:"#d8e1e8"}}>Price: {order.price}</Text>
          <Text style={{color:"#d8e1e8"}}>Vol: {order.requestedLots-order.executedLots} шт.</Text>
        </View>
        <TouchableOpacity style={{backgroundColor:"#293742",alignItems:"center"}} onPress={async () => cancelOrder(order.orderId)}><Text style={{color:"#d8e1e8"}}>Отмена</Text></TouchableOpacity></View>
        )}})}
  </ScrollView>
  );
}

const styles = StyleSheet.create({
  orders: {
    height: '100%',
    width: '100%',
    shadowColor: "#000",
    shadowOffset: {
	    width: 0,
	    height: 5,
    },
    shadowOpacity: 0.34,
    shadowRadius: 6.27,
    elevation: 1,
    borderWidth: 0.5,
    padding: 5
  },
});