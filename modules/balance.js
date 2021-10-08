import React, { useEffect, useState } from 'react';
import { Text, Modal} from 'react-native';
import Portfolio from './portfolio';



export default function Balance(props) {
  const [balance, setBalance] = useState({balance : 0});
  const [modalVisible, setModalVisible] = useState(false);

  const getBalance = async () => {
    try {
      const bal = await props.object.getBalance();
      setBalance(bal);
    } catch (error) {
      console.log(error);}
  }

  useEffect(() => {
    getBalance();
  },[]);

  useEffect(() => {
    const timer = setTimeout(() => getBalance(), 3000);
    return () => clearTimeout(timer);  
  },[balance]);

  return (
      <>
        <Modal animationType="slide" visible={modalVisible} 
              onRequestClose={() => {setModalVisible(!modalVisible);}}>
              <Portfolio object={props.object}/>
        </Modal>
        <Text style={{color:"#d8e1e8"}} onPress={() => {setModalVisible(!modalVisible)}}>Баланс: {balance.balance} ₽</Text>
      </>
  );
}

