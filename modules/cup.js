import React, {useState, useEffect, useRef, useReducer} from 'react';
import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';



export default function Cups(props) {
  const [asks, setAsks] = useState([[0,0]]);
  const [bids, setBids] = useState([[0,0]]);
  const [maxLots,setMaxLots] = useState(0);
  const ws = useRef(null);
  const [_, forceUpdate] = useReducer(x => x + 1, 0);

  const websokets = async () => {
    const headers = {
      Authorization: 'Bearer ' + props.object._apiToken
    }
    const subscribe = {
			"event": "orderbook:subscribe",
			"figi": props.object.figi,
			"depth": 14
    };

    const unsubscribe = {
			"event": "orderbook:unsubscribe",
			"figi": props.object.figi,
			"depth": 14
    };

    ws.current = new WebSocket('wss://api-invest.tinkoff.ru/openapi/md/v1/md-openapi/ws', null, {headers});

    ws.current.onopen = () => {
      ws.current.send(JSON.stringify(subscribe));
    };

    ws.current.onmessage = async(event) => {
      const response = JSON.parse(event.data);
      if (response.payload.asks[0] !== undefined) {
        const muss = [...response.payload.asks, ...response.payload.bids];
        setAsks(response.payload.asks);
        setBids(response.payload.bids);
        var sorted = muss.slice().sort(function(a, b) {
          return a[1] - b[1];
        });
        setMaxLots(sorted[sorted.length-1][1]);
      } else {
          setAsks([[0,0]]);
          setBids([[0,0]]);
          setMaxLots(0);
      }
    };

    ws.current.onclose = () => {
      ws.current.close();
      console.log("ws close");
    };

    ws.current.onerror = (e) => {
      ws.current.close()
      setTimeout(websokets, 5000);
    }
  }

  useEffect(() => {
    const figi = props.object.figi;
    websokets();
    const interval = setInterval(async() => {
        forceUpdate();}, 1000);
    return () => {ws.current.close(); clearInterval(interval);} 
  },[props.object.figi]);

    return (
        <View  style={[styles.cup, {alignItems: 'center'}]}>
            <Text style={{color: '#8a9ba8'}} >Стакан</Text>
            <View style={styles.cups}>
              <View style={styles.head}>
                <Text style={{color:"#d8e1e8"}}>    Bid</Text>
                <Text style={{color:'#8a9ba8'}}>{(asks[0][0]-bids[0][0]).toFixed(2)} ({((asks[0][0]/bids[0][0]-1)*100).toFixed(3)}%)</Text>
                <Text style={{color:"#d8e1e8"}}>Ask    </Text>
              </View>
              <View style={{flexDirection: "row",height: '94%',width: '100%',}}>
                <View style={styles.orders}>
                  {bids.map((bid)=> { const len = `${bid[1]/maxLots*100}%`;
                  const order = props.object.orderBid.filter((orders) => orders[0]===bid[0]);
                  if (props.object.orderBid.length === 0 || order.length === 0){
                    return(<TouchableOpacity style={styles.order} key={bid[0]} onPress={()=> props.object.price = `${bid[0]}`}>
                      <View style={{backgroundColor:"#0a6640",position:"relative",width:len}}></View>
                      <View style={styles.orde}>
                        <Text style={{color:"#d8e1e8"}}>{bid[0]}</Text>
                        <Text style={{color:"#8a9ba8"}}>{bid[1]}</Text>
                      </View>
                    </TouchableOpacity>)
                  } else {
                    const lot = order.reduce((sum,order) => sum += order[1],0);
                    return(<TouchableOpacity style={styles.order} key={bid[0]} onPress={()=> props.object.price = `${bid[0]}`}>
                      <View style={{backgroundColor:"#0a6640",position:"relative",width:len}}></View>
                      <View style={styles.orde}>
                        <Text style={{color:"#d8e1e8"}}>{bid[0]}</Text>
                        <Text style={{color:"#d8e1e8"}}>({lot})</Text>
                        <Text style={{color:"#8a9ba8"}}>{bid[1]}</Text>
                      </View>
                    </TouchableOpacity>)}})}
                </View>
                <View style={styles.orders}>
                  {asks.map((ask)=> { const len = `${ask[1]/maxLots*100}%`;
                  const order = props.object.orderAsk.filter((orders) => orders[0]===ask[0]);
                  if (props.object.orderAsk.length === 0 || order.length === 0){
                    return(<TouchableOpacity style={[styles.order, {flexDirection: "row"}]} key={ask[0]} onPress={()=> props.object.price = `${ask[0]}`}>
                      <View style={{backgroundColor:"#a82a2a",position:"relative",width:len}}></View>
                      <View style={styles.orde}>
                        <Text style={{color:"#8a9ba8"}}>{ask[1]}</Text>
                        <Text style={{color:"#d8e1e8"}}>{ask[0]}</Text>
                      </View>
                    </TouchableOpacity>)
                  } else {
                    const lot = order.reduce((sum,order) => sum += order[1],0);
                    return(<TouchableOpacity style={[styles.order, {flexDirection: "row"}]} key={ask[0]} onPress={()=> props.object.price = `${ask[0]}`}>
                      <View style={{backgroundColor:"#a82a2a",position:"relative",width:len}}></View>
                      <View style={styles.orde}>
                        <Text style={{color:"#8a9ba8"}}>{ask[1]}</Text>
                        <Text style={{color:"#d8e1e8"}}>({lot})</Text>
                        <Text style={{color:"#d8e1e8"}}>{ask[0]}</Text>
                      </View>
                    </TouchableOpacity>)}})}
                </View>
              </View>              
            </View>
        </View> 
  );
}

const styles = StyleSheet.create({
  cup: {
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
    borderWidth: 0.5,
    flexDirection: 'column'
  },
  cups: {
    height: '94%',
    width: '92%',
    flexDirection: "column"
  },
  head:{
    justifyContent: "space-between",
    height: '6%',
    width: '100%',
    flexDirection: 'row',
    backgroundColor: "#323e4a",
    borderRadius: 5,
    color: "#323e4a",
    padding : 1,
    justifyContent: "space-between",
    alignItems: 'center'
  },
  orders:{
    height: '100%',
    width: '50%',
    flexDirection: "column"
  },
  order:{
    height: '7%',
    width: '100%',
    elevation: 1,
    borderWidth: 0.5,
    flexDirection: "row-reverse",
  },
  orde:{
    position:"absolute",
    flexDirection: "row",
    height: '100%',
    width: '100%',
    justifyContent: "space-between"
  }
});