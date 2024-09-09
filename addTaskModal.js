import { StyleSheet, Text, View,TouchableOpacity,ScrollView,Dimensions,Modal,TextInput,Button, Alert } from 'react-native';
import { useState,useEffect} from 'react'
import { addPersonalTask,getPersonalTask, subtractFromBudgetCounter,getPersonalRemainingBudget,addBudgetCounter } from './database';
import { scheduleNotification } from './notification';
import AddColourPicker from './ColourPicker';
import DatePicker from './DatePicker';
import { StartTimePicker,EndTimePicker } from './TimePicker';


const screenWidth = Dimensions.get('window').width;

const buttonWidth = screenWidth * 0.15

function AddTaskModal({ tasks, setTasks,budgetCounter,setBudgetCounter}) {
    
    // create Needed useState
    const [isFormVisible, setIsFormVisible] = useState(false);
    const [taskName, setTaskName] = useState(null);
    const [taskDate, setTaskDate] = useState('');
    const [taskStartTime, setTaskStartTime] = useState('');
    const [taskEndTime, setTaskEndTime] = useState('');
    const [taskBudget, setTaskBudget] = useState('');
    const [taskDetail, setTaskDetail] = useState('');
  const [validatedInput, setValidatedInput] = useState(false);
  const [taskColour,setTaskColour]=useState('lightgrey')


 



  // for budget
  const handleTaskBudgetInput = (input) => { 
    const filterNumeric = input.replace(/[^0-9]/g, '')
    if (input !== filterNumeric) { 
      Alert.alert("Only numbers allowed")
    }
    setTaskBudget(filterNumeric)
  }
  

  // for validation
    const checkInput = (name) => {
      if (name.trim().length > 0) {
        setValidatedInput(true);
      } else {
        setValidatedInput(false);
      }
  };
  

  // check if date is set before time or ellse cannot submit the form
  const checkDateTime = (date) => { 
    if (date === '' && (taskStartTime !== '' || taskEndTime !== '')) {
      return false;
    } else { 
      return true;
    }
  };
  

  // check if all input is valid
  const validSubmission = async () => {
    if (!validatedInput) {
      Alert.alert("Task name must be defined");
      return; 
    }
  
    const isDateTimeValid = checkDateTime(taskDate);

    if (!isDateTimeValid) {
      Alert.alert("Task Date must be defined before defining start time and end time");
      return; 
    } 
  
    // Proceed with task addition and budget update
    await addTask(); 
    const checkIfBudgetCounterFilled = await getPersonalRemainingBudget
    if (checkIfBudgetCounterFilled == null) { 
    await addBudgetCounter(0,0)
    }
    const newBudget = await subtractFromBudgetCounter(); 
    console.log("subtractedBudget.addTask", newBudget);
    setBudgetCounter(newBudget);
    console.log("subtractedBudget complete");
    setValidatedInput(false)
  };

  
  
  // to add task to database
  

  const addTask = async() => {
    const checkIfStartTimeEmpty = taskStartTime=== null || taskStartTime === '' ? null : taskStartTime.toLocaleTimeString()
  const checkIfEndTimeEmpty = taskEndTime=== null || taskEndTime === '' ? null : taskEndTime.toLocaleTimeString()
    try {
      await addPersonalTask(taskName, taskDate, checkIfStartTimeEmpty, checkIfEndTimeEmpty, taskBudget, taskDetail,taskColour);
      const updatedTasks = await getPersonalTask();
      
      const newestTaskID = updatedTasks[updatedTasks.length - 1].id
      
      console.log('Newest Task ID:', newestTaskID);
      setTasks(updatedTasks);
      setIsFormVisible(false);
      setTaskDetail('');
      setTaskName(null);
      setTaskDate('');
      setTaskEndTime('');
      setTaskStartTime('');
      setTaskBudget('');
      setTaskColour('lightgrey')

      if (taskDate !='') {
        await scheduleNotification(taskName, taskDate, checkIfStartTimeEmpty, newestTaskID, taskDetail)
      }
    }
    catch (error) { 
      console.error('error in adding task',error)
    }

   
  
  };
 
  // on mount component to exe once only
  useEffect(() => {
    const loadTasks = async () => {
      try {
        const loadedTasks = await getPersonalTask(); // Fetch tasks
        setTasks(loadedTasks); // Update state with fetched tasks
        console.log("Loaded Tasks:", loadedTasks)
      } catch (error) {
        console.error('Error loading tasks:', error);
      }
    };

    loadTasks(); 
  }, []);


  
    const formVisiblity = () => {
      setIsFormVisible(true);
    };

  



    
    return (
      <View>
        <TouchableOpacity style={styles.buttonGreen} onPress={formVisiblity}>
          <Text style={styles.buttonText}>+</Text>
        </TouchableOpacity>
        <Modal
          animationType="slide"
          transparent={true}
          visible={isFormVisible}
          onRequestClose={() => setIsFormVisible(false)}
        >
          <View style={styles.formContainer}>
            <View style={styles.formContent}>
              <Text style={styles.formTitle}>Add Task</Text>
              <TextInput
                style={styles.userInput}
                placeholder="Task Name"
                value={taskName}
                onChangeText={text => { setTaskName(text); checkInput(text); }}
              />

              <DatePicker setTaskDate={setTaskDate} taskDate={taskDate} />
              
              <StartTimePicker taskStartTime={taskStartTime} setTaskStartTime={setTaskStartTime} />
              <EndTimePicker taskEndTime={taskEndTime} setTaskEndTime={setTaskEndTime}/>
           
             
              <TextInput
                style={styles.userInput}
                placeholder="Budget"
                value={taskBudget}
                keyboardType="numeric"
                onChangeText={text => handleTaskBudgetInput(text)}
              />
              <TextInput
                style={styles.userInput}
                placeholder="Details"
                value={taskDetail}
                keyboardType="default"
                onChangeText={text => setTaskDetail(text)}
              />

              <AddColourPicker  setTaskColour={setTaskColour} taskColour={taskColour} />
              

              <View style={ styles.buttonSpacing}>
                <Button title="Add Task" onPress={() => validSubmission()} />
              </View>
              <View style={ styles.buttonSpacing}>
              <Button title="Cancel" onPress={() => setIsFormVisible(false)} />
              </View>
            </View>
          </View>
        </Modal>
      </View>
    );
  }

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
    },
  
    buttonText: {
    color: 'white',
    fontSize: 20,
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
    
  buttonSpacing: {
    paddingTop:5
  },
 
  
   

  
    
});
  
export default AddTaskModal;