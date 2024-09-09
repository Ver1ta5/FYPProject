
import { StyleSheet, Text, View,Dimensions} from 'react-native';
import { useState,useEffect } from 'react'
import ProjectBudgetCounter from './projectBudgetComponent'
import ProjectAddTaskModal from './projectAddTaskModal';
import ProjectTableComponent from './projectTableComponent';




const screenWidth = Dimensions.get('window').width;


const buttonWidth = screenWidth * 0.15



// create Home Screen
function CreateProjectPage({ route }){
  // create Needed useState
  const [tasks, setTasks] = useState([]);
  const [budgetCounter,setBudgetCounter]=useState(null)
  const { title, id } = route.params
  
  // return the following
  useEffect(() => {
    setTasks([]);
  }, [route]);
  return(
    <View style={styles.container}>
      <Text style={styles.Title}>Title:{title}</Text>
      <ProjectBudgetCounter projectID={id} budgetCounter={budgetCounter} setBudgetCounter={setBudgetCounter} />

      <ProjectTableComponent tasks={tasks} setTasks={setTasks}
        budgetCounter={budgetCounter} setBudgetCounter={setBudgetCounter} projectID={id}/>
      
      <ProjectAddTaskModal tasks={tasks} projectID={id}
        budgetCounter={budgetCounter} setBudgetCounter={setBudgetCounter}
        setTasks={setTasks} />
    </View>
  )
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },


  Title: {
    fontSize: 20,
    fontStyle: "bold",
    textAlign:'center'
  },
 
});

export default CreateProjectPage;
