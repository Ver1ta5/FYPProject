//libraries
import { StatusBar } from 'expo-status-bar';
import { StyleSheet,} from 'react-native';
import { NavigationContainer} from '@react-navigation/native';
import { useEffect } from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import Entypo from '@expo/vector-icons/Entypo';

//Component
import StatisticPage from './statPage';
import ProjectsStack from './Projects';
import HomeScreen from './Personal'
import { createTable, resetDatabase } from './database';
import { requestPermissions } from './notification';
import { scheduleEndOfMonth } from './monthReset';




const tab=createBottomTabNavigator();







export default function App() {
  useEffect(() => {
   createTable()
    requestPermissions()
    scheduleEndOfMonth()
  }, []);
  return (
    <NavigationContainer>
      <tab.Navigator>
        
      <tab.Screen
          name="Personal"
          component={HomeScreen}
          options={{
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="person" size={size} color={color}   />
            ),
          }}
        />

        <tab.Screen name="Statistic"
          component={StatisticPage}
          options={{
            tabBarIcon: ({ color, size }) => (
              <Entypo name="bar-graph" size={size} color={color} />
            ),
          }}
        />

        <tab.Screen name="Projects"
          component={ProjectsStack}
          options={{headerShown:false,
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="people-sharp" size={size} color={color} />
            ),
          }} />
  
      

  </tab.Navigator>
  <StatusBar style="auto" />
  </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  
  
});
