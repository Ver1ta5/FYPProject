import { StyleSheet, Text, View,TouchableOpacity,Modal,Button} from 'react-native';
import { useState } from 'react'
import { Calendar, LocaleConfig } from 'react-native-calendars';



function DatePicker({taskDate, setTaskDate}) { 
    const [isCalendarOpen, setIsCalendarOpen] = useState(false)

    const openCalendar = () => {
        setIsCalendarOpen(true);
      };
    
      const pickedDate = (date) => {
        setTaskDate(date.dateString);
        setIsCalendarOpen(false);
    };
    return (
        <>
    <TouchableOpacity onPress={openCalendar} style={styles.userInput}>
                <Text>{taskDate ? taskDate : 'Select date'}</Text>
              </TouchableOpacity>
              <Modal
                animationType="slide"
                transparent={true}
                visible={isCalendarOpen}
                onRequestClose={() => setIsCalendarOpen(false)}
              >
                <View style={styles.calendarContainer}>
                  <Calendar
                    onDayPress={pickedDate}
                    markedDates={taskDate ? { [taskDate]: { selected: true } } : {}}
                    style={styles.calendar}
                  />
                  <Button title="Close" onPress={() => setIsCalendarOpen(false)} />
                </View>
            </Modal>
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
  

    
});

export default DatePicker