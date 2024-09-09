import { StyleSheet, Text, View,TouchableOpacity,Dimensions,Modal} from 'react-native';
import { useState,useRef } from 'react'
import { ColorPicker } from 'react-native-color-picker';
import Slider from '@react-native-community/slider';





const screenWidth = Dimensions.get('window').width;

const buttonWidth = screenWidth * 0.15

function AddColourPicker({taskColour,setTaskColour }) { 
  const [isColourPickerVisible,setIsColourPickerVisible]=useState('false')
    
  const toggleColourPicker = () => { 
      
        setIsColourPickerVisible(!isColourPickerVisible)
        }
      
        const setColour = (colour) => { 
          setTaskColour(colour)
          console.log(taskColour)
          setIsColourPickerVisible(false)
        }
        
        const colorPickerRef = useRef(null);
    return (
        <>
        <TouchableOpacity style={styles.userInput } onPress={toggleColourPicker}>
                <Text >Colour set: {taskColour}</Text>
              </TouchableOpacity>
              <Modal
        animationType="slide"
        transparent={false}
        visible={isColourPickerVisible}
        onRequestClose={() => setIsColourPickerVisible(false)}
      >
        <View style={styles.modalContent}>
          <ColorPicker
            ref={colorPickerRef}
            onColorSelected={setColour}
            sliderComponent={Slider}
            style={styles.colorPicker}
          />

                  <TouchableOpacity style={styles.closeColorPicker } onPress={toggleColourPicker}>
                    <Text style={{color:'white'}}>Close</Text>
          </TouchableOpacity>
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
  
  colorPicker: {
    width: '100%',
    height: '80%',
    paddingBottom:20
  },

  closeColorPicker: {
    position: 'absolute',
    width: buttonWidth,
    height:40,
    borderRadius:10,
    alignItems: "center",
    fontSize: 20,
    backgroundColor: 'blue',
    color: 'white',
    right: "43%",
    bottom: 50,
    paddingTop:10
  }
    
});

export default AddColourPicker;