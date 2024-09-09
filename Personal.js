import { StyleSheet, Text, View,TouchableOpacity,ScrollView,Dimensions,Modal,TextInput,Button, Alert } from 'react-native';

import { useState } from 'react'
import AddTaskModal from './addTaskModal.js';
import TableComponent from './table.js';
import BudgetCounter from './budgetComponent.js';





const screenWidth = Dimensions.get('window').width;

const buttonWidth = screenWidth * 0.15


// create Home Screen
function HomeScreen() {
  const [tasks, setTasks] = useState([]);
  const [budgetCounter,setBudgetCounter]=useState(null)
return(
  <View style={ styles.container}>
    <BudgetCounter budgetCounter={budgetCounter} setBudgetCounter={setBudgetCounter} />
    <TableComponent tasks={tasks} setTasks={setTasks}
      budgetCounter={budgetCounter} setBudgetCounter={setBudgetCounter}/>
    
    <AddTaskModal tasks={tasks} setTasks={setTasks}
      budgetCounter={budgetCounter} setBudgetCounter={setBudgetCounter} />
    
    </View>
  )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
    },
  
   budgetCounter:{
    alignItems:'center'
   },
  
    buttonText:{
     fontSize:40
    },
    
    buttonGreen: {
      position: 'absolute',
      bottom: 20,
      right: 20,
      backgroundColor: 'green',
      width: buttonWidth,
      height: buttonWidth,
      borderRadius: buttonWidth / 2,
      justifyContent: 'center',
      alignItems: 'center'
    },
  
    formContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
  
    formContent: {
      backgroundColor: 'white',
      padding: 20,
      borderRadius: 10,
      width: '75%',
      alignItems: 'center',
    },
  
    formTitle: {
      fontSize: 20,
      marginBottom: 10,
    },
  
    userInput: {
      width: '100%',
      height: 50,
      borderWidth: 1,
      borderRadius: 5,
      marginBottom: 10,
      paddingVertical:15,
      paddingHorizontal:10
      
    },
  
    tableHeader: {
      flex:1,
      flexDirection: 'row',
      backgroundColor: 'white',
      paddingVertical: 10,
      borderBottomWidth: 1,
      borderBottomColor: 'grey',
    },
  
    tableRow: {
      flex:1,
      flexDirection: 'row',
      backgroundColor: 'lightgrey',
      paddingVertical: 10,
      borderBottomWidth: 1,
      borderBottomColor: 'grey',
    },
  
    tableCell: {
      flex: 1,
      textAlign: 'center',
    },
  
    calendarContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
  
    calendar: {
      borderRadius: 10,
      marginBottom: 20,
    },
  
    whiteBg: {
      backgroundColor:"white"
    }
    
  });
  
  export default HomeScreen;