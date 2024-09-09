import { StyleSheet, Text,TouchableOpacity} from 'react-native';
import { useState} from 'react'

import DateTimePicker from '@react-native-community/datetimepicker';


export function StartTimePicker({taskStartTime,setTaskStartTime}) {

    const [showTimePicker, setShowTimePicker] = useState(false);
    // for time picker
    const toggleStartTimePicker = () => {
        setShowTimePicker(!showTimePicker);
    };
  
    const changeStartTime = (event, selectedTime) => {
        const startTime = selectedTime;
        setShowTimePicker(false);
        setTaskStartTime(startTime);
    };

    return (
        <>
            <TouchableOpacity onPress={toggleStartTimePicker} style={styles.userInput}>
            <Text>{taskStartTime ? taskStartTime.toLocaleTimeString() : 'Select Time'}</Text>
            </TouchableOpacity>
            {showTimePicker && (
            <DateTimePicker
                value={taskStartTime || new Date()}
                mode="time"
                display="default"
                onChange={changeStartTime}
            />
            )}
        </>
    )
}

export function EndTimePicker({taskEndTime,setTaskEndTime }) { 
    const [showTimePicker2, setShowTimePicker2] = useState(false);

    const toggleEndTimePicker = () => {
        setShowTimePicker2(!showTimePicker2);
    };

    const changeEndTime = (event, selectedTime) => {
        const endTime = selectedTime;
        setShowTimePicker2(false);
        setTaskEndTime(endTime);
    };

    return (
        <>
            <TouchableOpacity onPress={toggleEndTimePicker} style={styles.userInput}>
            <Text>{taskEndTime ? taskEndTime.toLocaleTimeString() : 'Select Time'}</Text>
            </TouchableOpacity>
            {showTimePicker2 && (
            <DateTimePicker
                value={taskEndTime || new Date()}
                mode="time"
                display="default"
                onChange={changeEndTime}
            />
            )}
        </>
    )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
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
  
});

