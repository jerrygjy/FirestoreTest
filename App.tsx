/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import type {PropsWithChildren} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  FlatList,
} from 'react-native';

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
import {useState, useEffect} from 'react';
import {ActivityIndicator} from 'react-native';
import firestore from '@react-native-firebase/firestore';

type SectionProps = PropsWithChildren<{
  title: string;
}>;

let unsubscribe = null;
var maintenanceList = [];
let unplannedList = [];

// function onResult(QuerySnapshot) {
//   console.log('Got Users collection result.');
// }

// function onError(error) {
//   console.error(error);
// }

// maintenanceList = firestore()
//   .collection('maintenance')
//   .onSnapshot(onResult, onError);

// async queryMaintenanceSnapShot(callback) {
// 	maintenanceList = [];
// 	unplannedList = [];
// 	plannedChangedList = [];
// 	firestore()
// 		.collection(collection)
// 		.get()
// 		.then((querySnapshot) => {
// 			querySnapshot.forEach((documentSnapshot) => {
// 				let doc = {
// 					docId: documentSnapshot.id,
// 					status: documentSnapshot.data().status,
// 					isFullMaintenance: documentSnapshot.data().isFullMaintenance,
// 					externalSystem: documentSnapshot.data().externalSystem,
// 					moduleIdList: documentSnapshot.data().moduleIdList,
// 					startTime: documentSnapshot.data().startTime,
// 					endTime: documentSnapshot.data().endTime,
// 					pushNotification: documentSnapshot.data().pushNotification,
// 					createdBy: documentSnapshot.data().createdBy,
// 					createdOn: documentSnapshot.data().createdOn,
// 					checksum: documentSnapshot.data().checksum,
// 					onGoing: documentSnapshot.data().onGoing,
// 					message: documentSnapshot.data().message,
// 					maintenanceType: documentSnapshot.data().maintenanceType,
// 					noticeDate: documentSnapshot.data().noticeDate,
// 					title: documentSnapshot.data().title
// 				};

// 				maintenanceList.push(doc);
// 			});
// 			maintenanceList.sort((a, b) => a.startTime - b.startTime);
// 			oldList = maintenanceList;
// 			isFirstQueryCompleted = true;
// 			callback(maintenanceList);
// 		});
// }

function Section({children, title}: SectionProps): JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  return (
    <View style={styles.sectionContainer}>
      <Text
        style={[
          styles.sectionTitle,
          {
            color: isDarkMode ? Colors.white : Colors.black,
          },
        ]}>
        {title}
      </Text>
      <Text
        style={[
          styles.sectionDescription,
          {
            color: isDarkMode ? Colors.light : Colors.dark,
          },
        ]}>
        {children}
      </Text>
    </View>
  );
}

function App(): JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
    flex: 1,
  };

  function Users() {
    const [loading, setLoading] = useState(true); // Set loading to true on component mount
    const [users, setUsers] = useState([]); // Initial empty array of users

    useEffect(() => {
      const subscriber = firestore()
        .collection('maintenance')
        .onSnapshot(querySnapshot => {
          const notices = [];

          querySnapshot.forEach(documentSnapshot => {
            console.log(documentSnapshot);
            notices.push({
              ...documentSnapshot.data(),
              key: documentSnapshot.id,
            });
          });

          setUsers(notices);
          setLoading(false);
        });

      // Unsubscribe from events when no longer in use
      return () => subscriber();
    }, []);

    if (loading) {
      return <ActivityIndicator />;
    }
    return (
      <FlatList
        style={styles.sectionContainer}
        data={users}
        renderItem={({item}) => (
          <View
            style={{
              height: 150,
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Text>UUID: {item.uuid}</Text>
            <Text>Message: {item.message}</Text>
            <Text>Status: {item.status}</Text>
            <Text>ExternalSystem: {item.externalSystem}</Text>
            <Text>IsFullMaintenance: {item.isFullMaintenance}</Text>
            <Text>MaintenanceType: {item.maintenanceType}</Text>
            <Text>NoticeDate: {item.noticeDate}</Text>
            <Text>StartTime: {item.startTime}</Text>
            <Text>EndTime: {item.endTime}</Text>
          </View>
        )}
      />
    );
  }

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={backgroundStyle}>
        <Header />
        {Users()}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  flatListStyle: {
    flex: 1,
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;
