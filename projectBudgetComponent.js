import { StyleSheet, Text, View,TouchableOpacity,Modal,TextInput,Button, Alert } from 'react-native';
import { useState, useEffect } from 'react'
import { getProjectBudget,addProjectBudgetCounter,updateProjectBudgetCounter,resetProjectBudget} from './database'


function ProjectBudgetCounter({projectID,budgetCounter,setBudgetCounter}) { 
  // create Needed useState
  const [isbudgetSettingVisible,setIsBudgetSettingVisible]=useState(false)
  const [budgetValue, setBudgetValue] = useState(null);

 
  useEffect(() => {
    const fetchBudget = async () => {
      const budget = await getProjectBudget(projectID);
      setBudgetCounter(budget);
    };
    fetchBudget()
  }, []
 
)

const handleBudgetCounterInput = (input) => { 
  const filterNumeric = input.replace(/[^0-9]/g, '')
  if (input !== filterNumeric) { 
    Alert.alert("Only numbers allowed")
  }
  setBudgetValue(filterNumeric)
}
    

    // create function to toggle modal form for budget on and off
  const budgetSetting = () => {
    setBudgetValue(null);
    setIsBudgetSettingVisible(true)
   }
  // create function to close modal form for budget off
 
   
  const handleBudgetCounter = async () => {
    if (budgetCounter == null) {
      await addProjectBudgetCounter(projectID,budgetValue);
    } else { 
      await updateProjectBudgetCounter(projectID,budgetValue);
    }
    const updatedBudget = await getProjectBudget(projectID)
    setBudgetCounter(updatedBudget)
    setIsBudgetSettingVisible(false);
  };
  
  const resetBudgetCounter = async () => {
    resetProjectBudget(projectID)
    const updatedBudget = await getProjectBudget(projectID)
    setBudgetCounter(updatedBudget)
    setIsBudgetSettingVisible(false);
};

    const checkIfBudgetSet = budgetCounter=== null || budgetCounter === '' ? "set budget here" : budgetCounter 
    
    return(
     <View style={styles.budgetCounter}>
      <TouchableOpacity onPress={budgetSetting} >
        <Text>Budget:{checkIfBudgetSet}</Text>
      </TouchableOpacity>
      <Modal
        animationType="slide"
        transparent={true}
        visible={isbudgetSettingVisible}
        onRequestClose={() => setIsBudgetSettingVisible(false)}
      >
        <View style={styles.formContainer}>
      <TextInput 
        style={[styles.userInput,styles.whiteBg]}
        placeholder="Enter amount"
        keyboardType="numeric"
        value={budgetValue}
        onChangeText={text => handleBudgetCounterInput(text)}
            />
            <View style={styles.buttonRow}>
              <View style={styles.buttonSpacing}>
              <Button title="Cancel" onPress={() => setIsBudgetSettingVisible(false)} />  
              </View>
              <View style={styles.buttonSpacing}>
              <Button title="Reset Budget" onPress={resetBudgetCounter} />
              </View>
              <View style={styles.buttonSpacing}>
              <Button title="Set Budget" onPress={handleBudgetCounter} />
          </View>
          </View>
      </View>
      </Modal>
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
   
    formContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
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

    whiteBg: {
      backgroundColor:"white"
  },
  buttonRow: {
    flexDirection: "row",
    
  },
  
  buttonSpacing: {
  padding:5
  }
    
  });

export default ProjectBudgetCounter;