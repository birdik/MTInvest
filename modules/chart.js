import { StyleSheet, Text, View, TouchableOpacity, ImageBackground} from 'react-native';
import React, { useEffect, useState } from 'react';


export default function Chart(props) {
    const [dates, setDates] = useState([{
    "c": 142.94,
    "figi": "BBG000B9XRY4",
    "h": 142.94,
    "interval": "1min",
    "l": 142.94,
    "o": 142.94,
    "time": "2021-09-20T21:43:00Z",
    "v": 450,
    },
    {
    "c": 142.94,
    "figi": "BBG000B9XRY4",
    "h": 142.94,
    "interval": "1min",
    "l": 142.94,
    "o": 142.94,
    "time": "2021-09-20T21:43:00Z",
    "v": 450,
    },
    {
    "c": 142.94,
    "figi": "BBG000B9XRY4",
    "h": 142.96,
    "interval": "1min",
    "l": 142.94,
    "o": 142.96,
    "time": "2021-09-20T21:44:00Z",
    "v": 11,
    },
    {
    "c": 142.92,
    "figi": "BBG000B9XRY4",
    "h": 142.96,
    "interval": "1min",
    "l": 142.92,
    "o": 142.96,
    "time": "2021-09-20T21:45:00Z",
    "v": 63,
    }
    ]);
    const [volue, setVolue] = useState(0);
    const [open, setOpen] = useState(0);
    const [max, setMax] = useState(0);
    const [min, setMin] = useState(0);
    const [close, setClose] = useState(0);
    const [time, setTime] = useState(0);
    const [percent, setPercent] = useState(0);
    const [color, setColor] = useState("#d8e1e8");
    const [interval, getInterval] = useState("1min");


    const getChart = async (interval="1min") => {
        try {
            console.log("Hi")
            getInterval(interval);
            let now = new Date();
            const currentTime = now.toISOString();
            let pastTime = ""
            switch (interval) {
                case "1min":
                    now.setMinutes(now.getMinutes()-31);
                    pastTime = now.toISOString(); 
                    break;
                case "2min":
                    now.setMinutes(now.getMinutes()-60);
                    pastTime = now.toISOString(); 
                    break;
                case "3min":
                    now.setMinutes(now.getMinutes()-90);
                    pastTime = now.toISOString(); 
                    break;
                case "5min":
                    now.setMinutes(now.getMinutes()-150);
                    pastTime = now.toISOString(); 
                    break;
                case "10min":
                    now.setMinutes(now.getMinutes()-300);
                    pastTime = now.toISOString(); 
                    break;
                case "15min":
                    now.setMinutes(now.getMinutes()-450);
                    pastTime = now.toISOString(); 
                    break;
                case "30min":
                    now.setMinutes(now.getMinutes()-900);
                    pastTime = now.toISOString(); 
                    break;
                case "hour":
                    now.setMinutes(now.getMinutes()-1800);
                    pastTime = now.toISOString();
                    break;
                case "day":
                    now.setMinutes(now.getMinutes()-57600);
                    pastTime = now.toISOString(); 
                    break;
                case "week":
                    now.setMinutes(now.getMinutes()-302400);
                    pastTime = now.toISOString(); 
                    break;
                }
            const answer = await fetch(props.object._apiUrl + `/market/candles?figi=${props.object.figi}&from=${pastTime}&to=${currentTime}&interval=${interval}`, { headers: props.object.head() });
            const dates = await answer.json();
            if (dates.payload.candles.length > 4) {
                {setDates(dates.payload.candles);}
            }     
        } catch (error) {
            console.warn(error);
        }
    }

    useEffect(() => {
        getChart();
      },[]);

    let maxx = dates.reduce((acc, date) => acc.h > date.h ? acc : date);
    let minn = dates.reduce((acc, date) => acc.l < date.l ? acc : date);
    const maxUp = (maxx.h-(maxx.h%0.1)+0.2).toFixed(1);
    const minLow = (minn.l-(minn.l%0.1)-0.1).toFixed(1);
    const step = (maxUp-minLow);

    const setData = (volue,open,max,min,close,time,color) =>{
        setVolue(volue);
        setOpen(open);
        setMax(max);
        setMin(min);
        setClose(close);
        const times = new Date(time);
        setTime(`${times.toLocaleDateString()} ${times.toLocaleTimeString()}`);
        setPercent(((close - open) / open * 100).toFixed(2))
        setColor(color);
    }


    return (
        <View style={{flex:1,flexDirection: 'row'}}>
            <View style={styles.chart}>
                    <View style={styles.data}>
                    <View style={styles.data2}>
                        <View style={styles.data3}>
                        <Text style={{color:"#d8e1e8"}}>{props.object.ticker}  {interval}</Text>
                        <Text style={{color:"#d8e1e8"}}>Обьем: {volue}</Text>
                        </View>
                        <View style={styles.data4}>
                        <TouchableOpacity style={styles.button} onPress={async () => getChart("1min")}>
                            <Text style={{color:"#d8e1e8"}}>1m</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.button} onPress={async () => getChart("2min")}>
                            <Text style={{color:"#d8e1e8"}}>2m</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.button} onPress={async () => getChart("3min")}>
                            <Text style={{color:"#d8e1e8"}}>3m</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.button} onPress={async () => getChart("5min")}>
                            <Text style={{color:"#d8e1e8"}}>5m</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.button} onPress={async () => getChart("10min")}>
                            <Text style={{color:"#d8e1e8"}}>10m</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.button} onPress={async () => getChart("15min")}>
                            <Text style={{color:"#d8e1e8"}}>15m</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.button} onPress={async () => getChart("30min")}>
                            <Text style={{color:"#d8e1e8"}}>30m</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.button} onPress={async () => getChart("hour")}>
                            <Text style={{color:"#d8e1e8"}}>1h</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.button} onPress={async () => getChart("day")}>
                            <Text style={{color:"#d8e1e8"}}>1D</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.button} onPress={async () => getChart("week")}>
                            <Text style={{color:"#d8e1e8"}}>1W</Text>
                        </TouchableOpacity>
                        </View>
                    </View>
                    <View style={styles.data1}> 
                        <Text style={{color:"#d8e1e8"}}>ОТКР:</Text>
                        <Text style={{color:color}}> {open}</Text>
                        <Text style={{color:"#d8e1e8"}}>  МАКС:</Text>
                        <Text style={{color:color}}> {max}</Text>
                        <Text style={{color:"#d8e1e8"}}>  МИН:</Text>
                        <Text style={{color:color}}> {min}</Text>
                        <Text style={{color:"#d8e1e8"}}>  ЗАКР:</Text>
                        <Text style={{color:color}}> {close}  {percent}%</Text>
                        <Text style={{color:"#d8e1e8"}}>  D&T: {time}</Text>
                    </View>
                    </View>
                    <View style={styles.chart1}>
                    <ImageBackground  source={require("../assets/kek.png")} style={styles.image}>
                    {dates.map((data,index)=>{const min = (maxUp-data.l)/step*100;
                        const max= 100-((maxUp-data.h)/step*100)/min*100;
                        if((data.o-data.c) < 0) {
                        const minB= 100-((maxUp-data.o)/step*100)/min*100;
                        const maxB= 100-((maxUp-data.c)/step*100)/min*100-minB;
                        return(
                            <View style={[styles.chart2, {height: `${min}%`,alignItems:"center",}]} key={index}>
                            <View style={[styles.line, {height: `${max}%`,backgroundColor: "#008000", position: "absolute"}]}>
                            </View>
                            <View style={{width: '100%', height: `${minB}%`,position: "relative"}}>
                            </View>
                            <TouchableOpacity style={[styles.rectangle, {height: `${maxB}%`,backgroundColor: "#008000",position: "relative"}]} onPress={async ()=> setData(data.v,data.o,data.h,data.l,data.c,data.time,"#008000")}>
                            </TouchableOpacity>
                            </View>
                        )
                        } else if (data.o-data.c == 0) {
                        const minB= 100-((maxUp-data.o)/step*100)/min*100;
                        const maxB= 100-((maxUp-data.c)/step*100)/min*100-minB+0.5;
                        return(
                            <View style={[styles.chart2, {height: `${min}%`,alignItems:"center",}]} key={index}>
                            <View style={[styles.line, {height: `${max}%`,backgroundColor: "#008000", position: "absolute"}]}>
                            </View>
                            <View style={{width: '100%', height: `${minB}%`,position: "relative"}}>
                            </View>
                            <TouchableOpacity style={[styles.rectangle, {height: `${maxB}%`,backgroundColor: "#008000",position: "relative"}]} onPress={async ()=> setData(data.v,data.o,data.h,data.l,data.c,data.time,"#008000")}>
                            </TouchableOpacity>
                            </View>
                        )
                        } else {
                        const minB= 100-((maxUp-data.c)/step*100)/min*100;
                        const maxB= 100-((maxUp-data.o)/step*100)/min*100-minB;
                        return(
                            <View style={[styles.chart2, {height: `${min}%`,alignItems:"center",}]} key={index}>
                            <View style={[styles.line, {height: `${max}%`,backgroundColor: "#FF0000", position: "absolute"}]}>
                            </View>
                            <View style={{width: '100%', height: `${minB}%`,position: "relative"}}>
                            </View>
                            <TouchableOpacity style={[styles.rectangle, {height: `${maxB}%`,backgroundColor: "#FF0000",position: "relative"}]} onPress={async ()=> setData(data.v,data.o,data.h,data.l,data.c,data.time,"#FF0000")}>
                            </TouchableOpacity>
                            </View>
                        )}})}
                    </ImageBackground>
                    </View>
                    <View style={styles.times}>
                    <View style={styles.time}>
                        <Text style={{color:"#d8e1e8"}}>{`${new Date(dates[0].time).toLocaleTimeString()}`}</Text>
                        <Text style={{color:"#d8e1e8"}}>{`${new Date(dates[0].time).toLocaleDateString()}`}</Text>
                    </View>
                        <View style={[styles.time,{alignItems: "center"}]}>
                            <Text style={{color:"#d8e1e8"}}>{`${new Date(dates[Math.round((dates.length-1)/4)+1].time).toLocaleTimeString()}`}</Text>
                            <Text style={{color:"#d8e1e8"}}>{`${new Date(dates[Math.round((dates.length-1)/4)+1].time).toLocaleDateString()}`}</Text>
                        </View>
                        <View style={[styles.time,{alignItems: "center"}]}>
                            <Text style={{color:"#d8e1e8"}}>{`${new Date(dates[Math.round((dates.length-1)/2)+1].time).toLocaleTimeString()}`}</Text>
                            <Text style={{color:"#d8e1e8"}}>{`${new Date(dates[Math.round((dates.length-1)/2)+1].time).toLocaleDateString()}`}</Text>
                        </View>
                        <View style={[styles.time,{alignItems: "center"}]}>
                            <Text style={{color:"#d8e1e8"}}>{`${new Date(dates[Math.round((dates.length-1)*3/4)+1].time).toLocaleTimeString()}`}</Text>
                            <Text style={{color:"#d8e1e8"}}>{`${new Date(dates[Math.round((dates.length-1)*3/4)+1].time).toLocaleDateString()}`}</Text>
                        </View>
                        <View style={[styles.time,{alignItems: "center"}]}>
                            <Text style={{color:"#d8e1e8"}}>{`${new Date(dates[dates.length-1].time).toLocaleTimeString()}`}</Text>
                            <Text style={{color:"#d8e1e8"}}>{`${new Date(dates[dates.length-1].time).toLocaleDateString()}`}</Text>
                        </View>
                    </View>
                </View>
            <View style={styles.price}>
                <View style={styles.price1}>
                </View>
                <View style={styles.price2}>
                <Text style={{color:"#d8e1e8"}}>{maxUp}</Text>
                </View>
                <View style={styles.price2}>
                <Text style={{color:"#d8e1e8"}}>{(Number(minLow)+(Number(maxUp)-Number(minLow))*3/4).toFixed(2)}</Text>
                </View>
                <View style={styles.price2}>
                <Text></Text>
                <Text style={{color:"#d8e1e8"}}>{((Number(maxUp)+Number(minLow))/2).toFixed(2)}</Text>
                </View>
                <View style={styles.price2}>
                <Text></Text>
                <Text></Text>
                <Text style={{color:"#d8e1e8"}}>{(Number(minLow)+(Number(maxUp)-Number(minLow))*1/4).toFixed(2)}</Text>
                </View>
                <View style={styles.price2}>
                <Text></Text>
                <Text></Text>
                <Text style={{color:"#d8e1e8"}}>{minLow}</Text>
                </View>
                <View style={styles.price1}>
                </View>
            </View>
        </View>  
    )
}

