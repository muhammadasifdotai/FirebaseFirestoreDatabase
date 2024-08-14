import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import firestore from '@react-native-firebase/firestore';

export default function App(): JSX.Element {
  const [myData, setMyData] = useState(null)
  // ya firebase kay database ka function hay, is kay zariyee hum us kay data ko excess kr sakain gay.
  useEffect(() => {
    getDatabase();
  }, []);

  const getDatabase = async () => {
    try {
      // database say data lanay kay leyee hum, firestore ka function call krain gay,
      // firestore().collection('testing'): firestore aik function, is kay ander method hay 'collection', or collection may hum, collection ka name pass kr dain, hamaray case may may nay us ka name 'testing' rakha hay firebase database may.
      // ... collection: may say document lenay kay leyee us ki 'id' pass kr dain gay. 'doc' method may.
      // .. '.get()': nam ka method hay usi kay zariyee hum data milay ga.
      const data = await firestore()
        .collection('testing')
        .doc('tl8spXU3sAIz5I55iBou')
        .get();
      console.log(data._data); // data.data: likhain gay to us say humay wo data mil jayee ga jis ko hum nay firebase database may save krwaya hay.
      setMyData(data._data)
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View style={styles.main}>
      <Text style={styles.text}>Name: {myData ? myData.Name : 'Loading...'}</Text>
      <Text style={styles.text}>Age: {myData ? myData.Age : 'Loading...'}</Text>
      <Text style={styles.text}>Hobby: {myData ? myData.Hobby.map((list) => ` ${list}`) : 'Loading...'}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  main: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  text: {
    fontSize: 20,
    color: 'green',
  },
});
