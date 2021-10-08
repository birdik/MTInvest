import React, { useEffect, useState } from 'react';
import { Text, DevSettings } from 'react-native';
import { useAsyncStorage } from '@react-native-async-storage/async-storage';


export default function Futures() {
  const [futures, setFutures] = useState([["SPX: 0","(+)"],["NSDQ: 0","(+)"],["Russell","(+)"]]);
  const { removeItem } = useAsyncStorage('@api_key');


  const getFutures= async () => {
    try {
        const result = [];
        let parseSP = await fetch("https://investing.daager.ru/indices/us-spx-500-futures")
        parseSP = await parseSP.text();
        result.push([`SPX: ${parseSP.match(/\d+\.\d+\,\d+/)[0]}`,`(${parseSP.match(/\++\d+\,\d+\%|-+\d+\,\d+\%|\d+\,\d+\%+/)[0]})`]);
        let parseNQ = await fetch("https://investing.daager.ru/indices/nq-100-futures")
        parseNQ = await parseNQ.text();
        result.push([`NSDQ: ${parseNQ.match(/\d+\.\d+\,\d+/)[0]}`,`(${parseNQ.match(/\++\d+\,\d+\%|-+\d+\,\d+\%|\d+\,\d+\%+/)[0]})`]);
        let parseRS = await fetch("https://investing.daager.ru/indices/smallcap-2000-futures")
        parseRS = await parseRS.text();
        result.push([`Russell: ${parseRS.match(/\d+\.\d+\,\d+/)[0]}`,`(${parseRS.match(/\++\d+\,\d+\%|-+\d+\,\d+\%|\d+\,\d+\%+/)[0]})`]);
      setFutures(result);
    } catch (error) {
      console.error(error);}
  }
  
  useEffect(() => {
    getFutures();
  },[]);
  
  useEffect(() => {
    const timer = setTimeout(() => {getFutures();}, 60000);
    return () => clearTimeout(timer);  
  },[futures]);

  return (
    <>
      {futures.map((futur, index) => {
        if (futur[1][1] === "+"){ 
          return (<Text key={index} style={{color: '#8a9ba8'}}>{futur[0]} <Text style={{color:"#3dcc91"}}>{futur[1]}</Text></Text>)
        } else { return (<Text key={index} style={{color: '#8a9ba8'}}>{futur[0]} <Text style={{color:"#db3737"}}>{futur[1]}</Text></Text>)}})}
      <Text style={{color: '#db3737'}} onPress={() => {removeItem(); DevSettings.reload();}}>Выход</Text>
    </>
  );
}