const styles = StyleSheet.create({
    chart: {
    height: '100%',
    width: '94%',
    shadowColor: "#000",
    shadowOffset: {
        width: 0,
        height: 5,
    },
    shadowOpacity: 0.34,
    shadowRadius: 6.27,
    elevation: 1,
    borderWidth: 0.5,
    backgroundColor: '#182026',
    },
    price: {
    height: '100%',
    width: '10%',
    shadowColor: "#000",
    shadowOffset: {
        width: 0,
        height: 5,
    },
    shadowOpacity: 0.34,
    shadowRadius: 6.27,
    elevation: 1,
    borderWidth: 0.5,
    flexDirection: 'column',
    backgroundColor: '#182026',
    },
    times: {
    height: '10%',
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
    flexDirection: 'row',
    },
    chart1: {
    height: '75%',
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
    flexDirection: 'row'
    },
    data: {
    height: '15%',
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
    flexDirection: 'column'
    },
    time: {
    height: '100%',
    width: '20%',
    flexDirection: 'column',
    alignItems: "center"
    },
    price1:{
    height: '15%',
    width: '100%',
    flexDirection: 'column'
    },
    price2:{
    height: '15%',
    width: '100%',
    },
    chart2: {
    height: '50%',
    width: '3.3%',
    flexDirection: "column-reverse"
    },
    line:{
    width: '5%',
    },
    rectangle:{
    width: '40%',
    },
    data1: {
    flexDirection: "row",
    },
    image: {
    flex: 1,
    flexDirection: 'row'
    },
    data2: {
    height: '67%',
    width: '100%',
    flexDirection: 'row',
    },
    data3: {
    height: '100%',
    width: '50%',
    },
    data4: {
    height: '100%',
    width: '50%',
    flexDirection: 'row'
    },
    button:{
    height: '80%',
    width: '10%',
    padding: 3,
    alignItems: "center"
    }
});
