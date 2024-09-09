
import { StyleSheet, Text, View,TouchableOpacity,ScrollView} from 'react-native';
import { useState } from 'react'
import { completePersonalTask, deletePersonalTask,getTaskNotificationID } from './database';
import { deleteNotification } from './notification';



function TableComponent({ tasks, setTasks,budget,setBudgetCounter}) { 
    const [selectedTaskDetail, setSelectedTaskDetail] = useState(null);
    function toggleTaskDetail(index) { 
        if (index == selectedTaskDetail) {
          setSelectedTaskDetail(null)
        } else { 
          setSelectedTaskDetail(index)
        }
      }
    
  const completeTask = (id) => {
        completePersonalTask(id)
        setTasks(tasks.filter(task => task.id !== id));
  };
  
  const deleteTask = async (id) => {
    try {
      const notificationID = await getTaskNotificationID(id);
  
      if (notificationID) {
        console.log('Notification ID:', notificationID);
        await deleteNotification(notificationID);
      }
      
      const newBudget = await deletePersonalTask(id);
      setTasks(tasks.filter(task => task.id !== id));
      setBudgetCounter(newBudget);
    } catch (error) {
      console.error('Error in deleting task', error);
      
      // Handle potential errors
    }
  };


        return(
    <ScrollView style>

       {/* table header */}
        <View style={styles.tableHeader}>
        <Text style={styles.tableCell}>Task Name</Text>
        <Text style={styles.tableCell}>Task Date </Text>
        <Text style={styles.tableCell}>Task Start</Text>
        <Text style={styles.tableCell}>Task End</Text>
         <Text style={styles.tableCell}>Budget </Text>
          
          
      </View>
      
        
        {/* table content */}
      {tasks.map(task => (
        <View key={task.id}>
          <TouchableOpacity style={[styles.tableRow, {backgroundColor:task.taskColour}]} onPress={()=>toggleTaskDetail(task.id)}>
          <Text style={styles.tableCell}>{task.title}</Text>
          <Text style={styles.tableCell}>{task.taskDate}</Text>
          <Text style={styles.tableCell}>{task.startTime}</Text>
          <Text style={styles.tableCell}>{task.endTime}</Text>
            <Text style={styles.tableCell}>{task.budget}</Text>
          </TouchableOpacity>
          
          {selectedTaskDetail === task.id && (
            <View style={styles.detailBG }>
              <Text style={styles.detail }>Details: {task.detail}</Text>
        <View style={styles.tableButton}>
          <View style={styles.buttonCell}>
                  <TouchableOpacity style={styles.button} title="Complete" onPress={() => completeTask(task.id)}>
                    <Text style={ styles.buttonText}>Complete</Text>
                    </TouchableOpacity>
          </View>
          <View style={styles.buttonCell}>
                  <TouchableOpacity style={styles.button} title="Delete" onPress={() => deleteTask(task.id)}>
                  <Text style={ styles.buttonText}>Delete</Text>
                  </TouchableOpacity>
          </View>
        </View>
      </View>
    )}
  </View>
        ))}
      
    
    
        </ScrollView>
        )
}


const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
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
      paddingVertical: 10,
      borderBottomWidth: 1,
      borderBottomColor: 'grey',
    },
  
    tableCell: {
      flex: 1,
      textAlign: 'center',
  },
    
  buttonCell: {
    flex: 1, 
    alignItems: 'center', 
    justifyContent: 'center', 
    padding: 5, 
    borderRadius: 10,
    paddingTop:20
  },

  button: {
    width:'60%',
    borderRadius: 10,
    backgroundColor: 'lightblue',
    height:30
  },

  buttonText: {
    textAlign: 'center',
    paddingTop:5,
    color: 'black',
    fontStyle: 'bold'
  },

  tableButton: {
    width:'100%',
    flexDirection: 'row',
    paddingHorizontal: 10,
    borderRadius:8,
    borderBottomWidth: 1,
    borderBottomColor: 'grey',
  },
  
  detail: {
    marginBottom: 10,
    paddingLeft:10
  },
 
  detailBG: {
    backgroundColor:'white'
  }
  });
export default TableComponent;