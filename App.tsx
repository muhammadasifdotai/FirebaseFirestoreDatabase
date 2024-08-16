// .........................Firebase Setup Example .......................

// import React, {useEffect, useState} from 'react';
// import {StyleSheet, Text, View} from 'react-native';
// import firestore from '@react-native-firebase/firestore';

// export default function App(): JSX.Element {
//   const [myData, setMyData] = useState(null)
//   // ya firebase kay database ka function hay, is kay zariyee hum us kay data ko excess kr sakain gay.
//   useEffect(() => {
//     getDatabase();
//   }, []);

//   const getDatabase = async () => {
//     try {
//       // database say data lanay kay leyee hum, firestore ka function call krain gay,
//       // firestore().collection('testing'): firestore aik function, is kay ander method hay 'collection', or collection may hum, collection ka name pass kr dain, hamaray case may may nay us ka name 'testing' rakha hay firebase database may.
//       // ... collection: may say document lenay kay leyee us ki 'id' pass kr dain gay. 'doc' method may.
//       // .. '.get()': nam ka method hay usi kay zariyee hum data milay ga.
//       const data = await firestore()
//         .collection('testing')
//         .doc('tl8spXU3sAIz5I55iBou')
//         .get();
//       console.log(data._data); // data.data: likhain gay to us say humay wo data mil jayee ga jis ko hum nay firebase database may save krwaya hay.
//       setMyData(data._data)
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   return (
//     <View style={styles.main}>
//       <Text style={styles.text}>Name: {myData ? myData.Name : 'Loading...'}</Text>
//       <Text style={styles.text}>Age: {myData ? myData.Age : 'Loading...'}</Text>
//       <Text style={styles.text}>Hobby: {myData ? myData.Hobby.map((list) => ` ${list}`) : 'Loading...'}</Text>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   main: {
//     alignItems: 'center',
//     justifyContent: 'center',
//     flex: 1,
//   },
//   text: {
//     fontSize: 20,
//     color: 'green',
//   },
// });

// ................................ CRUD OPERATION WITH FIREBASE DATA ...........

import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  StatusBar,
  FlatList,
  Alert,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';

export default function App() {
  const [inputTextValue, setInputTextValue] = useState(null);
  const [list, setList] = useState([]);
  const [isUpdateData, setIsUpdateData] = useState(false);
  const [cardId, setCardid] = useState(null);

  useEffect(() => {
    getDatabase();
  }, []);

  const getDatabase = async () => {
    try {
      // onSnapshot: aik method hay jis ki madat say hum data fetch krain gay. jaisay hi koi changes hongi(updata, delete , add) ya current data da ga.
      // .. is kay parameter may humay 'snap' milay ga.
      firestore()
        .collection('todo')
        .onSnapshot(snap => {
          // .. snap: collection kay ander jitna bhi data hoga, wo sara 'snap' may a jayee ga.
          // foreach(): jitna bhi data hay us saray ko process krnay kay leyee for each function ka use krain gay.
          // tempArray = []: yaha pay aik array bna rhay hay, jis ki list screen pr dekhayeen gay.
          //.. tempArray: ko bahir bhejanay kay leyee is ko list may pass kr dain gay.
          const tempArray = [];
          snap.forEach(item => {
            // console.log(item.id)
            tempArray.push({
              ...item.data(),
              id: item.id,
            });
          });

          // console.log(tempArray)
          setList(tempArray);
        });

      // // const data = await database().ref('todo').once('value');
      // const data = await database()
      //   .ref('todo')
      //   .on('value', tempData => {
      //     console.log(data);
      //     setList(tempData.val());
      //   });
    } catch (err) {
      console.log(err);
    }
  };

  const handleAddData = async () => {
    try {
      if (inputTextValue.length > 0) {
        await firestore().collection('todo').add({
          text: inputTextValue,
        });

        setInputTextValue('');

        // const index = list.length;
        // const response = await database().ref(`todo/${index}`).set({
        //   value: inputTextValue,
        // });

        // console.log(response);

        // setInputTextValue('');
      } else {
        Alert.alert('Please Enter Value & Then Try Again');
      }
    } catch (err) {
      console.log(err);
    }
  };
  // set: collection may ya wali document/Id hay to us ka data update kr do, document/Id nhi hay to usay update kr do.
  // set: set ka method kya krta hay kay data add bhi krta hay or iger data mojood nhi hay to naya add kr day ga.
  // update: method sirf data update kray ga. or iger data mojood nhi hoga to error da ga.
  const handleUpdateData = async () => {
    try {
      if (inputTextValue.length > 0) {
        // .doc: method hum tab used krtay hay, jub humay specific key ko update krna hota hay.
        await firestore().collection('todo').doc(cardId).update({
          text: inputTextValue,
        });

        setInputTextValue('');
        setIsUpdateData(false); // setIsUpdateData: is lyee 'false' kya hay takay add wala button a sakay.

        // const response = await database()
        //   .ref(`todo/${selectedCardIndex}`)
        //   .update({
        //     value: inputTextValue,
        //   });

        // console.log(response);
        // setInputTextValue('');
        // setIsUpdateData(false);
      } else {
        Alert.alert('Please Enter Value & Then Try Again');
      }
    } catch (err) {
      console.log(err);
    }
  };

  // is function kay paramether may hmain wo cardId milay ga.
  const handleCardPress = (cardId, cardValue) => {
    try {
      setIsUpdateData(true); // update ho rha hay to true takay update wala icon show ho sakay.
      setCardid(cardId); // cardId: ki madat say hum check kr saktay hay kay kon si value update honi wali hay, takay us ki value fetch kr kay input may la sakain.
      setInputTextValue(cardValue); // yaha pay input ki value set ho rhi hay.
    } catch (err) {
      console.log(err);
    }
  };

  const handleCardLongPress = (cardId, cardValue) => {
    try {
      // Alert: may 3 chezain hay,: title, value or last may array.
      Alert.alert('Alert', `Are You Sure To Delete ${cardValue} ?`, [
        {
          text: 'Cancel',
          onPress: () => {
            console.log('Cancel Is Press');
          },
        },
        {
          text: 'Ok',
          onPress: async () => {
            try {
              await firestore().collection('todo').doc(cardId).delete();
              setInputTextValue('');
              setIsUpdateData(false);

              // const response = await database()
              //   .ref(`todo/${cardIndex}`)
              //   .remove();
            } catch (err) {
              console.log(err);
            }
          },
        },
      ]);

      // setIsUpdateData(true);
      // setCardid(cardIndex);
      // setInputTextValue(cardValue);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar hidden={true} />
      <View>
        <Text style={{textAlign: 'center', fontSize: 20, fontWeight: 'bold'}}>
          Todo App
        </Text>
        <TextInput
          style={styles.inputBox}
          placeholder="Enter Any Value"
          value={inputTextValue}
          onChangeText={value => setInputTextValue(value)}
        />
        {!isUpdateData ? (
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => handleAddData()}>
            <Text style={{color: '#fff'}}>Add</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => handleUpdateData()}>
            <Text style={{color: '#fff'}}>Update</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.cardContainer}>
        <Text style={{marginVertical: 20, fontSize: 20, fontWeight: 'bold'}}>
          Todo List
        </Text>

        <FlatList
          data={list}
          renderItem={({item, index}) => {
            // const cardIndex = index;
            if (item !== null) {
              return (
                <TouchableOpacity
                  style={styles.card}
                  onPress={() => handleCardPress(item.id, item.text)}
                  onLongPress={() => handleCardLongPress(item.id, item.text)}>
                  <Text>{item.text}</Text>
                </TouchableOpacity>
              );
            }
          }}
        />
      </View>
    </View>
  );
}

const {height, width} = Dimensions.get('screen');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  inputBox: {
    width: width - 30,
    borderRadius: 15,
    borderWidth: 2,
    marginVertical: 10,
    padding: 10,
  },
  addButton: {
    backgroundColor: 'blue',
    alignItems: 'center',
    padding: 10,
    borderRadius: 50,
  },
  cardContainer: {
    marginVertical: 20,
  },
  card: {
    backgroundColor: '#fff',
    width: width - 40,
    padding: 20,
    borderRadius: 30,
    marginVertical: 10,
  },
});
